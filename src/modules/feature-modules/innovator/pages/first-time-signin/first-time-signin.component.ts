import { Component, OnInit, ViewChild } from '@angular/core';
import { of } from 'rxjs';
import { concatMap } from 'rxjs/operators';

import { CoreComponent } from '@app/base';
import { FormEngineComponent, WizardEngineModel } from '@app/base/forms';

import { UtilsHelper } from '@modules/core/helpers/utils.helper';
import { FIRST_TIME_SIGNIN_QUESTIONS } from './first-time-signin.config';

@Component({
  selector: 'app-innovator-pages-first-time-signin',
  templateUrl: './first-time-signin.component.html'
})
export class FirstTimeSigninComponent extends CoreComponent implements OnInit {
  @ViewChild(FormEngineComponent) formEngineComponent?: FormEngineComponent;

  wizard: WizardEngineModel = new WizardEngineModel({});
  isSaving = false;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.wizard = FIRST_TIME_SIGNIN_QUESTIONS;
    this.wizard.setAnswers(this.wizard.runInboundParsing({})).runRules();

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
          this.redirectTo(`innovator`);
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

    if (!this.wizard.isFirstStep()) {
      this.setBackLink('Go back', this.onSubmitStep.bind(this, 'previous'));
    } else {
      this.resetBackLink();
    }
  }

  onSubmitWizard(): void {
    this.isSaving = true;
    const wizardData = this.wizard.runOutboundParsing();

    of(true)
      .pipe(
        concatMap(() =>
          this.ctx.user.updateUserInfo$({
            displayName: wizardData.innovatorName,
            mobilePhone: UtilsHelper.isEmpty(wizardData.mobilePhone) ? null : wizardData.mobilePhone,

            organisation: wizardData.organisation
              ? {
                  id: this.ctx.user.getUserInfo().organisations[0].id,
                  isShadow: false,
                  name: wizardData.organisation.name,
                  size: wizardData.organisation.size,
                  description: wizardData.organisation.description,
                  registrationNumber: wizardData.organisation.registrationNumber
                }
              : {
                  id: this.ctx.user.getUserInfo().organisations[0].id,
                  isShadow: true
                },
            howDidYouFindUsAnswers: wizardData.howDidYouFindUsAnswers
          })
        ),

        // Initialize authentication in order to update First Time SignIn information.
        // TODO: try to remove this by updating the state when calling updateUserInfo$
        concatMap(() => this.ctx.user.initializeAuthentication$())
      )
      .subscribe({
        next: () => {
          this.redirectTo(`innovator/dashboard`, { alert: 'alertDisabled' });
          this.isSaving = false;
        },
        error: () => {
          this.setAlertUnknownError();
          this.isSaving = false;
        }
      });
  }
}
