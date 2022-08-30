import { Component, OnInit, ViewChild } from '@angular/core';

import { CoreComponent } from '@app/base';
import { FormControl, FormEngineComponent, FormGroup, WizardEngineModel } from '@app/base/forms';

import { CreateOrganisationBodyDTO, OrganisationsService } from '@modules/feature-modules/admin/services/organisations.service';

import { CREATE_NEW_ORGANISATION_QUESTIONS } from './organisation-new.config';


@Component({
  selector: 'app-admin-pages-organisations-organisations-new',
  templateUrl: './organisation-new.component.html'
})

export class PageOrganisationNewComponent extends CoreComponent implements OnInit {

  @ViewChild(FormEngineComponent) formEngineComponent?: FormEngineComponent;

  wizard: WizardEngineModel = new WizardEngineModel(CREATE_NEW_ORGANISATION_QUESTIONS);

  submitBtnClicked = false;

  pageStep: 'RULES_LIST' | 'CODE_REQUEST' | 'SUCCESS' = 'RULES_LIST';

  securityConfirmation = { id: '', code: '' };

  form = new FormGroup({
    code: new FormControl('')
  }, { updateOn: 'blur' });

  constructor(
    private organisationsService: OrganisationsService,
  ) {

    super();
    this.setPageTitle('New Organisation');
  }

  ngOnInit(): void {

    this.organisationsService.getOrganisationsList({ onlyActive: false }).subscribe(
      response => {

        const organisationsList = response.map(o => ({ acronym: o.acronym, name: o.name, units: o.organisationUnits.map(u => ({ acronym: u.acronym, name: u.name })) }));

        this.wizard.gotoStep(1).setAnswers(this.wizard.runInboundParsing({ organisationsList })).runRules();
        this.wizard.steps[0].parameters[0].validations = { ...this.wizard.steps[0].parameters[0].validations, existsIn: [response.map(e => e.name), 'Organisation name already exists'] };
        this.wizard.steps[1].parameters[0].validations = { ...this.wizard.steps[1].parameters[0].validations, existsIn: [response.map(e => e.acronym), 'Organisation acronym already exists'] };

        this.setPageStatus('READY');
      },
      () => {
        this.setPageStatus('READY');
        this.logger.error('Error fetching organisations units');
      });

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
        if (this.wizard.isFirstStep()) { this.redirectTo(`organisations`); }
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

    const data = this.wizard.runOutboundParsing();

    const body: CreateOrganisationBodyDTO = {
      name: data.name,
      acronym: data.acronym,
      units: data.units
    };

    this.organisationsService.createOrganisation(body).subscribe(
      response => {
        this.redirectTo(`admin/organisations/${response.id}`, { alert: 'organisationCreationSuccess' });
      },
      // error => this.errorResponse(error)
    );

  }

}
