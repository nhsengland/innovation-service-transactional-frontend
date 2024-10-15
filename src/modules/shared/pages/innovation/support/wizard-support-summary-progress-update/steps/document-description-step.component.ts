import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

import { CoreComponent } from '@app/base';
import { FormGroup } from '@app/base/forms';
import { WizardStepComponentType, WizardStepEventType } from '@app/base/types';
import { DocumentDescriptionStepInputType, DocumentDescriptionStepOutputType } from './document-description-step.types';

@Component({
  selector: 'shared-pages-innovation-support-wizard-support-summary-progress-update-document-description-step',
  templateUrl: './document-description-step.component.html'
})
export class WizardInnovationSupportSummaryProgressUpdateDocumentDescriptionStepComponent
  extends CoreComponent
  implements WizardStepComponentType<DocumentDescriptionStepInputType, DocumentDescriptionStepOutputType>, OnInit
{
  @Input() title = '';
  @Input() data: DocumentDescriptionStepInputType = {
    documentDescription: ''
  };

  @Output() cancelEvent = new EventEmitter<WizardStepEventType<DocumentDescriptionStepOutputType>>();
  @Output() previousStepEvent = new EventEmitter<WizardStepEventType<DocumentDescriptionStepOutputType>>();
  @Output() nextStepEvent = new EventEmitter<WizardStepEventType<DocumentDescriptionStepOutputType>>();
  @Output() submitEvent = new EventEmitter<WizardStepEventType<DocumentDescriptionStepOutputType>>();

  form = new FormGroup({
    documentDescription: new FormControl<string>('')
  });

  constructor() {
    super();

    this.setBackLink('Go back', this.onPreviousStep.bind(this));
  }

  ngOnInit(): void {
    // Set the answer previously given by the user
    this.form.get('documentDescription')?.setValue(this.data.documentDescription);

    this.setPageTitle(this.title, { showPage: false });
    this.setPageStatus('READY');
  }

  prepareOutputData(): DocumentDescriptionStepOutputType {
    return {
      documentDescription: this.form.value.documentDescription ?? ''
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
