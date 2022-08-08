import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { CoreComponent, FormControl, FormGroup } from '@app/base';
import { CustomValidators } from '@app/base/forms';
import { WizardStepComponentType, WizardStepEventType } from '@app/base/types';

import { SummaryWithConfirmStepInputType, SummaryWithConfirmStepOutputType } from './summary-with-confirm-step.types';


@Component({
  selector: 'app-shared-wizards-steps-summary-with-confirm-step',
  templateUrl: './summary-with-confirm-step.component.html'
})
export class WizardSummaryWithConfirmStepComponent extends CoreComponent implements WizardStepComponentType<SummaryWithConfirmStepInputType, SummaryWithConfirmStepOutputType>, OnInit {

  @Input() title = '';
  @Input() data: SummaryWithConfirmStepInputType = {
    summary: [],
    confirmCheckbox: { label: '' },
    submitButton: { label: '', active: true }
  };
  @Output() cancelEvent = new EventEmitter<WizardStepEventType<SummaryWithConfirmStepOutputType>>();
  @Output() previousStepEvent = new EventEmitter<WizardStepEventType<SummaryWithConfirmStepOutputType>>();
  @Output() nextStepEvent = new EventEmitter<WizardStepEventType<SummaryWithConfirmStepOutputType>>();
  @Output() submitEvent = new EventEmitter<WizardStepEventType<SummaryWithConfirmStepOutputType>>();


  form = new FormGroup({
    confirm: new FormControl(false, CustomValidators.required('You need to confirm to proceed'))
  }, { updateOn: 'blur' });

  constructor() {

    super();
    this.setPageTitle(this.title);

  }

  ngOnInit(): void {

    this.setPageStatus('READY');

  }

  verifyOutputData(): boolean {

    if (!this.form.get('confirm')!.value) {
      this.form.markAllAsTouched();
      return false;
    }

    return true;

  }


  onPreviousStep(): void {
    this.previousStepEvent.emit({ isComplete: true, data: { confirm: this.form.get('confirm')!.value } });
  }

  onSubmit(): void {

    if (!this.verifyOutputData()) { return; }

    this.data.submitButton.active = false;

    if (this.form.valid) {
      this.submitEvent.emit({ isComplete: true, data: { confirm: this.form.get('confirm')!.value } });
    }

  }

}
