import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { concatMap } from 'rxjs/operators';

import { CoreComponent } from '@app/base';
import { FormEngineComponent, WizardEngineModel } from '@app/base/forms';
import { ContextInnovationType } from '@app/base/types';

import { InnovationSectionEnum } from '@modules/stores/innovation';
import { getInnovationRecordConfig } from '@modules/stores/innovation/innovation-record/ir-versions.config';


@Component({
  selector: 'app-innovator-pages-innovation-section-edit',
  templateUrl: './section-edit.component.html'
})
export class InnovationSectionEditComponent extends CoreComponent implements OnInit {

  @ViewChild(FormEngineComponent) formEngineComponent?: FormEngineComponent;

  alertErrorsList: { title: string, description: string }[] = [];
  errorOnSubmitStep: boolean = false;

  innovation: ContextInnovationType;
  sectionId: InnovationSectionEnum;
  baseUrl: string;

  sectionsIdsList: string[];
  wizard: WizardEngineModel;

  saveButton = { isActive: true, label: 'Save and continue' };
  submitButton = { isActive: false, label: 'Confirm section answers' };
  submitRequestedActionsButton = { isActive: false, label: 'Submit updates' };

  hasRequestActions: boolean = false;


  constructor(
    private activatedRoute: ActivatedRoute
  ) {

    super();

    this.innovation = this.stores.context.getInnovation();
    this.sectionId = this.activatedRoute.snapshot.params.sectionId;
    this.baseUrl = `innovator/innovations/${this.innovation.id}/record/sections/${this.sectionId}`;

    this.sectionsIdsList = getInnovationRecordConfig().flatMap(sectionsGroup => sectionsGroup.sections.map(section => section.id));
    this.wizard = this.stores.innovation.getInnovationRecordSectionWizard(this.sectionId);

    this.setBackLink('Go back', this.onSubmitStep.bind(this, 'previous'));

  }

  private getNextSectionId(): string | null {

    const currentSectionIndex = this.sectionsIdsList.indexOf(this.sectionId);
    return this.sectionsIdsList[currentSectionIndex + 1] || null;

  }


  ngOnInit(): void {

    this.stores.innovation.getSectionInfo$(this.innovation.id, this.sectionId).subscribe({
      next: response => {
        this.hasRequestActions = response.actionsIds?.length !== 0;

        this.wizard.setAnswers(this.wizard.runInboundParsing(response.data)).runRules();
        this.wizard.gotoStep(this.activatedRoute.snapshot.params.questionId || 1);

        this.setPageTitle(this.wizard.currentStepTitle(), { showPage: false });
        this.setPageStatus('READY');

      },
      error: () => {
        this.setPageStatus('ERROR');
        this.logger.error('Error fetching data');
      }
    });

  }

  onGotoStep(stepNumber: number): void {

    this.wizard.gotoStep(stepNumber);
    this.resetAlert();
    this.setPageTitle(this.wizard.currentStepTitle(), { showPage: false });

  }

  onSubmitStep(action: 'previous' | 'next'): void {

    this.alertErrorsList = [];
    this.resetAlert();

    const formData = this.formEngineComponent?.getFormValues();


    if (action === 'previous') {
      this.wizard.addAnswers(formData?.data || {}).runRules();
      if (this.wizard.isFirstStep()) { this.redirectTo(this.baseUrl); }
      else { this.wizard.previousStep(); }
      this.setPageTitle(this.wizard.currentStepTitle(), { showPage: false });
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

        if (shouldUpdateInformation || this.errorOnSubmitStep) {
          return this.stores.innovation.updateSectionInfo$(this.innovation.id, this.sectionId, this.wizard.runOutboundParsing());
        } else {
          return of(true);
        }

      }),
      concatMap(() => {

        // NOTE: This is a very specific operation that updates the context (store) innovation name.
        // If more exceptions appears, a wizard configurations should be considered.
        if (this.sectionId === 'INNOVATION_DESCRIPTION' && this.wizard.currentStepId === 1) {
          this.stores.context.updateInnovation({ name: this.wizard.getAnswers().name });
        }
        return of(true);

      }),
      concatMap(() => {

        const shouldRefreshInformation = this.wizard.currentStep().saveStrategy === 'updateAndWait';

        if (shouldRefreshInformation) {
          return this.stores.innovation.getSectionInfo$(this.innovation.id, this.sectionId);
        } else {
          return of({ data: {} });
        }

      })).subscribe({
        next: response => {

          // Update only if GET call was made!
          if (Object.keys(response.data).length > 0) {
            this.wizard.setAnswers(this.wizard.runInboundParsing(response.data)).runRules();
          }

          this.wizard.nextStep();

          if (this.wizard.isQuestionStep()) {
            this.setPageTitle(this.wizard.currentStepTitle(), { showPage: false });
          }
          else {

            this.setPageStatus('LOADING');

            this.stores.innovation.getSectionInfo$(this.innovation.id, this.sectionId).subscribe((sectionInfo) => {

              const validInformation = this.wizard.validateData();

              if (!validInformation.valid) {
                this.alertErrorsList = validInformation.errors;
                this.setAlertError(`Please verify what's missing with your answers`, { itemsList: this.alertErrorsList, width: '2.thirds' });
              }

              if (this.hasRequestActions && sectionInfo.status === 'DRAFT') {
                this.submitRequestedActionsButton.isActive = validInformation.valid;
              } else {
                this.submitButton.isActive = validInformation.valid;
              }

              this.setPageTitle('Check your answers', { size: 'l' });

              this.setPageStatus('READY');
            }
            );

          }

          this.errorOnSubmitStep = false;
          this.saveButton = { isActive: true, label: 'Save and continue' };

        },
        error: () => {
          this.errorOnSubmitStep = true;
          this.saveButton = { isActive: true, label: 'Save and continue' };
          this.alertErrorsList = [];
          this.setAlertUnknownError();

        }
      });

  }

  onSubmitSection(): void {

    this.stores.innovation.submitSections$(this.innovation.id, this.sectionId).subscribe({
      next: () => {
        this.setRedirectAlertSuccess('Your answers have been confirmed for this section', { message: this.getNextSectionId() ? 'Go to next section or return to the full innovation record' : undefined });
        this.redirectTo(this.baseUrl);
      },
      error: () => this.setAlertError('Please try again or contact us for further help.', { width: '2.thirds' })

    });

  }

}
