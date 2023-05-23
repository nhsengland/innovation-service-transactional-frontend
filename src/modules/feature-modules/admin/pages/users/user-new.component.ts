import { Component, OnInit, ViewChild } from '@angular/core';

import { CoreComponent } from '@app/base';
import { FormEngineComponent, WizardEngineModel } from '@app/base/forms';

import { OrganisationsService } from '@modules/shared/services/organisations.service';
import { UsersService } from '@modules/shared/services/users.service';
import { AdminUsersService } from '../../services/admin-users.service';

import { CREATE_NEW_USER_QUESTIONS } from './user-new.config';


@Component({
  selector: 'app-admin-pages-users-user-new',
  templateUrl: './user-new.component.html'
})
export class PageUserNewComponent extends CoreComponent implements OnInit {

  @ViewChild(FormEngineComponent) formEngineComponent?: FormEngineComponent;

  wizard: WizardEngineModel = new WizardEngineModel(CREATE_NEW_USER_QUESTIONS);

  constructor(
    private adminUsersService: AdminUsersService,
    private usersService: UsersService,
    private organisationsService: OrganisationsService
  ) {
    super();
    this.setPageTitle('Create new user');
  }

  ngOnInit(): void {

    // Adds async email validator to the second step.
    this.wizard.steps[1].parameters[0].validations = { ...this.wizard.steps[1].parameters[0].validations, async: [this.usersService.userEmailValidator()] };

    this.organisationsService.getOrganisationsList({ unitsInformation: true, withInactive: true }).subscribe({
      next: response => {
        const organisationsList = response.map(o => ({ acronym: o.acronym, name: o.name, units: o.organisationUnits.map(u => ({ acronym: u.acronym, name: u.name })) }));
        this.wizard.gotoStep(1).setAnswers(this.wizard.runInboundParsing({ organisationsList })).runRules();
        this.setPageStatus('READY');
      },
      error: () => {
        this.setPageStatus('ERROR');
        this.logger.error('Error fetching organisations units');
      }
    });

  }


  onSubmitStep(action: 'previous' | 'next'): void {

    const formData = this.formEngineComponent?.getFormValues() || { valid: false, data: {} };

    if (action === 'next' && !formData.valid) { // Don't move forward if step is NOT valid.
      return;
    }

    this.wizard.addAnswers(formData.data).runRules();

    switch (action) {
      case 'previous':
        if (this.wizard.isFirstStep()) { this.redirectTo(`innovator`); }
        else { this.wizard.previousStep(); }
        break;
      case 'next':
        this.wizard.nextStep();
        break;
      default: // Should NOT happen!
        break;
    }

  }

  onSubmitWizard(): void {

    const body = this.wizard.runOutboundParsing();

    this.adminUsersService.createUser(body).subscribe({
      next: response => this.redirectTo(`/admin/users/${response.id}`, { alert: 'userCreationSuccess' }),
      error: () => {
        this.setPageStatus('ERROR');
        this.setAlertUnknownError();
      }
    });

  }

}
