import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

import { CoreComponent } from '@app/base';
import { FileTypes, FormGroup } from '@app/base/forms';
import { DatesHelper } from '@app/base/helpers';
import { WizardStepComponentType, WizardStepEventType } from '@app/base/types';
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

  constructor() {
    super();

    this.setBackLink('Go back', this.onPreviousStep.bind(this));
  }

  ngOnInit(): void {
    this.setPageTitle(this.title);

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
      //dateISOString: `${year}-${month}-${day}`;
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

    const inputDate = Date.parse(
      DatesHelper.constructISODateString(
        this.form.value.date?.year!,
        this.form.value.date?.month!,
        this.form.value.date?.day!
      )
    );

    const isDateInFuture = inputDate > Date.parse(this.dateNowISOString);

    this.nextStepEvent.emit({ isComplete: true, data: this.prepareOutputData() });
  }
}
