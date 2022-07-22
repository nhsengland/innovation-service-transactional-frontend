import { Component, OnInit, ViewChild } from '@angular/core';
import { concatMap } from 'rxjs/operators';

import { CoreComponent } from '@app/base';
import { FormEngineComponent, WizardEngineModel } from '@app/base/forms';

import { FIRST_TIME_SIGNIN_QUESTIONS } from './first-time-signin.config';

import { OrganisationsService } from '@modules/shared/services/organisations.service';
import { InnovatorService } from '../../services/innovator.service';


@Component({
  selector: 'app-innovator-pages-first-time-signin',
  templateUrl: './first-time-signin.component.html'
})
export class FirstTimeSigninComponent extends CoreComponent implements OnInit {

  @ViewChild(FormEngineComponent) formEngineComponent?: FormEngineComponent;

  wizard: WizardEngineModel = new WizardEngineModel({});


  constructor(
    private organisationsService: OrganisationsService,
    private innovatorService: InnovatorService
  ) { super(); }


  ngOnInit(): void {

    this.wizard = FIRST_TIME_SIGNIN_QUESTIONS;
    this.wizard.setAnswers(this.wizard.runInboundParsing({})).runRules();

    // Update last step with the organisations list with description and pre-select all checkboxes.
    this.organisationsService.getAccessorsOrganisations().subscribe(response => {
      this.wizard.steps[this.wizard.steps.length - 1].parameters[0].items = response.map(item => ({ value: item.id, label: item.name }));
      this.wizard.addAnswers({ organisationShares: response.map(item => item.id) });

      this.setPageStatus('READY');

    },
      () => {
        this.setPageStatus('READY');
        this.logger.error('Error fetching organisations list');
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

    this.focusBody();

  }

  onSubmitWizard(): void {

    const body = this.wizard.runOutboundParsing();

    this.innovatorService.submitFirstTimeSigninInfo('FIRST_TIME_SIGNIN', body).pipe(
      concatMap(() => {
        return this.stores.authentication.initializeAuthentication$(); // Initialize authentication in order to update First Time SignIn information.
      })
    ).subscribe(
      () => this.redirectTo(`innovator/dashboard`, { alert: 'alertDisabled' }),
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

}
