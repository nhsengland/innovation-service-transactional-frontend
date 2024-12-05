import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

import { CoreComponent } from '@app/base';
import { CustomValidators, FormEngineComponent, FormGroup, WizardEngineModel } from '@app/base/forms';

import { ActivatedRoute } from '@angular/router';
import { InnovatorService } from '@modules/feature-modules/innovator/services/innovator.service';
import { WizardSummaryType } from '@modules/shared/forms';
import { InnovationsService } from '@modules/shared/services/innovations.service';
import { cloneDeep } from 'lodash';
import { COLLABORATORS_TRANSFERS, NO_COLLABORATORS_TRANSFERS, otherEmailItem } from './manage-transfer.config';

@Component({
  selector: 'app-innovator-pages-innovation-manage-transfer',
  templateUrl: './manage-transfer.component.html'
})
export class PageInnovationManageTransferComponent extends CoreComponent implements OnInit {
  @ViewChild(FormEngineComponent) formEngineComponent?: FormEngineComponent;

  innovationId: string;
  stayAsCollaborator = false;
  redirectToDeleteAccount = false;

  wizard: WizardEngineModel = new WizardEngineModel({});
  summaryList: WizardSummaryType[] = [];

  isQuestionStep(): boolean {
    return Number.isInteger(Number(this.activatedRoute.snapshot.params.stepId));
  }
  isSummaryStep(): boolean {
    return this.activatedRoute.snapshot.params.stepId === 'summary';
  }

  form = new FormGroup(
    {
      confirmation: new UntypedFormControl('', [
        CustomValidators.required('A confirmation text is necessary'),
        CustomValidators.equalTo('transfer my innovation')
      ])
    },
    { updateOn: 'blur' }
  );

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovatorService: InnovatorService,
    private innovationsService: InnovationsService
  ) {
    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.redirectToDeleteAccount = this.ctx.layout.previousUrl()?.includes('/manage-account/delete') ?? false;
  }

  ngOnInit(): void {
    const myEmail = this.ctx.user.getUserInfo().email;
    this.wizard = cloneDeep(NO_COLLABORATORS_TRANSFERS(myEmail));

    this.innovationsService.getInnovationCollaboratorsList(this.innovationId, ['active']).subscribe(response => {
      if (response.count > 0) {
        this.wizard = cloneDeep(COLLABORATORS_TRANSFERS);
        const collaborators: {
          value: string;
          label: string;
        }[] = response.data.map(i => ({
          value: i.email ?? '',
          label: i.name ?? ''
        }));

        //add collaborators
        this.wizard.steps[0].parameters[0].items = [...collaborators, otherEmailItem(myEmail)];

        // Updates wizard configuration step 1 description.
        this.wizard.setAnswers(this.wizard.runInboundParsing({})).runRules();
      }

      this.subscriptions.push(
        this.activatedRoute.params.subscribe(params => {
          if (!this.wizard.isValidStep(params.stepId)) {
            this.redirectTo('/not-found');
            return;
          }

          if (this.isSummaryStep()) {
            const wizardData = this.wizard.runOutboundParsing();
            this.stayAsCollaborator = wizardData.ownerToCollaborator;
            this.setPageTitle(
              `Transfer ownership of this innovation to ${wizardData.email} ${
                this.stayAsCollaborator ? 'but continue to collaborate on it' : ''
              }`,
              { size: 'l' }
            );

            this.setBackLink('Go back', this.onSubmitStep.bind(this, 'previous', new Event('')));
            this.setPageStatus('READY');
            return;
          }

          this.wizard.gotoStep(Number(params.stepId));
          this.setPageTitle(this.wizard.currentStepTitle() || '');

          if (Number(params.stepId) === 1) {
            this.setBackLink('Go back');
          } else {
            this.setBackLink('Go back', this.onSubmitStep.bind(this, 'previous', new Event('')));
          }

          this.setPageStatus('READY');
        })
      );
    });
  }

  onSubmitStep(action: 'previous' | 'next', event: Event): void {
    event.preventDefault();

    const formData = this.formEngineComponent?.getFormValues();

    if (action === 'next' && !formData?.valid) {
      // Apply validation only when moving forward.
      return;
    }

    this.wizard.addAnswers(formData?.data || {}).runRules();

    this.redirectTo(this.getNavigationUrl(action));
  }

  onSubmitWizard(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const wizardData = this.wizard.runOutboundParsing();

    const body: { innovationId: string; email: string; ownerToCollaborator: boolean } = {
      innovationId: this.innovationId,
      email: wizardData.email,
      ownerToCollaborator: wizardData.ownerToCollaborator
    };

    this.innovatorService.transferInnovation(body).subscribe({
      next: () => {
        if (this.redirectToDeleteAccount) {
          this.redirectTo(`/innovator/account/manage-account/delete`);
        } else {
          this.redirectTo(`/innovator/innovations/${this.innovationId}/manage/innovation`);
        }
      },
      error: () => {
        this.setAlertError(
          'An error occurred when transferring innovation ownership. Please check the details and try again or contact us for further info'
        );
      }
    });
  }

  private getNavigationUrl(action: 'previous' | 'next'): string {
    let url = `/innovator/innovations/${this.innovationId}/manage/innovation`;

    switch (action) {
      case 'previous':
        if (this.wizard.isFirstStep()) {
          url += ``;
        } else if (this.isSummaryStep()) {
          url += `/transfer/${this.wizard.steps.length}`;
        } else {
          url += `/transfer/${Number(this.wizard.currentStepId) - 1}`;
        }
        break;

      case 'next':
        if (this.isSummaryStep()) {
          url += ``;
        } else if (this.wizard.isLastStep()) {
          url += `/transfer/summary`;
        } else {
          url += `/transfer/${Number(this.wizard.currentStepId) + 1}`;
        }
        break;

      default: // Should NOT happen!
        url += '';
        break;
    }

    return url;
  }
}
