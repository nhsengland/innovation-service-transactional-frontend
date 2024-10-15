import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

import { CoreComponent } from '@app/base';
import { CustomValidators, FormEngineParameterModel, FormGroup } from '@app/base/forms';
import { WizardStepComponentType, WizardStepEventType } from '@app/base/types';
import { AddDocumentStepInputType, AddDocumentStepOutputType } from './add-document-step.types';

@Component({
  selector: 'shared-pages-innovation-support-wizard-support-summary-progress-update-add-document-step',
  templateUrl: './add-document-step.component.html'
})
export class WizardInnovationSupportSummaryProgressUpdateAddDocumentStepComponent
  extends CoreComponent
  implements WizardStepComponentType<AddDocumentStepInputType, AddDocumentStepOutputType>, OnInit
{
  @Input() title = '';
  @Input() data: AddDocumentStepInputType = {
    addDocument: ''
  };

  @Output() cancelEvent = new EventEmitter<WizardStepEventType<AddDocumentStepOutputType>>();
  @Output() previousStepEvent = new EventEmitter<WizardStepEventType<AddDocumentStepOutputType>>();
  @Output() nextStepEvent = new EventEmitter<WizardStepEventType<AddDocumentStepOutputType>>();
  @Output() submitEvent = new EventEmitter<WizardStepEventType<AddDocumentStepOutputType>>();

  form = new FormGroup({
    addDocument: new FormControl<string | null>(null, [CustomValidators.required('Choose one option')])
  });

  addDocumentItems: Required<FormEngineParameterModel>['items'] = [
    { value: 'YES', label: 'Yes' },
    { value: 'NO', label: 'No' }
  ];

  constructor() {
    super();

    this.setBackLink('Go back', this.onPreviousStep.bind(this));
  }

  ngOnInit(): void {
    // Select the item previously selected by the user
    this.form.get('addDocument')?.setValue(this.data.addDocument);

    this.setPageTitle(this.title, { showPage: false });
    this.setPageStatus('READY');
  }

  prepareOutputData(): AddDocumentStepOutputType {
    return {
      addDocument: this.form.value.addDocument ?? ''
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
