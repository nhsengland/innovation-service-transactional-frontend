import { FormControl, FormGroup } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';
import { CustomValidators } from '@modules/shared/forms';
import { CoreComponent } from '@app/base';
import { VizardService } from '../../vizard.service';

export type ReminderStepAnswersInput = {
  reminder: string;
};

export type ReminderStepAnswersOutput = ReminderStepAnswersInput;

@Component({
  selector: 'app-reminder-step',
  templateUrl: './reminder-step.component.html'
})
export class ReminderStepComponent extends CoreComponent implements OnInit {
  @Input({ required: true }) title = '';
  @Input({ required: true }) answers!: ReminderStepAnswersInput;

  errorMessage = 'Write your notification';

  form = new FormGroup({
    reminder: new FormControl<string>('', CustomValidators.required(this.errorMessage))
  });

  constructor(private vizardService: VizardService<ReminderStepAnswersOutput>) {
    super();

    this.setBackLink('Go back', this.onPreviousStep.bind(this));
  }

  ngOnInit() {
    // Set the answer previously given by the user
    this.form.get('reminder')?.setValue(this.answers.reminder);

    this.setPageTitle(this.title, { width: '2.thirds', size: 'l' });
    this.setPageStatus('READY');
  }

  prepareOutputData(): ReminderStepAnswersOutput {
    return {
      reminder: this.form.value.reminder ?? ''
    };
  }

  onPreviousStep(): void {
    this.vizardService.triggerPrevious(this.prepareOutputData());
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

    this.vizardService.triggerNext(this.prepareOutputData());
  }
}
