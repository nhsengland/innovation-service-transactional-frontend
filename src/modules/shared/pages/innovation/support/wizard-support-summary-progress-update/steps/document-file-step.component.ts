import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

import { CoreComponent } from '@app/base';
import { CustomValidators, FileTypes, FileUploadType, FormGroup } from '@app/base/forms';
import { WizardStepComponentType, WizardStepEventType } from '@app/base/types';
import { DocumentFileStepInputType, DocumentFileStepOutputType } from './document-file-step.types';
import { UrlModel } from '@app/base/models';

@Component({
  selector: 'shared-pages-innovation-support-wizard-support-summary-progress-update-document-file-step',
  templateUrl: './document-file-step.component.html'
})
export class WizardInnovationSupportSummaryProgressUpdateDocumentFileStepComponent
  extends CoreComponent
  implements WizardStepComponentType<DocumentFileStepInputType, DocumentFileStepOutputType>, OnInit
{
  @Input() title = '';
  @Input() data: DocumentFileStepInputType = {
    documentFile: null
  };

  @Output() cancelEvent = new EventEmitter<WizardStepEventType<DocumentFileStepOutputType>>();
  @Output() previousStepEvent = new EventEmitter<WizardStepEventType<DocumentFileStepOutputType>>();
  @Output() nextStepEvent = new EventEmitter<WizardStepEventType<DocumentFileStepOutputType>>();
  @Output() submitEvent = new EventEmitter<WizardStepEventType<DocumentFileStepOutputType>>();

  form = new FormGroup({
    documentFile: new FormGroup<FileUploadType | {}>({}, [CustomValidators.required('You need to upload 1 file')])
  });

  fileUploadConfig = {
    httpUploadUrl: new UrlModel(this.CONSTANTS.APP_URL).addPath('upload-file').buildUrl(),
    httpUploadBody: {
      innovatorId: this.ctx.user.getUserId(),
      innovationId: this.ctx.innovation.info().id
    },
    maxFileSize: 20,
    acceptedFiles: [FileTypes.CSV, FileTypes.DOCX, FileTypes.XLSX, FileTypes.PDF]
  };

  constructor() {
    super();

    this.setBackLink('Go back', this.onPreviousStep.bind(this));
  }

  ngOnInit(): void {
    // Set the file previously given by the user
    Object.entries(this.data.documentFile ?? {}).forEach(([key, value]) => {
      (this.form.get('documentFile') as FormGroup).addControl(key, new FormControl(value));
    });

    this.setPageTitle(this.title, { showPage: false });
    this.setPageStatus('READY');
  }

  prepareOutputData(): DocumentFileStepOutputType {
    const documentFile = this.form.value.documentFile;
    return {
      documentFile: documentFile && Object.keys(documentFile).length > 0 ? (documentFile as FileUploadType) : null
    };
  }

  onPreviousStep(): void {
    this.previousStepEvent.emit({ isComplete: true, data: this.prepareOutputData() });
  }

  onNextStep(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.nextStepEvent.emit({ isComplete: true, data: this.prepareOutputData() });
  }
}
