import { transpile } from 'typescript';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, of } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { CoreComponent } from '@app/base';
import { FormEngineComponent, WizardEngineModel } from '@app/base/forms';
import { ContextInnovationType } from '@app/base/types';

import { InnovationSectionEnum, InnovationStatusEnum } from '@modules/stores/innovation';
import {
  getInnovationRecordSchemaSectionQuestionsIdsList,
  getIRSchemaSectionsIdsListV3,
  getInnovationRecordSchemaQuestion,
  translateSectionIdEnums
} from '@modules/stores/innovation/innovation-record/202405/ir-v3.helpers';
import { dummy_innovation_data_V3_202405 } from '@modules/stores/innovation/innovation-record/202405/ir-v3-answers-dummy-data';
import { WizardIRV3EngineModel } from '@modules/shared/forms/engine/models/wizard-irv3-engine.model';
import { FormEngineV3Component } from '@modules/shared/forms/engine/form-engine-v3.component';
import { IRV3Helper } from '@modules/stores/innovation/innovation-record/202405/ir-v3-translator.helper';
import {
  InnovationRecordQuestionStepType,
  InnovationRecordSectionAnswersType
} from '@modules/stores/innovation/innovation-record/202405/ir-v3-types';
import { Parser } from 'expr-eval';

@Component({
  selector: 'app-innovator-pages-innovation-section-edit',
  templateUrl: './section-edit.component.html'
})
export class InnovationSectionEditComponent extends CoreComponent implements OnInit {
  @ViewChild(FormEngineV3Component) formEngineComponent?: FormEngineV3Component;

  alertErrorsList: { title: string; description: string }[] = [];
  errorOnSubmitStep: boolean = false;

  innovation: ContextInnovationType;
  isArchived: boolean;
  sectionId: InnovationSectionEnum;
  baseUrl: string;

  sectionsIdsList: string[];
  sectionQuestionsIdList: string[];
  wizard: WizardIRV3EngineModel;

  saveButton = { isActive: true, label: 'Save and continue' };
  submitButton = { isActive: false, label: 'Confirm section answers' };

  sectionSubmittedText: string = '';

  displayChangeButtonList: number[] = [];

  constructor(private activatedRoute: ActivatedRoute) {
    super();

    this.innovation = this.stores.context.getInnovation();
    this.sectionId = this.activatedRoute.snapshot.params.sectionId;
    this.baseUrl = `/innovator/innovations/${this.innovation.id}/record/sections/${this.sectionId}`;

    this.sectionsIdsList = getIRSchemaSectionsIdsListV3();
    this.sectionQuestionsIdList = getInnovationRecordSchemaSectionQuestionsIdsList(this.sectionId);

    this.wizard = this.stores.innovation.getInnovationRecordSectionWizard(this.sectionId);

    this.isArchived = this.innovation.status === 'ARCHIVED';

    this.setBackLink('Go back', this.onSubmitStep.bind(this, 'previous'));
  }

  private getNextSectionId(): string {
    const currentSectionIndex = this.sectionsIdsList.indexOf(this.sectionId);
    return this.sectionsIdsList[currentSectionIndex + 1] ?? '';
  }

  ngOnInit(): void {
    const sectionIdentification = this.stores.innovation.getInnovationRecordSectionIdentification(this.sectionId);

    const savedOrSubmitted = !this.isArchived ? 'submitted' : 'saved';

    this.sectionSubmittedText = sectionIdentification
      ? `You have ${savedOrSubmitted} section ${sectionIdentification?.group.number}.${sectionIdentification?.section.number} '${sectionIdentification?.section.title}'`
      : '';

    combineLatest([
      this.activatedRoute.queryParams,
      this.stores.innovation.getSectionInfo$(this.innovation.id, translateSectionIdEnums(this.sectionId))
    ]).subscribe({
      next: ([queryParams, sectionInfoResponse]) => {
        const irv3: InnovationRecordSectionAnswersType = IRV3Helper.translateIR({
          id: sectionInfoResponse.id,
          document: {
            [sectionInfoResponse.section]: sectionInfoResponse.data
          }
        });

        console.log('irv3');
        console.log(irv3);

        // Get out if trying to load summary
        if (this.activatedRoute.snapshot.params.questionId === 'summary') {
          this.router.navigateByUrl(`${this.baseUrl}`);
        } else {
          this.wizard.setAnswers(irv3);

          // queryParams.isChangeMode
          //   ? // enables changing mode and redirects to step function

          //     this.wizard.gotoStep(this.activatedRoute.snapshot.params.questionId || 1, true)
          //   : // go to regular step
          //     this.wizard.gotoStep(this.activatedRoute.snapshot.params.questionId || 1);

          this.onGoToStep(this.activatedRoute.snapshot.params.questionId);
        }
      },
      error: () => {
        this.setPageStatus('ERROR');
        this.logger.error('Error fetching data');
      }
    });
  }

  onChangeStep(stepId: string): void {
    this.wizard.gotoStep(stepId, true);
    this.resetAlert();
    this.setPageTitle(this.wizard.currentStepTitle(), { showPage: false });
  }

  onGoToStep(stepId: string) {
    if (stepId === 'summary') {
      this.wizard.parseSummary(this.sectionId);
      this.wizard.gotoSummary();
      this.router.navigateByUrl(`${this.baseUrl}/edit/summary`);
      this.setPageTitle('Check your answers', { size: 'l' });
    } else {
      this.wizard.gotoStep(stepId);
      this.redirectTo(`${this.baseUrl}/edit/${stepId}`);
      this.setPageTitle(this.wizard.currentStepTitle(), { showPage: false });
    }

    this.setPageStatus('READY');
  }

  onSubmitStep(action: 'previous' | 'next'): void {
    this.alertErrorsList = [];
    this.resetAlert();

    const formData = this.formEngineComponent?.getFormValues() || { valid: false, data: {} };
    console.log('formData');
    console.log(formData);

    //

    if (action === 'next' && !formData?.valid) {
      // Apply validation only when moving forward.
      return;
    }

    let currentStepIndex = this.sectionQuestionsIdList.indexOf(this.wizard.currentStepId);

    if (action === 'previous') {
      if (currentStepIndex !== 0 && this.wizard.currentStepId !== 'summary') {
        currentStepIndex--;

        let previousStepId = this.sectionQuestionsIdList[currentStepIndex];

        while (!this.wizard.checkIfStepConditionIsMet(getInnovationRecordSchemaQuestion(previousStepId).condition)) {
          currentStepIndex--;
          previousStepId = this.sectionQuestionsIdList[currentStepIndex];
        }

        this.onGoToStep(previousStepId);
      } else {
        this.router.navigateByUrl(`${this.baseUrl}`);
      }
    }

    if (action === 'next') {
      if (currentStepIndex + 1 !== this.sectionQuestionsIdList.length) {
        this.wizard.addAnswers(formData.data);

        currentStepIndex++;

        let nextStepId = this.sectionQuestionsIdList[currentStepIndex];

        while (!this.wizard.checkIfStepConditionIsMet(getInnovationRecordSchemaQuestion(nextStepId).condition)) {
          currentStepIndex++;
          nextStepId = this.sectionQuestionsIdList[currentStepIndex];
        }

        this.onGoToStep(nextStepId);
      } else {
        this.wizard.parseSummary(this.sectionId);
        this.wizard.showSummary = true;
        this.onGoToStep('summary');
      }
    }

    this.setBackLink('Go back', this.onSubmitStep.bind(this, 'previous'));

    //

    //   if (action === 'previous') {
    //     this.wizard.addAnswers(formData?.data || {}).runRules();

    //     if (
    //       this.wizard.isSummaryStep() ||
    //       (!this.wizard.isChangingMode && this.wizard.isFirstStep()) ||
    //       this.wizard.getCurrentStepObjId() === [...this.wizard.visitedSteps][0]
    //     ) {
    //       this.redirectTo(this.stores.context.getPreviousUrl() ?? this.baseUrl);
    //     } else {
    //       this.wizard.previousStep();
    //     }
    //     this.setPageTitle(this.wizard.currentStepTitle(), { showPage: false });
    //     return;
    //   }

    // const shouldUpdateInformation =
    //   Object.entries(formData?.data || {}).filter(([key, updatedAnswer]) => {
    //     // NOTE: This is a very shallow comparison, and will return false for objects and arrays.
    //     // Althought this can be improved in the future, for now it helps on some steps...
    //     const currentAnswer = this.wizard.getAnswers()[key];
    //     return currentAnswer !== updatedAnswer;
    //   }).length > 0;

    // this.wizard.addAnswers(formData!.data).runRules();

    //   this.saveButton = { isActive: false, label: 'Saving...' };

    //   of(true)
    //     .pipe(
    //       concatMap(() => {
    //         if (shouldUpdateInformation || this.errorOnSubmitStep) {
    //           return this.stores.innovation.updateSectionInfo$(
    //             this.innovation.id,
    //             this.sectionId,
    //             this.wizard.runOutboundParsing()
    //           );
    //         } else {
    //           return of(true);
    //         }
    //       }),
    //       concatMap(() => {
    //         // NOTE: This is a very specific operation that updates the context (store) innovation name.
    //         // If more exceptions appears, a wizard configurations should be considered.
    //         if (this.sectionId === 'INNOVATION_DESCRIPTION' && this.wizard.currentStepId === 1) {
    //           this.stores.context.updateInnovation({ name: this.wizard.getAnswers().name });
    //         }
    //         return of(true);
    //       }),
    //       concatMap(() => {
    //         const shouldRefreshInformation = this.wizard.currentStep().saveStrategy === 'updateAndWait';

    //         if (shouldRefreshInformation) {
    //           return this.stores.innovation.getSectionInfo$(this.innovation.id, this.sectionId);
    //         } else {
    //           return of({ data: {} });
    //         }
    //       })
    //     )
    //     .subscribe({
    //       next: response => {
    //         // Update only if GET call was made!
    //         if (Object.keys(response.data).length > 0) {
    //           this.wizard.setAnswers(this.wizard.runInboundParsing(response.data)).runRules();
    //         }

    //         this.wizard.nextStep();

    //         if (this.wizard.isQuestionStep()) {
    //           this.setPageTitle(this.wizard.currentStepTitle(), { showPage: false });
    //         } else {
    //           this.setPageStatus('LOADING');

    //           this.stores.innovation.getSectionInfo$(this.innovation.id, this.sectionId).subscribe(sectionInfo => {
    //             const validInformation = this.wizard.validateData();

    //             if (!validInformation.valid) {
    //               this.alertErrorsList = validInformation.errors;
    //               this.setAlertError(`Please verify what's missing with your answers`, {
    //                 itemsList: this.alertErrorsList,
    //                 width: '2.thirds'
    //               });
    //             }

    //             if (sectionInfo.status === 'DRAFT') {
    //               this.submitButton.isActive = validInformation.valid;
    //               if (
    //                 this.innovation.status !== InnovationStatusEnum.CREATED &&
    //                 this.innovation.status !== InnovationStatusEnum.WAITING_NEEDS_ASSESSMENT
    //               ) {
    //                 this.submitButton.label = !this.isArchived ? 'Submit updates' : 'Save updates';
    //               }
    //             }

    //             for (const [index, item] of this.wizard.getSummary().entries()) {
    //               this.displayChangeButtonList.push(index);
    //               if (!item.value && !item.isNotMandatory) {
    //                 break;
    //               }
    //             }

    //             this.setPageTitle('Check your answers', { size: 'l' });

    //             this.setPageStatus('READY');
    //           });
    //         }

    //         this.errorOnSubmitStep = false;
    //         this.saveButton = { isActive: true, label: 'Save and continue' };
    //       },
    //       error: () => {
    //         this.errorOnSubmitStep = true;
    //         this.saveButton = { isActive: true, label: 'Save and continue' };
    //         this.alertErrorsList = [];
    //         this.setAlertUnknownError();
    //       }
    //     });
  }

  onSubmitSection(): void {
    this.stores.innovation.submitSections$(this.innovation.id, this.sectionId).subscribe({
      next: () => {
        if (
          this.innovation.status === InnovationStatusEnum.CREATED ||
          this.innovation.status === InnovationStatusEnum.WAITING_NEEDS_ASSESSMENT
        ) {
          this.setRedirectAlertSuccess('Your answers have been confirmed for this section', {
            message: this.getNextSectionId() ? 'Go to next section or return to the full innovation record' : undefined
          });
          this.redirectTo(this.baseUrl);
        } else {
          this.setRedirectAlertSuccess(this.sectionSubmittedText);
          this.redirectTo(`${this.baseUrl}/submitted`);
        }
      },
      error: () => this.setAlertError('Please try again or contact us for further help.', { width: '2.thirds' })
    });
  }
}
