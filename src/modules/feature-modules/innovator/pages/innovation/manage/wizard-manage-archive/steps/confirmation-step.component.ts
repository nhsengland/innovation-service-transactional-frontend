import { ActivatedRoute } from '@angular/router';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

import { CoreComponent } from '@app/base';
import { CustomValidators, FormEngineHelper, FormGroup } from '@app/base/forms';
import { WizardStepComponentType, WizardStepEventType } from '@app/base/types';
import { ConfirmationStepInputType, ConfirmationStepOutputType } from './confirmation-step.types';

@Component({
  selector: 'app-innovator-pages-innovation-wizard-manage-archive-confirmation-step',
  templateUrl: './confirmation-step.component.html'
})
export class WizardInnovationManageArchiveConfirmationStepComponent
  extends CoreComponent
  implements WizardStepComponentType<ConfirmationStepInputType, ConfirmationStepOutputType>, OnInit
{
  @Input() title = '';
  @Input() data: ConfirmationStepInputType = {
    email: '',
    confirmation: ''
  };

  @Output() cancelEvent = new EventEmitter<WizardStepEventType<ConfirmationStepOutputType>>();
  @Output() previousStepEvent = new EventEmitter<WizardStepEventType<ConfirmationStepOutputType>>();
  @Output() nextStepEvent = new EventEmitter<WizardStepEventType<ConfirmationStepOutputType>>();
  @Output() submitEvent = new EventEmitter<WizardStepEventType<ConfirmationStepOutputType>>();

  innovationId: string;
  userEmail: string;

  form = new FormGroup(
    {
      email: new FormControl<string>('', [CustomValidators.required('Your email is required')]),
      confirmation: new FormControl<string>('', [
        CustomValidators.required('A confirmation text is necessary'),
        CustomValidators.equalTo('archive innovation')
      ])
    },
    { updateOn: 'blur' }
  );

  constructor(private activatedRoute: ActivatedRoute) {
    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.userEmail = this.stores.authentication.getUserInfo().email;

    this.form.controls.email.addValidators(CustomValidators.equalTo(this.userEmail));

    this.setBackLink('Go back', this.onPreviousStep.bind(this));
  }

  ngOnInit(): void {
    // Set the answer previously given by the user
    this.form.get('email')?.setValue(this.data.email);
    this.form.get('confirmation')?.setValue(this.data.confirmation);

    this.setPageTitle(this.title);
    this.setPageStatus('READY');
  }

  prepareOutputData(): ConfirmationStepOutputType {
    return {
      email: this.form.value.email ?? '',
      confirmation: this.form.value.confirmation ?? ''
    };
  }

  onPreviousStep(): void {
    this.previousStepEvent.emit({ isComplete: true, data: this.prepareOutputData() });
  }

  onSubmit(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitEvent.emit();
  }

  onCancelStep(): void {
    this.cancelEvent.emit({ isComplete: true, data: this.prepareOutputData() });
  }
}
