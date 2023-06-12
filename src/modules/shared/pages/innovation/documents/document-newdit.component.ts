import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { FileTypes, FormEngineComponent, WizardEngineModel } from '@app/base/forms';

import { InnovationDocumentsService } from '@modules/shared/services/innovation-documents.service';

import { DOCUMENT_EDIT_QUESTIONS, DOCUMENT_INNOVATOR_QUESTIONS, DOCUMENT_OTHER_USERS_QUESTIONS, OutboundPayloadType } from './document-newdit.config';
import { UrlModel } from '@app/base/models';


@Component({
  selector: 'shared-pages-innovation-documents-document-newdit',
  templateUrl: './document-newdit.component.html'
})
export class PageInnovationDocumentsNewditComponent extends CoreComponent implements OnInit {

  @ViewChild(FormEngineComponent) formEngineComponent?: FormEngineComponent;

  innovationId: string;
  documentId: string;
  documentData: {
    isCreation: boolean,
    isEdition: boolean
  };
  baseUrl: string;

  wizard = new WizardEngineModel({});

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationDocumentsService: InnovationDocumentsService
  ) {

    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.documentId = this.activatedRoute.snapshot.params.announcementId;
    this.documentData = {
      isCreation: !this.documentId,
      isEdition: !!this.documentId
    };
    this.baseUrl = `${this.stores.authentication.userUrlBasePath()}/innovations/${this.innovationId}/documents`;

    this.setBackLink('Go back', this.onSubmitStep.bind(this, 'previous'));

  }

  ngOnInit(): void {

    if (this.documentData.isCreation) {

      if (this.stores.authentication.isInnovatorType()) {
        this.wizard = new WizardEngineModel(DOCUMENT_INNOVATOR_QUESTIONS);
      } else {
        // this.wizard.setAnswers(this.wizard.runInboundParsing({ contextType: 'INNOVATION' }));
        this.wizard = new WizardEngineModel(DOCUMENT_OTHER_USERS_QUESTIONS);
      }

      this.wizard.runRules();

      this.setPageTitle(this.wizard.currentStepTitle(), { showPage: false });
      this.setPageStatus('READY');

    } else {

      this.innovationDocumentsService.getDocumentInfo(this.innovationId, this.documentId).subscribe(response => {

        this.wizard = new WizardEngineModel(DOCUMENT_EDIT_QUESTIONS);

        this.wizard.setAnswers(this.wizard.runInboundParsing(response)).runRules();
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
        httpUploadBody: {
          innovatorId: this.stores.authentication.getUserId(),
          innovationId: this.innovationId,
          // context: '' // this.sectionId, // TODO!
        },
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

    const formData = this.formEngineComponent?.getFormValues() || { valid: false, data: {} };

    if (action === 'next' && !formData.valid) { // Don't move forward if step is NOT valid.
      return;
    }

    this.wizard.addAnswers(formData.data).runRules();

    switch (action) {
      case 'previous':
        if (this.wizard.isFirstStep()) { this.redirectTo(this.baseUrl); }
        else { this.wizard.previousStep(); }
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

    if (this.documentData.isCreation) {

      this.innovationDocumentsService.createDocument(this.innovationId, wizardSummary).subscribe({
        next: response => {
          this.setRedirectAlertSuccess('A new document was created.');
          this.redirectTo(`${this.baseUrl}/${response.id}`);
        },
        error: () => {
          this.setPageStatus('ERROR');
          this.setAlertUnknownError();
        }
      });

    } else {

      this.innovationDocumentsService.updateDocument(this.innovationId, this.documentId, wizardSummary).subscribe({
        next: () => {
          this.setRedirectAlertSuccess('The document was updated.');
          this.redirectTo(`${this.baseUrl}/${this.documentId}`);
        },
        error: () => {
          this.setPageStatus('ERROR');
          this.setAlertUnknownError();
        }
      });

    }

  }

}
