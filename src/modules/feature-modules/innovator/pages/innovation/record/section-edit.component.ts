import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { concatMap } from 'rxjs/operators';

import { CoreComponent } from '@app/base';
import { AlertType } from '@app/base/models';
import { FormEngineComponent, FileTypes, WizardEngineModel } from '@app/base/forms';

import { UrlModel } from '@modules/core';

import { ContextInnovationType } from '@stores-module/context/context.models';
import { InnovationSectionsIds } from '@stores-module/innovation/innovation.models';


@Component({
  selector: 'app-innovator-pages-innovation-section-edit',
  templateUrl: './section-edit.component.html'
})
export class InnovationSectionEditComponent extends CoreComponent implements OnInit {

  @ViewChild(FormEngineComponent) formEngineComponent?: FormEngineComponent;

  alert: AlertType & { errorsList: { label: string, error: string }[] } = { type: null, errorsList: [] };

  innovation: ContextInnovationType;
  sectionId: InnovationSectionsIds;
  baseUrl: string;

  wizard: WizardEngineModel;

  saveButton = { isActive: true, label: 'Save and continue' };
  submitButton = { isActive: false, label: 'Confirm section answers' };


  constructor(
    private activatedRoute: ActivatedRoute
  ) {

    super();

    this.innovation = this.stores.context.getInnovation();
    this.sectionId = this.activatedRoute.snapshot.params.sectionId;
    this.baseUrl = `innovator/innovations/${this.innovation.id}/record/sections/${this.sectionId}`;

    this.wizard = this.stores.innovation.getSectionWizard(this.sectionId);

  }


  ngOnInit(): void {

    this.stores.innovation.getSectionInfo$('innovator', this.innovation.id, this.sectionId).subscribe(
      response => {

        this.wizard.setAnswers(this.wizard.runInboundParsing(response.data)).runRules();
        this.wizard.gotoStep(this.activatedRoute.snapshot.params.questionId || 1);

        this.setPageTitle(this.wizard.currentStepTitle());
        this.setUploadConfiguration();

        this.setPageStatus('READY');

      },
      () => {
        this.setPageStatus('ERROR');
        this.logger.error('Error fetching data');
      });

  }


  setUploadConfiguration(): void {

    if (this.wizard.currentStep().parameters[0].dataType === 'file-upload') {
      this.wizard.currentStep().parameters[0].fileUploadConfig = {
        httpUploadUrl: new UrlModel(this.stores.environment.APP_URL).addPath('upload').buildUrl(),
        httpUploadBody: {
          context: this.sectionId,
          innovatorId: this.stores.authentication.getUserId(),
          innovationId: this.innovation.id
        },
        maxFileSize: 10,
        acceptedFiles: [FileTypes.CSV, FileTypes.DOCX, FileTypes.XLSX, FileTypes.PDF]
      };
    }

  }



  onSubmitStep(action: 'previous' | 'next'): void {

    this.alert = { type: null, errorsList: [] };

    const formData = this.formEngineComponent?.getFormValues();

    if (action === 'previous') {
      this.wizard.addAnswers(formData?.data || {}).runRules();
      if (this.wizard.isFirstStep()) { this.redirectTo(this.baseUrl); }
      else { this.wizard.previousStep(); }
      this.setPageTitle(this.wizard.currentStepTitle());
      this.setUploadConfiguration();
      return;
    }

    if (action === 'next' && !formData?.valid) { // Apply validation only when moving forward.
      return;
    }

    const shouldUpdateInformation = Object.entries(formData?.data || {}).filter(([key, updatedAnswer]) => {
      // NOTE: This is a very shallow comparison, and will return false for objects and arrays.
      // Althought this can be improved in the future, for now it helps on some steps...
      const currentAnswer = this.wizard.getAnswers()[key];
      return currentAnswer !== updatedAnswer;

    }).length > 0;

    this.wizard.addAnswers(formData!.data).runRules();

    this.saveButton = { isActive: false, label: 'Saving...' };

    of(true).pipe(
      concatMap(() => {

        if (shouldUpdateInformation) {
          return this.stores.innovation.updateSectionInfo$(this.innovation.id, this.sectionId, this.wizard.runOutboundParsing());
        } else {
          return of(true);
        }

      }),
      concatMap(() => {

        // NOTE: This is a very specific operation that updates the context (store) innovation name.
        // If more exceptions appears, a wizard configurations should be considered.
        if (this.sectionId === 'INNOVATION_DESCRIPTION' && this.wizard.currentStepId === 1) {
          this.stores.context.updateInnovation({ name: this.wizard.getAnswers().innovationName });
        }
        return of(true);

      }),
      concatMap(() => {

        const shouldRefreshInformation = this.wizard.currentStep().saveStrategy === 'updateAndWait';

        if (shouldRefreshInformation) {
          return this.stores.innovation.getSectionInfo$('innovator', this.innovation.id, this.sectionId);
        } else {
          return of({ data: {} });
        }

      })).subscribe(
        response => {

          // Update only if GET call was made!
          if (Object.keys(response.data).length > 0) {
            this.wizard.setAnswers(this.wizard.runInboundParsing(response.data)).runRules();
          }

          this.wizard.nextStep();
          this.focusBody();

          if (this.wizard.isQuestionStep()) {
            this.setPageTitle(this.wizard.currentStepTitle());
            this.setUploadConfiguration();
          }
          else {

            this.setPageTitle('Check your answers');

            const validInformation = this.wizard.validateData();

            this.submitButton.isActive = validInformation.valid;
            if (!validInformation.valid) {
              this.alert = {
                type: 'ERROR',
                title: `Please verify what's missing with your answers`,
                errorsList: validInformation.errors
              };

            }

          }

          this.saveButton = { isActive: true, label: 'Save and continue' };

        },
        () => {

          this.saveButton = { isActive: true, label: 'Save and continue' };
          this.alert = {
            type: 'ERROR',
            title: 'An error has ocurred when saving information',
            message: 'Please try again or contact us for further help',
            errorsList: []
          };

        });

  }

  onSubmitSection(): void {

    this.stores.innovation.submitSections$(this.innovation.id, [this.sectionId]).subscribe(
      () => { this.redirectTo(this.baseUrl, { alert: 'sectionUpdateSuccess' }); },
      () => { this.redirectTo(this.baseUrl, { alert: 'sectionUpdateError' }); }
    );

  }

}
