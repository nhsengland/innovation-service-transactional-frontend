import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { FileTypes, FormEngineComponent, WizardEngineModel } from '@app/base/forms';
import { UrlModel } from '@app/base/models';

import { InnovationDocumentsService } from '@modules/shared/services/innovation-documents.service';

import { WIZARD_EDIT_QUESTIONS, WIZARD_WITH_LOCATION_QUESTIONS, WIZARD_BASE_QUESTIONS, OutboundPayloadType } from './document-newdit.config';


@Component({
  selector: 'shared-pages-innovation-documents-document-newdit',
  templateUrl: './document-newdit.component.html'
})
export class PageInnovationDocumentsNewditComponent extends CoreComponent implements OnInit {

  @ViewChild(FormEngineComponent) formEngineComponent?: FormEngineComponent;

  innovationId: string;
  documentId: string;

  pageData: {
    isCreation: boolean,
    isEdition: boolean,
    queryParams: {
      sectionId?: string
    }
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
      queryParams: { sectionId: this.activatedRoute.snapshot.queryParams.sectionId }
    };

    this.setBackLink('Go back', this.onSubmitStep.bind(this, 'previous'));

  }

  ngOnInit(): void {

    if (this.pageData.isCreation) {

      if (this.stores.authentication.isInnovatorType()) {

        if (this.pageData.queryParams.sectionId) {
          this.wizard = new WizardEngineModel(WIZARD_BASE_QUESTIONS);
          this.wizard.setAnswers(this.wizard.runInboundParsing({ context: { type: 'INNOVATION_SECTION', id: this.pageData.queryParams.sectionId } }));
        } else {
          this.wizard = new WizardEngineModel(WIZARD_WITH_LOCATION_QUESTIONS);
        }

      } else {
        this.wizard = new WizardEngineModel(WIZARD_BASE_QUESTIONS);
      }

      this.wizard.runRules();

      this.setPageTitle(this.wizard.currentStepTitle(), { showPage: false });
      this.setPageStatus('READY');

    } else {

      this.innovationDocumentsService.getDocumentInfo(this.innovationId, this.documentId).subscribe(response => {

        this.wizard = new WizardEngineModel(WIZARD_EDIT_QUESTIONS);

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

    const formData = this.formEngineComponent?.getFormValues() ?? { valid: false, data: {} };

    if (action === 'next' && !formData.valid) { // Don't move forward if step is NOT valid.
      return;
    }

    this.wizard.addAnswers(formData.data).runRules();

    switch (action) {
      case 'previous':
        if (this.wizard.isFirstStep()) { this.redirectTo(this.redirectUrl()); }
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

    if (this.pageData.isCreation) {

      this.innovationDocumentsService.createDocument(this.innovationId, wizardSummary).subscribe({
        next: response => {
          this.setRedirectAlertSuccess('Your document has been added');
          this.redirectTo(this.redirectUrl({ sectionId: this.pageData.queryParams.sectionId, documentId: response.id }));
        },
        error: () => {
          this.setPageStatus('ERROR');
          this.setAlertUnknownError();
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

  redirectUrl(data?: { documentId?: string, sectionId?: string }): string {

    const baseUrl = `${this.stores.authentication.userUrlBasePath()}/innovations/${this.innovationId}`;

    if (data?.sectionId) {
      return `${baseUrl}/record/sections/${data.sectionId}`;
    } else if (data?.documentId) {
      return `${baseUrl}/documents/${data.documentId}`;
    } else {
      return this.stores.context.getPreviousUrl() ?? `${baseUrl}/documents`;
    }

  }

}
