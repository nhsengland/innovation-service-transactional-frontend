import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { FormEngineComponent, FormEngineModel } from '@app/base/forms';
import { WizardEngineModel } from '@modules/shared/forms';
import { InnovationSectionsIds } from '@stores-module/innovation/innovation.models';

import { InnovationsService } from '../../../services/innovations.service';


@Component({
  selector: 'app-innovator-pages-innovations-section-edit',
  templateUrl: './section-edit.component.html'
})
export class InnovationsSectionEditComponent extends CoreComponent implements OnInit {

  @ViewChild(FormEngineComponent) formEngineComponent?: FormEngineComponent;

  innovationId: string;
  sectionId: InnovationSectionsIds;

  wizard: WizardEngineModel;

  currentStep: FormEngineModel;
  currentAnswers: { [key: string]: any };

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService
  ) {

    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.sectionId = this.activatedRoute.snapshot.params.sectionId;

    this.wizard = this.stores.innovation.getSectionWizard(this.sectionId);

    this.currentStep = new FormEngineModel({ parameters: [] });
    this.currentAnswers = {};

  }


  ngOnInit(): void {

    this.innovationsService.getSectionInfo(this.innovationId, this.sectionId).subscribe(
      response => {
        this.currentAnswers = this.wizard.runInboundParsing(response);
      },
      () => {
        this.logger.error('Error fetching data');
      });

    this.subscriptions.push(
      this.activatedRoute.params.subscribe(params => {
        this.wizard.gotoStep(Number(params.questionId));
        this.currentStep = this.wizard.currentStep();
      })
    );

  }



  onSubmitStep(action: 'previous' | 'next', event: Event): void {

    event.preventDefault();

    const formData = this.formEngineComponent?.getFormValues();

    if (action === 'next' && !formData?.valid) { // Apply validation only when moving forward.
      return;
    }

    this.currentAnswers = { ...this.currentAnswers, ...formData?.data };

    this.wizard.runRules(this.currentAnswers);

    if (this.wizard.isLastStep() && action === 'next') {
      this.onSubmitSurvey();
    }
    else {
      this.redirectTo(this.getNavigationUrl(action), { a: action });

    }

  }



  onSubmitSurvey(): void {

    const teste = this.wizard.runInboundParsing(this.currentAnswers);

    this.innovationsService.updateSectionInfo(this.innovationId, this.sectionId, teste).subscribe(
      () => {
        this.redirectTo(`innovator/innovations/776227DC-C9A8-EB11-B566-0003FFD6549F/record`);
        return;
      },
      () => {
        this.redirectTo(`innovator/first-time-signin/summary`);
        return;
      }
    );

  }


  getNavigationUrl(action: 'previous' | 'next'): string {

    let url = `/innovator/innovations/${this.activatedRoute.snapshot.params.innovationId}/record`;

    switch (action) {
      case 'previous':
        if (this.wizard.isFirstStep()) { url += ''; }
        else { url += `/sections/${this.activatedRoute.snapshot.params.sectionId}/edit/${this.wizard.currentStepNumber - 1}`; }
        break;

      case 'next':
        if (this.wizard.isLastStep()) { url += '/first-time-signin/summary'; }
        else { url += `/sections/${this.activatedRoute.snapshot.params.sectionId}/edit/${this.wizard.currentStepNumber + 1}`; }
        break;

      default: // Should NOT happen!
        url += '';
        break;
    }

    return url;

  }

}
