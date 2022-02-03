import { Component, OnInit, ViewChild } from '@angular/core';

import { CoreComponent } from '@app/base';
import { AlertType } from '@app/base/models';
import { FormEngineComponent, WizardEngineModel } from '@app/base/forms';
import { CREATE_NEW_USER_QUESTIONS } from './service-users-new.config';
import { OrganisationsService } from '@modules/shared/services/organisations.service';
import { response } from 'express';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-admin-pages-service-users-new',
  templateUrl: './service-users-new.component.html'
})
export class PageServiceUsersNewComponent extends CoreComponent implements OnInit {

  alert: AlertType = { type: null };

  @ViewChild(FormEngineComponent) formEngineComponent?: FormEngineComponent;

  wizard: WizardEngineModel = new WizardEngineModel({});

  constructor(
    private organisationsService: OrganisationsService,
  ) {

    super();
    this.setPageTitle('Create new user'); 
  }

  ngOnInit(): void {
    this.wizard = CREATE_NEW_USER_QUESTIONS;
    forkJoin([
      this.organisationsService.getAccessorsOrganisations(),
      this.organisationsService.getOrganisationUnits()
    ]).subscribe(([orgnisation, units]) => {
      const organisationList = units.map((unit) => ({ acronym: unit.acronym, name: unit.name, units: unit.organisationUnits.map(o => ({ acronym: o.acronym, name: o.name })) }))
      this.wizard.setAnswers(this.wizard.runInboundParsing({ organisationList })).runRules();

      this.wizard.steps[this.wizard.steps.length - 1].parameters[0].items = orgnisation.map((item: { [key: string]: any }) => ({ value: item.acronym, label: item.name }));
      this.wizard.addAnswers({ organisationAcronym: orgnisation.map((item: { [key: string]: any }) => item.acronym) });

      //units
      // this.wizard.steps[this.wizard.steps.length - 2].parameters[0].items = units.map((unit) => ({ objRes:unit }));
      // this.wizard.addAnswers({ organisationAcronym: units.map((item: { [key: string]: any }) => item.acronym) });
      console.log(orgnisation, units);
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
    // this.innovatorService.submitFirstTimeSigninInfo('FIRST_TIME_SIGNIN', body).pipe(
    //   concatMap(() => {
    //     return this.stores.authentication.initializeAuthentication$(); // Initialize authentication in order to update First Time SignIn information.
    //   })
    // ).subscribe(
    //   () => this.redirectTo(`innovator/dashboard`, { alert: 'alertDisabled' }),
    //   () => {
    //     this.alert = {
    //       type: 'ERROR',
    //       title: 'An unknown error occurred',
    //       message: 'You may try to go back and try again.',
    //       setFocus: true
    //     };
    //   }
    // );

  }
}
