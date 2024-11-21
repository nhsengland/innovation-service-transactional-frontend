import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DoCheck, Injector, Input, OnInit } from '@angular/core';
import { AbstractControl, ControlContainer, FormArray, FormControl, FormGroup } from '@angular/forms';
import { NgxDropzoneChangeEvent } from 'ngx-dropzone';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { RandomGeneratorHelper } from '@modules/core/helpers/random-generator.helper';
import { LoggerService, Severity } from '@modules/core/services/logger.service';

import { FileTypes, FileUploadType } from '../engine/config/form-engine.config';
import { FormEngineHelper } from '../engine/helpers/form-engine.helper';

@Component({
  selector: 'theme-form-file-upload-array',
  templateUrl: 'file-upload-array.component.html',
  styleUrls: ['./file-upload-array.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormFileUploadArrayComponent implements OnInit, DoCheck {
  @Input() id?: string;
  @Input() arrayName = '';
  @Input() label?: string;
  @Input() description?: string;
  @Input() pageUniqueField? = true;

  @Input()
  set config(
    c:
      | undefined
      | {
          httpUploadUrl: string;
          httpUploadBody?: Record<string, any>;
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
      multiple: true
    };
  }

  uploadedFiles: { id: string; file: File }[] = [];
  previousUploadedFiles: FileUploadType[] = [];

  hasError = false;
  hasUploadError = false;
  error: { message: string; params: Record<string, string> } = { message: '', params: {} };
  isLoadingFile = false;

  fileConfig: {
    httpUploadUrl: string;
    httpUploadBody?: Record<string, any>;
  } = { httpUploadUrl: '' };

  dzConfig: {
    acceptedFiles: string;
    multiple: boolean;
    maxFileSize: number; // In bytes
  } = { acceptedFiles: '*', multiple: false, maxFileSize: 1000000 };

  // Get hold of the control being used.
  get parentFieldControl(): AbstractControl | null {
    return this.injector.get(ControlContainer).control;
  }
  get fieldArrayControl(): FormArray {
    return this.parentFieldControl?.get(this.arrayName) as FormArray;
  }
  get fieldArrayValues(): { id: string; name: string; url: string }[] {
    return this.fieldArrayControl.value as { id: string; name: string; url: string }[];
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

    // TODO: This need revisit when documents feature is closed and information regarding files
    // will always have size and extension information!
    // Then, the following line can be unccommented!
    // this.previousUploadedFiles = [...this.fieldArrayValues]; // Need to clone here!
    this.previousUploadedFiles = this.fieldArrayValues.map(item => ({
      id: item.id,
      name: item.name,
      size: 0,
      extension: '',
      url: item.url
    })); // Need to clone here!
  }

  ngDoCheck(): void {
    if (this.hasUploadError) {
      this.hasError = this.hasUploadError;
      this.hasUploadError = false;
    } else if (!this.isLoadingFile) {
      this.hasError =
        this.fieldArrayControl.invalid && (this.fieldArrayControl.touched || this.fieldArrayControl.dirty);
      this.error = this.hasError
        ? FormEngineHelper.getValidationMessage(this.fieldArrayControl.errors)
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
      const sizeExceeded = event.rejectedFiles.some(i => i.reason === 'size');
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
      const emptyFile = event.addedFiles.find(i => i.size === 0);
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
            this.uploadedFiles.push({ id: response.id, file });

            this.fieldArrayControl.push(
              new FormGroup({
                id: new FormControl(response.id),
                name: new FormControl(response.name),
                size: new FormControl(response.size),
                extension: new FormControl(response.extension),
                url: new FormControl(response.url)
              })
            );

            this.evaluateDropZoneTabIndex();
            this.setAuxMessageAndFocus(`${file.name} added.`);
            this.isLoadingFile = false;

            this.cdr.detectChanges();
          },
          error: error => {
            // TODO: This isn't removing from the dropbox area, if we start using this component that should be reviewed
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

  onRemoveUploadedFile(id: string): void {
    this.uploadedFiles.splice(
      this.uploadedFiles.findIndex(item => item.id === id),
      1
    );

    const arrayIndex = this.fieldArrayValues.findIndex(item => item.id === id);
    if (arrayIndex > -1) {
      const file = this.fieldArrayValues[arrayIndex];
      this.fieldArrayControl.removeAt(arrayIndex);
      this.evaluateDropZoneTabIndex();
      this.setAuxMessageAndFocus(`${file.name} removed.`);
    }

    this.cdr.detectChanges();
  }

  onRemovePreviousUploadedFile(id: string): void {
    this.previousUploadedFiles.splice(
      this.previousUploadedFiles.findIndex(item => item.id === id),
      1
    );

    const arrayIndex = this.fieldArrayValues.findIndex(item => item.id === id);
    if (arrayIndex > -1) {
      this.fieldArrayControl.removeAt(arrayIndex);
    }

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

    if (this.uploadedFiles.length === 0) {
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
