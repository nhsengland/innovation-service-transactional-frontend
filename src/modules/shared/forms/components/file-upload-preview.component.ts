import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxDropzonePreviewComponent } from 'ngx-dropzone';

@Component({
  selector: 'theme-file-upload-preview',
  template: ` <ng-content select="ngx-dropzone-label"></ng-content>`,
  styleUrls: ['./file-upload-preview.component.scss'],
  providers: [
    {
      provide: NgxDropzonePreviewComponent,
      useExisting: FormFileUploadPreviewComponent
    }
  ]
})
export class FormFileUploadPreviewComponent extends NgxDropzonePreviewComponent {
  constructor(sanitizer: DomSanitizer) {
    super(sanitizer);
  }
}
