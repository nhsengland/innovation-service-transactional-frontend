import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

import { CoreComponent } from '@app/base';
import { GenericErrorsEnum } from '@app/base/enums';
import { CustomValidators, FormGroup } from '@app/base/forms';
import { ContextInnovationType, WizardStepComponentType, WizardStepEventType } from '@app/base/types';
import { InnovationValidationRules } from '@modules/shared/services/innovations.dtos';
import { InnovationsService } from '@modules/shared/services/innovations.service';
import { DateStepInputType, DateStepOutputType } from './date-step.types';

@Component({
  selector: 'shared-pages-innovation-support-wizard-support-summary-progress-update-milestones-date-step',
  templateUrl: './date-step.component.html'
})
export class WizardInnovationSupportSummaryProgressUpdateMilestonesDateStepComponent
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

  innovation: ContextInnovationType;

  dateNowISOString = new Date().toISOString().slice(0, 10);

  saveButton = { isActive: true, label: 'Continue' };

  form = new FormGroup(
    {
      date: new FormGroup(
        {
          day: new FormControl<string>(''),
          month: new FormControl<string>(''),
          year: new FormControl<string>('')
        },
        CustomValidators.dateInputFormatValidator()
      )
    },
    { updateOn: 'blur' }
  );

  constructor(private innovationsService: InnovationsService) {
    super();

    this.innovation = this.ctx.innovation.innovation();
    this.setBackLink('Go back', this.onPreviousStep.bind(this));
  }

  ngOnInit(): void {
    // Set the date previously given by the user
    this.form.setValue({
      date: {
        day: this.data.day || this.dateNowISOString.split('-')[2],
        month: this.data.month || this.dateNowISOString.split('-')[1],
        year: this.data.year || this.dateNowISOString.split('-')[0]
      }
    });

    this.setPageTitle(this.title, { width: '2.thirds' });
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
    this.saveButton = { isActive: false, label: 'Saving...' };

    if (!this.form.valid) {
      this.form.markAllAsTouched();
      this.saveButton = { isActive: true, label: 'Continue' };
      if (this.form.controls.date.errors?.parsedDateString) {
        this.resetAlert();
      }
      return;
    }

    this.resetAlert();

    const dateString = `${this.form.value.date?.year!}-${this.form.value.date?.month!}-${this.form.value.date?.day!}`;

    const data = {
      unitId: this.stores.authentication.getUserContextInfo()?.organisationUnit?.id!,
      date: dateString
    };

    // Check if organisation had already started support on the date provided and if the date is not in the future
    this.innovationsService
      .getInnovationRules(this.innovation.id, InnovationValidationRules.checkIfSupportHadAlreadyStartedAtDate, data)
      .subscribe({
        next: res => {
          const supportStatusValidation = res.validations.find(
            validation => validation.rule === InnovationValidationRules.checkIfSupportHadAlreadyStartedAtDate
          );

          if (!supportStatusValidation?.valid) {
            const supportNotStartedErrorMessage =
              'Date must be any date after your organisation started supporting this innovation';
            this.setAlertError('', {
              itemsList: [
                {
                  title: supportNotStartedErrorMessage,
                  fieldId: 'day-progressUpdateDate'
                }
              ],
              width: '2.thirds'
            });

            this.form.get('date')?.setErrors({
              customError: true,
              message: supportNotStartedErrorMessage
            });
            this.form.markAllAsTouched();

            this.saveButton = { isActive: true, label: 'Continue' };
            return;
          }
          this.nextStepEvent.emit({ isComplete: true, data: this.prepareOutputData() });
        },
        error: ({ error: err }: HttpErrorResponse) => {
          if (err.error === GenericErrorsEnum.INVALID_PAYLOAD) {
            const dateNotInThePastOrTodayErrorMessage = 'The date must be in the past or today';
            this.setAlertError('The date provided is in the future', {
              itemsList: [{ title: dateNotInThePastOrTodayErrorMessage, fieldId: 'day-progressUpdateDate' }],
              width: '2.thirds'
            });

            this.form.get('date')?.setErrors({ customError: true, message: dateNotInThePastOrTodayErrorMessage });
            this.form.markAllAsTouched();
          } else {
            this.setAlertUnknownError();
          }
          this.saveButton = { isActive: true, label: 'Continue' };
          return;
        }
      });
  }
}
