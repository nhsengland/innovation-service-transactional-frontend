import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DoCheck, Injector, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { LoggerService, Severity } from '@modules/core/services/logger.service';
import { saveAs } from 'file-saver';
import { FileTypes, FileUploadType } from '../engine/config/form-engine.config';
import { FormEngineHelper } from '../engine/helpers/form-engine.helper';

@Component({
  selector: 'theme-form-file-upload-descriptive',
  templateUrl: './file-upload-descriptive.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormFileUploadDescriptiveComponent implements OnInit, DoCheck {

  @Input() id?: string;
  @Input() label?: string;
  @Input() description?: string;
  @Input() pageUniqueField = true;

  @Input()
  set config(c: undefined | {
    acceptedFiles?: FileTypes[],
    maxFileSize?: number // In Mb.
  }) {

    this.inputFileConfig = {
      acceptedFiles: (c?.acceptedFiles || [FileTypes.ALL]).map(ext => ext).join(','),
      maxFileSize: c?.maxFileSize ? (c.maxFileSize * 1000000) : 1000000, // 1Mb.
    };

  };

  inputFileConfig: {
    acceptedFiles: string;
    maxFileSize: number; // In bytes
  } = { acceptedFiles: '*', maxFileSize: 1000000 };

  uploadedFile: null | { file: File, url: string } = null;

  hasError = false;
  hasUploadError = false;
  error: { message: string, params: { [key: string]: string } } = { message: '', params: {} };
  isLoadingFile = false;

  constructor(
    private injector: Injector,
    private cdr: ChangeDetectorRef,
    private http: HttpClient,
    private loggerService: LoggerService,
    private sanitizer:DomSanitizer
  ) { }

  ngOnInit() {
    console.log();
  }

  ngDoCheck(): void {
    console.log();
  }

  onChange(event: any) {

    this.hasError = false;

    const file = event.target.files[0];

    if (file.size === 0) {
      this.hasError = true;
      this.error = FormEngineHelper.getValidationMessage({ emptyFile: 'true' });
      return;
    }

    if(file.size > this.inputFileConfig.maxFileSize) {
      this.hasError = true;
      this.error = FormEngineHelper.getValidationMessage({ maxFileSize: 'true' });
      return;
    }

    this.uploadedFile = { file: file, url: window.URL.createObjectURL(file) };

    console.log('uploaded files', this.uploadedFile);

  }

  downloadFile(file: File) {
    saveAs(file, file.name);
  }

  removeUploadedFile() {
    this.uploadedFile = null;
  }

}
