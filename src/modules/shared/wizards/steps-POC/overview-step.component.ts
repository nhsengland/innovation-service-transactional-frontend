import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';

import { OverviewStepInputType, OverviewStepOutputType } from './overview-step.types';
import { Subject } from 'rxjs';
import { FormFieldActionsEnum } from '@modules/feature-modules/innovator/pages/innovation/how-to-proceed/how-to-proceed.component';
import { WizardStepComponentTypePOC, WizardStepEventType } from '../wizard-POC/wizard.types-POC';
import { ContextInnovationType } from '@modules/stores';

@Component({
  selector: 'app-innovator-pages-innovation-wizard-manage-archive-overview-step',
  templateUrl: './overview-step.component.html'
})
export class WizardInnovationManageArchiveOverviewStepPOCComponent
  extends CoreComponent
  implements WizardStepComponentTypePOC<OverviewStepInputType, OverviewStepOutputType>, OnInit
{
  @Input() changing: Subject<boolean> | undefined;
  @Input() title = '';
  @Input() data: OverviewStepInputType = {};

  @Output() sendDataEvent = new EventEmitter<WizardStepEventType<OverviewStepOutputType>>();

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
  }

  ngOnInit() {
    this.changing?.subscribe(() => {
      console.log(`received call from parent, emitting from ${this.constructor.name}  `);
      this.sendDataEvent.emit({ isComplete: true, data: {} });
    });

    if (this.entryPointIsManageInnovation) {
      this.setPageTitle(this.title);
    } else {
      this.setPageTitle(this.title, { width: '2.thirds', size: 'l' });
    }

    this.setPageStatus('READY');
  }

  // onPreviousStep(): void {
  //   this.previousStepEvent.emit({ isComplete: true, data: {} });
  // }

  // onNextStep(): void {
  //   console.log('clicked on button');
  //   this.nextStepEvent.emit({ isComplete: true, data: {} });
  // }

  // onCancelStep(): void {
  //   this.cancelEvent.emit({ isComplete: true, data: {} });
  // }

  onGoToInnovation() {
    this.redirectTo('');
  }
}
