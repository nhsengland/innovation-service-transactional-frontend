import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { FormEngineComponent, WizardEngineModel } from '@app/base/forms';

import { InnovatorService } from '@modules/feature-modules/innovator/services/innovator.service';

import { NEEDS_REASSESSMENT_CONFIG, OutboundPayloadType } from './needs-reassessment-send.config';


@Component({
  selector: 'app-innovator-pages-innovation-reassessment-innovation-reassessment-send',
  templateUrl: './needs-reassessment-send.component.html'
})
export class PageInnovationNeedsReassessmentSendComponent extends CoreComponent {

  @ViewChild(FormEngineComponent) formEngineComponent?: FormEngineComponent;

  innovationId: string;
  baseUrl: string;

  alertErrorsList: { title: string, description: string }[] = [];

  wizard = new WizardEngineModel(NEEDS_REASSESSMENT_CONFIG);

  saveButton = { isActive: true, label: 'Continue' };
  submitButton = { isActive: false, label: 'Send to needs reassessment' };


  constructor(
    private activatedRoute: ActivatedRoute,
    private innovatorService: InnovatorService
  ) {

    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.baseUrl = `/innovator/innovations/${this.innovationId}`;

  }

  ngOnInit(): void {

    this.wizard.setAnswers(this.wizard.runInboundParsing({})).runRules();
    this.setPageTitle(this.wizard.currentStepTitle(), { showPage: false });
    this.setBackLink('Go back', this.onSubmitStep.bind(this, 'previous'));
    this.setPageStatus('READY');

  }

  onSubmitStep(action: 'previous' | 'next'): void {

    this.alertErrorsList = [];
    this.resetAlert();

    const formData = this.formEngineComponent?.getFormValues() || { valid: false, data: {} };

    if (action === 'next' && !formData.valid) { // Don't move forward if step is NOT valid.
      return;
    }

    this.wizard.addAnswers(formData.data).runRules();

    switch (action) {

      case 'previous':
        if (this.wizard.isFirstStep()) { this.redirectTo(`${this.baseUrl}/how-to-proceed`); }
        else {
          this.wizard.previousStep();
          this.setPageTitle(this.wizard.currentStepTitle(), { showPage: false });
        }
        break;

      case 'next':

        this.wizard.nextStep();

        if (this.wizard.isQuestionStep()) {
          this.setPageTitle(this.wizard.currentStepTitle(), { showPage: false });
        }
        else {

          this.setPageTitle('Check your answers', { size: 'l' });

          const validInformation = this.wizard.validateData();

          this.submitButton.isActive = validInformation.valid;
          if (!validInformation.valid) {
            this.alertErrorsList = validInformation.errors;
            this.setAlertError(`Please verify what's missing with your answers`, { itemsList: this.alertErrorsList, width: '2.thirds' });
          }

        }

        break;

      default: // Should NOT happen!
        break;
    }

  }

  onGotoStep(stepNumber: number): void {

    this.wizard.gotoStep(stepNumber);
    this.resetAlert();
    this.setPageTitle(this.wizard.currentStepTitle(), { showPage: false });

  }

  onSubmitWizard(): void {

    this.submitButton = { isActive: false, label: 'Saving...' };

    const body = this.wizard.runOutboundParsing() as OutboundPayloadType;

    this.innovatorService.createNeedsReassessment(this.innovationId, body).subscribe({
      next: () => {
        this.setRedirectAlertSuccess('Your innovation was submitted to need reassessment', { message: 'Our support team will be in touch within a week to let you know if further support is available to your innovation at this moment in time.' });
        this.redirectTo(this.baseUrl);
      },
      error: () => {
        this.submitButton = { isActive: true, label: 'Send to needs reassessment' };
        this.setAlertError('Please try again or contact us for further help.', { width: '2.thirds' })
      }
    });

  }

}
