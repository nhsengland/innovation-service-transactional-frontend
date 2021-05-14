/* istanbul ignore file */
// TODO: create tests for this!!!!!

import { Component, Input, Output, OnInit, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { catchError, map, take } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { NgxDropzoneChangeEvent } from 'ngx-dropzone';
import { FormEngineFileUploadEvent, FormEngineFilesListEvent } from '../../engine/types/form-engine.types';

@Component({
  selector: 'theme-form-upload',
  templateUrl: 'uploads.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class FormUploadComponent implements OnInit {

  @Input() config?: {
    httpUploadUrl: string;
    httpUploadBody?: { [key: string]: any };
    acceptedFiles?: string[];
    multiple?: boolean;
    maxFileSize?: number; // In bytes.
    previousUploadedFiles?: { id: string, name: string }[]
  };

  @Output() fileUploadEvent: EventEmitter<FormEngineFileUploadEvent> = new EventEmitter();
  @Output() filesListEvent: EventEmitter<FormEngineFilesListEvent[]> = new EventEmitter();


  files: { id: string, file: File }[] = [];
  previousUploadedFiles: { id: string, name: string }[] = [];
  dzConfig: {
    acceptedFiles: string;
    multiple: boolean;
    maxFileSize: number; // In bytes
  };


  constructor(
    private http: HttpClient
  ) {

    this.dzConfig = { acceptedFiles: '*', multiple: false, maxFileSize: 5000 };

  }

  ngOnInit(): void {


    this.dzConfig = {
      acceptedFiles: (this.config?.acceptedFiles || ['*']).map(ext => ext).join(','),
      multiple: this.config?.multiple === false ? false : true,
      maxFileSize: this.config?.maxFileSize ? this.config.maxFileSize : 5000
    };

    this.previousUploadedFiles = this.config?.previousUploadedFiles || [];
    this.filesListEvent.emit(this.previousUploadedFiles);

  }


  private uploadFile(file: File): Observable<{ id: string }> {

    const formdata = new FormData();
    formdata.append('file', file, file.name);

    Object.entries(this.config?.httpUploadBody || {}).forEach(([key, value]) => {
      formdata.append(key, value);
    });

    return this.http.post<{ id: string }>(this.config?.httpUploadUrl || '', formdata).pipe(
      take(1),
      map(response => response),
      catchError((error) => {
        console.log('upload error', error);
        return of({ id: '' });
      })
    );

  }

  onChange(event: NgxDropzoneChangeEvent): void {

    event.addedFiles.forEach(file => {
      this.uploadFile(file).subscribe(
        response => {
          this.files.push({ id: response.id, file });
          this.fileUploadEvent.emit({ type: 'fileAdded', data: { id: response.id, name: file.name } });
        },
        error => {
          console.log('Upload error', error);
        }
      );

    });

  }

  onRemove(id: string): void {
    this.files.splice(this.files.findIndex(item => item.id === id), 1);
    this.fileUploadEvent.emit({ type: 'fileRemoved', data: { id, name: '' } });
  }

  onRemovePreviousUploadedFile(id: string): void {

    this.previousUploadedFiles.splice(this.previousUploadedFiles.findIndex(item => item.id === id), 1);
    this.fileUploadEvent.emit({ type: 'fileRemoved', data: { id, name: '' } });

  }

}
