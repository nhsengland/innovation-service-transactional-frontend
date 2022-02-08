import { Component, OnInit, ViewChild } from '@angular/core';

import { CoreComponent, FormGroup } from '@app/base';
import { AlertType } from '@app/base/models';
import { FormEngineComponent, WizardEngineModel } from '@app/base/forms';
import { CREATE_NEW_USER_QUESTIONS } from './service-users-new.config';
import { OrganisationsService } from '@modules/shared/services/organisations.service';
import { forkJoin } from 'rxjs';
import { ServiceUsersService } from '@modules/feature-modules/admin/services/service-users.service';
import { concatMap } from 'rxjs/operators';

@Component({
  selector: 'app-admin-pages-service-users-new',
  templateUrl: './service-users-new.component.html'
})
export class PageServiceUsersNewComponent extends CoreComponent implements OnInit {

  alert: AlertType = { type: null };

  @ViewChild(FormEngineComponent) formEngineComponent?: FormEngineComponent;

  wizard: WizardEngineModel = new WizardEngineModel({});

  formChanges: FormGroup = new FormGroup({});

  constructor(
    private organisationsService: OrganisationsService,
    private userService: ServiceUsersService
  ) {

    super();
    this.setPageTitle('Create new user');
  }

  ngOnInit(): void {
    forkJoin([
      this.organisationsService.getOrganisationUnits()
    ]).subscribe(([units]) => {
      this.wizard = CREATE_NEW_USER_QUESTIONS;
      const organisationUnitList = units.map((unit) => ({ acronym: unit.acronym, name: unit.name, units: unit.organisationUnits.map(o => ({ acronym: o.acronym, name: o.name })) }));
      this.wizard.setAnswers(this.wizard.runInboundParsing({ organisationUnitList, service: this.userService, emailValidator: this.userService.userEmailValidator })).runRules();

      this.wizard.steps[this.wizard.steps.length - 1].parameters[0].items = units.map((item: { [key: string]: any }) => ({ value: item.acronym, label: item.name }));
      this.wizard.addAnswers({ organisationAcronym: units.map((item: { [key: string]: any }) => item.acronym) });

      // units
      // this.wizard.steps[this.wizard.steps.length - 2].parameters[0].items = units.map((unit) => ({ objRes:unit }));
      // this.wizard.addAnswers({ organisationAcronym: units.map((item: { [key: string]: any }) => item.acronym) });
      console.log(units);
      // const units = units.filter()
      this.setPageStatus('READY');


    },
      () => {
        this.setPageStatus('READY');
        this.logger.error('Error fetching organisations list');
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

    const body = this.wizard.runOutboundParsing();
    console.log(body);
    this.userService.createUser(body).pipe(
      concatMap(() => {
        return this.stores.authentication.initializeAuthentication$(); // Initialize authentication in order to update First Time SignIn information.
      })
    ).subscribe(
      () => { this.redirectTo(`admin/service-users`, { alert: 'alertDisabled' }); },
      () => {
        this.alert = {
          type: 'ERROR',
          title: 'An unknown error occurred',
          message: 'You may try to go back and try again.',
          setFocus: true
        };
      }
    );

  }

  onFormChange(form: FormGroup): void {
    this.formChanges = form;
  }
}
