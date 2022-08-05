import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';

import { CoreComponent, FormControl, FormGroup } from '@app/base';
import { RoutingHelper } from '@app/base/helpers';
import { FormEngineComponent, WizardEngineModel } from '@modules/shared/forms';
import { OrganisationsService } from '@modules/shared/services/organisations.service';

import { getOrganisationUnitRulesOutDTO, ServiceUsersService } from '../../services/service-users.service';

import { CHANGE_USER_ORGANISATION_UNIT } from './service-user-change-organisation-unit.config';


@Component({
  selector: 'app-admin-pages-service-users-service-user-change-organisation-unit',
  templateUrl: './service-user-change-organisation-unit.component.html'
})
export class PageServiceUserChangeOrganisationUnitComponent extends CoreComponent implements OnInit {

  user: { id: string, name: string, role?: string; };
  pageStep: 'CODE_REQUEST' | 'SUCCESS' | 'RULES_LIST' | 'UNIT_LIST' = 'RULES_LIST';
  rulesList: getOrganisationUnitRulesOutDTO[] = [];
  oldOrganisationUnits: { id: string, name: string, acronym: string, supportCount: null | string }[] = [];
  titleHint = '';
  submitBtnClicked = false;
  isRulesValid = false;

  organisation: {
    id: string | null;
    name: string | null;
    acronym: string | null;
    organisationUnits: {
      id: string;
      name: string;
      acronym: string;
    }[];
  } = { id: null, name: null, acronym: null, organisationUnits: [] };

  securityConfirmation = { id: '', code: '' };

  form = new FormGroup({
    code: new FormControl('')
  }, { updateOn: 'blur' });

  wizard: WizardEngineModel = new WizardEngineModel(CHANGE_USER_ORGANISATION_UNIT);

  @ViewChild(FormEngineComponent) formEngineComponent?: FormEngineComponent;

  constructor(
    private activatedRoute: ActivatedRoute,
    private organisationsService: OrganisationsService,
    private serviceUsersService: ServiceUsersService
  ) {

    super();
    this.user = { id: this.activatedRoute.snapshot.params.userId, name: RoutingHelper.getRouteData(this.activatedRoute).user.displayName, };
    this.pageStep = 'RULES_LIST';

    this.setPageTitle(`Change organisation unit`);
  }

  ngOnInit(): void {

    forkJoin([
      this.organisationsService.getOrganisationsListWithUnits(),
      this.serviceUsersService.getUserFullInfo(this.user.id),
      this.serviceUsersService.getOrgnisationUnitRules(this.user.id)
    ]).subscribe(([organisations, userInfo, orgnisationUnitRules]) => {

      this.rulesList = orgnisationUnitRules;
      this.user.role = this.stores.authentication.getRoleDescription(userInfo.userOrganisations[0].role).toLowerCase();
      this.titleHint = `${this.user.name} (${this.stores.authentication.getRoleDescription(userInfo.userOrganisations[0].role)})`;
      this.isRulesValid = this.rulesList.some(rule => rule.valid === false);
      this.oldOrganisationUnits = userInfo.userOrganisations[0].units;
      this.organisation = organisations.filter(org => (userInfo.userOrganisations[0].id === org.id))[0];
      this.wizard.steps[0].parameters[0].items = this.organisation.organisationUnits.map(unit => ({ value: unit.acronym, label: unit.name }));
      this.wizard.gotoStep(1).setAnswers(this.wizard.runInboundParsing({ organisation: this.organisation, assignedUnit: this.oldOrganisationUnits })).runRules();
      this.setPageStatus('READY');
    },
      () => {
        this.setPageStatus('ERROR');
        this.alert = {
          type: 'ERROR',
          title: 'Unable to fetch the necessary information',
          message: 'Please try again or contact us for further help'
        };
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
        if (this.wizard.isFirstStep()) { this.pageStep = 'RULES_LIST'; }
        break;
      case 'next':
        this.wizard.nextStep();
        break;
      default: // Should NOT happen!
        break;
    }

    this.focusBody();

  }

  onSubmit(): void {
    this.form.markAllAsTouched(); // Form is always valid.
    this.submitBtnClicked = true;
    this.securityConfirmation.code = this.form.get('code')!.value;
    const body = this.wizard.runOutboundParsing();
    body.organisationId = this.organisation.id;

    this.serviceUsersService.changeOrganisationUserUnit(body, this.securityConfirmation, this.user.id).subscribe(
      () => this.redirectTo(`admin/service-users/${this.user.id}`, { alert: 'unitChangeSuccess' }),
      (error: { id: string }) => {
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
