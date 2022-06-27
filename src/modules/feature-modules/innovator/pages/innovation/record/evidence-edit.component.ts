import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { FormEngineComponent, FormEngineModel, FileTypes } from '@app/base/forms';
import { UrlModel } from '@app/base/models';
import { WizardSummaryType, WizardEngineModel } from '@modules/shared/forms';
import { InnovationSectionsIds } from '@modules/stores/innovation/innovation.models';

@Component({
  selector: 'app-innovator-pages-innovation-section-evidence-edit',
  templateUrl: './evidence-edit.component.html'
})
export class InnovationSectionEvidenceEditComponent extends CoreComponent implements OnInit {

  @ViewChild(FormEngineComponent) formEngineComponent?: FormEngineComponent;

  innovationId: string;
  sectionId: InnovationSectionsIds;
  evidenceId: string;

  wizard: WizardEngineModel;

  currentStep: FormEngineModel;
  currentAnswers: { [key: string]: any };

  summaryList: WizardSummaryType[];

  // TODO: Make sure is a valid step.
  // isValidStepId(): boolean {
  //   const id = this.activatedRoute.snapshot.params.id;
  //   return ((1 <= Number(id) && Number(id) <= this.stepsData.length) || id === 'summary');
  // }


  isCreation(): boolean { return !this.activatedRoute.snapshot.params.evidenceId; }
  isEdition(): boolean { return !!this.activatedRoute.snapshot.params.evidenceId; }

  isQuestionStep(): boolean { return Number.isInteger(Number(this.activatedRoute.snapshot.params.questionId)); }
  isSummaryStep(): boolean { return this.activatedRoute.snapshot.params.questionId === 'summary'; }

  constructor(
    private activatedRoute: ActivatedRoute
  ) {

    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.sectionId = this.activatedRoute.snapshot.params.sectionId;
    this.evidenceId = this.activatedRoute.snapshot.params.evidenceId;

    /* istanbul ignore next */
    this.wizard = this.stores.innovation.getSection(this.sectionId)?.evidences || new WizardEngineModel({});

    this.currentStep = new FormEngineModel({ parameters: [] });
    this.currentAnswers = {};

    this.summaryList = [];

  }


  ngOnInit(): void {

    if (this.isCreation()) {

      this.wizard.runRules(this.currentAnswers);

      this.setPageStatus('READY');
      this.draw();

    } else {

      this.stores.innovation.getSectionEvidence$('innovator', this.innovationId, this.evidenceId).subscribe(
        response => {
          this.currentAnswers = this.wizard.runInboundParsing(response);
          this.wizard.runRules(this.currentAnswers);

          this.setPageStatus('READY');

          this.draw();
        },
        () => {
          this.setPageStatus('ERROR');
          this.logger.error('Error fetching data');
        }
      );

    }

  }


  draw(): void {

    this.subscriptions.push(
      this.activatedRoute.params.subscribe(params => {

        // if (!this.isValidStepId()) {
        //   this.redirectTo('/not-found');
        //   return;
        // }

        if (this.isSummaryStep()) {
          this.setPageTitle('Check your answers');
          this.summaryList = this.wizard.runSummaryParsing(this.currentAnswers);
          return;
        }

        this.wizard.gotoStep(Number(params.questionId));
        this.currentStep = this.wizard.currentStep();

        this.setPageTitle(this.currentStep.parameters[0].label); // Only 1 question per page.

        if (this.currentStep.parameters[0].dataType === 'file-upload') {
          this.currentStep.parameters[0].fileUploadConfig = {
            httpUploadUrl: new UrlModel(this.CONSTANTS.APP_URL).addPath('upload').buildUrl(),
            httpUploadBody: {
              context: this.sectionId,
              innovatorId: this.stores.authentication.getUserId(),
              innovationId: this.innovationId
            },
            maxFileSize: 10,
            acceptedFiles: [FileTypes.CSV, FileTypes.DOCX, FileTypes.XLSX, FileTypes.PDF]
          };
        }

      })
    );

  }


  onSubmitStep(action: 'previous' | 'next', event: Event): void {

    event.preventDefault();

    const formData = this.formEngineComponent?.getFormValues();

    if (action === 'next' && !formData?.valid) { // Apply validation only when moving forward.
      return;
    }

    this.currentAnswers = { ...this.currentAnswers, ...formData!.data };

    this.wizard.runRules(this.currentAnswers);
    this.summaryList = this.wizard.runSummaryParsing(this.currentAnswers);

    this.redirectTo(this.getNavigationUrl(action));

  }


  onSubmitSurvey(): void {

    this.stores.innovation.upsertSectionEvidenceInfo$(
      this.innovationId,
      this.wizard.runOutboundParsing(this.currentAnswers),
      this.evidenceId
    ).subscribe(
      () => {
        this.redirectTo(`innovator/innovations/${this.innovationId}/record/sections/${this.activatedRoute.snapshot.params.sectionId}`, { alert: 'evidenceUpdateSuccess' });
      },
      () => {
        this.redirectTo(`innovator/innovations/${this.innovationId}/record/sections/${this.activatedRoute.snapshot.params.sectionId}`, { alert: 'evidenceUpdateError' });
      }
    );

  }

  gotoStep(stepNumber?: number): string {

    return `/innovator/innovations/${this.activatedRoute.snapshot.params.innovationId}/record/sections/${this.activatedRoute.snapshot.params.sectionId}/evidence/${this.isCreation() ? 'new' : `${this.activatedRoute.snapshot.params.evidenceId}/edit`}/${stepNumber}`;
  }


  getNavigationUrl(action: 'previous' | 'next'): string {

    let url = `/innovator/innovations/${this.activatedRoute.snapshot.params.innovationId}/record`;

    switch (action) {
      case 'previous':
        if (this.isSummaryStep()) { url += `/sections/${this.activatedRoute.snapshot.params.sectionId}/evidence/${this.isCreation() ? 'new' : `${this.activatedRoute.snapshot.params.evidenceId}/edit`}/${this.wizard.steps.length}`; }
        else if (this.wizard.isFirstStep()) { url += `/sections/${this.activatedRoute.snapshot.params.sectionId}${this.isCreation() ? '' : `/evidence/${this.activatedRoute.snapshot.params.evidenceId}`}`; }
        else { url += `/sections/${this.activatedRoute.snapshot.params.sectionId}/evidence/${this.isCreation() ? 'new' : `${this.activatedRoute.snapshot.params.evidenceId}/edit`}/${Number(this.wizard.currentStepId) - 1}`; }
        break;

      case 'next':
        if (this.isSummaryStep()) { url += `/sections/${this.activatedRoute.snapshot.params.sectionId}/evidence/${this.isCreation() ? 'new' : `${this.activatedRoute.snapshot.params.evidenceId}/edit`}/summary`; }
        else if (this.wizard.isLastStep()) { url += `/sections/${this.activatedRoute.snapshot.params.sectionId}/evidence/${this.isCreation() ? 'new' : `${this.activatedRoute.snapshot.params.evidenceId}/edit`}/summary`; }
        else { url += `/sections/${this.activatedRoute.snapshot.params.sectionId}/evidence/${this.isCreation() ? 'new' : `${this.activatedRoute.snapshot.params.evidenceId}/edit`}/${Number(this.wizard.currentStepId) + 1}`; }
        break;

      default: // Should NOT happen!
        url += '';
        break;
    }

    return url;

  }

}
