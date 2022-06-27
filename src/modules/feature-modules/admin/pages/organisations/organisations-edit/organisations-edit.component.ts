import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent, FormGroup, FormControl } from '@app/base';
import { AlertType, MappedObjectType } from '@app/base/types';
import { FormEngineComponent, WizardEngineModel } from '@modules/shared/forms';
import { OrganisationsService, updateOrganisationDTO } from '@modules/shared/services/organisations.service';
import { EDIT_ORGANISATIONS_QUESTIONS } from './organisations-edit.config';
import { EDIT_ORGANISATION_UNIT_QUESTIONS } from './organisationUnits-edit.config';

@Component({
  selector: 'app-admin-pages-organisations-edit',
  templateUrl: './organisations-edit.component.html'
})
export class PageAdminOrganisationEditComponent extends CoreComponent implements OnInit {

  orgId: string;
  unitId: string;
  submitBtnClicked = false;
  securityConfirmation = { id: '', code: '' };
  alert: AlertType = { type: null };

  module: 'Organisation' | 'Unit';
  pageStep: 'RULES_LIST' | 'CODE_REQUEST' | 'SUCCESS' = 'RULES_LIST';

  form = new FormGroup({
    code: new FormControl('')
  }, { updateOn: 'blur' });

  wizard: WizardEngineModel = new WizardEngineModel({});

  @ViewChild(FormEngineComponent) formEngineComponent?: FormEngineComponent;

  constructor(
    private activatedRoute: ActivatedRoute,
    private organisationsService: OrganisationsService
  ) {
    super();
    this.module = this.activatedRoute.snapshot.data.module;
    this.orgId = this.activatedRoute.snapshot.params.orgId;
    this.unitId = this.activatedRoute.snapshot.params.unitId;

    switch (this.module) {
      case 'Organisation':
        this.wizard = new WizardEngineModel(EDIT_ORGANISATIONS_QUESTIONS);
        break;
      case 'Unit':
        this.wizard = new WizardEngineModel(EDIT_ORGANISATION_UNIT_QUESTIONS);
        break;
      default:
      break;
    }

    this.setPageTitle(`Edit ${this.module}`);
  }

  ngOnInit(): void {
    this.organisationsService.getOrganisation(this.orgId).subscribe((organisation) => {
      const data = (this.module === 'Organisation') ? ({ name: organisation.name, acronym: organisation.acronym }) : organisation.organisationUnits.filter(unit => (unit.id === this.unitId))[0];
      this.wizard.gotoStep(1).setAnswers(this.wizard.runInboundParsing({ ...data })).runRules();
      this.setPageStatus('READY');
    },
      () => {
        this.setPageStatus('ERROR');
        this.alert = {
          type: 'ERROR',
          title: 'Unable to fetch organisations information',
          message: 'Please try again or contact us for further help'
        };
      }
    );

  }

  onSubmitStep(action: 'previous' | 'next'): void {

    const formData = this.formEngineComponent?.getFormValues() || { valid: false, data: {} };

    if (action === 'next' && !formData.valid) { // Don't move forward if step is NOT valid.
      return;
    }

    this.wizard.addAnswers(formData.data).runRules();

    switch (action) {
      case 'previous':
        if (this.wizard.isFirstStep()) { this.redirectTo(`organisations/${this.orgId}`); }
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
    const body: MappedObjectType = this.wizard.runOutboundParsing();
    this.securityConfirmation.code = this.form.get('code')!.value;
    this.submitBtnClicked = true;

    switch (this.module) {
      case 'Organisation':
        this.organisationsService.updateOrganisation(body, this.securityConfirmation, this.orgId).subscribe(
          response => {
            (response.id) ?
              this.redirectTo(`admin/organisations/${response.id}`, { alert: 'updateOrganisationSuccess' })
                : this.alert = { type: response.status as 'ERROR', title: response.error };
          },
          error => this.errorResponse(error)
        );
        break;
      case 'Unit':
        this.organisationsService.updateUnit(body, this.securityConfirmation, this.unitId).subscribe(
          response => {
            (response.id) ?
            this.redirectTo(`admin/organisations/${this.orgId}`, { alert: 'updateUnitSuccess' })
              : this.alert = { type: response.status as 'ERROR', title: response.error };
          },
          error => this.errorResponse(error)
        );
        break;
      default:
      break;
    }

  }

  errorResponse(error: updateOrganisationDTO): void {
    this.submitBtnClicked = false;

    if (!this.securityConfirmation.id && error.id) {
      this.securityConfirmation.id = error.id;
      this.pageStep = 'CODE_REQUEST';

    } else {

      this.form.get('code')!.setErrors({ customError: true, message: 'The code is invalid. Please, verify if you are entering the code received on your e-mail' });

    }

  }
}
