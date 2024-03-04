import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { CoreComponent } from '@app/base';
import { CustomValidators, FileTypes, FormGroup } from '@app/base/forms';
import { WizardStepComponentType, WizardStepEventType } from '@app/base/types';
import { DescriptionStepInputType } from './description-step.types';
import { SummaryStepInputType } from './summary-step.types';

@Component({
  selector: 'shared-pages-innovation-support-wizard-support-summary-progress-update-milestones-summary-step',
  templateUrl: './summary-step.component.html'
})
export class WizardInnovationSupportSummaryProgressUpdateMilestonesSummaryStepComponent
  extends CoreComponent
  implements WizardStepComponentType<SummaryStepInputType, null>, OnInit
{
  @Input() title = '';
  @Input() data: SummaryStepInputType = {
    categoriesStep: {
      categories: [],
      otherCategory: null
    },
    subcategoriesStep: {
      subcategories: []
    },
    descriptionStep: {
      description: '',
      file: null,
      fileName: ''
    },
    dateStep: {
      day: '',
      month: '',
      year: ''
    }
  };

  @Output() cancelEvent = new EventEmitter<WizardStepEventType<null>>();
  @Output() previousStepEvent = new EventEmitter<WizardStepEventType<null>>();
  @Output() nextStepEvent = new EventEmitter<WizardStepEventType<null>>();
  @Output() submitEvent = new EventEmitter<WizardStepEventType<null>>();
  @Output() goToStepEvent = new EventEmitter<string>();

  constructor() {
    super();

    this.setBackLink('Go back', this.onPreviousStep.bind(this));
  }

  ngOnInit(): void {
    this.setPageTitle(this.title, { width: '2.thirds' });

    this.setPageStatus('READY');
  }

  onPreviousStep(): void {
    this.previousStepEvent.emit();
  }

  onGotoStep(stepId: string): void {
    this.goToStepEvent.emit(stepId);
  }

  onSubmit(): void {
    this.submitEvent.emit();
  }
}
