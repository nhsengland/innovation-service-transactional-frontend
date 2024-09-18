import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DoCheck, Injector, Input, OnInit } from '@angular/core';
import { AbstractControl, ControlContainer, FormControl, FormGroup } from '@angular/forms';
import { NgxDropzoneChangeEvent } from 'ngx-dropzone';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { RandomGeneratorHelper } from '@modules/core/helpers/random-generator.helper';
import { LoggerService, Severity } from '@modules/core/services/logger.service';

import { FileTypes, FileUploadType } from '../engine/config/form-engine.config';
import { FormEngineHelper } from '../engine/helpers/form-engine.helper';

@Component({
  selector: 'theme-form-file-upload',
  templateUrl: 'file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormFileUploadComponent implements OnInit, DoCheck {
  @Input() id?: string;
  @Input() groupName = '';
  @Input() label?: string;
  @Input() description?: string;
  @Input() pageUniqueField? = true;

  @Input()
  set config(
    c:
      | undefined
      | {
          httpUploadUrl: string;
          httpUploadBody?: { [key: string]: any };
          acceptedFiles?: FileTypes[];
          maxFileSize?: number; // In Mb.
        }
  ) {
    this.fileConfig = {
      httpUploadUrl: c?.httpUploadUrl ?? '',
      httpUploadBody: c?.httpUploadBody
    };

    this.dzConfig = {
      acceptedFiles: (c?.acceptedFiles || [FileTypes.ALL]).map(ext => ext).join(','),
      maxFileSize: c?.maxFileSize ? c.maxFileSize * 1000000 : 1000000, // 1Mb.
      multiple: false
    };
  }

  uploadedFile: null | { id: string; file: File } = null;
  previousUploadedFile: null | FileUploadType = null;

  hasError = false;
  hasUploadError = false;
  error: { message: string; params: { [key: string]: string } } = { message: '', params: {} };
  isLoadingFile = false;

  fileConfig: {
    httpUploadUrl: string;
    httpUploadBody?: { [key: string]: any };
  } = { httpUploadUrl: '' };

  dzConfig: {
    acceptedFiles: string;
    multiple: boolean;
    maxFileSize: number; // In bytes
  } = { acceptedFiles: '*', multiple: false, maxFileSize: 1000000 };

  // Form controls.
  get parentFieldControl(): AbstractControl | null {
    return this.injector.get(ControlContainer).control;
  }
  get fieldGroupControl(): FormGroup {
    return this.parentFieldControl?.get(this.groupName) as FormGroup;
  }

  // Accessibility.
  get ariaDescribedBy(): null | string {
    let s = '';
    if (this.description) {
      s += `hint-${this.id}`;
    }
    if (this.hasError) {
      s += `${s ? ' ' : ''}error-${this.id}`;
    }
    return s || null;
  }

  constructor(
    private injector: Injector,
    private cdr: ChangeDetectorRef,
    private http: HttpClient,
    private loggerService: LoggerService
  ) {}

  ngOnInit(): void {
    this.id = this.id || RandomGeneratorHelper.generateRandom();

    const currentValue = this.fieldGroupControl.value;
    this.previousUploadedFile = currentValue.id
      ? {
          id: currentValue.id,
          name: currentValue.name,
          size: currentValue.size,
          extension: currentValue.extension,
          url: currentValue.url
        }
      : null;
  }

  ngDoCheck(): void {
    if (this.hasUploadError) {
      this.hasError = this.hasUploadError;
      this.hasUploadError = false;
    } else if (!this.isLoadingFile) {
      this.hasError =
        this.fieldGroupControl.invalid && (this.fieldGroupControl.touched || this.fieldGroupControl.dirty);
      this.error = this.hasError
        ? FormEngineHelper.getValidationMessage(this.fieldGroupControl.errors)
        : { message: '', params: {} };
      this.cdr.detectChanges();
    }
  }

  private uploadFile(file: File): Observable<FileUploadType> {
    const formdata = new FormData();
    formdata.append('file', file, file.name);
    Object.entries(this.fileConfig?.httpUploadBody || {}).forEach(([key, value]) => formdata.append(key, value));

    return this.http.post<FileUploadType>(this.fileConfig?.httpUploadUrl || '', formdata).pipe(
      take(1),
      map(response => response)
    );
  }

  onChange(event: NgxDropzoneChangeEvent): void {
    this.hasError = false;
    this.hasUploadError = false;

    if (!this.fileConfig.httpUploadUrl) {
      console.error('No httpUploadUrl provided for file upload.');
      return;
    }

    if (event.rejectedFiles.length > 0) {
      const sizeExceeded = event.rejectedFiles.some(f => f.reason === 'size');
      if (sizeExceeded) {
        this.hasUploadError = true;
        this.error = FormEngineHelper.getValidationMessage({ maxFileSize: 'true' });
      }

      const wrongFormat = event.rejectedFiles.some(f => f.reason === 'type');
      if (wrongFormat) {
        this.hasUploadError = true;
        this.error = FormEngineHelper.getValidationMessage({ wrongFileFormat: 'true' });
      }

      event.rejectedFiles.forEach(file => {
        this.loggerService.trackTrace(`File Upload failed for file`, Severity.ERROR, file);
      });

      return; // If any file gives error, abort everything!
    }

    if (event.addedFiles.length > 0) {
      const emptyFile = event.addedFiles.some(i => i.size === 0);
      if (emptyFile) {
        event.addedFiles = event.addedFiles.filter(i => i.size !== 0);
        this.hasUploadError = true;
        this.error = FormEngineHelper.getValidationMessage({ emptyFile: 'true' });
      } else {
        this.isLoadingFile = true;
      }

      event.addedFiles.forEach(file => {
        this.uploadFile(file).subscribe({
          next: response => {
            if (this.uploadedFile) {
              this.onRemoveUploadedFile();
            }

            this.uploadedFile = { id: response.id, file };

            this.fieldGroupControl.addControl('id', new FormControl(response.id));
            this.fieldGroupControl.addControl('name', new FormControl(response.name));
            this.fieldGroupControl.addControl('size', new FormControl(response.size));
            this.fieldGroupControl.addControl('extension', new FormControl(response.extension));
            this.fieldGroupControl.addControl('url', new FormControl(response.url));

            this.evaluateDropZoneTabIndex();
            this.setAuxMessageAndFocus(`${file.name} added.`);
            this.isLoadingFile = false;

            this.cdr.detectChanges();
          },
          error: error => {
            if (this.uploadedFile) {
              this.onRemoveUploadedFile();
            }
            this.hasError = true;
            this.hasUploadError = true;
            this.error = FormEngineHelper.getValidationMessage({ uploadError: 'true' });
            this.isLoadingFile = false;
            this.cdr.detectChanges();
            this.loggerService.trackTrace('upload error', Severity.ERROR, { error });
          }
        });
      });
    }
  }

  onRemoveUploadedFile(): void {
    this.uploadedFile = null;
    this.fieldGroupControl.removeControl('id');
    this.fieldGroupControl.removeControl('name');
    this.fieldGroupControl.removeControl('size');
    this.fieldGroupControl.removeControl('extension');
    this.fieldGroupControl.removeControl('url');
    this.cdr.detectChanges();
  }

  onRemovePreviousUploadedFile(): void {
    this.previousUploadedFile = null;
    this.fieldGroupControl.removeControl('id');
    this.fieldGroupControl.removeControl('name');
    this.fieldGroupControl.removeControl('size');
    this.fieldGroupControl.removeControl('extension');
    this.fieldGroupControl.removeControl('url');
    this.cdr.detectChanges();
  }

  setAuxMessageAndFocus(text: string): void {
    const element = document.getElementById('aux-upload-message');

    if (element) {
      element.textContent = text;
      setTimeout(() => {
        // Await for the html injection if needed.
        element.setAttribute('tabIndex', '-1');
        element.focus();
        element.addEventListener('blur', (e: any) => {
          e.preventDefault();
          element.removeAttribute('tabIndex');
        });
      });
    }
  }

  evaluateDropZoneTabIndex(): void {
    const element: any = document.getElementsByTagName('ngx-dropzone')[0] as HTMLInputElement;

    if (this.uploadedFile) {
      element.firstElementChild.setAttribute('tabIndex', '0');
    } else {
      element.firstElementChild.setAttribute('tabIndex', '-1');
    }
  }

  openAddFileDialog(): void {
    const element: any = document.getElementsByTagName('ngx-dropzone')[0];
    element.firstElementChild.click();
  }
}
