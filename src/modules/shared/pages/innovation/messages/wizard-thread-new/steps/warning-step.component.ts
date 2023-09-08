import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { CoreComponent } from '@app/base';
import { WizardStepComponentType, WizardStepEventType } from '@app/base/types';

import { WarningStepInputType, WarningStepOutputType } from './warning-step.types';


@Component({
  selector: 'shared-pages-innovation-messages-wizard-thread-new-warning-step',
  templateUrl: './warning-step.component.html'
})
export class WizardInnovationThreadNewWarningStepComponent extends CoreComponent implements WizardStepComponentType<WarningStepInputType, WarningStepOutputType>, OnInit {

  @Input() title = '';
  @Input() data: WarningStepInputType = {};
  @Output() cancelEvent = new EventEmitter<WizardStepEventType<WarningStepOutputType>>();
  @Output() previousStepEvent = new EventEmitter<WizardStepEventType<WarningStepOutputType>>();
  @Output() nextStepEvent = new EventEmitter<WizardStepEventType<WarningStepOutputType>>();
  @Output() submitEvent = new EventEmitter<WizardStepEventType<WarningStepOutputType>>();

  constructor() { super(); }

  ngOnInit(): void {

    this.setPageTitle(this.title, { showPage: false });
    this.setBackLink('Go back', this.onCancelStep.bind(this));

    this.setPageStatus('READY');

  }

  // onPreviousStep(): void {
  //   this.previousStepEvent.emit({ isComplete: true, data: {} });
  // }

  // onNextStep(): void {
  //   this.nextStepEvent.emit({ isComplete: true, data: {} });
  // }

  onCancelStep(): void {
    this.cancelEvent.emit({ isComplete: true, data: {} });
  }

}
