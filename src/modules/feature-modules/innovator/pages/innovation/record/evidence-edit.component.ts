import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { FormEngineComponent } from '@app/base/forms';
import { ContextInnovationType } from '@app/base/types';

import { WizardEngineModel } from '@modules/shared/forms';
import {
  InnovationDocumentsService,
  UpsertInnovationDocumentType
} from '@modules/shared/services/innovation-documents.service';
import { EvidenceDraftService } from '@modules/stores/ctx/evidence/evidenceDraft.store';
import { concatMap, from } from 'rxjs';

@Component({
  selector: 'app-innovator-pages-innovation-section-evidence-edit',
  templateUrl: './evidence-edit.component.html'
})
export class InnovationSectionEvidenceEditComponent extends CoreComponent implements OnInit {
  @ViewChild(FormEngineComponent) formEngineComponent?: FormEngineComponent;

  innovation: ContextInnovationType;
  sectionId: string;
  evidenceId: string;
  baseUrl: string;

  queryParams: { entrypoint: string };

  wizard: WizardEngineModel;

  submitButton = { isActive: true, label: 'Save' };

  isCreation(): boolean {
    return !this.activatedRoute.snapshot.params.evidenceId;
  }
  isEdition(): boolean {
    return !!this.activatedRoute.snapshot.params.evidenceId;
  }

  supportingDocumentsList: UpsertInnovationDocumentType[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private evidenceDraftService: EvidenceDraftService,
    private innovationDocumentsService: InnovationDocumentsService
  ) {
    super();

    this.innovation = this.ctx.innovation.info();
    this.sectionId = this.activatedRoute.snapshot.params.sectionId;
    this.evidenceId = this.activatedRoute.snapshot.params.evidenceId;
    this.baseUrl = `innovator/innovations/${this.innovation.id}/record/sections/${this.sectionId}`;

    this.queryParams = { entrypoint: this.activatedRoute.snapshot.queryParams.entrypoint };

    this.wizard =
      this.ctx.innovation.getInnovationRecordSectionEvidencesWizard(this.sectionId) ?? new WizardEngineModel({});

    // Protection from direct url access.
    if (this.wizard.steps.length === 0) {
      this.redirectTo(this.baseUrl);
    }

    this.setBackLink('Go back', this.onSubmitStep.bind(this, 'previous', new Event('')));
  }

  ngOnInit(): void {
    this.innovationDocumentsService
      .getDocumentList(this.innovation.id, {
        skip: 0,
        take: 50,
        order: { createdAt: 'ASC' },
        filters: { contextTypes: ['INNOVATION_EVIDENCE'], contextId: this.evidenceId, fields: ['description'] }
      })
      .subscribe(documents => {
        this.supportingDocumentsList = documents.data;
        console.log('evidence-edit supportingDocumentsList', this.supportingDocumentsList);
        if (this.isCreation()) {
          this.runCreationFlow();
        } else {
          this.runEditFlow();
        }
      });
  }

  onGotoStep(stepNumber: number): void {
    this.wizard.gotoStep(stepNumber);
    this.resetAlert();
    this.setPageTitle(this.wizard.currentStepTitle(), { showPage: false });
  }

  onSubmitStep(action: 'previous' | 'next', event: Event): void {
    const formData = this.formEngineComponent?.getFormValues();

    if (action === 'previous') {
      this.wizard.addAnswers(formData?.data || {}).runRules();

      if (this.wizard.isFirstStep()) {
        this.redirectTo(`${this.baseUrl}${this.isCreation() ? '' : `/evidences/${this.evidenceId}`}`);
      } else {
        this.wizard.previousStep();
      }

      this.setPageTitle(this.wizard.currentStepTitle(), { showPage: false });
      return;
    }

    if (action === 'next' && !formData?.valid) {
      // Apply validation only when moving forward.
      return;
    }

    this.evidenceDraftService.updateEvidence(this.wizard.currentAnswers);
    this.wizard.addAnswers(formData?.data || {}).runRules();
    this.wizard.nextStep();

    if (this.wizard.isQuestionStep()) {
      this.setPageTitle(this.wizard.currentStepTitle(), { showPage: false });
    } else {
      this.setPageTitle('Check your answers', { size: 'l' });
    }
  }

  onSubmitEvidence(): void {
    this.resetAlert();

    this.submitButton = { isActive: false, label: 'Saving...' };

    this.ctx.innovation
      .upsertSectionEvidenceInfo$(this.innovation.id, this.wizard.runOutboundParsing(), this.evidenceId)
      .subscribe({
        next: response => {
          const evidenceId = response.id;

          // add uploaded documents to the DB
          if (this.isCreation()) {
            this.evidenceDraftService.updateAllDocumentContexts(evidenceId);

            from(this.evidenceDraftService.documents())
              .pipe(concatMap(document => this.innovationDocumentsService.createDocument(this.innovation.id, document)))
              .subscribe();
          }

          this.setRedirectAlertSuccess('Your evidence has been saved', {
            message: 'You need to submit this section for review to notify your supporting accessor(s).'
          });
          this.redirectTo(
            `innovator/innovations/${this.innovation.id}/record/sections/${this.activatedRoute.snapshot.params.sectionId}/evidences/${response.id}`
          );
        },
        error: () => {
          this.submitButton = { isActive: true, label: 'Save' };
          this.setAlertError(
            'An error occurred when saving your evidence. Please try again or contact us for further help.',
            { width: '2.thirds' }
          );
        }
      });
  }

  runCreationFlow() {
    this.wizard.runRules();

    this.setPageTitle('New evidence', { showPage: false });
    this.setPageStatus('READY');

    // if creation initialize draft store
    if (this.evidenceDraftService.isEmpty()) {
      this.evidenceDraftService.initDraft();
    }

    // if coming from document flow, load answers & redirect to supporting documents step
    if (this.queryParams.entrypoint === 'newDocumentWizard') {
      const draftEvidence = this.evidenceDraftService.evidence();
      this.wizard
        .setAnswers(
          this.wizard.runInboundParsing({
            evidenceSubmitType: draftEvidence?.evidenceSubmitType,
            evidenceType: draftEvidence?.evidenceType,
            description: draftEvidence?.description,
            summary: draftEvidence?.summary
          })
        )
        .runRules();
        this.supportingDocumentsList = [...this.supportingDocumentsList, ...this.evidenceDraftService.documents()]
      this.wizard.gotoStep(4);
    }
  }

  runEditFlow() {
    this.ctx.innovation.getSectionEvidence$(this.innovation.id, this.evidenceId).subscribe(response => {
      this.wizard.setAnswers(this.wizard.runInboundParsing(response)).runRules();
      this.wizard.gotoStep(this.activatedRoute.snapshot.params.questionId || 1);

      this.setPageTitle(this.wizard.currentStepTitle(), { showPage: false });
      this.setPageStatus('READY');
    });
  }
}
