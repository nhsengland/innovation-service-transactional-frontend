import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { CoreComponent } from '@app/base';
import { CustomValidators, FormGroup } from '@app/base/forms';
import { WizardStepComponentType, WizardStepEventType } from '@app/base/types';
import { DocumentNameStepInputType, DocumentNameStepOutputType } from './document-name-step.types';

@Component({
  selector: 'shared-pages-innovation-support-wizard-support-summary-progress-update-document-name-step',
  templateUrl: './document-name-step.component.html'
})
export class WizardInnovationSupportSummaryProgressUpdateDocumentNameStepComponent
  extends CoreComponent
  implements WizardStepComponentType<DocumentNameStepInputType, DocumentNameStepOutputType>, OnInit
{
  @Input() title = '';
  @Input() data: DocumentNameStepInputType = {
    documentName: ''
  };

  @Output() cancelEvent = new EventEmitter<WizardStepEventType<DocumentNameStepOutputType>>();
  @Output() previousStepEvent = new EventEmitter<WizardStepEventType<DocumentNameStepOutputType>>();
  @Output() nextStepEvent = new EventEmitter<WizardStepEventType<DocumentNameStepOutputType>>();
  @Output() submitEvent = new EventEmitter<WizardStepEventType<DocumentNameStepOutputType>>();

  form = new FormGroup({
    documentName: new FormControl<string>('', [
      CustomValidators.required('Name is required'),
      Validators.maxLength(100)
    ])
  });

  constructor() {
    super();

    this.setBackLink('Go back', this.onPreviousStep.bind(this));
  }

  ngOnInit(): void {
    // Set the answer previously given by the user
    this.form.get('documentName')?.setValue(this.data.documentName);

    this.setPageTitle(this.title, { showPage: false });
    this.setPageStatus('READY');
  }

  prepareOutputData(): DocumentNameStepOutputType {
    return {
      documentName: this.form.value.documentName ?? ''
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
