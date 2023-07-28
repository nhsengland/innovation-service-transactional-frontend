import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { FileTypes, FormEngineComponent, WizardEngineModel } from '@app/base/forms';
import { UrlModel } from '@app/base/models';

import { InnovationsService } from '@modules/shared/services/innovations.service';

import { OutboundPayloadType, SUPPORT_SUMMARY_PROGRESS_UPDATE } from './support-summary-progress-update.config';


@Component({
  selector: 'shared-pages-innovation-support-support-summary-progress-update',
  templateUrl: './support-summary-progress-update.component.html'
})
export class PageInnovationSupportSummaryProgressUpdateComponent extends CoreComponent implements OnInit {

  @ViewChild(FormEngineComponent) formEngineComponent?: FormEngineComponent;

  innovationId: string;
  baseUrl: string;

  wizard = new WizardEngineModel(SUPPORT_SUMMARY_PROGRESS_UPDATE);

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService
  ) {

    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.baseUrl = `${this.stores.authentication.userUrlBasePath()}/innovations/${this.innovationId}/support-summary`;

    this.setBackLink('Go back', this.onSubmitStep.bind(this, 'previous'));

  }

  ngOnInit(): void {

    this.setUploadConfiguration();

    this.setPageTitle(this.wizard.currentStepTitle(), { showPage: false });
    this.setPageStatus('READY');

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

    this.innovationsService.createSupportSummaryProgressUpdate(this.innovationId, wizardSummary).subscribe({
      next: () => {
        this.setRedirectAlertSuccess('Your progress update has been added to the support summary', { message: 'The innovator has been notified about your update.' });
        this.redirectTo(this.baseUrl);
      },
      error: () => {
        this.setPageStatus('ERROR');
        this.setAlertUnknownError();
      }
    });

  }

}
