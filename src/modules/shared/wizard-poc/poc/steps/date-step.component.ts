import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CoreComponent } from '@app/base';
import { CustomValidators, FormEngineHelper } from '@modules/shared/forms';
import { VizardService } from '../../vizard.service';

export type DateStepAnswersInput = {
  day: string;
  month: string;
  year: string;
};

export type DateStepAnswersOutput = DateStepAnswersInput;

@Component({
  selector: 'app-date-step',
  templateUrl: './date-step.component.html'
})
export class DateStepComponent extends CoreComponent implements OnInit {
  @Input({ required: true }) title = '';
  @Input({ required: true }) answers!: DateStepAnswersInput;

  output: DateStepAnswersOutput = {
    day: '',
    month: '',
    year: ''
  };

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

  constructor(private vizardService: VizardService<DateStepAnswersOutput>) {
    super();

    this.setBackLink('Go back', this.onPreviousStep.bind(this));
  }

  ngOnInit(): void {
    // Set the date previously given by the user
    this.form.setValue({
      date: {
        day: this.answers.day,
        month: this.answers.month,
        year: this.answers.year
      }
    });

    this.setPageTitle(this.title, { width: '2.thirds', size: 'l' });
    this.setPageStatus('READY');
  }

  prepareOutputData(): DateStepAnswersOutput {
    return {
      day: this.form.value.date?.day ?? '',
      month: this.form.value.date?.month ?? '',
      year: this.form.value.date?.year ?? ''
    };
  }

  onPreviousStep(): void {
    this.vizardService.triggerPrevious(this.prepareOutputData());
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

    this.vizardService.triggerNext(this.prepareOutputData());
  }
}
