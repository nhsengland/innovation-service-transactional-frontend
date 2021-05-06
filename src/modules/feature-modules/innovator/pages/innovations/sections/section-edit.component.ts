import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { FormEngineComponent, FormEngineModel } from '@app/base/forms';
import { WizardEngineModel } from '@modules/shared/forms';
import { InnovationSectionsIds } from '@stores-module/innovation/innovation.models';

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

  summaryList: { label: string, value: string, stepNumber: number }[];


  // isValidStepId(): boolean {
  //   const id = this.activatedRoute.snapshot.params.id;
  //   return ((1 <= Number(id) && Number(id) <= this.stepsData.length) || id === 'summary');
  // }
  isQuestionStep(): boolean {

    return Number.isInteger(Number(this.activatedRoute.snapshot.params.questionId));
  }
  isSummaryStep(): boolean { return this.activatedRoute.snapshot.params.questionId === 'summary'; }

  constructor(
    private activatedRoute: ActivatedRoute
  ) {

    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.sectionId = this.activatedRoute.snapshot.params.sectionId;

    this.wizard = this.stores.innovation.getSectionWizard(this.sectionId);

    this.currentStep = new FormEngineModel({ parameters: [] });
    this.currentAnswers = {};

    this.summaryList = [];

  }




  ngOnInit(): void {

    this.stores.innovation.getSectionInfo$(this.innovationId, this.sectionId).subscribe(
      response => {
        this.currentAnswers = this.wizard.runInboundParsing(response.data);
        this.wizard.runRules(this.currentAnswers);

        this.subscriptions.push(
          this.activatedRoute.params.subscribe(params => {

            // if (!this.isValidStepId()) {
            //   this.redirectTo('not-found');
            //   return;
            // }

            if (this.isSummaryStep()) {
              this.summaryList = this.wizard.runSummaryParsing(this.currentAnswers);
              return;
            }

            this.wizard.gotoStep(Number(params.questionId));
            this.currentStep = this.wizard.currentStep();

          })
        );

      },
      () => {
        this.logger.error('Error fetching data');
      });


  }



  onSubmitStep(action: 'previous' | 'next', event: Event): void {

    event.preventDefault();

    const formData = this.formEngineComponent?.getFormValues();

    if (action === 'next' && !formData?.valid) { // Apply validation only when moving forward.
      return;
    }

    this.currentAnswers = { ...this.currentAnswers, ...formData?.data };

    this.wizard.runRules(this.currentAnswers);

    this.redirectTo(this.getNavigationUrl(action));

  }



  onSubmitSurvey(isSubmission: boolean): void {

    this.stores.innovation.updateSectionInfo$(
      this.innovationId,
      this.sectionId,
      isSubmission,
      this.wizard.runInboundParsing(this.currentAnswers)
    ).subscribe(
      () => {
        this.redirectTo(`innovator/innovations/${this.innovationId}/record/sections/${this.activatedRoute.snapshot.params.sectionId}`);
        return;
      },
      () => {
        this.redirectTo(`innovator/innovations/${this.innovationId}/record/sections/${this.activatedRoute.snapshot.params.sectionId}`);
        return;
      }
    );

  }

  gotoStep(stepNumber: number): string {

    return `/innovator/innovations/${this.activatedRoute.snapshot.params.innovationId}/record/sections/${this.activatedRoute.snapshot.params.sectionId}/edit/${stepNumber}`;
  }


  getNavigationUrl(action: 'previous' | 'next'): string {

    let url = `/innovator/innovations/${this.activatedRoute.snapshot.params.innovationId}/record`;

    switch (action) {
      case 'previous':
        if (this.wizard.isFirstStep()) { url += `/sections/${this.activatedRoute.snapshot.params.sectionId}`; }
        else if (this.isSummaryStep()) { url += `/sections/${this.activatedRoute.snapshot.params.sectionId}/edit/${this.wizard.steps.length}`; }
        else { url += `/sections/${this.activatedRoute.snapshot.params.sectionId}/edit/${this.wizard.currentStepNumber - 1}`; }
        break;

      case 'next':
        if (this.isSummaryStep()) { url += ``; }
        else if (this.wizard.isLastStep()) { url += `/sections/${this.activatedRoute.snapshot.params.sectionId}/edit/summary`; }
        else { url += `/sections/${this.activatedRoute.snapshot.params.sectionId}/edit/${this.wizard.currentStepNumber + 1}`; }
        break;

      default: // Should NOT happen!
        url += '';
        break;
    }

    return url;

  }

}
