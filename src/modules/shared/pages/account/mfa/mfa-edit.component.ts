import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoreComponent } from '@app/base';
import { FormEngineComponent, WizardEngineModel } from '@modules/shared/forms';
import { UsersService } from '@modules/shared/services/users.service';
import { AuthenticationService } from '@modules/stores';
import { MFAInfoDTO } from '@modules/stores/authentication/authentication.service';
import { combineLatest, Observable } from 'rxjs';
import { MFA_EMAIL, MFA_PHONE, MFA_SET_UP, MFA_TURN_OFF, MFAWizardModeType } from './mfa-edit.config';

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
  userId: string | null = null;
  userEmail: string;
  newPhoneNumber: string = '';
  manageAccountPageUrl: string;

  // Configurations
  getUserMFAInfo: () => Observable<MFAInfoDTO>;
  updateUserMFAInfo: (mfaInfo: MFAInfoDTO) => Observable<any>;

  isAdmin = this.stores.authentication.isAdminRole();

  constructor(
    private activatedRoute: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private usersService: UsersService
  ) {
    super();

    if (this.isAdmin) {
      const user = this.activatedRoute.snapshot.data.user;
      if (!user.id) {
        throw new Error(
          'User ID to be changed is required for admin users. Ensure it is provided when instantiating this component.'
        );
      }

      this.userEmail = user.email;
      this.userId = user.id;
      this.manageAccountPageUrl = `/admin/users/${this.userId}/manage`;
      this.getUserMFAInfo = this.usersService.getUserMFAInfo(user.id).bind(this.usersService);
      this.updateUserMFAInfo = this.usersService.updateUserMFAInfo(user.id).bind(this.usersService);
    } else {
      this.userEmail = this.stores.authentication.getUserInfo().email;
      this.manageAccountPageUrl = `${this.stores.authentication.userUrlBasePath()}/account/manage-account`;
      this.getUserMFAInfo = this.authenticationService.getUserMFAInfo.bind(this.authenticationService);
      this.updateUserMFAInfo = this.authenticationService.updateUserMFAInfo.bind(this.authenticationService);
    }
  }

  ngOnInit(): void {
    this.setPageStatus('LOADING');

    combineLatest([this.activatedRoute.queryParams, this.getUserMFAInfo()]).subscribe({
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
        this.wizard = new WizardEngineModel(MFA_SET_UP(this.isAdmin));
        break;
      case 'turn-off':
        this.wizard = new WizardEngineModel(MFA_TURN_OFF(this.isAdmin));
        break;
      case 'email':
        this.wizard = new WizardEngineModel(MFA_EMAIL(this.isAdmin));
        break;
      case 'phone':
        this.wizard = new WizardEngineModel(MFA_PHONE(this.isAdmin));
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
    const wizardData = this.wizard.runOutboundParsing() as { mfaInfo: MFAInfoDTO; turnOff: boolean };

    this.formButton.isActive = false;

    if (this.wizardMode === 'turn-off' && wizardData.turnOff === false) {
      this.redirectTo(this.manageAccountPageUrl);
      return;
    }

    this.updateUserMFAInfo(wizardData.mfaInfo).subscribe({
      next: _response => {
        if (wizardData.mfaInfo.type === 'phone') {
          this.setRedirectAlertSuccess(
            this.currentMFAMode === 'phone'
              ? `${this.isAdmin ? 'Phone' : 'Your phone'} number has been changed to ${getCensoredPhoneNumber(wizardData.mfaInfo.phoneNumber)}`
              : this.wizardMode === 'phone'
                ? `${this.isAdmin ? 'Two-step' : 'Your two-step'} verification method has been changed to phone`
                : `You have set up two-step verification on ${this.isAdmin ? 'their' : 'your'} account`,
            {
              message: `A security code will be sent to ${this.isAdmin ? "the user's" : 'your'} phone when you log in to your account.`
            }
          );
        }

        if (wizardData.mfaInfo.type === 'email') {
          this.setRedirectAlertSuccess(
            this.currentMFAMode === 'phone'
              ? `${this.isAdmin ? 'Two-step' : 'Your two-step'} verification method has been changed to email`
              : `You have set up two-step verification on ${this.isAdmin ? 'their' : 'your'} account`,
            {
              message: `A security code will be sent to ${this.isAdmin ? "the user's" : 'your'} email when you log in to your account.`
            }
          );
        }

        if (wizardData.mfaInfo.type === 'none') {
          this.setRedirectAlertSuccess(
            `You have turned off two-step verification on ${this.isAdmin ? 'their' : 'your'} account`,
            {
              message: `${this.isAdmin ? 'They' : 'You'} will only use ${this.isAdmin ? 'their' : 'your'} password to log in.`
            }
          );
        }
        this.redirectTo(this.manageAccountPageUrl);
      },
      error: ({ error: err }: HttpErrorResponse) => {
        this.formButton.isActive = true;
        this.setAlertError(err.message, { width: '2.thirds' });
      }
    });
  }
}

export function getCensoredPhoneNumber(number: string | undefined): string {
  return number ? `${number.replace(/ /g, '').slice(0, -3).replace(/./g, '*')}${number.slice(-3)}` : '*****';
}
