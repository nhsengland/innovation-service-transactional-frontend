import { Component, OnInit, ViewChild } from '@angular/core';

import { CoreComponent, FormGroup, FormControl } from '@app/base';
import { AlertType } from '@app/base/models';
import { FormEngineComponent, WizardEngineModel } from '@app/base/forms';

import { OrganisationsService } from '@modules/shared/services/organisations.service';
import { ServiceUsersService } from '@modules/feature-modules/admin/services/service-users.service';

import { CREATE_NEW_USER_QUESTIONS } from './admin-users-new.config';


@Component({
  selector: 'app-admin-pages-admin-users-new',
  templateUrl: './admin-users-new.component.html'
})
export class PageAdminUsersNewComponent extends CoreComponent implements OnInit {

  @ViewChild(FormEngineComponent) formEngineComponent?: FormEngineComponent;

  alert: AlertType = { type: null };

  wizard: WizardEngineModel = new WizardEngineModel(CREATE_NEW_USER_QUESTIONS);

  submitBtnClicked = false;

  pageStep: 'RULES_LIST' | 'CODE_REQUEST' | 'SUCCESS' = 'RULES_LIST';

  securityConfirmation = { id: '', code: '' };

  form = new FormGroup({
    code: new FormControl('')
  }, { updateOn: 'blur' });

  constructor(
    private organisationsService: OrganisationsService,
    private serviceUsersService: ServiceUsersService
  ) {

    super();
    this.setPageTitle('Create new admin');
  }

  ngOnInit(): void {

    // Adds async e-mail validator to the second step.
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

    this.focusBody();

  }

  onSubmitWizard(): void {

    this.submitBtnClicked = true;
    const body = this.wizard.runOutboundParsing();
    this.securityConfirmation.code = this.form.get('code')!.value;
    this.serviceUsersService.createUser(body, this.securityConfirmation).subscribe(
      response => {
        this.redirectTo(`admin/administration-users/${response.id}`, { alert: 'adminCreationSuccess' });
      },
      (error) => {
        this.submitBtnClicked = false;

        if (!this.securityConfirmation.id && error.id) {
          this.securityConfirmation.id = error.id;
          this.pageStep = 'CODE_REQUEST';

        } else {

          this.form.get('code')!.setErrors({ customError: true, message: 'The code is invalid. Please, verify if you are entering the code received on your e-mail' });

        }

      }
    );

  }

}
