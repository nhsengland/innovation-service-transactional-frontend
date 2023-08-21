import { Component, OnInit, ViewChild } from '@angular/core';

import { CoreComponent } from '@app/base';
import { UserRoleEnum } from '@app/base/enums';
import { FormEngineComponent, WizardEngineModel } from '@app/base/forms';
import { UserInfo } from '@modules/shared/dtos/users.dto';

import { OrganisationsService } from '@modules/shared/services/organisations.service';
import { AdminUsersService } from '../../services/admin-users.service';
import { ServiceUsersService } from '../../services/service-users.service';

import { CREATE_NEW_USER_QUESTIONS, OutboundPayloadType } from './user-new.config';

@Component({
  selector: 'app-admin-pages-users-user-new',
  templateUrl: './user-new.component.html',
})
export class PageUserNewComponent extends CoreComponent implements OnInit {
  @ViewChild(FormEngineComponent) formEngineComponent?: FormEngineComponent;

  user: null | (UserInfo & { rolesDescription: string[] }) = null;

  submitButton = { isActive: true, label: 'Confirm and add user' };
  continueButton = { isActive: true, label: 'Continue' };

  wizard: WizardEngineModel = new WizardEngineModel(CREATE_NEW_USER_QUESTIONS);

  constructor(
    private adminUsersService: AdminUsersService,
    private organisationsService: OrganisationsService,
    private usersService: ServiceUsersService
  ) {
    super();
    this.setBackLink('Go back', this.onSubmitStep.bind(this, 'previous'));
  }

  ngOnInit(): void {

    this.organisationsService
      .getOrganisationsList({ unitsInformation: true, withInactive: true })
      .subscribe({
        next: (response) => {
          const organisationsList = response.map((o) => ({
            id: o.id,
            name: o.name,
            units: o.organisationUnits.map((u) => ({ id: u.id, name: u.name })),
          }));
          this.wizard.setInboundParsedAnswers({ organisationsList }).runRules();
          this.wizard.gotoStep(1);
          this.setPageTitle(this.wizard.currentStepTitle(), { showPage: false });
          this.setPageStatus('READY');
        },
        error: () => {
          this.setPageStatus('ERROR');
          this.logger.error('Error fetching organisations units');
        },
      });

  }

  checkUserEmail(): void {

    this.user = null;

    this.setPageStatus('LOADING');

    this.usersService.getUserInfo(this.wizard.currentAnswers.email).subscribe({
      next: (response) => {
        this.user = {
          ...response,
          rolesDescription: response.roles.map(r => {
            let roleDescription = this.stores.authentication.getRoleDescription(r.role);
            if (r.role === UserRoleEnum.ASSESSMENT && r.displayTeam) {
              roleDescription = `${roleDescription} (${r.displayTeam})`;
            }
            if (r.role === UserRoleEnum.QUALIFYING_ACCESSOR || r.role === UserRoleEnum.ACCESSOR) {
              roleDescription = `${roleDescription} (${r.organisationUnit?.name})`;
            }
            return roleDescription;
          })
        };

        this.setPageTitle('This user already exists on the service', { size: 'l' });
        this.setPageStatus('READY');
      },
      error: (e) => {
        if (e.status === 404) {
          this.wizard.nextStep();
          this.setPageTitle(this.wizard.currentStepTitle(), { showPage: false });
          this.setPageStatus('READY');
        }
        else {
          this.setPageStatus('ERROR');
          this.setAlertUnknownError();
        }
      },
    });

  }

  onGotoStep(stepNumber: number): void {

    this.wizard.gotoStep(stepNumber);
    this.resetAlert();
    this.setPageTitle(this.wizard.currentStepTitle(), { showPage: false });

  }

  onSubmitStep(action: 'previous' | 'next'): void {

    const formData = this.formEngineComponent?.getFormValues() ?? { valid: false, data: {} };

    if (action === 'next' && !formData.valid) { // Don't move forward if step is NOT valid.
      return;
    }

    this.wizard.addAnswers(formData.data).runRules();

    switch (action) {
      case 'previous':
        if (this.user) {
          this.user = null;
        }
        else if (this.wizard.isFirstStep()) {
          this.redirectTo('/admin/users');
        } else {
          this.wizard.previousStep();
        }
        break;
      case 'next':
        if (this.wizard.isFirstStep()) {
          this.checkUserEmail();
          return;
        } else {
          this.wizard.nextStep();
        }
        break;
      default: // Should NOT happen!
        break;
    }

    if (this.wizard.isQuestionStep()) {
      this.setPageTitle(this.wizard.currentStepTitle(), { showPage: false });
    } else {
      this.setPageTitle('Check your answers', { size: 'l' });
    }

  }

  onSubmitWizard(): void {

    this.submitButton = { isActive: false, label: 'Saving...' };

    const body = this.wizard.runOutboundParsing() as OutboundPayloadType;

    this.adminUsersService.createUser(body).subscribe({
      next: (response) => {
        this.redirectTo(`/admin/users/${response.id}`, {
          alert: 'userCreationSuccess',
        });
      },
      error: () => {
        this.setPageStatus('ERROR');
        this.setAlertUnknownError();
      },
    });

  }
}
