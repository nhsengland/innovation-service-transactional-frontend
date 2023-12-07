import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';

import { CoreComponent } from '@app/base';
import { FormEngineComponent, WizardEngineModel } from '@app/base/forms';

import { OrganisationsService } from '@modules/shared/services/organisations.service';

import { AdminUsersService } from '@modules/feature-modules/admin/services/users.service';

import { OutboundPayloadType, WIZARD_ADD_ROLE } from './role-new.config';

@Component({
  selector: 'app-admin-pages-users-role-new',
  templateUrl: './role-new.component.html'
})
export class PageRoleNewComponent extends CoreComponent implements OnInit {
  @ViewChild(FormEngineComponent) formEngineComponent?: FormEngineComponent;

  submitButton = { isActive: true, label: 'Confirm and add role' };

  pageData: {
    flags: {
      isBaseCreate: boolean;
      isUnitCreate: boolean;
    };
    params: {
      organisationId?: string;
      unitId?: string;
      userId: string;
    };
  };

  wizard = new WizardEngineModel(WIZARD_ADD_ROLE);

  constructor(
    private organisationsService: OrganisationsService,
    private usersService: AdminUsersService,
    private activatedRoute: ActivatedRoute
  ) {
    super();

    const isUnitCreate =
      !!this.activatedRoute.snapshot.queryParams.organisationId && !!this.activatedRoute.snapshot.queryParams.unitId;

    this.pageData = {
      flags: {
        isBaseCreate: !isUnitCreate,
        isUnitCreate
      },
      params: {
        organisationId: this.activatedRoute.snapshot.queryParams.organisationId,
        unitId: this.activatedRoute.snapshot.queryParams.unitId,
        userId: this.activatedRoute.snapshot.params.userId
      }
    };

    this.setBackLink('Go back', this.onSubmitStep.bind(this, 'previous'));
  }

  ngOnInit(): void {
    forkJoin([
      this.usersService.getUserInfo(this.pageData.params.userId),
      this.organisationsService.getOrganisationsList({ unitsInformation: true, withInactive: true })
    ]).subscribe({
      next: ([user, orgs]) => {
        const organisations = orgs.map(o => ({
          id: o.id,
          name: o.name,
          units: o.organisationUnits.map(u => ({ id: u.id, name: u.name }))
        }));

        this.wizard
          .setInboundParsedAnswers({
            email: user.email,
            name: user.name,
            userRoles: user.roles.map(r => ({
              role: r.role,
              orgId: r.organisation?.id,
              unitId: r.organisationUnit?.id
            })),
            organisations,

            ...(this.pageData.flags.isUnitCreate
              ? { organisationId: this.pageData.params.organisationId, unitId: this.pageData.params.unitId }
              : {})
          })
          .runRules();
        this.setPageTitle(this.wizard.currentStepTitle(), { showPage: false });
        this.setPageStatus('READY');
      },
      error: () => {
        this.setPageStatus('ERROR');
        this.logger.error('Error fetching users, organisations and units');
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
        if (this.wizard.isFirstStep()) {
          this.goBackOrCancel();
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

    if (this.wizard.isQuestionStep()) {
      this.setPageTitle(this.wizard.currentStepTitle(), { showPage: false });
    } else {
      this.setPageTitle('Check your answers', { size: 'l' });
    }
  }

  onSubmitWizard(): void {
    this.submitButton = { isActive: false, label: 'Saving...' };

    const body = this.wizard.runOutboundParsing() as OutboundPayloadType;

    this.usersService.addRoles(this.pageData.params.userId, body).subscribe({
      next: response => {
        if (response.length > 0) {
          if (this.pageData.flags.isUnitCreate) {
            this.setRedirectAlertSuccess('A new user has been added to the unit');
          } else {
            this.setRedirectAlertSuccess('A new role has been added to the user');
          }
          this.goBackOrCancel();
        }
      },
      error: () => {
        this.setPageStatus('ERROR');
        this.setAlertUnknownError();
      }
    });
  }

  goBackOrCancel(): void {
    if (this.pageData.flags.isBaseCreate) {
      this.redirectTo(`/admin/users/${this.pageData.params.userId}`);
    }
    if (this.pageData.flags.isUnitCreate) {
      this.redirectTo(
        `/admin/organisations/${this.pageData.params.organisationId}/unit/${this.pageData.params.unitId}`
      );
    }
  }
}
