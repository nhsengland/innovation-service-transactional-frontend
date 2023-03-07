import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { FormEngineComponent, WizardEngineModel } from '@app/base/forms';
import { ContextInnovationType } from '@modules/stores';

import { InnovationsService } from '@modules/shared/services/innovations.service';
import { InnovatorService } from '@modules/feature-modules/innovator/services/innovator.service';

import { MANAGE_COLLABORATORS_CONFIG } from './manage-collaborators-wizard.config';


@Component({
  selector: 'app-innovator-pages-innovation-manage-collaborators-wizard',
  templateUrl: './manage-collaborators-wizard.component.html'
})
export class PageInnovationManageCollaboratorsWizardComponent extends CoreComponent implements OnInit {

  @ViewChild(FormEngineComponent) formEngineComponent?: FormEngineComponent;

  innovationCollaboratorId: null | string;
  innovation: ContextInnovationType;
  baseUrl: string;

  wizard = new WizardEngineModel(MANAGE_COLLABORATORS_CONFIG);



  constructor(
    private activatedRoute: ActivatedRoute,
    private innovatorService: InnovatorService,
    private innovationsService: InnovationsService
  ) {

    super();

    this.innovationCollaboratorId = this.activatedRoute.snapshot.params.collaboratorId ?? null;
    this.innovation = this.stores.context.getInnovation();
    this.baseUrl = `innovator/innovations/${this.innovation.id}/manage/collaborators`;

    this.setBackLink('Go back', this.onSubmitStep.bind(this, 'previous'));

  }


  ngOnInit(): void {

    if (!this.innovationCollaboratorId) {

      this.setPageStatus('READY');

    } else {

      this.innovationsService.getInnovationCollaboratorInfo(this.innovation.id, this.innovationCollaboratorId).subscribe({
        next: response => {

          this.wizard.setAnswers({
            email: response.email,
            collaboratorRole: response.collaboratorRole
          }).runRules();

          this.wizard.gotoStep(this.activatedRoute.snapshot.params.questionId || 1);

          this.setPageTitle(this.wizard.currentStepTitle(), { showPage: false });
          this.setPageStatus('READY');

        },
        error: () => {
          this.setPageStatus('ERROR');
        }

      });

    }

  }



  onGotoStep(stepNumber: number): void {

    this.resetAlert();
    this.wizard.gotoStep(stepNumber);
    this.setPageTitle(this.wizard.currentStepTitle(), { showPage: false });

  }

  onSubmitStep(action: 'previous' | 'next'): void {

    // this.alertErrorsList = [];
    this.resetAlert();


    const formData = this.formEngineComponent?.getFormValues();

    if (action === 'previous') {
      this.wizard.addAnswers(formData?.data || {}).runRules();
      if (this.wizard.isFirstStep()) { this.redirectTo(this.baseUrl); }
      else { this.wizard.previousStep(); }
      this.setPageTitle(this.wizard.currentStepTitle(), { showPage: false });
      return;
    }

    if (action === 'next' && !formData?.valid) { // Apply validation only when moving forward.
      return;
    }

    this.wizard.addAnswers(formData!.data).runRules();
    this.wizard.nextStep();
    this.setPageTitle(this.wizard.currentStepTitle(), { showPage: false });

    // this.saveButton = { isActive: false, label: 'Saving...' };

  }

  onSubmitWizard(): void {

    // if (!this.parseForm()) { return; }

    // if (!this.form.valid) { return; }

    console.log(this.wizard.currentAnswers);


    const body = {
      email: this.wizard.currentAnswers.email,
      role: this.wizard.currentAnswers.role ?? null
    };


    this.innovationsService.createInnovationCollaborator(this.innovation.id, body).subscribe({
      next: () => {
        this.setRedirectAlertSuccess('Organisation suggestions sent', { message: 'Your suggestions were saved and notifications sent.' });
        this.redirectTo(this.baseUrl);
      },
      error: () => {
        // this.submitButton = { isActive: true, label: 'Confirm and notify organisations' };
        this.setAlertUnknownError();
      }
    });

  }

}
