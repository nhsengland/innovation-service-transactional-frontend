import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { CoreComponent } from '@app/base';
import { MappedObjectType, WizardStepComponentType, WizardStepEventType } from '@app/base/types';
import { CustomValidators, FormEngineHelper } from '@modules/shared/forms';
import { SupportStatusesStepInputType, SupportStatusesStepOutputType } from './support-statuses-step.types';
import { InnovationSupportStatusEnum } from '@modules/stores';

@Component({
  selector: 'app-accessor-innovation-custom-notifications-wizard-custom-notification-new-support-statuses-step',
  templateUrl: './support-statuses-step.component.html'
})
export class WizardInnovationCustomNotificationNewSupportStatusesStepComponent
  extends CoreComponent
  implements WizardStepComponentType<SupportStatusesStepInputType, SupportStatusesStepOutputType>, OnInit
{
  @Input() title = '';
  @Input() data: SupportStatusesStepInputType = {
    selectedSupportStatuses: []
  };

  @Output() cancelEvent = new EventEmitter<WizardStepEventType<SupportStatusesStepOutputType>>();
  @Output() previousStepEvent = new EventEmitter<WizardStepEventType<SupportStatusesStepOutputType>>();
  @Output() nextStepEvent = new EventEmitter<WizardStepEventType<SupportStatusesStepOutputType>>();
  @Output() submitEvent = new EventEmitter<WizardStepEventType<SupportStatusesStepOutputType>>();

  errorMessage = "Select the support statuses you'd like to be notified about";

  form = new FormGroup({
    supportStatuses: new FormArray<FormControl<InnovationSupportStatusEnum>>(
      [],
      [CustomValidators.requiredCheckboxArray(this.errorMessage)]
    )
  });

  get fieldArrayControl(): FormArray {
    return this.form.get('supportStatuses') as FormArray;
  }

  get supportStatusesArrayHasError(): boolean {
    return this.fieldArrayControl.invalid && (this.fieldArrayControl.touched || this.fieldArrayControl.dirty);
  }

  get supportStatusesArrayErrorMessage(): { message: string; params: MappedObjectType } {
    return this.supportStatusesArrayHasError
      ? FormEngineHelper.getValidationMessage(this.fieldArrayControl.errors)
      : { message: '', params: {} };
  }

  supportStatusesItems: InnovationSupportStatusEnum[] = [
    InnovationSupportStatusEnum.CLOSED,
    InnovationSupportStatusEnum.UNSUITABLE,
    InnovationSupportStatusEnum.WAITING,
    InnovationSupportStatusEnum.ENGAGING
  ];

  constructor() {
    super();

    this.setBackLink('Go back', this.onPreviousStep.bind(this));
  }

  ngOnInit() {
    // Select the support statuses previously selected by the user
    this.data.selectedSupportStatuses.forEach(item => {
      this.fieldArrayControl.push(new FormControl<string>(item));
    });

    this.setPageTitle(this.title, { width: '2.thirds', size: 'l' });
    this.setPageStatus('READY');
  }

  isChecked(value: InnovationSupportStatusEnum): boolean {
    return this.fieldArrayControl.value.includes(value);
  }

  onChange(e: Event): void {
    const event = e.target as HTMLInputElement;
    const valueIndex = (this.fieldArrayControl.value as string[]).indexOf(event.value);

    // Add the checked option to the supportStatuses FormArray if it does not exist there
    if (event.checked && valueIndex === -1) {
      this.fieldArrayControl.push(new FormControl(event.value));
    }

    // Remove unchecked option from supportStatuses FormArray if it exists in it
    if (!event.checked && valueIndex > -1) {
      this.fieldArrayControl.removeAt(valueIndex);
    }
  }

  prepareOutputData(): SupportStatusesStepOutputType {
    return {
      supportStatuses: this.form.value.supportStatuses ?? []
    };
  }

  onPreviousStep(): void {
    this.previousStepEvent.emit({ isComplete: true, data: this.prepareOutputData() });
  }

  onNextStep(): void {
    this.resetAlert();
    if (!this.form.valid) {
      this.setAlertError('', {
        itemsList: [{ title: this.errorMessage, fieldId: 'supportStatuses' }],
        width: '2.thirds'
      });

      this.form.markAllAsTouched();

      return;
    }

    this.nextStepEvent.emit({ isComplete: true, data: this.prepareOutputData() });
  }
}
