import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

import { CoreComponent } from '@app/base';
import { CustomValidators, FormEngineParameterModel, FormGroup } from '@app/base/forms';
import { ReasonStepInputType, ReasonStepOutputType } from './reason-step.types';
import { InnovationArchiveReasonEnum } from '@modules/feature-modules/innovator/services/innovator.service';
import { Subject } from 'rxjs';
import { WizardStepComponentTypePOC, WizardStepEventType } from '../wizard-POC/wizard.types-POC';

@Component({
  selector: 'app-innovator-pages-innovation-wizard-manage-archive-reason-step',
  templateUrl: './reason-step.component.html'
})
export class WizardInnovationManageArchiveReasonStepPOCComponent
  extends CoreComponent
  implements WizardStepComponentTypePOC<ReasonStepInputType, ReasonStepOutputType>, OnInit
{
  @Input() changing: Subject<boolean> | undefined;
  @Input() title = '';
  @Input() data: ReasonStepInputType = {
    reason: null
  };

  // @Output() cancelEvent = new EventEmitter<WizardStepEventType<ReasonStepOutputType>>();
  // @Output() previousStepEvent = new EventEmitter<WizardStepEventType<ReasonStepOutputType>>();
  // @Output() nextStepEvent = new EventEmitter<WizardStepEventType<ReasonStepOutputType>>();
  // @Output() submitEvent = new EventEmitter<WizardStepEventType<ReasonStepOutputType>>();
  @Output() sendDataEvent = new EventEmitter<WizardStepEventType<ReasonStepOutputType>>();

  form = new FormGroup({
    reason: new FormControl<InnovationArchiveReasonEnum | null>(null, [CustomValidators.required('Choose one option')])
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
  }

  ngOnInit(): void {
    // Select the item previously selected by the user
    console.log('sent data to child:', this.data);
    console.log('sent title to child:', this.title);
    this.form.get('reason')?.setValue(this.data.reason);

    this.changing?.subscribe(() => {
      console.log(`received call from parent, emitting from ${this.constructor.name}  `);
      this.sendDataEvent.emit({ isComplete: true, data: this.prepareOutputData() });
    });

    this.setPageTitle(this.title, { width: '2.thirds', size: 'l' });
    this.setPageStatus('READY');
  }

  prepareOutputData(): ReasonStepOutputType {
    return {
      reason: this.form.value.reason ?? null
    };
  }

  onPreviousStep(): void {
    // this.previousStepEvent.emit({ isComplete: true, data: this.prepareOutputData() });
  }

  onNextStep(): void {
    // if (!this.form.valid) {
    //   this.form.markAllAsTouched();
    //   return;
    // }
    // this.nextStepEvent.emit({ isComplete: true, data: this.prepareOutputData() });
  }
}