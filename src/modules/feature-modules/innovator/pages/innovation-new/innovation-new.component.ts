import { Component, OnInit, ViewChild } from '@angular/core';
import { cloneDeep } from 'lodash';

import { CoreComponent } from '@app/base';
import { FormEngineComponent } from '@app/base/forms';

import { InnovatorService } from '../../services/innovator.service';

import { HttpErrorResponse } from '@angular/common/http';
import { InnovationErrorsEnum } from '@app/base/enums';
import { getNewInnovationQuestionsWizard } from './innovation-new.config';

@Component({
  selector: 'app-innovator-pages-innovation-new',
  templateUrl: './innovation-new.component.html'
})
export class InnovationNewComponent extends CoreComponent implements OnInit {
  @ViewChild(FormEngineComponent) formEngineComponent?: FormEngineComponent;

  wizard = cloneDeep(getNewInnovationQuestionsWizard(this.ctx.schema.irSchemaInfo()));

  isCreatingInnovation = false;

  constructor(private innovatorService: InnovatorService) {
    super();

    this.setPageTitle('', { showPage: false });
    this.setBackLink('Go back', this.onSubmitStep.bind(this, 'previous'));
  }

  ngOnInit(): void {
    this.wizard.setAnswers(this.wizard.runInboundParsing({}));
  }

  onSubmitStep(action: 'previous' | 'next'): void {
    const formData = this.formEngineComponent?.getFormValues() ?? { valid: false, data: {} };

    if (action === 'next' && !formData.valid) {
      // Apply validation only when moving forward.
      return;
    }

    this.wizard.addAnswers(formData.data).runRules();

    this.navigateTo(action);
  }

  submitWizard(): void {
    this.isCreatingInnovation = true;

    const data = this.wizard.runOutboundParsing();
    const body = {
      name: data.name,
      description: data.description,
      postcode: data.postcode,
      website: data.website,
      hasWebsite: data.hasWebsite,
      countryLocation: data.countryLocation,
      officeLocation: data.officeLocation
    };

    this.innovatorService.createInnovation(body).subscribe({
      next: response => {
        this.setRedirectAlertSuccess(`You have successfully registered the innovation '${body.name}'`);
        this.redirectTo(`innovator/innovations/${response.id}`);
      },
      error: ({ error: err }: HttpErrorResponse) => {
        if (err.error === InnovationErrorsEnum.INNOVATION_ALREADY_EXISTS) {
          this.setAlertError('An innovation with that name already exists. Try again with a new name');
        } else {
          this.setAlertError(
            'An error occurred when creating the innovation. Please try again or contact us for further help'
          );
        }
        this.isCreatingInnovation = false;
      }
    });
  }

  private navigateTo(action: 'previous' | 'next'): void {
    switch (action) {
      case 'previous':
        if (this.wizard.isFirstStep()) {
          this.redirectTo('innovator');
        } else {
          this.wizard.previousStep();
        }
        break;
      case 'next':
        this.wizard.nextStep();
        break;
      default:
        break; // Should NOT happen!
    }
  }
}
