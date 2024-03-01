import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoreComponent } from '@app/base';
import { FormEngineComponent, WizardEngineModel } from '@modules/shared/forms';
import { MFA_EMAIL, MFA_PHONE, MFA_SET_UP, MFA_TURN_OFF, MFAWizardModeType } from './mfa-edit.config';
import { AuthenticationService } from '@modules/stores';
import { MFAInfoDTO } from '@modules/stores/authentication/authentication.service';
import { combineLatest, forkJoin } from 'rxjs';

export type CurrentMFAModeType = 'phone' | 'email' | 'none';

@Component({
  selector: 'shared-pages-account-mfa-edit',
  templateUrl: './mfa-edit.component.html'
})
export class PageAccountMFAEditComponent extends CoreComponent implements OnInit {
  @ViewChild(FormEngineComponent) formEngineComponent?: FormEngineComponent;
  @Input({ required: true }) currentMFAMode: CurrentMFAModeType = 'none';

  wizard = new WizardEngineModel({});

  showItems: boolean = true;
  formButton = { isActive: true, label: 'Continue' };
  wizardMode: MFAWizardModeType = 'set-mfa';
  userEmail: string = this.stores.authentication.getUserInfo().email;
  newPhoneNumber: string = '';
  manageAccountPageUrl = `${this.stores.authentication.userUrlBasePath()}/account/manage-account`;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authenticationService: AuthenticationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.setPageStatus('LOADING');

    combineLatest([this.activatedRoute.queryParams, this.authenticationService.getUserMFAInfo()]).subscribe({
      next: ([queryParams, mfaInfo]) => {
        if (!queryParams.mode) {
          this.redirectTo(this.manageAccountPageUrl);
        } else {
          this.wizardMode = queryParams.mode;
          this.currentMFAMode = mfaInfo.type;

          this.setupWizard();
        }
        this.setPageStatus('READY');
      }
    });
  }

  setupWizard(): void {
    switch (this.wizardMode) {
      case 'set-mfa':
        this.wizard = new WizardEngineModel(MFA_SET_UP);
        break;
      case 'turn-off':
        this.wizard = new WizardEngineModel(MFA_TURN_OFF);
        break;
      case 'email':
        this.wizard = new WizardEngineModel(MFA_EMAIL);
        break;
      case 'phone':
        this.wizard = new WizardEngineModel(MFA_PHONE);
        break;
      default:
        this.redirectTo(this.manageAccountPageUrl);
    }

    this.wizard
      .setAnswers(
        this.wizard.runInboundParsing({
          userEmail: this.userEmail,
          wizardMode: this.wizardMode,
          currentMFAMode: this.currentMFAMode
        })
      )
      .runRules();

    this.formButton.label = this.wizard.isLastStep() ? 'Save' : 'Continue';

    this.setPageTitle(this.wizard.currentStepTitle());
  }

  onSubmitStep(action: 'previous' | 'next'): void {
    const formData = this.formEngineComponent?.getFormValues() ?? { valid: false, data: {} };

    if (action === 'next' && !formData.valid) {
      // Don't move forward if step is NOT valid.
      return;
    }

    this.wizard.addAnswers(formData.data).runRules();

    if (this.wizard.isLastStep()) {
      this.onSubmitWizard();
    } else {
      this.wizard.currentStepTitle;
      switch (action) {
        case 'previous':
          if (this.wizard.isFirstStep()) {
            return;
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

      this.setPageTitle(this.wizard.currentStepTitle());

      this.formButton.label = this.wizard.isLastStep() ? 'Save' : 'Continue';
    }
  }

  onSubmitWizard() {
    const wizardData = this.wizard.runOutboundParsing() as MFAInfoDTO;
    this.formButton.isActive = false;

    this.authenticationService.updateUserMFAInfo(wizardData).subscribe({
      next: response => {
        if (wizardData.type === 'phone') {
          this.setRedirectAlertSuccess(
            this.currentMFAMode === 'phone'
              ? `Your phone number has been changed to ${getCensoredPhoneNumber(wizardData.phoneNumber)}`
              : this.wizardMode === 'phone'
                ? 'Your two-step verification method has been changed to phone'
                : 'You have set up two-step verification on your account',
            {
              message: 'A security code will be sent to your phone when you log in to your account.'
            }
          );
        }

        if (wizardData.type === 'email') {
          this.setRedirectAlertSuccess(
            this.currentMFAMode === 'phone'
              ? 'Your two-step verification method has been changed to email'
              : 'You have set up two-step verification on your account',
            {
              message: 'A security code will be sent to your email when you log in to your account. '
            }
          );
        }

        if (wizardData.type === 'none') {
          this.setRedirectAlertSuccess('You have turned off two-step verification on your account', {
            message: 'You will only use your password to log in.'
          });
        }
        this.redirectTo(this.manageAccountPageUrl);
      },
      error: () => {
        this.setPageStatus('ERROR');
        this.setAlertUnknownError();
      }
    });
  }
}

export function getCensoredPhoneNumber(number: string | undefined): string {
  return number ? `${number.replace(/ /g, '').slice(0, -3).replace(/./g, '*')}${number.slice(-3)}` : '*****';
}
