import { Component, OnInit, ViewChild } from '@angular/core';
import { of } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { cloneDeep } from 'lodash';

import { CoreComponent } from '@app/base';
import { FormEngineComponent } from '@app/base/forms';

import { OrganisationsService } from '@modules/shared/services/organisations.service';
import { InnovatorService } from '../../services/innovator.service';

import { NEW_INNOVATION_QUESTIONS } from './innovation-new.config';
import { HttpErrorResponse } from '@angular/common/http';
import { InnovationErrorsEnum } from '@app/base/enums';


@Component({
  selector: 'app-innovator-pages-innovation-new',
  templateUrl: './innovation-new.component.html'
})
export class InnovationNewComponent extends CoreComponent implements OnInit {

  @ViewChild(FormEngineComponent) formEngineComponent?: FormEngineComponent;

  wizard = cloneDeep(NEW_INNOVATION_QUESTIONS);


  constructor(
    private organisationsService: OrganisationsService,
    private innovatorService: InnovatorService
  ) {

    super();

    this.setPageTitle('', { showPage: false });
    this.setBackLink('Go back', this.onSubmitStep.bind(this, 'previous', new Event('')));

  }


  ngOnInit(): void {

    this.wizard.setAnswers(this.wizard.runInboundParsing({}));

    // Update last step with the organisations list and pre-select all checkboxes.
    this.organisationsService.getOrganisationsList({ unitsInformation: false }).subscribe(response => {
      this.wizard.steps[this.wizard.steps.length - 1].parameters[0].items = response.map(item => ({ value: item.id, label: item.name }));
      this.wizard.addAnswers({ organisationShares: response.map(item => item.id) }).runRules();
    });

  }


  onSubmitStep(action: 'previous' | 'next', event: Event): void {

    event.preventDefault();

    const formData = this.formEngineComponent?.getFormValues();

    if (action === 'next' && !formData?.valid) { // Apply validation only when moving forward.
      return;
    }

    this.wizard.addAnswers(formData!.data).runRules();

    this.navigateTo(action);

  }


  submitWizard(): void {

    const data = this.wizard.runOutboundParsing();
    const body = {
      name: data.name,
      description: data.description,
      countryName: data.countryName,
      postcode: data.postcode,
      organisationShares: data.organisationShares
    };

    this.innovatorService.createInnovation(body, false).pipe(
      concatMap(response => {
        this.stores.authentication.initializeAuthentication$(); // Initialize authentication in order to update innovations information.
        return of(response);
      })
    ).subscribe({
      next: response => {
        this.setRedirectAlertSuccess(`You have successfully registered the innovation '${body.name}'`);
        this.redirectTo(`innovator/innovations/${response.id}`)
      },
      error: (err: HttpErrorResponse) => {
        if(err.error.error === InnovationErrorsEnum.INNOVATION_ALREADY_EXISTS) {
          this.setAlertError('An innovation with that name already exists. Try again with a new name.');
        } else {
          this.setAlertError('An error occurred when creating the innovation. Please try again or contact us for further help');
        }
      }
    });

  }


  navigateTo(action: 'previous' | 'next'): void {

    switch (action) {
      case 'previous':
        if (this.wizard.isFirstStep()) { this.redirectTo(`innovator/dashboard`); }
        else { this.wizard.previousStep(); }
        break;

      case 'next':
        if (this.wizard.isLastStep()) { this.submitWizard(); }
        else { this.wizard.nextStep(); }
        break;

      default: // Should NOT happen!
        break;

    }

  }

}
