import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { concatMap } from 'rxjs/operators';

import { CoreComponent } from '@app/base';
import { FormEngineComponent, WizardEngineModel } from '@app/base/forms';
import { RoutingHelper } from '@app/base/helpers';

import { WizardSummaryType } from '@modules/shared/forms';

import { InnovatorService } from '../../services/innovator.service';

import { INNOVATION_TRANSFER } from './innovation-transfer-acceptance.config';


@Component({
  selector: 'app-innovator-pages-innovation-transfer-acceptance',
  templateUrl: './innovation-transfer-acceptance.component.html'
})
export class InnovationTransferAcceptanceComponent extends CoreComponent implements OnInit {

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

    this.module = RoutingHelper.getRouteData(this.activatedRoute.root).module;

  }


  ngOnInit(): void {

    this.wizard = INNOVATION_TRANSFER;

    this.innovatorService.getInnovationTransfers(true).subscribe(
      response => {

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
              this.setPageTitle('Check your answers');
              this.summaryList = this.wizard.runSummaryParsing();
              return;
            }

            /* istanbul ignore next */
            this.setPageTitle(this.wizard.currentStep().label || this.wizard.currentStep().parameters[0].label || '');
            this.wizard.gotoStep(Number(params.stepId));

          })
        );

        this.setPageStatus('READY');

      },
      error => this.redirectTo('error/generic')
    );

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

    const body = this.wizard.runOutboundParsing();

    body.transferId = this.transferId;

    this.innovatorService.submitFirstTimeSigninInfo('TRANSFER', body).pipe(
      concatMap(() => {
        return this.stores.authentication.initializeAuthentication$(); // Initialize authentication in order to update First Time SignIn information.
      })
    ).subscribe(
      () => this.redirectTo(`innovator/dashboard`),
      () => this.redirectTo(`innovator/innovation-transfer-acceptance/summary`)
    );

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
