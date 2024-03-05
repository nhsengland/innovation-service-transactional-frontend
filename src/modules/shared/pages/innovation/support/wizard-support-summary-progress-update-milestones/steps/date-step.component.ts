import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

import { CoreComponent } from '@app/base';
import { GenericErrorsEnum } from '@app/base/enums';
import { FileTypes, FormGroup } from '@app/base/forms';
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

  form = new FormGroup(
    {
      date: new FormGroup({
        day: new FormControl<string>(''),
        month: new FormControl<string>(''),
        year: new FormControl<string>('')
      })
    },
    { updateOn: 'blur' }
  );

  configInputFile = {
    acceptedFiles: [FileTypes.CSV, FileTypes.XLSX, FileTypes.DOCX, FileTypes.PDF],
    maxFileSize: 20 // In Mb.
  };

  constructor(private innovationsService: InnovationsService) {
    super();

    this.innovation = this.stores.context.getInnovation();
    this.setBackLink('Go back', this.onPreviousStep.bind(this));
  }

  ngOnInit(): void {
    this.setPageTitle(this.title, { width: '2.thirds' });

    this.form
      .get('date')
      ?.get('day')
      ?.setValue(this.data.day || this.dateNowISOString.split('-')[2]);
    this.form
      .get('date')
      ?.get('month')
      ?.setValue(this.data.month || this.dateNowISOString.split('-')[1]);
    this.form
      .get('date')
      ?.get('year')
      ?.setValue(this.data.year || this.dateNowISOString.split('-')[0]);

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
      this.form.markAllAsTouched();
      return;
    }

    const dateString = `${this.form.value.date?.year!}-${this.form.value.date?.month!}-${this.form.value.date?.day!}`;

    const data = {
      supportId: this.innovation.support?.id!,
      date: dateString,
      status: this.innovation.support?.status!
    };

    this.innovationsService
      .getInnovationRules(this.innovation.id, InnovationValidationRules.checkIfSupportStatusAtDate, data)
      .subscribe({
        next: res => {
          const supportStatusValidation = res.validations.find(
            validation => validation.rule === InnovationValidationRules.checkIfSupportStatusAtDate
          );

          if (!supportStatusValidation?.valid) {
            this.setAlertError('Your organisation was not engaging with this innovation on the date provided', {
              itemsList: [
                {
                  title: 'The date provided must be during the time your organisation was engaging with this innovation'
                }
              ],
              width: '2.thirds'
            });
            this.form.get('date')?.setErrors({
              customError: true,
              message: 'The date provided must be during the time your organisation was engaging with this innovation'
            });
            this.form.markAllAsTouched();
            return;
          }
          this.nextStepEvent.emit({ isComplete: true, data: this.prepareOutputData() });
        },
        error: ({ error: err }: HttpErrorResponse) => {
          if (err.error === GenericErrorsEnum.INVALID_PAYLOAD) {
            this.setAlertError('The date provided is in the future', {
              itemsList: [{ title: 'The date must be in the past or today' }],
              width: '2.thirds'
            });
            this.form.get('date')?.setErrors({ customError: true, message: 'The date must be in the past or today' });
            this.form.markAllAsTouched();
          } else {
            this.setAlertUnknownError();
          }
          return;
        }
      });
  }
}
