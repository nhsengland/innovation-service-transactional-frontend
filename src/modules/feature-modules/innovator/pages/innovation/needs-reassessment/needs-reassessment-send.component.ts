import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { FormEngineComponent, WizardEngineModel } from '@app/base/forms';

import { ContextInnovationType } from '@modules/stores/context/context.types';
import { InnovationStatusEnum } from '@modules/stores/innovation';

import { NEEDS_REASSESSMENT_CONFIG, OutboundPayloadType } from './needs-reassessment-send.config';
import { InnovationsService } from '@modules/shared/services/innovations.service';

@Component({
  selector: 'app-innovator-pages-innovation-reassessment-innovation-reassessment-send',
  templateUrl: './needs-reassessment-send.component.html'
})
export class PageInnovationNeedsReassessmentSendComponent extends CoreComponent implements OnInit {
  @ViewChild(FormEngineComponent) formEngineComponent?: FormEngineComponent;

  innovationId: string;
  baseUrl: string;
  innovation: ContextInnovationType;

  wizard = new WizardEngineModel(NEEDS_REASSESSMENT_CONFIG);

  saveButton = { isActive: true, label: 'Continue' };
  submitButton = { isActive: true, label: 'Send to needs reassessment' };

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService
  ) {
    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.innovation = this.stores.context.getInnovation();
    this.baseUrl = `/innovator/innovations/${this.innovationId}`;
  }

  ngOnInit(): void {
    this.wizard.setAnswers(this.wizard.runInboundParsing({ status: this.innovation.status })).runRules();
    this.setPageTitle(this.wizard.currentStepTitle(), { showPage: false });
    this.setBackLink('Go back', this.onSubmitStep.bind(this, 'previous'));
    this.setPageStatus('READY');
  }

  onSubmitStep(action: 'previous' | 'next'): void {
    const formData = this.formEngineComponent?.getFormValues() || { valid: false, data: {} };

    if (action === 'next' && !formData.valid) {
      // Don't move forward if step is NOT valid.
      return;
    }

    this.wizard.addAnswers(formData.data).runRules();

    switch (action) {
      case 'previous':
        if (this.wizard.isFirstStep()) {
          if (this.innovation.status === InnovationStatusEnum.ARCHIVED) {
            this.redirectTo(`${this.baseUrl}/record`);
          } else {
            this.redirectTo(`${this.baseUrl}/how-to-proceed`);
          }
        } else {
          this.wizard.previousStep();
          this.setPageTitle(this.wizard.currentStepTitle(), { showPage: false });
        }
        break;

      case 'next':
        this.wizard.nextStep();

        if (this.wizard.isQuestionStep()) {
          this.setPageTitle(this.wizard.currentStepTitle(), { showPage: false });
        } else {
          this.setPageTitle('Check your answers', { size: 'l' });
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
    this.resetAlert();

    this.submitButton = { isActive: false, label: 'Saving...' };

    const body = this.wizard.runOutboundParsing() as OutboundPayloadType;

    this.innovationsService.createNeedsReassessment(this.innovationId, body).subscribe({
      next: () => {
        this.setRedirectAlertSuccess('Your innovation has been reshared for a needs reassessment', {
          message:
            'Our team will be in touch within a week to let you know if further support is available for your innovation.'
        });
        this.redirectTo(`${this.baseUrl}`);
      },
      error: () => {
        this.submitButton = { isActive: true, label: 'Send to needs reassessment' };
        this.setAlertError('Please try again or contact us for further help.', { width: '2.thirds' });
      }
    });
  }
}
