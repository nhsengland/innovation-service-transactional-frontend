import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

import { CoreComponent } from '@app/base';
import { CustomValidators, FormGroup } from '@app/base/forms';
import { WizardStepComponentType, WizardStepEventType } from '@app/base/types';
import { DescriptionStepInputType, DescriptionStepOutputType } from './description-step.types';

@Component({
  selector: 'shared-pages-innovation-support-wizard-support-summary-progress-update-description-step',
  templateUrl: './description-step.component.html'
})
export class WizardInnovationSupportSummaryProgressUpdateDescriptionStepComponent
  extends CoreComponent
  implements WizardStepComponentType<DescriptionStepInputType, DescriptionStepOutputType>, OnInit
{
  @Input() title = '';
  @Input() data: DescriptionStepInputType = {
    description: ''
  };

  @Output() cancelEvent = new EventEmitter<WizardStepEventType<DescriptionStepOutputType>>();
  @Output() previousStepEvent = new EventEmitter<WizardStepEventType<DescriptionStepOutputType>>();
  @Output() nextStepEvent = new EventEmitter<WizardStepEventType<DescriptionStepOutputType>>();
  @Output() submitEvent = new EventEmitter<WizardStepEventType<DescriptionStepOutputType>>();

  form = new FormGroup({
    description: new FormControl<string>('', [CustomValidators.required('Description is required')])
  });

  constructor() {
    super();

    this.setBackLink('Go back', this.onPreviousStep.bind(this));
  }

  ngOnInit(): void {
    // Set the answer previously given by the user
    this.form.get('description')?.setValue(this.data.description);

    this.setPageTitle(this.title, { showPage: false });
    this.setPageStatus('READY');
  }

  prepareOutputData(): DescriptionStepOutputType {
    return {
      description: this.form.value.description ?? ''
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
