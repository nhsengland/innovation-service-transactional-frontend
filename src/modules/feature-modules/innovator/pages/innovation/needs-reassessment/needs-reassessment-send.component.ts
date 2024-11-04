import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { FormEngineComponent, WizardEngineModel } from '@app/base/forms';

import { ContextInnovationType } from '@modules/stores';

import { NEEDS_REASSESSMENT_CONFIG, OutboundPayloadType } from './needs-reassessment-send.config';
import { InnovationsService } from '@modules/shared/services/innovations.service';
import { FormFieldActionsEnum } from '../how-to-proceed/how-to-proceed.component';

@Component({
  selector: 'app-innovator-pages-innovation-reassessment-innovation-reassessment-send',
  templateUrl: './needs-reassessment-send.component.html'
})
export class PageInnovationNeedsReassessmentSendComponent extends CoreComponent implements OnInit {
  @ViewChild(FormEngineComponent) formEngineComponent?: FormEngineComponent;

  innovationId: string;
  baseUrl: string;
  innovation: ContextInnovationType;

  action: FormFieldActionsEnum;

  wizard = new WizardEngineModel(NEEDS_REASSESSMENT_CONFIG);

  saveButton = { isActive: true, label: 'Continue' };
  submitButton = { isActive: true, label: 'Send to needs reassessment' };

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService
  ) {
    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.action = this.activatedRoute.snapshot.queryParams.action;

    this.innovation = this.ctx.innovation.info();
    this.baseUrl = `/innovator/innovations/${this.innovationId}`;
  }

  ngOnInit(): void {
    this.wizard.setAnswers(this.wizard.runInboundParsing({ status: this.innovation.status })).runRules();
    this.setPageTitle(this.wizard.currentStepTitle(), { showPage: false });
    this.setBackLink('Go back', this.onSubmitStep.bind(this, 'previous'));
    this.setPageStatus('READY');
  }

  onSubmitStep(action: 'previous' | 'next'): void {
    this.resetAlert();

    const formData = this.formEngineComponent?.getFormValues() || { valid: false, data: {} };

    if (action === 'next' && !formData.valid) {
      // Don't move forward if step is NOT valid.

      // To display alert error when parameter is required.
      const parameterRequiredValidation = this.wizard.currentStep().parameters[0].validations?.isRequired;
      if (parameterRequiredValidation && Array.isArray(parameterRequiredValidation)) {
        this.setAlertError('', {
          itemsList: [
            {
              title: parameterRequiredValidation[1],
              fieldId:
                this.wizard.currentStep().parameters[0].dataType === 'checkbox-array'
                  ? this.wizard.currentStep().parameters[0].id + '0'
                  : this.wizard.currentStep().parameters[0].id
            }
          ]
        });
      }

      return;
    }

    this.wizard.addAnswers(formData.data).runRules();

    switch (action) {
      case 'previous':
        if (this.wizard.isFirstStep()) {
          const previousUrl = this.stores.context.getPreviousUrl();
          if (previousUrl) {
            if (previousUrl.includes('how-to-proceed')) {
              const howToProceedUrl = previousUrl.split('?')[0];
              this.redirectTo(
                howToProceedUrl,
                this.action && {
                  action: this.action
                }
              );
            } else {
              this.redirectTo(previousUrl);
            }
          } else {
            this.redirectTo(`/${this.stores.authentication.userUrlBasePath()}/dashboard`);
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
        this.setRedirectAlertSuccess('Your innovation has been submitted for a needs reassessment', {
          message:
            'The needs assessment team will be in touch within a week to let you know what support is available for your innovation.'
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
