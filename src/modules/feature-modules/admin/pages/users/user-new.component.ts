import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { UserRoleEnum } from '@app/base/enums';
import { FormEngineComponent, WizardEngineModel } from '@app/base/forms';

import { UserInfo } from '@modules/shared/dtos/users.dto';
import { OrganisationsService } from '@modules/shared/services/organisations.service';

import { UserInformationComponentState } from '../../components/user-information.component';
import { AdminUsersService } from '../../services/users.service';
import { OutboundPayloadType, WIZARD_CREATE_USER } from './user-new.config';

@Component({
  selector: 'app-admin-pages-users-user-new',
  templateUrl: './user-new.component.html'
})
export class PageUserNewComponent extends CoreComponent implements OnInit {
  @ViewChild(FormEngineComponent) formEngineComponent?: FormEngineComponent;

  user: null | (UserInfo & { rolesDescription: string[] }) = null;

  submitButton = { isActive: true, label: 'Confirm and add user' };
  continueButton = { isActive: true, label: 'Continue' };

  pageData: {
    flags: {
      isBaseCreate: boolean;
      isTeamCreate: boolean;
      isUnitCreate: boolean;
    };
    queryParams: {
      organisationId?: string;
      unitId?: string;
      team: UserRoleEnum.ASSESSMENT | UserRoleEnum.ADMIN;
    };
  };

  wizard = new WizardEngineModel(WIZARD_CREATE_USER);

  constructor(
    private organisationsService: OrganisationsService,
    private usersService: AdminUsersService,
    private activatedRoute: ActivatedRoute
  ) {
    super();

    const isTeamCreate = !!this.activatedRoute.snapshot.queryParams.team;
    const isUnitCreate =
      !!this.activatedRoute.snapshot.queryParams.organisationId && !!this.activatedRoute.snapshot.queryParams.unitId;

    this.pageData = {
      flags: {
        isBaseCreate: !isTeamCreate && !isUnitCreate,
        isTeamCreate,
        isUnitCreate
      },
      queryParams: {
        organisationId: this.activatedRoute.snapshot.queryParams.organisationId,
        unitId: this.activatedRoute.snapshot.queryParams.unitId,
        team: this.activatedRoute.snapshot.queryParams.team
      }
    };

    this.setBackLink('Go back', this.onSubmitStep.bind(this, 'previous'));
  }

  ngOnInit(): void {
    // Creating a user from the NA/Admin team
    if (this.pageData.flags.isTeamCreate) {
      this.wizard.setInboundParsedAnswers({ contextType: 'TEAM', role: this.pageData.queryParams.team }).runRules();

      this.setPageTitle(this.wizard.currentStepTitle(), { showPage: false });
      this.setPageStatus('READY');
      return;
    }

    // Creating a user from Base or Unit
    this.organisationsService.getOrganisationsList({ unitsInformation: true, withInactive: true }).subscribe({
      next: response => {
        const organisations = response.map(o => ({
          id: o.id,
          name: o.name,
          units: o.organisationUnits.map(u => ({ id: u.id, name: u.name }))
        }));

        // Creating a user from the unit
        if (this.pageData.flags.isUnitCreate) {
          this.wizard.setInboundParsedAnswers({
            contextType: 'UNIT',
            organisations,
            organisationId: this.pageData.queryParams.organisationId,
            unitIds: [this.pageData.queryParams.unitId]
          });
        } else {
          this.wizard.setInboundParsedAnswers({ contextType: 'BASE', organisations });
        }

        this.wizard.runRules();
        this.setPageTitle(this.wizard.currentStepTitle(), { showPage: false });
        this.setPageStatus('READY');
      },
      error: () => {
        this.setPageStatus('ERROR');
        this.logger.error('Error fetching organisations and units');
      }
    });
  }

  checkUserEmail(): void {
    this.user = null;

    this.setPageStatus('LOADING');

    this.usersService.getUserInfo(this.wizard.currentAnswers.email).subscribe({
      next: response => {
        this.user = {
          ...response,
          rolesDescription: response.roles.map(r => {
            let roleDescription = this.ctx.user.getRoleDescription(r.role);
            if (r.displayTeam) {
              roleDescription += ` (${r.displayTeam})`;
            }
            return roleDescription;
          })
        };

        this.setPageTitle('This user already exists on the service', { size: 'l' });
        this.setPageStatus('READY');
      },
      error: e => {
        if (e.status === 404) {
          this.wizard.nextStep();
          this.setPageTitle(this.wizard.currentStepTitle(), { showPage: false });
          this.setPageStatus('READY');
        } else {
          this.setPageStatus('ERROR');
          this.setAlertUnknownError();
        }
      }
    });
  }

  onGotoStep(stepNumber: number): void {
    this.wizard.gotoStep(stepNumber);
    this.resetAlert();
    this.setPageTitle(this.wizard.currentStepTitle(), { showPage: false });
  }

  onSubmitStep(action: 'previous' | 'next'): void {
    const formData = this.formEngineComponent?.getFormValues() ?? { valid: false, data: {} };

    if (action === 'next' && !formData.valid) {
      // Don't move forward if step is NOT valid.
      return;
    }

    this.wizard.addAnswers(formData.data).runRules();

    switch (action) {
      case 'previous':
        if (this.user) {
          this.user = null;
        } else if (this.wizard.isFirstStep()) {
          this.goBackOrCancel();
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

    this.usersService.createUser(body).subscribe({
      next: response => {
        if (this.pageData.flags.isUnitCreate) {
          this.setRedirectAlertSuccess('A new user has been added to the unit');
          this.redirectTo(
            `/admin/organisations/${this.pageData.queryParams.organisationId}/unit/${this.pageData.queryParams.unitId}`
          );
        } else if (this.pageData.flags.isTeamCreate) {
          this.setRedirectAlertSuccess('A new user has been added to this team');
          this.redirectTo(`/admin/organisations/${this.pageData.queryParams.team}`);
        } else {
          this.redirectTo(`/admin/users/${response.id}`, { alert: 'userCreationSuccess' });
        }
      },
      error: () => {
        this.setPageStatus('ERROR');
        this.setAlertUnknownError();
      }
    });
  }

  handleComponentStateChange(state: UserInformationComponentState): void {
    switch (state.type) {
      case 'ERROR':
        this.setPageStatus('ERROR');
        this.setAlertUnknownError();
        break;

      case 'CANCEL':
        this.goBackOrCancel();
        break;

      case 'SUCCESS':
        if (state.alertMessage) {
          this.setRedirectAlertSuccess(state.alertMessage);
        }
        this.redirectTo(state.redirectTo, state.queryParams);
        break;

      case 'CHANGE_TITLE':
        this.setPageTitle(state.title, { size: 'l' });
        break;

      case 'PAGE_STATUS':
        this.setPageStatus(state.isLoading ? 'LOADING' : 'READY');
        break;
    }
  }

  goBackOrCancel(): void {
    if (this.pageData.flags.isBaseCreate) {
      this.redirectTo('/admin/users');
    }
    if (this.pageData.flags.isUnitCreate) {
      this.redirectTo(
        `/admin/organisations/${this.pageData.queryParams.organisationId}/unit/${this.pageData.queryParams.unitId}`
      );
    }
    if (this.pageData.flags.isTeamCreate) {
      this.redirectTo(`/admin/organisations/${this.pageData.queryParams.team}`);
    }
  }
}
