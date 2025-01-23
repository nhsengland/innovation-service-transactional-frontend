import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoreComponent } from '@app/base';
import { ContextInnovationType } from '@app/base/types';
import { combineLatest, concatMap, of } from 'rxjs';

import { FormEngineV3Component } from '@modules/shared/forms/engine/form-engine-v3.component';
import {
  WizardIRV3EngineModel,
  WizardSummaryV3Type
} from '@modules/shared/forms/engine/models/wizard-engine-irv3-schema.model';
import { InnovationSectionStatusEnum, InnovationStatusEnum } from '@modules/stores';

import { HttpErrorResponse } from '@angular/common/http';
import { IRSchemaErrors } from '@modules/shared/enums/ir-schema-errors.enum';

@Component({
  selector: 'app-innovator-pages-innovation-section-edit',
  templateUrl: './section-edit.component.html'
})
export class InnovationSectionEditComponent extends CoreComponent implements OnInit {
  @ViewChild(FormEngineV3Component) formEngineComponent?: FormEngineV3Component;

  alertErrorsList: { title: string; description: string }[] = [];
  errorOnSubmitStep = false;

  innovation: ContextInnovationType;
  isArchived: boolean;
  sectionId: string;
  baseUrl: string;

  sectionsIdsList: string[];
  sectionQuestionsIdList: string[];
  wizard: WizardIRV3EngineModel;
  sectionStatus = InnovationSectionStatusEnum.NOT_STARTED;
  saveButton = { isActive: true, label: 'Save and continue' };
  submitButton = { isActive: false, label: 'Mark section complete' };

  isChangeMode = false;
  lastSection = false;

  displayChangeButtonList: number[] = [];

  constructor(private activatedRoute: ActivatedRoute) {
    super();

    this.innovation = this.ctx.innovation.info();
    this.sectionId = this.activatedRoute.snapshot.params.sectionId;
    this.baseUrl = `/innovator/innovations/${this.innovation.id}/record/sections/${this.sectionId}`;

    this.sectionsIdsList = this.ctx.schema.getSubSectionsIds();
    this.sectionQuestionsIdList = this.ctx.schema.getIrSchemaSectionQuestionsIdsList(this.sectionId);

    this.wizard = this.ctx.innovation.getInnovationRecordSectionWizard(this.sectionId);
    this.wizard.currentStepId = this.activatedRoute.snapshot.params.questionId;

    this.isArchived = this.ctx.innovation.isArchived();

    this.setBackLink('Go back', this.onSubmitStep.bind(this, 'previous'));
  }

  private getNextSectionId(): string | null {
    const currentSectionIndex = this.sectionsIdsList.indexOf(this.sectionId);
    return this.sectionsIdsList[currentSectionIndex + 1] ?? null;
  }

  ngOnInit(): void {
    combineLatest([this.activatedRoute.queryParams, this.activatedRoute.params]).subscribe({
      next: ([queryParams]) => {
        this.isChangeMode = queryParams.isChangeMode ?? false;

        this.ctx.innovation.getSectionInfo$(this.innovation.id, this.sectionId).subscribe({
          next: sectionInfoResponse => {
            this.wizard.setAnswers(sectionInfoResponse.data).runRules().runInboundParsing();
            this.sectionStatus = sectionInfoResponse.status;

            this.onGoToStep(this.activatedRoute.snapshot.params.questionId, this.isChangeMode);
          },
          error: () => {
            this.setPageStatus('ERROR');
            this.logger.error('Error fetching data');
          }
        });

        if (this.innovation.status === InnovationStatusEnum.CREATED) {
          this.ctx.innovation.getSectionsSummary$(this.innovation.id).subscribe({
            next: data => {
              this.lastSection = !data
                .flatMap(s => s.sections)
                .some(s => s.status != InnovationSectionStatusEnum.SUBMITTED && s.id !== this.sectionId);
            }
            // no error handling assuming it was not the last section as a fallback
          });
        }
      }
    });
  }

  onChangeStep(stepId: number, item: WizardSummaryV3Type): void {
    this.isChangeMode = true;
    this.redirectTo(`${this.baseUrl}/edit/${stepId}`, { ...(item.value && { isChangeMode: true }) });
    this.resetAlert();
  }

  onGoToStep(stepId: 'summary' | number, isChangeMode?: boolean) {
    if (stepId === 'summary') {
      this.wizard.parseSummary();

      const validInformation = this.wizard.validateData();

      if (!validInformation.valid) {
        this.alertErrorsList = validInformation.errors;
        this.setAlertError(`Please verify what's missing with your answers`, {
          itemsList: this.alertErrorsList,
          width: '2.thirds'
        });
      }

      if (this.sectionStatus === 'DRAFT') {
        this.submitButton.isActive = validInformation.valid;
        if (
          this.innovation.status !== InnovationStatusEnum.CREATED &&
          this.innovation.status !== InnovationStatusEnum.WAITING_NEEDS_ASSESSMENT
        ) {
          this.submitButton.label = 'Save updates';
        }
      }

      for (const [index, item] of this.wizard.getSummary().entries()) {
        this.displayChangeButtonList.push(index);
        if (!this.checkItemHasValue(item) && !item.isNotMandatory) {
          break;
        }
      }

      this.wizard.gotoSummary();
      this.setPageTitle('Check your answers', { size: 'l' });
    } else {
      this.wizard.showSummary = false;
      this.wizard.gotoStep(stepId, isChangeMode);
      this.setPageTitle(this.wizard.currentStepTitle(), { showPage: false });
    }

    this.setBackLink('Go back', this.onSubmitStep.bind(this, 'previous'));
    this.setPageStatus('READY');
  }

  checkItemHasValue(item: WizardSummaryV3Type): boolean {
    if (item.value) {
      return Array.isArray(item.value) && item.value.length === 0 ? false : true;
    }
    return false;
  }

  onSubmitStep(action: 'previous' | 'next'): void {
    this.alertErrorsList = [];
    this.resetAlert();

    const formData = this.formEngineComponent?.getFormValues() || { valid: false, data: {} };

    if (action === 'next' && !formData?.valid) {
      // Apply validation only when moving forward.
      return;
    }

    const currentStepIndex = this.wizard.currentStepId;

    if (typeof currentStepIndex === 'number') {
      if (action === 'previous') {
        const previousStep = this.wizard.getPreviousStep(this.isChangeMode);
        if (previousStep === -1) {
          this.redirectTo(this.baseUrl);
        } else {
          this.onGoToStep(previousStep, this.isChangeMode);
          this.redirectTo(`${this.baseUrl}/edit/${previousStep}`, { ...(this.isChangeMode && { isChangeMode: true }) });
        }
      }

      if (action === 'next') {
        const shouldUpdateInformation =
          Object.entries(formData?.data || {}).filter(([key, updatedAnswer]) => {
            // NOTE: This is a very shallow comparison, and will return false for objects and arrays.
            // Althought this can be improved in the future, for now it helps on some steps...
            const currentAnswer = this.wizard.getAnswers()[key];
            return currentAnswer !== updatedAnswer;
          }).length > 0;

        this.wizard.addAnswers(formData!.data).runRules();

        this.saveButton = { isActive: false, label: 'Saving...' };

        of(true)
          .pipe(
            concatMap(() => {
              if (shouldUpdateInformation || this.errorOnSubmitStep) {
                return this.ctx.innovation.updateSectionInfo$(
                  this.innovation.id,
                  this.sectionId,
                  this.wizard.runOutboundParsing()
                );
              } else {
                return of(true);
              }
            }),
            concatMap(() => {
              // NOTE: This is a very specific operation that updates the context (store) innovation name.
              // If more exceptions appears, a wizard configurations should be considered.
              if (this.sectionId === 'INNOVATION_DESCRIPTION' && this.wizard.currentStepId === 1) {
                this.ctx.innovation.update({ name: this.wizard.getAnswers().name });
                // this.stores.context.updateInnovation({ name: this.wizard.getAnswers().name });
              }
              return of(true);
            })
          )
          .subscribe({
            next: () => {
              this.saveButton = { isActive: true, label: 'Save and continue' };

              const nextStep = this.wizard.getNextStep(this.isChangeMode);
              this.onGoToStep(this.activatedRoute.snapshot.params.questionId, this.isChangeMode);
              this.redirectTo(`${this.baseUrl}/edit/${nextStep}`, { ...(this.isChangeMode && { isChangeMode: true }) });
            },
            error: ({ error: err }: HttpErrorResponse) => {
              this.errorOnSubmitStep = true;
              this.saveButton = { isActive: true, label: 'Save and continue' };
              this.alertErrorsList = [];
              this.setAlertUnknownError();
              if (err.error === IRSchemaErrors.INNOVATION_RECORD_SCHEMA_VERSION_MISMATCH) {
                this.ctx.schema.clear();
                this.setAlertError('This section of the innovation record has been updated.', {
                  itemsList: [
                    {
                      title: 'Go back to the section and start again',
                      callback: `/innovator/innovations/${this.innovation.id}/record/sections/${this.sectionId}`
                    }
                  ]
                });
              }
            }
          });
      }
    } else {
      this.router.navigateByUrl(`${this.baseUrl}`);
    }

    this.setBackLink('Go back', this.onSubmitStep.bind(this, 'previous'));
  }

  onSubmitSection(): void {
    this.ctx.innovation.submitSections$(this.innovation.id, this.sectionId).subscribe({
      next: () => {
        const { group, section } = this.ctx.schema.getIrSchemaSectionIdentificationV3(this.sectionId)!;
        const sectionId = `${group.number}.${section.number}. ${section.title}`;
        this.setRedirectAlertSuccess(`You have completed section ${sectionId}`);

        if (
          this.innovation.status === InnovationStatusEnum.CREATED ||
          this.innovation.status === InnovationStatusEnum.WAITING_NEEDS_ASSESSMENT
        ) {
          this.redirectTo(
            this.lastSection ? `/innovator/innovations/${this.innovation.id}/submission-ready` : this.baseUrl
          );
        } else {
          this.redirectTo(`${this.baseUrl}/submitted`);
        }
      },
      error: () => this.setAlertError('Please try again or contact us for further help.', { width: '2.thirds' })
    });
  }
}
