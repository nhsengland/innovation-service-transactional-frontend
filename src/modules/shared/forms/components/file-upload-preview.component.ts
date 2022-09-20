/* istanbul ignore file */

import { Component, OnInit } from '@angular/core';
import { NgxDropzonePreviewComponent } from 'ngx-dropzone';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'theme-file-upload-preview',
  template: `
    <ng-content select="ngx-dropzone-label"></ng-content>
    <ngx-dropzone-remove-badge *ngIf="removable" (click)="_remove($event)"></ngx-dropzone-remove-badge>`,
  styleUrls: ['./file-upload-preview.component.scss'],
  providers: [
    {
      provide: NgxDropzonePreviewComponent,
      useExisting: FormFileUploadPreviewComponent
    }
  ]
})
export class FormFileUploadPreviewComponent extends NgxDropzonePreviewComponent implements OnInit {

  constructor(
    sanitizer: DomSanitizer
  ) {
    super(sanitizer);
  }

  ngOnInit(): void {

    if (!this.file) {
      console.error('No file to read. Please provide a file using the [file] Input property.');
    }

  }

}
