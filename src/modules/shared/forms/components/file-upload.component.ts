/* istanbul ignore file */
// TODO: create tests for this!!!!!

import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, Input, OnInit } from '@angular/core';
import { AbstractControl, ControlContainer, FormArray, FormControl, FormGroup } from '@angular/forms';
import { RandomGeneratorHelper } from '@modules/core';
import { LoggerService, Severity } from '@modules/core/services/logger.service';
import { NgxDropzoneChangeEvent } from 'ngx-dropzone';
import { Observable, of } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';
import { FileTypes, FileUploadType } from '../engine/types/form-engine.types';


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

  isLoadingFile = false;

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

    if (event.addedFiles.length > 0) {
      this.isLoadingFile = true;
    }

    event.addedFiles.forEach(file => {
      this.uploadFile(file).subscribe(
        response => {
          this.files.push({ id: response.id, file });
          this.fieldArrayControl.push(new FormGroup({ id: new FormControl(response.id), name: new FormControl(response.name), url: new FormControl(response.url) }));
          this.evaluateDropZoneTabIndex();
          this.setAuxMessageAndFocus(`${file.name} added.`);
          this.isLoadingFile = false;
          this.cdr.detectChanges();
        },
        error => {
          this.isLoadingFile = false;
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
    if (arrayIndex > -1) {
      const file = this.fieldArrayValues[arrayIndex];
      this.fieldArrayControl.removeAt(arrayIndex);
      this.evaluateDropZoneTabIndex();
      this.setAuxMessageAndFocus(`${file.name} removed.`);
    }

    this.cdr.detectChanges();
  }

  onRemovePreviousUploadedFile(id: string): void {
    this.previousUploadedFiles.splice(this.previousUploadedFiles.findIndex(item => item.id === id), 1);

    const arrayIndex = this.fieldArrayValues.findIndex(item => item.id === id);
    if (arrayIndex > -1) { this.fieldArrayControl.removeAt(arrayIndex); }

    this.cdr.detectChanges();
  }

  setAuxMessageAndFocus(text: string): void {
    const auxUploadMsgElem: any = document.getElementById('aux-upload-message');

    auxUploadMsgElem.textContent = text;

    setTimeout(() => { // Await for the html injection if needed.
      auxUploadMsgElem.setAttribute('tabIndex', '-1');
      auxUploadMsgElem.focus();
      auxUploadMsgElem.addEventListener('blur', (e: any) => {
        e.preventDefault();
        auxUploadMsgElem.removeAttribute('tabIndex');
      });
    });
  }

  evaluateDropZoneTabIndex(): void {
    const dropZoneElem: any = document.getElementsByTagName('ngx-dropzone')[0] as HTMLInputElement;

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
