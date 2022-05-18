import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { AlertType, LinkType } from '@app/base/models';
import { FormEngineComponent, FormEngineModel, FileTypes, WizardEngineModel, FormEngineHelper } from '@app/base/forms';
import { RoutingHelper, UrlModel } from '@modules/core';
import { SummaryParsingType } from '@modules/shared/forms';
import { InnovationDataResolverType, InnovationSectionsIds } from '@stores-module/innovation/innovation.models';
import { concatMap } from 'rxjs/operators';

@Component({
  selector: 'app-innovator-pages-innovation-section-edit',
  templateUrl: './section-edit.component.html'
})
export class InnovationSectionEditComponent extends CoreComponent implements OnInit {

  @ViewChild(FormEngineComponent) formEngineComponent?: FormEngineComponent;

  alert: AlertType = { type: null };
  innovationId: string;
  innovation: InnovationDataResolverType;
  sectionId: InnovationSectionsIds;
  showSubmitButton = false;
  showSaveButton = false;
  saveButtonText = 'Save and continue';
  wizard: WizardEngineModel;

  currentStep: FormEngineModel;
  currentAnswers: { [key: string]: any };

  summaryList: SummaryParsingType[];

  // isValidStepId(): boolean {
  //   const id = this.activatedRoute.snapshot.params.id;
  //   return ((1 <= Number(id) && Number(id) <= this.stepsData.length) || id === 'summary');
  // }
  isQuestionStep(): boolean { return Number.isInteger(Number(this.activatedRoute.snapshot.params.questionId)); }
  isSummaryStep(): boolean { return this.activatedRoute.snapshot.params.questionId === 'summary'; }

  constructor(
    private activatedRoute: ActivatedRoute
  ) {

    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.innovation = RoutingHelper.getRouteData(this.activatedRoute).innovationData;
    this.sectionId = this.activatedRoute.snapshot.params.sectionId;

    this.wizard = this.stores.innovation.getSectionWizard(this.sectionId);

    this.currentStep = new FormEngineModel({ parameters: [] });
    this.currentAnswers = {};

    this.summaryList = [];

  }


  ngOnInit(): void {

    this.stores.innovation.getSectionInfo$('innovator', this.innovationId, this.sectionId).subscribe(
      response => {
        this.currentAnswers = this.wizard.runInboundParsing(response.data);
        this.wizard.runRules(this.currentAnswers);

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
                httpUploadUrl: new UrlModel(this.stores.environment.APP_URL).addPath('upload').buildUrl(),
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

        this.setPageStatus('READY');

      },
      () => {
        this.setPageStatus('ERROR');
        this.logger.error('Error fetching data');
      });


  }



  onSubmitStep(action: 'previous' | 'next', event: Event): void {
    this.alert = {type: null};
    event.preventDefault();

    const formData = this.formEngineComponent?.getFormValues();

    if (action === 'next' && !formData?.valid) { // Apply validation only when moving forward.
      this.alert = {type: null};
      this.showSaveButton = false;
      this.saveButtonText = 'Save and continue';
      return;
    }

    this.currentAnswers = { ...this.currentAnswers, ...formData!.data };

    this.wizard.runRules(this.currentAnswers);
    this.summaryList = this.wizard.runSummaryParsing(this.currentAnswers);

    if (action === 'next') {
      this.showSaveButton = true;
      this.saveButtonText = '...saving data';
      this.stores.innovation.updateSectionInfo$(
        this.innovationId,
        this.sectionId,
        this.wizard.runOutboundParsing(this.currentAnswers)
      ).pipe(
        concatMap(() => this.stores.authentication.initializeAuthentication$())).subscribe(
        () => {
          this.showSaveButton = false;
          this.saveButtonText = 'Save and continue';
          this.redirectTo(this.getNavigationUrl(action));
          this.alert = {
            type: 'SUCCESS',
            title: 'Data saved successfully',
            // message: 'Your suggestions were saved and notifications sent.'
          };

        },
        () => {
          this.showSaveButton = false;
          this.saveButtonText = 'Save and continue';
          this.alert = {
            type: 'ERROR',
            title: 'Unable to save data',
            message: 'Please try again or contact us for further help'
          };
        }
      );
    }


    // this.redirectTo(this.getNavigationUrl(action));

  }



  onSubmitSection(): void {

    this.stores.innovation.submitSections$(
      this.innovationId,
      [this.sectionId]
      // .wizard.runOutboundParsing(this.currentAnswers)
    ).pipe(
      concatMap(() => this.stores.authentication.initializeAuthentication$())).subscribe(
      () => { this.redirectTo(`innovator/innovations/${this.innovationId}/record/sections/${this.activatedRoute.snapshot.params.sectionId}`, { alert: 'sectionUpdateSuccess' }); },
      () => { this.redirectTo(`innovator/innovations/${this.innovationId}/record/sections/${this.activatedRoute.snapshot.params.sectionId}`, { alert: 'sectionUpdateError' }); }
    );

  }

  gotoStep(stepNumber: number | undefined): string {

    return `/innovator/innovations/${this.activatedRoute.snapshot.params.innovationId}/record/sections/${this.activatedRoute.snapshot.params.sectionId}/edit/${stepNumber}`;
  }


  getNavigationUrl(action: 'previous' | 'next'): string {

    let url = `/innovator/innovations/${this.activatedRoute.snapshot.params.innovationId}/record`;

    switch (action) {
      case 'previous':
        if (this.isSummaryStep()) { url += `/sections/${this.activatedRoute.snapshot.params.sectionId}/edit/${this.wizard.steps.length}`; }
        else if (this.wizard.isFirstStep()) { url += `/sections/${this.activatedRoute.snapshot.params.sectionId}`; }
        else { url += `/sections/${this.activatedRoute.snapshot.params.sectionId}/edit/${Number(this.wizard.currentStepId) - 1}`; }
        break;

      case 'next':
        if (this.isSummaryStep()) {
          // const formData = this.formEngineComponent?.getFormValues();
          const form = FormEngineHelper.buildForm(this.wizard.steps.flatMap(x => x.parameters), this.currentAnswers);
          this.showSubmitButton = form.valid;
          url += `/sections/${this.activatedRoute.snapshot.params.sectionId}/edit/summary`;
        }
        else if (this.wizard.isLastStep()) {
          const form = FormEngineHelper.buildForm(this.wizard.steps.flatMap(x => x.parameters), this.currentAnswers);
          this.showSubmitButton = form.valid;
          url += `/sections/${this.activatedRoute.snapshot.params.sectionId}/edit/summary`;
        }
        else { url += `/sections/${this.activatedRoute.snapshot.params.sectionId}/edit/${Number(this.wizard.currentStepId) + 1}`; }
        break;

      default: // Should NOT happen!
        url += '';
        break;
    }

    return url;

  }

}
