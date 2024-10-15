import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { CoreComponent } from '@app/base';
import { CustomValidators, FormGroup } from '@app/base/forms';
import { WizardStepComponentType, WizardStepEventType } from '@app/base/types';
import { TitleStepInputType, TitleStepOutputType } from './title-step.types';

@Component({
  selector: 'shared-pages-innovation-support-wizard-support-summary-progress-update-title-step',
  templateUrl: './title-step.component.html'
})
export class WizardInnovationSupportSummaryProgressUpdateTitleStepComponent
  extends CoreComponent
  implements WizardStepComponentType<TitleStepInputType, TitleStepOutputType>, OnInit
{
  @Input() title = '';
  @Input() data: TitleStepInputType = {
    title: ''
  };

  @Output() cancelEvent = new EventEmitter<WizardStepEventType<TitleStepOutputType>>();
  @Output() previousStepEvent = new EventEmitter<WizardStepEventType<TitleStepOutputType>>();
  @Output() nextStepEvent = new EventEmitter<WizardStepEventType<TitleStepOutputType>>();
  @Output() submitEvent = new EventEmitter<WizardStepEventType<TitleStepOutputType>>();

  form = new FormGroup({
    title: new FormControl<string>('', [CustomValidators.required('Title is required'), Validators.maxLength(100)])
  });

  constructor() {
    super();

    this.setBackLink('Go back', this.onPreviousStep.bind(this));
  }

  ngOnInit(): void {
    // Set the answer previously given by the user
    this.form.get('title')?.setValue(this.data.title);

    this.setPageTitle(this.title, { showPage: false });
    this.setPageStatus('READY');
  }

  prepareOutputData(): TitleStepOutputType {
    return {
      title: this.form.value.title ?? ''
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
