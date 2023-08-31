import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Validators } from '@angular/forms';

import { CoreComponent } from '@app/base';
import { CustomValidators, FormControl, FormGroup } from '@app/base/forms';
import { WizardStepComponentType, WizardStepEventType } from '@app/base/types';

import { UsersService } from '@modules/shared/services/users.service';

import { SubjectMessageStepInputType, SubjectMessageStepOutputType } from './subject-message-step.types';


@Component({
  selector: 'shared-pages-innovation-messages-wizard-thread-new-subject-message-step',
  templateUrl: './subject-message-step.component.html'
})
export class WizardInnovationThreadNewSubjectMessageStepComponent extends CoreComponent implements WizardStepComponentType<SubjectMessageStepInputType, SubjectMessageStepOutputType>, OnInit {

  @Input() title = '';
  @Input() data: SubjectMessageStepInputType = {
    subject: '',
    message: ''
  };
  @Output() cancelEvent = new EventEmitter<WizardStepEventType<SubjectMessageStepOutputType>>();
  @Output() previousStepEvent = new EventEmitter<WizardStepEventType<SubjectMessageStepOutputType>>();
  @Output() nextStepEvent = new EventEmitter<WizardStepEventType<SubjectMessageStepOutputType>>();
  @Output() submitEvent = new EventEmitter<WizardStepEventType<SubjectMessageStepOutputType>>();

  form = new FormGroup({
    subject: new FormControl<string>('', [CustomValidators.required('A subject is required'), Validators.maxLength(100)]),
    message: new FormControl<string>('', CustomValidators.required('A message is required')),
    confirmation: new FormControl<boolean>(false, CustomValidators.required('You need to confirm to proceed'))
  }, { updateOn: 'blur' });

  constructor(
    private usersService: UsersService
  ) { super(); }

  ngOnInit(): void {

    this.setPageTitle(this.title);
    this.setBackLink('Go back', this.onPreviousStep.bind(this));

    this.form.get('subject')?.setValue(this.data.subject);
    this.form.get('message')?.setValue(this.data.message);

  }


  verifyOutputData(): boolean {

    if (!this.form.value.subject || !this.form.value.message) {
      this.form.markAllAsTouched();
      return false;
    }

    return true;

  }

  onCancelStep(): void {
    this.cancelEvent.emit({
      isComplete: true, data: {
        subject: this.form.value.subject ?? '',
        message: this.form.value.message ?? ''
      }
    });
  }

  onPreviousStep(): void {
    this.previousStepEvent.emit({
      isComplete: true, data: {
        subject: this.form.value.subject ?? '',
        message: this.form.value.message ?? ''
      }
    });
  }

  // onNextStep(): void {

  //   if (!this.verifyOutputData()) { return; }

  //   if (this.form.valid) {
  //     this.nextStepEvent.emit({
  //       isComplete: true, data: {
  //         title: 'bla2',
  //         message: 'bla2'
  //         }
  //     });
  //   }

  // }

  onSubmitStep(): void {

    if (!this.verifyOutputData()) { return; }

    if (this.form.valid) {
      this.submitEvent.emit({
        isComplete: true, data: {
          subject: this.form.value.subject ?? '',
          message: this.form.value.message ?? ''
        }
      });
    }

  }


}
