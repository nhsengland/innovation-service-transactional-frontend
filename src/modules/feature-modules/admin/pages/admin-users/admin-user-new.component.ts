import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

import { CoreComponent } from '@app/base';
import { FormEngineComponent, FormGroup, WizardEngineModel } from '@app/base/forms';

import { ServiceUsersService } from '@modules/feature-modules/admin/services/service-users.service';

import { CREATE_NEW_USER_QUESTIONS } from './admin-user-new.config';


@Component({
  selector: 'app-admin-pages-admin-users-admin-user-new',
  templateUrl: './admin-user-new.component.html'
})
export class PageAdminUserNewComponent extends CoreComponent implements OnInit {

  @ViewChild(FormEngineComponent) formEngineComponent?: FormEngineComponent;

  wizard: WizardEngineModel = new WizardEngineModel(CREATE_NEW_USER_QUESTIONS);

  constructor(
    private serviceUsersService: ServiceUsersService
  ) {
    super();
    this.setPageTitle('Create new admin');
  }

  ngOnInit(): void {

    // Adds async email validator to the second step.
    this.wizard.steps[0].parameters[0].validations = { ...this.wizard.steps[0].parameters[0].validations, async: [this.serviceUsersService.userEmailValidator()] };

    this.setPageStatus('READY');

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

    this.serviceUsersService.createUser(body).subscribe({
      next: response => this.redirectTo(`admin/administration-users/${response.id}`, { alert: 'adminCreationSuccess' }),
      error: () => {
        this.setPageStatus('ERROR');
        this.setAlertUnknownError();
      }
    });

  }

}
