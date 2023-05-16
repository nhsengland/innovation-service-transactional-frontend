import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoreComponent } from '@app/base';
import { OrganisationErrorsEnum } from '@app/base/enums';
import { FormEngineComponent, WizardEngineModel } from '@app/base/forms';
import { AdminOrganisationsService } from '@modules/feature-modules/admin/services/admin-organisations.service';
import { ServiceUsersService } from '@modules/feature-modules/admin/services/service-users.service';
import { GetOrganisationUnitUserDTO, OrganisationsService } from '@modules/shared/services/organisations.service';
import { ORGANISATION_UNIT_USER_EDIT } from './organisation-unit-user-edit-wizard.config';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-admin-pages-organisation-unit-user-edit',
  templateUrl: './organisation-unit-user-edit.component.html'
})
export class PageOrganisationUnitUserEditComponent extends CoreComponent implements OnInit {

  @ViewChild(FormEngineComponent) formEngineComponent?: FormEngineComponent;

  organisationId: string;
  organisationUnitId: string;
  redirectUrl: string;
  organisationAcronym: string = '';
  organisationUnitAcronym: string = '';
  user: GetOrganisationUnitUserDTO | null = null;

  submitButton = { isActive: true, label: 'Confirm and add user' };
  continueButton = { isActive: true, label: 'Continue' };

  wizard: WizardEngineModel = new WizardEngineModel(ORGANISATION_UNIT_USER_EDIT);

  constructor(
    private activatedRoute: ActivatedRoute,
    private serviceUsersService: ServiceUsersService,
    private organisationsService: OrganisationsService,
    private adminOrganisationsService: AdminOrganisationsService
  ) {

    super();

    this.organisationId = this.activatedRoute.snapshot.params.organisationId;
    this.organisationUnitId = this.activatedRoute.snapshot.params.organisationUnitId;

    this.organisationAcronym = this.activatedRoute.snapshot.data.organisation.acronym;
    this.organisationUnitAcronym = this.activatedRoute.snapshot.data.organisationUnit.acronym;

    this.setBackLink('Go back', this.onSubmitStep.bind(this, 'previous'));

    this.redirectUrl = `/admin/organisations/${this.organisationId}/unit/${this.organisationUnitId}`;

  }

  ngOnInit() {
    this.setPageStatus('READY');
  }


  checkUserEmail(): void {

    this.user = null;
    this.continueButton = { isActive: false, label: 'Saving...' };

    this.organisationsService.getOrganisationUnitUserByEmail(this.organisationUnitId, this.wizard.currentAnswers.email).subscribe({
      next: user => {
        this.user = user;
        this.wizard.setAnswers(this.wizard.runInboundParsing(user)).runRules().gotoStep(3).nextStep();
        this.continueButton = { isActive: true, label: 'Continue' };
        this.submitButton = { isActive: true, label: 'Add user' };
      },
      error: ({ error: err }: HttpErrorResponse) => {

        this.continueButton = { isActive: true, label: 'Continue' };
        this.submitButton = { isActive: true, label: 'Confirm and add user' };

        if (err.error === OrganisationErrorsEnum.ORGANISATION_USER_NOT_FOUND ) {
          this.wizard.addAnswers({ name: '', role: null }).runRules();
          this.onSubmitStep();
        }
        else if (err.error === OrganisationErrorsEnum.ORGANISATION_UNIT_USER_CANT_BE_INNOVATOR) {
          this.setAlertError('The user cannot be an innovator');
        }
        else if(err.error === OrganisationErrorsEnum.ORGANISATION_USER_FROM_OTHER_ORG) {
          this.setAlertError('This user already exists on another organisation');
        }
        else if(err.error === OrganisationErrorsEnum.ORGANISATION_UNIT_USER_ALREADY_EXISTS ) {
          this.setAlertError('This user already exists on the organisation unit');
        }
        else {
          this.setAlertUnknownError();
        }
      }
    });

  }

  onSubmitStep(action?: 'previous' | 'next'): void {

    this.resetAlert();

    const formData = this.formEngineComponent?.getFormValues() ?? { valid: false, data: {} };

    if (action === 'next' && !formData.valid) {
      return;
    }

    this.wizard.addAnswers(formData.data).runRules();

    switch (action) {
      case 'previous':
        if (this.wizard.isFirstStep()) {
          this.redirectTo(this.redirectUrl);
        }
        else if (this.user && !this.user.role && this.wizard.currentStepId === 3) {
          this.wizard.nextStep();
        }
        else if (this.user && this.wizard.isSummaryStep()){
          this.wizard.gotoStep(1);
        }
        else {
          this.wizard.previousStep();
        }
        break;
      case 'next':
        if (this.wizard.isFirstStep()) {
          this.checkUserEmail();
        }
        else {
          this.wizard.nextStep();
        }
        break;
      default:
        this.wizard.nextStep();
        break;
    }

  }

  private onSubmitWizardSuccess(): void {
    this.setRedirectAlertSuccess('A new user has been added to this organisation unit.', {
      width: '2.thirds'
    });
    this.redirectTo(this.redirectUrl);
  }

  private onSubmitWizardError(): void {
    this.submitButton = { isActive: true, label: this.user ? 'Add user' : 'Confirm and add user'};
    this.setAlertUnknownError();
  }

  onSubmitWizard(): void {

    this.submitButton = { isActive: false, label: 'Saving...' };

    if (this.user) {

      const role = this.wizard.getAnswers().role;

      if (!role) {
        this.submitButton = { isActive: true, label: 'Add user' };

        this.setAlertError('', {
          itemsList: [{
            title: "Select a user role",
            callback: () => this.wizard.gotoStep(3),
          }]
        });

      }
      else {

        const body = { role: role }

        this.adminOrganisationsService.createUnitUser(this.organisationUnitId, this.user.id, body).subscribe({
          next: () => {
            this.onSubmitWizardSuccess();
          },
          error: () => {
            this.onSubmitWizardError();
          }
        });

      }
    }
    else {

      const body = {
        ...this.wizard.runOutboundParsing(),
        organisationAcronym: this.organisationAcronym,
        organisationUnitAcronym: this.organisationUnitAcronym
      }

      this.serviceUsersService.createUser(body).subscribe({
        next: () => {
          this.onSubmitWizardSuccess();
        },
        error: () => {
          this.onSubmitWizardError();
        }
      });

    }

  }

}
