import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, ValidationErrors } from '@angular/forms';

import { CoreComponent } from '@app/base';
import { CustomValidators, FormEngineParameterModel, FormGroup } from '@app/base/forms';
import { WizardStepComponentType, WizardStepEventType } from '@app/base/types';
import { ReasonStepInputType, ReasonStepOutputType } from './reason-step.types';
import { InnovationArchiveReasonEnum } from '@modules/feature-modules/innovator/services/innovator.service';

@Component({
  selector: 'app-innovator-pages-innovation-wizard-manage-archive-reason-step',
  templateUrl: './reason-step.component.html'
})
export class WizardInnovationManageArchiveReasonStepComponent
  extends CoreComponent
  implements WizardStepComponentType<ReasonStepInputType, ReasonStepOutputType>, OnInit
{
  @Input() title = '';
  @Input() data: ReasonStepInputType = {
    reason: null
  };

  @Output() cancelEvent = new EventEmitter<WizardStepEventType<ReasonStepOutputType>>();
  @Output() previousStepEvent = new EventEmitter<WizardStepEventType<ReasonStepOutputType>>();
  @Output() nextStepEvent = new EventEmitter<WizardStepEventType<ReasonStepOutputType>>();
  @Output() submitEvent = new EventEmitter<WizardStepEventType<ReasonStepOutputType>>();

  errorMessage = 'Choose one option';

  form = new FormGroup({
    reason: new FormControl<InnovationArchiveReasonEnum | null>(null, [CustomValidators.required(this.errorMessage)])
  });

  reasonItems: Required<FormEngineParameterModel>['items'] = [
    {
      value: InnovationArchiveReasonEnum.DEVELOP_FURTHER,
      label: 'To develop it further and come back for support later on'
    },
    { value: InnovationArchiveReasonEnum.HAVE_ALL_SUPPORT, label: 'I have all the support I need for now' },
    { value: InnovationArchiveReasonEnum.DECIDED_NOT_TO_PURSUE, label: 'I have decided not to pursue this innovation' },
    { value: InnovationArchiveReasonEnum.ALREADY_LIVE_NHS, label: 'My innovation is already live in the NHS' },
    { value: InnovationArchiveReasonEnum.OTHER_DONT_WANT_TO_SAY, label: 'Other reason or I do not want to say' }
  ];

  constructor() {
    super();

    this.setBackLink('Go back', this.onPreviousStep.bind(this));
  }

  ngOnInit(): void {
    // Select the item previously selected by the user
    this.form.get('reason')?.setValue(this.data.reason);

    this.setPageTitle(this.title, { showPage: false });
    this.setPageStatus('READY');
  }

  prepareOutputData(): ReasonStepOutputType {
    return {
      reason: this.form.value.reason ?? null
    };
  }

  onPreviousStep(): void {
    this.previousStepEvent.emit({ isComplete: true, data: this.prepareOutputData() });
  }

  onNextStep(): void {
    this.resetAlert();
    if (!this.form.valid) {
      this.setAlertError('', {
        itemsList: [{ title: this.errorMessage, fieldId: 'reason0' }],
        width: '2.thirds'
      });

      this.form.markAllAsTouched();

      return;
    }

    this.nextStepEvent.emit({ isComplete: true, data: this.prepareOutputData() });
  }
}
