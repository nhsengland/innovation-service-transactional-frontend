import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { OrganisationErrorsEnum } from '@app/base/enums';
import { FormGroup } from '@app/base/forms';
import { MappedObjectType } from '@app/base/types';

import { AdminOrganisationsService } from '@modules/feature-modules/admin/services/admin-organisations.service';
import { FormEngineComponent, WizardEngineModel } from '@modules/shared/forms';
import { OrganisationsService } from '@modules/shared/services/organisations.service';

import { EDIT_ORGANISATION_UNIT_QUESTIONS } from './organisation-edit-unit.config';
import { EDIT_ORGANISATIONS_QUESTIONS } from './organisation-edit.config';

@Component({
  selector: 'app-admin-pages-organisations-organisations-edit',
  templateUrl: './organisation-edit.component.html'
})
export class PageOrganisationEditComponent extends CoreComponent implements OnInit {
  organisationId: string;
  unitId: string;
  submitBtnClicked = false;
  stepId: number;

  module: 'Organisation' | 'Unit';
  pageStep: 'RULES_LIST' | 'SUCCESS' = 'RULES_LIST';

  form = new FormGroup({}, { updateOn: 'blur' });

  wizard: WizardEngineModel = new WizardEngineModel({});

  @ViewChild(FormEngineComponent) formEngineComponent?: FormEngineComponent;

  constructor(
    private activatedRoute: ActivatedRoute,
    private adminOrganisationsService: AdminOrganisationsService,
    private organisationsService: OrganisationsService
  ) {
    super();
    this.module = this.activatedRoute.snapshot.data.module;
    this.organisationId = this.activatedRoute.snapshot.params.organisationId;
    this.unitId = this.activatedRoute.snapshot.params.organisationUnitId;
    this.stepId = Number(this.activatedRoute.snapshot.params.stepId ?? 1);

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
    this.organisationsService.getOrganisationInfo(this.organisationId).subscribe(
      organisation => {
        const data =
          this.module === 'Organisation'
            ? {
                name: organisation.name,
                acronym: organisation.acronym,
                summary: organisation.summary,
                website: organisation.website
              }
            : organisation.organisationUnits?.filter(unit => unit.id === this.unitId)[0];

        this.wizard
          .gotoStep(this.stepId)
          .setAnswers(this.wizard.runInboundParsing({ ...data }))
          .runRules();
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

    if (action === 'next' && !formData.valid) {
      // Don't move forward if step is NOT valid.
      return;
    }

    this.wizard.addAnswers(formData.data).runRules();

    switch (action) {
      case 'previous':
        if (this.wizard.isFirstStep()) {
          this.redirectTo(`organisations/${this.organisationId}`);
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
  }

  onSubmitWizard(): void {
    const body: MappedObjectType = this.wizard.runOutboundParsing();
    this.submitBtnClicked = true;

    switch (this.module) {
      case 'Organisation':
        this.adminOrganisationsService.updateOrganisation(body, this.organisationId).subscribe({
          next: response => {
            response.organisationId
              ? this.redirectTo(`admin/organisations/${response.organisationId}`, {
                  alert: 'updateOrganisationSuccess'
                })
              : (this.alert = { type: 'ERROR', title: 'Error updating organisation' });
            this.submitBtnClicked = false;
          },
          error: err => this.errorResponse(err)
        });
        break;
      case 'Unit':
        this.adminOrganisationsService.updateUnit(body, this.unitId, this.organisationId).subscribe({
          next: response => {
            if (response.unitId) {
              this.setRedirectAlertSuccess('You have successfully updated the organisation unit');
            } else {
              this.setRedirectAlertError('Error updating unit');
            }
            this.redirectTo(`admin/organisations/${this.organisationId}/unit/${this.unitId}`);

            this.submitBtnClicked = false;
          },
          error: err => this.errorResponse(err)
        });
        break;
      default:
        break;
    }
  }

  errorResponse(error: { id: string; message?: string }): void {
    switch (error.id) {
      case OrganisationErrorsEnum.ORGANISATION_ALREADY_EXISTS:
        this.alert = { type: 'ERROR', title: 'Organisation name or acronym already in use' };
        break;
      case OrganisationErrorsEnum.ORGANISATION_UNIT_ALREADY_EXISTS:
        this.alert = { type: 'ERROR', title: 'Organisation unit name or acronym already in use' };
        break;
      case OrganisationErrorsEnum.ORGANISATION_NHSE_ACRONYM_CANNOT_BE_CHANGED:
        this.alert = { type: 'ERROR', title: 'NHSE acronym cannot be changed' };
        break;
      default:
        this.alert = { type: 'ERROR', title: error?.message || 'Error updating organisation' };
    }
    this.submitBtnClicked = false;
  }
}
