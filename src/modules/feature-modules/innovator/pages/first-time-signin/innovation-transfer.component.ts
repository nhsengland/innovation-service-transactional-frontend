import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { concatMap } from 'rxjs/operators';

import { CoreComponent } from '@app/base';
import { FormEngineComponent, WizardEngineModel } from '@app/base/forms';
import { RoutingHelper } from '@app/base/helpers';

import { InnovationTransferStatusEnum } from '@modules/stores/innovation';
import { WizardSummaryType } from '@modules/shared/forms';

import { InnovatorService } from '../../services/innovator.service';

import { INNOVATION_TRANSFER } from './innovation-transfer.config';


@Component({
  selector: 'app-innovator-pages-first-time-signin-innovation-transfer',
  templateUrl: './innovation-transfer.component.html'
})
export class FirstTimeSigninInnovationTransferComponent extends CoreComponent implements OnInit {

  @ViewChild(FormEngineComponent) formEngineComponent?: FormEngineComponent;

  module: '' | 'innovator' | 'accessor' | 'assessment';
  transferId = '';

  wizard: WizardEngineModel = new WizardEngineModel({});

  summaryList: WizardSummaryType[] = [];

  isQuestionStep(): boolean { return Number.isInteger(Number(this.activatedRoute.snapshot.params.stepId)); }
  isSummaryStep(): boolean { return this.activatedRoute.snapshot.params.stepId === 'summary'; }


  constructor(
    private activatedRoute: ActivatedRoute,
    private innovatorService: InnovatorService
  ) {

    super();

    this.module = RoutingHelper.getRouteData<any>(this.activatedRoute.root).module;

  }


  ngOnInit(): void {

    this.wizard = INNOVATION_TRANSFER;

    this.innovatorService.getInnovationTransfers(true).subscribe(response => {

      if (response.length === 0) {
        this.redirectTo('error/generic');
        return;
      }

      // As this page only appears for new users, if more innovation transfers exists to him, we just choose the first to finish the process.
      // User will have the opportunity to accept other transfers afterwards.
      const transfer = response[0];
      this.transferId = transfer.id;

      // Updates wizard configuration step 1 description.
      this.wizard.steps[0].description = `${transfer.innovation.owner} has requested that you take ownership of ${transfer.innovation.name}.`;


      this.wizard.setAnswers(this.wizard.runInboundParsing({})).runRules();

      this.subscriptions.push(
        this.activatedRoute.params.subscribe(params => {

          if (!this.wizard.isValidStep(params.stepId)) {
            this.redirectTo('/not-found');
            return;
          }

          if (this.isSummaryStep()) {

            this.summaryList = this.wizard.runSummaryParsing();

            this.setPageTitle('Check your answers');
            this.setPageStatus('READY');
            return;
          }

          this.wizard.gotoStep(Number(params.stepId));

          this.setPageTitle(this.wizard.currentStep().label || this.wizard.currentStep().parameters[0].label || '');

          if (!this.wizard.isFirstStep()) {
            this.setBackLink('Go back', this.onSubmitStep.bind(this, 'previous', new Event('')));
          } else {
            this.resetBackLink();
          }

          this.setPageStatus('READY');

        })
      );

    });

  }


  onSubmitStep(action: 'previous' | 'next', event: Event): void {

    event.preventDefault();

    const formData = this.formEngineComponent?.getFormValues();

    if (action === 'next' && !formData?.valid) { // Apply validation only when moving forward.
      return;
    }

    this.wizard.addAnswers(formData!.data).runRules();

    this.redirectTo(this.getNavigationUrl(action));

  }


  onSubmitWizard(): void {

    const wizardData = this.wizard.runOutboundParsing();

    wizardData.transferId = this.transferId;

    of(true).pipe(

      concatMap(() => this.stores.authentication.updateUserInfo$({
        displayName: wizardData.innovatorName,
        organisation: wizardData.isCompanyOrOrganisation.toUpperCase() === 'YES' ? {
          id: this.stores.authentication.getUserInfo().organisations[0].id,
          isShadow: false,
          name: wizardData.organisationName,
          size: wizardData.organisationSize
        } : {
          id: this.stores.authentication.getUserInfo().organisations[0].id,
          isShadow: true
        }
      })),

      concatMap(() => this.innovatorService.updateTransferInnovation(this.transferId, InnovationTransferStatusEnum.COMPLETED)),

      // Initialize authentication in order to update First Time SignIn information.
      concatMap(() => this.stores.authentication.initializeAuthentication$())

    ).subscribe({
      next: () => this.redirectTo(`innovator/dashboard`),
      error: () => this.redirectTo(`innovator/innovation-transfer-acceptance/summary`)
    });

  }


  getStepUrl(stepNumber: number | undefined): string {
    return `/${this.module}/innovation-transfer-acceptance/${stepNumber}`;
  }

  getNavigationUrl(action: 'previous' | 'next'): string {

    let url = `/innovator/innovation-transfer-acceptance`;

    switch (action) {
      case 'previous':
        if (this.isSummaryStep()) { url += `/${this.wizard.steps.length}`; }
        else if (this.wizard.isFirstStep()) { url += `/1`; }
        else { url += `/${Number(this.wizard.currentStepId) - 1}`; }
        break;

      case 'next':
        if (this.isSummaryStep()) { url += ``; }
        else if (this.wizard.isLastStep()) { url += `/summary`; }
        else { url += `/${Number(this.wizard.currentStepId) + 1}`; }
        break;

      default: // Should NOT happen!
        url += '';
        break;
    }

    return url;

  }

}
