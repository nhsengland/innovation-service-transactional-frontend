import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DoCheck, forwardRef, Injector, Input, OnInit } from '@angular/core';
import { AbstractControl, ControlContainer, FormControl } from '@angular/forms';
import { RandomGeneratorHelper } from '@app/base/helpers';
import { saveAs } from 'file-saver';
import { FileTypes } from '../engine/config/form-engine.config';
import { FormEngineHelper } from '../engine/helpers/form-engine.helper';

@Component({
  selector: 'theme-form-file-upload-descriptive',
  templateUrl: './file-upload-descriptive.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormFileUploadDescriptiveComponent implements OnInit, DoCheck {

  @Input() id?: string;
  @Input() name?: string;
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
  error: { message: string, params: { [key: string]: string } } = { message: '', params: {} };

  // Form controls.
  get parentFieldControl(): AbstractControl | null { return this.injector.get(ControlContainer).control; }
  get fieldControl(): FormControl { return this.parentFieldControl?.get(this.name!) as FormControl; }

  // Accessibility.
  get ariaDescribedBy(): null | string {
    let s = '';
    if (this.description) { s += `hint-${this.id}`; }
    if (this.hasError) { s += `${s ? ' ' : ''}error-${this.id}`; }
    return s || null;
  }

  constructor(
    private injector: Injector,
    private cdr: ChangeDetectorRef
  ) {

  }

  ngOnInit(): void {

    this.id = this.id || RandomGeneratorHelper.generateRandom();

  }

  ngDoCheck(): void {
    this.hasError = (this.fieldControl.invalid && (this.fieldControl.touched || this.fieldControl.dirty));
    this.error = this.hasError ? FormEngineHelper.getValidationMessage(this.fieldControl.errors) : { message: '', params: {} };
    this.cdr.detectChanges();
  }

  onChange(event: any): void {

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

    this.fieldControl.setValue(file);

    this.setAuxMessageAndFocus(`${file.name} added.`);

  }

  downloadFile(file: File): void {
    saveAs(file, file.name);
  }

  removeUploadedFile(): void {
    this.uploadedFile = null;
    this.fieldControl.setValue(null);
  }

  setAuxMessageAndFocus(text: string): void {

    const element = document.getElementById('aux-upload-message');

    if (element) {
      element.textContent = text;
      setTimeout(() => { // Await for the html injection if needed.
        element.setAttribute('tabIndex', '-1');
        element.focus();
        element.addEventListener('blur', (e: any) => {
          e.preventDefault();
          element.removeAttribute('tabIndex');
        });
      });
    }

  }

}
