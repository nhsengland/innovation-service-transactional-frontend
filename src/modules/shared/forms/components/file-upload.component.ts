/* istanbul ignore file */
// TODO: create tests for this!!!!!

import { Component, Input, OnInit, ChangeDetectionStrategy, Injector, ChangeDetectorRef } from '@angular/core';
import { AbstractControl, ControlContainer, FormArray, FormControl, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';

import { NgxDropzoneChangeEvent } from 'ngx-dropzone';

import { RandomGeneratorHelper } from '@modules/core';

import { FileUploadType, FileTypes } from '../engine/types/form-engine.types';
import { LoggerService, Severity } from '@modules/core/services/logger.service';


@Component({
  selector: 'theme-form-file-upload',
  templateUrl: 'file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class FormFileUploadComponent implements OnInit {

  @Input() id?: string;
  @Input() arrayName = '';
  @Input() label?: string;
  @Input() description?: string;
  @Input() pageUniqueField = true;

  @Input() config?: {
    httpUploadUrl: string;
    httpUploadBody?: { [key: string]: any };
    acceptedFiles?: FileTypes[];
    multiple?: boolean;
    maxFileSize?: number; // In Mb.
  };

  files: { id: string, file: File }[] = [];
  previousUploadedFiles: FileUploadType[] = [];

  dzConfig: {
    acceptedFiles: string;
    multiple: boolean;
    maxFileSize: number; // In bytes
  };

  // Get hold of the control being used.
  get parentFieldControl(): AbstractControl | null { return this.injector.get(ControlContainer).control; }
  get fieldArrayControl(): FormArray { return this.parentFieldControl?.get(this.arrayName) as FormArray; }
  get fieldArrayValues(): { id: string, name: string, url: string }[] { return this.fieldArrayControl.value as { id: string, name: string, url: string }[]; }

  constructor(
    private injector: Injector,
    private cdr: ChangeDetectorRef,
    private http: HttpClient,
    private loggerService: LoggerService
  ) {

    this.dzConfig = { acceptedFiles: '*', multiple: false, maxFileSize: 1000000 };

  }

  ngOnInit(): void {

    this.id = this.id || RandomGeneratorHelper.generateRandom();

    this.dzConfig = {
      acceptedFiles: (this.config?.acceptedFiles || [FileTypes.ALL]).map(ext => ext).join(','),
      multiple: this.config?.multiple === false ? false : true,
      maxFileSize: this.config?.maxFileSize ? (this.config.maxFileSize * 1000000) : 1000000 // 1Mb.
    };

    this.previousUploadedFiles = [...this.fieldArrayValues]; // Need to clone here!

  }

  private uploadFile(file: File): Observable<FileUploadType> {

    const formdata = new FormData();
    formdata.append('file', file, file.name);

    Object.entries(this.config?.httpUploadBody || {}).forEach(([key, value]) => {
      formdata.append(key, value);
    });

    return this.http.post<{ id: string, displayFileName: string, url: string }>(this.config?.httpUploadUrl || '', formdata).pipe(
      take(1),
      map(response => ({ id: response.id, name: response.displayFileName, url: response.url })),
      catchError((error) => {
        this.loggerService.trackTrace('upload error', Severity.ERROR, { error });
        return of({ id: '', name: '', url: '' });
      })
    );
  }

  onChange(event: NgxDropzoneChangeEvent): void {

    event.addedFiles.forEach(file => {
      this.uploadFile(file).subscribe(
        response => {
          this.files.push({ id: response.id, file });
          this.fieldArrayControl.push(new FormGroup({ id: new FormControl(response.id), name: new FormControl(response.name), url: new FormControl(response.url) }));
          this.evaluateDropZoneTabIndex();
          this.cdr.detectChanges();
        },
        error => {
          this.loggerService.trackTrace('upload error', Severity.ERROR, { error });
        }
      );
    });

    event.rejectedFiles.forEach(file => {
      this.loggerService.trackTrace(`File Upload failed for file: ${file}`, Severity.ERROR);
    });
  }

  onRemove(id: string): void {
    this.files.splice(this.files.findIndex(item => item.id === id), 1);

    const arrayIndex = this.fieldArrayValues.findIndex(item => item.id === id);
    if (arrayIndex > -1) { this.fieldArrayControl.removeAt(arrayIndex); }

    this.evaluateDropZoneTabIndex();
    this.cdr.detectChanges();
  }

  onRemovePreviousUploadedFile(id: string): void {
    this.previousUploadedFiles.splice(this.previousUploadedFiles.findIndex(item => item.id === id), 1);

    const arrayIndex = this.fieldArrayValues.findIndex(item => item.id === id);
    if (arrayIndex > -1) { this.fieldArrayControl.removeAt(arrayIndex); }

    this.cdr.detectChanges();
  }

  evaluateDropZoneTabIndex(): void {
    const dropZoneElem: any = document.getElementsByTagName('ngx-dropzone')[0];

    if (this.files.length === 0) {
      dropZoneElem.firstElementChild.setAttribute('tabIndex', '0');
    } else {
      dropZoneElem.firstElementChild.setAttribute('tabIndex', '-1');
    }
  }

  openAddFileDialog(): void {
    const dropZoneElem: any = document.getElementsByTagName('ngx-dropzone')[0];

    dropZoneElem.firstElementChild.click();
  }
}
