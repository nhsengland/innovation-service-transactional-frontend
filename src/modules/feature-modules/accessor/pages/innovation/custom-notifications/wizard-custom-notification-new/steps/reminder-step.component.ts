import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

import { CoreComponent } from '@app/base';
import { CustomValidators, FormGroup } from '@app/base/forms';
import { WizardStepComponentType, WizardStepEventType } from '@app/base/types';
import { ReminderStepInputType, ReminderStepOutputType } from './reminder-step.types';

@Component({
  selector: 'app-accessor-innovation-custom-notifications-wizard-custom-notification-new-reminder-step',
  templateUrl: './reminder-step.component.html'
})
export class WizardInnovationCustomNotificationNewReminderStepComponent
  extends CoreComponent
  implements WizardStepComponentType<ReminderStepInputType, ReminderStepOutputType>, OnInit
{
  @Input() title = '';
  @Input() data: ReminderStepInputType = {
    reminder: ''
  };

  @Output() cancelEvent = new EventEmitter<WizardStepEventType<ReminderStepOutputType>>();
  @Output() previousStepEvent = new EventEmitter<WizardStepEventType<ReminderStepOutputType>>();
  @Output() nextStepEvent = new EventEmitter<WizardStepEventType<ReminderStepOutputType>>();
  @Output() submitEvent = new EventEmitter<WizardStepEventType<ReminderStepOutputType>>();

  errorMessage = 'Write your notification';

  form = new FormGroup({
    reminder: new FormControl<string>('', CustomValidators.required(this.errorMessage))
  });

  constructor() {
    super();

    this.setBackLink('Go back', this.onPreviousStep.bind(this));
  }

  ngOnInit(): void {
    // Set the answer previously given by the user
    this.form.get('reminder')?.setValue(this.data.reminder);

    this.setPageTitle(this.title, { width: '2.thirds', size: 'l' });
    this.setPageStatus('READY');
  }

  prepareOutputData(): ReminderStepOutputType {
    return {
      reminder: this.form.value.reminder ?? ''
    };
  }

  onPreviousStep(): void {
    this.previousStepEvent.emit({ isComplete: true, data: this.prepareOutputData() });
  }

  onNextStep(): void {
    this.resetAlert();
    if (!this.form.valid) {
      this.setAlertError('', {
        itemsList: [{ title: this.errorMessage, fieldId: 'reminder' }],
        width: '2.thirds'
      });

      this.form.markAllAsTouched();

      return;
    }

    this.nextStepEvent.emit({ isComplete: true, data: this.prepareOutputData() });
  }
}
