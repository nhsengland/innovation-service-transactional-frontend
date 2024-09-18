import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { CoreComponent } from '@app/base';
import { WizardStepComponentType, WizardStepEventType } from '@app/base/types';
import { DateStepInputType, DateStepOutputType } from './date-step.types';
import { CustomValidators, FormEngineHelper } from '@modules/shared/forms';

@Component({
  selector: 'app-accessor-innovation-custom-notifications-wizard-custom-notification-new-date-step',
  templateUrl: './date-step.component.html'
})
export class WizardInnovationCustomNotificationNewDateStepComponent
  extends CoreComponent
  implements WizardStepComponentType<DateStepInputType, DateStepOutputType>, OnInit
{
  @Input() title = '';
  @Input() data: DateStepInputType = {
    day: '',
    month: '',
    year: ''
  };

  @Output() cancelEvent = new EventEmitter<WizardStepEventType<DateStepOutputType>>();
  @Output() previousStepEvent = new EventEmitter<WizardStepEventType<DateStepOutputType>>();
  @Output() nextStepEvent = new EventEmitter<WizardStepEventType<DateStepOutputType>>();
  @Output() submitEvent = new EventEmitter<WizardStepEventType<DateStepOutputType>>();

  dateNowISOString = new Date().toISOString().slice(0, 10);

  dateRequiredErrorMessage = 'Select a date to receive your notification';
  dateShouldBeInFutureErrorMessage = 'Select a date in future';

  form = new FormGroup(
    {
      date: new FormGroup(
        {
          day: new FormControl<string>(''),
          month: new FormControl<string>(''),
          year: new FormControl<string>('')
        },
        [
          CustomValidators.requiredDateInputValidator(this.dateRequiredErrorMessage),
          CustomValidators.dateInputFormatValidator(),
          CustomValidators.futureDateInputValidator(false, this.dateShouldBeInFutureErrorMessage)
        ]
      )
    },
    { updateOn: 'submit' }
  );

  constructor() {
    super();

    this.setBackLink('Go back', this.onPreviousStep.bind(this));
  }

  ngOnInit(): void {
    // Set the date previously given by the user
    this.form.setValue({
      date: {
        day: this.data.day,
        month: this.data.month,
        year: this.data.year
      }
    });

    this.setPageTitle(this.title, { width: '2.thirds', size: 'l' });
    this.setPageStatus('READY');
  }

  prepareOutputData(): DateStepOutputType {
    return {
      day: this.form.value.date?.day ?? '',
      month: this.form.value.date?.month ?? '',
      year: this.form.value.date?.year ?? ''
    };
  }

  onPreviousStep(): void {
    this.previousStepEvent.emit({ isComplete: true, data: this.prepareOutputData() });
  }

  onNextStep(): void {
    this.resetAlert();

    if (!this.form.valid) {
      if (this.form.controls.date.errors?.requiredDateInput) {
        this.setAlertError('', {
          itemsList: [{ title: this.form.controls.date.errors?.requiredDateInput.message, fieldId: 'date' }],
          width: '2.thirds'
        });
      } else if (this.form.controls.date.errors?.dateInputFormat) {
        this.setAlertError('', {
          itemsList: [
            {
              title: this.translate(FormEngineHelper.getValidationMessage(this.form.controls.date.errors).message),
              fieldId: 'date'
            }
          ],
          width: '2.thirds'
        });
      } else if (this.form.controls.date.errors?.futureDateInput) {
        this.setAlertError('', {
          itemsList: [{ title: this.form.controls.date.errors?.futureDateInput.message, fieldId: 'date' }],
          width: '2.thirds'
        });
      }

      this.form.markAllAsTouched();

      return;
    }

    this.nextStepEvent.emit({ isComplete: true, data: this.prepareOutputData() });
  }
}
