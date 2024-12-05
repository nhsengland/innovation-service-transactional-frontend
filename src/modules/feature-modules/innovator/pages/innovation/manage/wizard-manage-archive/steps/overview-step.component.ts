import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { ContextInnovationType, WizardStepComponentType, WizardStepEventType } from '@app/base/types';

import { OverviewStepInputType, OverviewStepOutputType } from './overview-step.types';
import { FormFieldActionsEnum } from '../../../how-to-proceed/how-to-proceed.component';

@Component({
  selector: 'app-innovator-pages-innovation-wizard-manage-archive-overview-step',
  templateUrl: './overview-step.component.html'
})
export class WizardInnovationManageArchiveOverviewStepComponent
  extends CoreComponent
  implements WizardStepComponentType<OverviewStepInputType, OverviewStepOutputType>, OnInit
{
  @Input() title = '';
  @Input() data: OverviewStepInputType = {};

  @Output() cancelEvent = new EventEmitter<WizardStepEventType<OverviewStepOutputType>>();
  @Output() previousStepEvent = new EventEmitter<WizardStepEventType<OverviewStepOutputType>>();
  @Output() nextStepEvent = new EventEmitter<WizardStepEventType<OverviewStepOutputType>>();
  @Output() submitEvent = new EventEmitter<WizardStepEventType<OverviewStepOutputType>>();

  innovationId: string;
  innovation: ContextInnovationType;

  action: FormFieldActionsEnum;
  entryPointIsManageInnovation: boolean;

  isOwner: boolean;

  constructor(private activatedRoute: ActivatedRoute) {
    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.action = this.activatedRoute.snapshot.queryParams.action;
    this.entryPointIsManageInnovation = this.router.url.includes('/manage/innovation/archive');

    this.innovation = this.ctx.innovation.info();

    this.isOwner = this.ctx.innovation.isOwner();

    this.setBackLink('Go back', this.onPreviousStep.bind(this));
  }

  ngOnInit() {
    if (this.entryPointIsManageInnovation) {
      this.setPageTitle(this.title);
    } else {
      this.setPageTitle(this.title, { width: '2.thirds', size: 'l' });
    }

    this.setPageStatus('READY');
  }

  onPreviousStep(): void {
    this.previousStepEvent.emit({ isComplete: true, data: {} });
  }

  onNextStep(): void {
    this.nextStepEvent.emit({ isComplete: true, data: {} });
  }

  onCancelStep(): void {
    this.cancelEvent.emit({ isComplete: true, data: {} });
  }

  onGoToInnovation() {
    this.onCancelStep();
  }
}
