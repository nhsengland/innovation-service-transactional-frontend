import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CoreComponent } from '@app/base';
import { WizardStepComponentType, WizardStepEventType } from '@app/base/types';
import { CustomValidators } from '@modules/shared/forms';
import { MessageStepInputType, MessageStepOutputType } from './message-step.types';

@Component({
  selector: 'shared-pages-innovation-actions-wizard-task-new-message-step',
  templateUrl: './message-step.component.html'
})
export class WizardTaskNewMessageStepComponent
  extends CoreComponent
  implements WizardStepComponentType<MessageStepInputType, MessageStepOutputType>, OnInit
{
  @Input() title = '';
  @Input() isSubmitStep = false;
  @Input() data: MessageStepInputType = {
    selectedSection: null,
    message: ''
  };
  @Output() cancelEvent = new EventEmitter<WizardStepEventType<MessageStepOutputType>>();
  @Output() previousStepEvent = new EventEmitter<WizardStepEventType<MessageStepOutputType>>();
  @Output() nextStepEvent = new EventEmitter<WizardStepEventType<MessageStepOutputType>>();
  @Output() submitEvent = new EventEmitter<WizardStepEventType<MessageStepOutputType>>();

  form = new FormGroup(
    {
      message: new FormControl<string>('', CustomValidators.required('Please enter a message'))
    },
    { updateOn: 'blur' }
  );

  constructor() {
    super();
  }

  ngOnInit() {
    this.setBackLink('Go back', this.onPreviousStep.bind(this));

    this.form.get('message')?.setValue(this.data.message);

    const sectionIdentification = this.stores.schema.getIrSchemaSectionIdentificationV3(this.data.selectedSection);

    this.title = sectionIdentification
      ? `Assign a task for section ${sectionIdentification?.group.number}.${sectionIdentification?.section.number} '${sectionIdentification?.section.title}'`
      : '';

    this.setPageTitle(this.title, { size: 'l' });

    this.setPageStatus('READY');
  }

  prepareOutputData(): MessageStepOutputType {
    return {
      message: this.form.value.message ?? ''
    };
  }

  onCancelStep(): void {
    this.cancelEvent.emit({ isComplete: true, data: this.prepareOutputData() });
  }

  onPreviousStep(): void {
    this.previousStepEvent.emit({ isComplete: true, data: this.prepareOutputData() });
  }

  onSubmitStep(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitEvent.emit({ isComplete: true, data: this.prepareOutputData() });
  }
}
