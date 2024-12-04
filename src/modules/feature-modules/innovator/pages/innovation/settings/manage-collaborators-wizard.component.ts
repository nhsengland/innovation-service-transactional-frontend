import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { FormEngineComponent, WizardEngineModel } from '@app/base/forms';
import { ContextInnovationType } from '@modules/stores';

import { InnovationsService } from '@modules/shared/services/innovations.service';

import { HttpErrorResponse } from '@angular/common/http';
import { UtilsHelper } from '@app/base/helpers';
import {
  MANAGE_COLLABORATORS_CONFIG_EDIT,
  MANAGE_COLLABORATORS_CONFIG_NEW
} from './manage-collaborators-wizard.config';

type ActionsType = 'create' | 'update';

@Component({
  selector: 'app-innovator-pages-innovation-manage-collaborators-wizard',
  templateUrl: './manage-collaborators-wizard.component.html'
})
export class PageInnovationManageCollaboratorsWizardComponent extends CoreComponent implements OnInit {
  @ViewChild(FormEngineComponent) formEngineComponent?: FormEngineComponent;

  innovationCollaboratorId: null | string;
  innovation: ContextInnovationType;
  baseUrl: string;
  action: ActionsType;
  submitButton = { isActive: true, label: '' };

  wizard = new WizardEngineModel({});

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService
  ) {
    super();

    this.innovationCollaboratorId = this.activatedRoute.snapshot.params.collaboratorId ?? null;

    this.innovation = this.ctx.innovation.info();
    this.baseUrl = `innovator/innovations/${this.innovation.id}/manage/innovation/collaborators`;
    this.action = this.router.url.endsWith('edit') ? 'update' : 'create';
    this.submitButton.label = this.action === 'create' ? 'Send invitation' : 'Update collaborator';

    this.setBackLink('Go back', this.onSubmitStep.bind(this, 'previous'));
  }

  ngOnInit(): void {
    if (this.action === 'create') {
      this.wizard = new WizardEngineModel(MANAGE_COLLABORATORS_CONFIG_NEW);
    } else {
      this.wizard = new WizardEngineModel(MANAGE_COLLABORATORS_CONFIG_EDIT);
    }

    if (this.innovationCollaboratorId) {
      this.innovationsService
        .getInnovationCollaboratorInfo(this.innovation.id, this.innovationCollaboratorId)
        .subscribe({
          next: response => {
            this.wizard
              .setAnswers({
                email: response.email,
                role: response.role
              })
              .runRules();

            this.wizard.gotoStep(this.activatedRoute.snapshot.params.questionId || 1);

            this.setPageTitle(this.wizard.currentStepTitle(), { showPage: false });
            this.setPageStatus('READY');
          },
          error: () => {
            this.setPageStatus('ERROR');
          }
        });
    } else {
      this.setPageStatus('READY');
    }
  }

  onGotoStep(stepNumber: number): void {
    this.resetAlert();
    this.wizard.gotoStep(stepNumber);
    this.setPageTitle(this.wizard.currentStepTitle(), { showPage: false });
  }

  onSubmitStep(action: 'previous' | 'next'): void {
    this.resetAlert();

    const formData = this.formEngineComponent?.getFormValues();

    if (action === 'previous') {
      this.wizard.addAnswers(formData?.data || {}).runRules();
      if (this.wizard.isFirstStep()) {
        this.redirectTo(this.ctx.layout.previousUrl() ?? this.baseUrl);
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

    this.wizard.addAnswers(formData!.data).runRules();
    this.wizard.nextStep();
    this.setPageTitle(this.wizard.currentStepTitle(), { showPage: false });
  }

  onSubmitWizard(): void {
    this.submitButton = { isActive: false, label: 'Saving...' };

    if (this.action === 'create') {
      const body = {
        email: this.wizard.currentAnswers.email,
        role: UtilsHelper.isEmpty(this.wizard.currentAnswers.role) ? null : this.wizard.currentAnswers.role
      };

      this.innovationsService.createInnovationCollaborator(this.innovation.id, body).subscribe({
        next: () => {
          this.setRedirectAlertSuccess(
            `An invitation has been sent to ${body.email} to collaborate on '${this.innovation.name}'`,
            { message: 'This invitation will expire in 30 days if not accepted.' }
          );
          this.redirectTo(this.baseUrl);
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 409) {
            this.setAlertError(
              `Please, make sure that the user you're inviting does not have already access to this innovation`
            );
          } else {
            this.setAlertUnknownError();
          }

          this.submitButton = { isActive: true, label: 'Add new collaborator' };
        }
      });
    } else {
      const body = {
        role: UtilsHelper.isEmpty(this.wizard.currentAnswers.role) ? null : this.wizard.currentAnswers.role
      };

      this.innovationsService
        .updateInnovationCollaborator(this.innovation.id, this.innovationCollaboratorId ?? '', body)
        .subscribe({
          next: () => {
            this.setRedirectAlertSuccess(`The collaborator information has been updated`);
            this.redirectTo(this.baseUrl);
          },
          error: () => {
            this.setAlertUnknownError();
            this.submitButton = { isActive: true, label: 'Update user' };
          }
        });
    }
  }
}
