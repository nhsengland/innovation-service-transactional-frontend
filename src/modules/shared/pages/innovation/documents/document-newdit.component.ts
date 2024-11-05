import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { FileTypes, FormEngineComponent, WizardEngineModel } from '@app/base/forms';
import { UrlModel } from '@app/base/models';

import { InnovationDocumentsService } from '@modules/shared/services/innovation-documents.service';

import { InnovationErrorsEnum } from '@app/base/enums';
import {
  OutboundPayloadType,
  WIZARD_BASE_QUESTIONS,
  WIZARD_EDIT_QUESTIONS,
  WIZARD_WITH_LOCATION_QUESTIONS
} from './document-newdit.config';

@Component({
  selector: 'shared-pages-innovation-documents-document-newdit',
  templateUrl: './document-newdit.component.html'
})
export class PageInnovationDocumentsNewditComponent extends CoreComponent implements OnInit {
  @ViewChild(FormEngineComponent) formEngineComponent?: FormEngineComponent;

  innovationId: string;
  documentId: string;

  pageData: {
    isCreation: boolean;
    isEdition: boolean;
    queryParams: { sectionId?: string; evidenceId?: string; progressUpdateId?: string };
  };

  wizard = new WizardEngineModel({});

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationDocumentsService: InnovationDocumentsService
  ) {
    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.documentId = this.activatedRoute.snapshot.params.announcementId;
    this.pageData = {
      isCreation: !this.documentId,
      isEdition: !!this.documentId,
      queryParams: {
        sectionId: this.activatedRoute.snapshot.queryParams.sectionId,
        evidenceId: this.activatedRoute.snapshot.queryParams.evidenceId,
        progressUpdateId: this.activatedRoute.snapshot.queryParams.progressUpdateId
      }
    };

    this.setBackLink('Go back', this.onSubmitStep.bind(this, 'previous'));
  }

  ngOnInit(): void {
    if (this.pageData.isCreation) {
      if (this.stores.authentication.isInnovatorType()) {
        if (this.pageData.queryParams.sectionId) {
          this.wizard = new WizardEngineModel(WIZARD_BASE_QUESTIONS);
          this.wizard.setInboundParsedAnswers({
            innovationId: this.innovationId,
            context: { type: 'INNOVATION_SECTION', id: this.pageData.queryParams.sectionId }
          });
        } else if (this.pageData.queryParams.evidenceId) {
          this.wizard = new WizardEngineModel(WIZARD_BASE_QUESTIONS);
          this.wizard.setInboundParsedAnswers({
            innovationId: this.innovationId,
            context: { type: 'INNOVATION_EVIDENCE', id: this.pageData.queryParams.evidenceId }
          });
        } else {
          this.wizard = new WizardEngineModel(WIZARD_WITH_LOCATION_QUESTIONS).setInboundParsedAnswers({
            innovationId: this.innovationId,
            schema: this.ctx.schema.irSchemaInfo()
          });
        }
      } else {
        if (this.pageData.queryParams.progressUpdateId) {
          this.wizard = new WizardEngineModel(WIZARD_BASE_QUESTIONS);
          this.wizard.setInboundParsedAnswers({
            innovationId: this.innovationId,
            context: { type: 'INNOVATION_PROGRESS_UPDATE', id: this.pageData.queryParams.progressUpdateId }
          });
        } else {
          this.wizard = new WizardEngineModel(WIZARD_BASE_QUESTIONS).setInboundParsedAnswers({
            innovationId: this.innovationId
          });
        }
      }

      this.wizard.runRules();

      this.setPageTitle(this.wizard.currentStepTitle(), { showPage: false });
      this.setPageStatus('READY');
    } else {
      this.innovationDocumentsService.getDocumentInfo(this.innovationId, this.documentId).subscribe(response => {
        this.wizard = new WizardEngineModel(WIZARD_EDIT_QUESTIONS);

        this.wizard.setInboundParsedAnswers(response).runRules();
        this.wizard.gotoStep(this.activatedRoute.snapshot.params.stepId || 1);

        this.setUploadConfiguration();

        this.setPageTitle(this.wizard.currentStepTitle(), { showPage: false });
        this.setPageStatus('READY');
      });
    }
  }

  setUploadConfiguration(): void {
    if (this.wizard.currentStep().parameters[0].dataType === 'file-upload') {
      this.wizard.currentStep().parameters[0].fileUploadConfig = {
        httpUploadUrl: new UrlModel(this.CONSTANTS.APP_URL).addPath('upload-file').buildUrl(),
        httpUploadBody: { innovatorId: this.stores.authentication.getUserId(), innovationId: this.innovationId },
        maxFileSize: 20,
        acceptedFiles: [FileTypes.CSV, FileTypes.DOCX, FileTypes.XLSX, FileTypes.PDF]
      };
    }
  }

  onGotoStep(stepNumber: number): void {
    this.wizard.gotoStep(stepNumber);
    this.resetAlert();
    this.setPageTitle(this.wizard.currentStepTitle(), { showPage: false });
    this.setUploadConfiguration();
  }

  onSubmitStep(action: 'previous' | 'next'): void {
    const formData = this.formEngineComponent?.getFormValues() ?? { valid: false, data: {} };

    if (action === 'next' && !formData.valid) {
      // Don't move forward if step is NOT valid.
      return;
    }

    this.wizard.addAnswers(formData.data).runRules();

    switch (action) {
      case 'previous':
        if (this.wizard.isFirstStep()) {
          this.redirectTo(this.redirectUrl());
        } else {
          this.wizard.previousStep();
        }
        break;
      case 'next':
        this.wizard.nextStep();
        break;
      default: // Should NOT happen!
        break;
    }

    if (this.wizard.isQuestionStep()) {
      this.setPageTitle(this.wizard.currentStepTitle(), { showPage: false });
      this.setUploadConfiguration();
    } else {
      this.setPageTitle('Check your answers', { size: 'l' });
    }
  }

  onSubmitWizard(): void {
    const wizardSummary = this.wizard.runOutboundParsing() as OutboundPayloadType;

    if (this.pageData.isCreation) {
      this.innovationDocumentsService.createDocument(this.innovationId, wizardSummary).subscribe({
        next: () => {
          this.setRedirectAlertSuccess('Your document has been added');
          this.redirectTo(
            this.redirectUrl({
              sectionId: this.pageData.queryParams.sectionId,
              evidenceId: this.pageData.queryParams.evidenceId
            })
          );
        },
        error: ({ error: err }) => {
          this.setPageStatus('ERROR');
          if (err.error === InnovationErrorsEnum.INNOVATION_MAX_ALLOWED_FILES_REACHED) {
            this.setAlertError('You cannot upload this file as this innovation has reached the limit of 50 files.');
          } else {
            this.setAlertUnknownError();
          }
        }
      });
    } else {
      this.innovationDocumentsService.updateDocument(this.innovationId, this.documentId, wizardSummary).subscribe({
        next: () => {
          this.setRedirectAlertSuccess('Your document has been updated');
          this.redirectTo(this.redirectUrl({ documentId: this.documentId }));
        },
        error: () => {
          this.setPageStatus('ERROR');
          this.setAlertUnknownError();
        }
      });
    }
  }

  redirectUrl(data?: { documentId?: string; sectionId?: string; evidenceId?: string }): string {
    const baseUrl = `${this.stores.authentication.userUrlBasePath()}/innovations/${this.innovationId}`;

    if (data?.evidenceId) {
      return `${baseUrl}/record/sections/EVIDENCE_OF_EFFECTIVENESS/evidences/${data.evidenceId}`;
    } else if (data?.sectionId) {
      return `${baseUrl}/record/sections/${data.sectionId}`;
    } else if (data?.documentId) {
      return `${baseUrl}/documents/${data.documentId}`;
    } else {
      return this.stores.context.getPreviousUrl() ?? `${baseUrl}/documents`;
    }
  }
}
