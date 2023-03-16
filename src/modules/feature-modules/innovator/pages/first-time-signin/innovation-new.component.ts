import { Component, OnInit, ViewChild } from '@angular/core';
import { of } from 'rxjs';
import { concatMap } from 'rxjs/operators';

import { CoreComponent } from '@app/base';
import { FormEngineComponent, WizardEngineModel } from '@app/base/forms';

import { FIRST_TIME_SIGNIN_QUESTIONS } from './innovation-new.config';

import { OrganisationsService } from '@modules/shared/services/organisations.service';
import { InnovatorService } from '../../services/innovator.service';
import { UtilsHelper } from '@modules/core/helpers/utils.helper';
import { FIRST_TIME_SIGNIN_ACCOUNT_ONLY_QUESTIONS } from './innovation-new-account.config';
import { FIRST_TIME_SIGNIN_QUESTIONS_TEST } from './first-time-signin.config';


@Component({
  selector: 'app-innovator-pages-first-time-signin-innovation-new',
  templateUrl: './innovation-new.component.html'
})
export class FirstTimeSigninInnovationNewComponent extends CoreComponent implements OnInit {

  @ViewChild(FormEngineComponent) formEngineComponent?: FormEngineComponent;

  wizard: WizardEngineModel = new WizardEngineModel({});
  disableContinueButton: boolean = false;
  hasInnovationCollaborations: boolean = false;

  constructor(
    private organisationsService: OrganisationsService,
    private innovatorService: InnovatorService
  ) { super(); }


  ngOnInit(): void {
    this.hasInnovationCollaborations = this.stores.authentication.hasInnovationCollaborations();

    if (this.hasInnovationCollaborations) {
      this.wizard = FIRST_TIME_SIGNIN_ACCOUNT_ONLY_QUESTIONS;
      this.wizard.setAnswers(this.wizard.runInboundParsing({})).runRules();

      this.setPageTitle('Welcome to the Innovation Service')
      this.setPageStatus('READY');
    } else {
      // this.wizard = FIRST_TIME_SIGNIN_QUESTIONS;
      this.wizard = FIRST_TIME_SIGNIN_QUESTIONS_TEST;
      this.wizard.setAnswers(this.wizard.runInboundParsing({})).runRules();
      // Update last step with the organisations list with description and pre-select all checkboxes.
      this.organisationsService.getOrganisationsList({ unitsInformation: false }).subscribe(response => {
  
        // this.wizard.steps[this.wizard.steps.length - 1].parameters[0].items = response.map(item => ({ value: item.id, label: item.name }));
        // this.wizard.addAnswers({ organisationShares: response.map(item => item.id) });
  
        this.setPageStatus('READY');
  
      });
    }
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

    if (!this.wizard.isFirstStep()) {
      this.setBackLink('Go back', this.onSubmitStep.bind(this, 'previous'));
    } else {
      this.resetBackLink();
    }

  }

  onSubmitWizard(): void {
    this.disableContinueButton = true;
    const wizardData = this.wizard.runOutboundParsing();


    of(true).pipe(

      concatMap(() => this.stores.authentication.updateUserInfo$({
        displayName: wizardData.innovatorName,
        mobilePhone: UtilsHelper.isEmpty(wizardData.mobilePhone) ? null : wizardData.mobilePhone,
      
        organisation: wizardData.isCompanyOrOrganisation && wizardData.isCompanyOrOrganisation.toUpperCase() === 'YES' ? {
          id: this.stores.authentication.getUserInfo().organisations[0].id,
          isShadow: false,
          name: wizardData.organisationName,
          size: wizardData.organisationSize
        } : {
          id: this.stores.authentication.getUserInfo().organisations[0].id,
          isShadow: true
        } 
        
      })),

      concatMap(() => {
        if(this.hasInnovationCollaborations) {
          return of(true);
        }

        return this.innovatorService.createInnovation({
          name: wizardData.innovationName,
          description: wizardData.innovationDescription,
          countryName: wizardData.locationCountryName || wizardData.location,
          postcode: wizardData.englandPostCode,
          organisationShares: wizardData.organisationShares
        }, true);
      }),


      // Initialize authentication in order to update First Time SignIn information.
      concatMap(() => this.stores.authentication.initializeAuthentication$())

    ).subscribe({
      next: () => {
        this.redirectTo(`innovator/dashboard`, { alert: 'alertDisabled' });
        this.disableContinueButton = false;
      },
      error: () => {
        this.setAlertUnknownError();
        this.disableContinueButton = false;
      }
    });

  }   
}
