import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { FormEngineComponent, WizardEngineModel } from '@app/base/forms';
import { AdminOrganisationsService } from '@modules/feature-modules/admin/services/admin-organisations.service';

import { NEW_UNIT_CONFIG, OutboundPayloadType } from './organisation-unit-new.config';

@Component({
  selector: 'app-admin-pages-organisations-organisation-unit-new',
  templateUrl: './organisation-unit-new.component.html'
})
export class PageOrganisationUnitNewComponent extends CoreComponent implements OnInit {
  @ViewChild(FormEngineComponent) formEngineComponent?: FormEngineComponent;

  organisationId: string;

  wizard = new WizardEngineModel(NEW_UNIT_CONFIG);

  saveButton = { isActive: true, label: 'Continue' };
  submitButton = { isActive: true, label: 'Submit' };

  constructor(
    private activatedRoute: ActivatedRoute,
    private adminOrganisationsService: AdminOrganisationsService
  ) {
    super();

    this.organisationId = this.activatedRoute.snapshot.params.organisationId;
  }

  ngOnInit(): void {
    this.wizard.setAnswers({}).runRules();
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
          this.redirectTo(`${this.ctx.user.userUrlBasePath()}/organisations/${this.organisationId}`);
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
          this.setPageTitle('Check the new organisation unit details', { size: 'l' });
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

    this.adminOrganisationsService.createOrganisationUnit(this.organisationId, body).subscribe({
      next: () => {
        this.setRedirectAlertSuccess(
          'You have successfully created a new organisation unit attached to this organisation'
        );
        this.redirectTo(`${this.ctx.user.userUrlBasePath()}/organisations/${this.organisationId}`);
      },
      error: () => {
        this.submitButton = { isActive: true, label: 'Submit' };
        this.setAlertError('Please try again or contact us for further help', { width: '2.thirds' });
      }
    });
  }
}
