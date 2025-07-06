import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

import { CoreComponent } from '@app/base';
import { CustomValidators, FormGroup } from '@app/base/forms';
import { WizardStepEventType } from '@app/base/types';

type NotificationStepOutputType = { toNotify: string };

@Component({
  selector: 'shared-pages-innovation-support-wizard-support-summary-progress-update-milestones-notification-step',
  templateUrl: './notification-step.component.html'
})
export class WizardInnovationSupportSummaryProgressUpdateMilestonesNotificationStepComponent
  extends CoreComponent
  implements OnInit
{
  @Input() title = '';
  @Input() data: NotificationStepOutputType = { toNotify: 'yes' };

  @Output() cancelEvent = new EventEmitter<WizardStepEventType<NotificationStepOutputType>>();
  @Output() previousStepEvent = new EventEmitter<WizardStepEventType<NotificationStepOutputType>>();
  @Output() nextStepEvent = new EventEmitter<WizardStepEventType<NotificationStepOutputType>>();
  @Output() submitEvent = new EventEmitter<WizardStepEventType<NotificationStepOutputType>>();

  saveButton = { isActive: true, label: 'Continue' };

  errorMessage = "Select whether you'd like to notify innovator or not";

  form = new FormGroup({
    toNotify: new FormControl<string>('yes', [CustomValidators.required(this.errorMessage)])
  });

  items = [
    {
      value: 'yes',
      label: 'Yes'
    },
    {
      value: 'no',
      label: 'No'
    }
  ];

  constructor() {
    super();

    this.setBackLink('Go back', this.onPreviousStep.bind(this));
  }

  ngOnInit(): void {
    this.form.setValue({ toNotify: this.data.toNotify });
    this.setPageTitle(this.title, { width: '2.thirds' });
    this.setPageStatus('READY');
  }

  prepareOutputData(): NotificationStepOutputType {
    return {
      toNotify: this.form.value.toNotify ?? 'yes'
    };
  }

  onPreviousStep(): void {
    this.previousStepEvent.emit({ isComplete: true, data: this.prepareOutputData() });
  }

  onNextStep(): void {
    this.resetAlert();
    if (!this.form.valid) {
      this.setAlertError('', {
        itemsList: [{ title: this.errorMessage, fieldId: 'notification1' }],
        width: '2.thirds'
      });

      this.form.markAllAsTouched();

      return;
    }
    this.nextStepEvent.emit({ isComplete: true, data: this.prepareOutputData() });
  }
}
