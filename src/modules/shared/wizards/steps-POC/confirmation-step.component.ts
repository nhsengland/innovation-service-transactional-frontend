import { ActivatedRoute } from '@angular/router';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

import { CoreComponent } from '@app/base';
import { CustomValidators, FormGroup } from '@app/base/forms';
import { ConfirmationStepInputType, ConfirmationStepOutputType } from './confirmation-step.types';
import { Subject } from 'rxjs';
import { WizardStepComponentTypePOC, WizardStepEventType } from '../wizard-POC/wizard.types-POC';

@Component({
  selector: 'app-innovator-pages-innovation-wizard-manage-archive-confirmation-step',
  templateUrl: './confirmation-step.component.html'
})
export class WizardInnovationManageArchiveConfirmationStepPOCComponent
  extends CoreComponent
  implements WizardStepComponentTypePOC<ConfirmationStepInputType, ConfirmationStepOutputType>, OnInit
{
  @Input() changing: Subject<boolean> | undefined;

  @Input() title = '';
  @Input() data: ConfirmationStepInputType = {
    email: '',
    confirmation: ''
  };

  @Output() submitEvent = new EventEmitter<WizardStepEventType<ConfirmationStepOutputType>>();
  @Output() sendDataEvent = new EventEmitter<WizardStepEventType<ConfirmationStepOutputType>>();

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
  }

  ngOnInit(): void {
    // Set the answer previously given by the user
    this.form.get('email')?.setValue(this.data.email);
    this.form.get('confirmation')?.setValue(this.data.confirmation);

    this.changing?.subscribe(() => {
      console.log(`received call from parent, emitting from ${this.constructor.name}  `);
      this.sendDataEvent.emit({ isComplete: true, data: this.prepareOutputData() });
    });

    this.setPageTitle(this.title, { width: '2.thirds', size: 'l' });
    this.setPageStatus('READY');
  }

  prepareOutputData(): ConfirmationStepOutputType {
    return {
      email: this.form.value.email ?? '',
      confirmation: this.form.value.confirmation ?? ''
    };
  }

  onPreviousStep(): void {
    // this.previousStepEvent.emit({ isComplete: true, data: this.prepareOutputData() });
  }

  onSubmit(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }
    this.sendDataEvent.emit({ isComplete: true, data: this.prepareOutputData() });

    this.submitEvent.emit({ isComplete: true, data: this.prepareOutputData() });
  }

  onCancelStep(): void {
    // this.cancelEvent.emit({ isComplete: true, data: this.prepareOutputData() });
  }
}
