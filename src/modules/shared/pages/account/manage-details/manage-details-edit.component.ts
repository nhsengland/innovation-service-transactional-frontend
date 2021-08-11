import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { concatMap } from 'rxjs/operators';

import { CoreComponent } from '@app/base';
import { FormEngineComponent, WizardEngineModel } from '@app/base/forms';
import { RoutingHelper } from '@modules/core';

import { SummaryParsingType } from '@modules/shared/forms';

import { ACCOUNT_DETAILS_INNOVATOR } from './manage-details-edit-innovator.config';
import { ACCOUNT_DETAILS_ACCESSOR } from './manage-details-edit-accessor.config';


@Component({
  selector: 'shared-pages-account-manage-details-edit',
  templateUrl: './manage-details-edit.component.html'
})
export class PageAccountManageDetailsEditComponent extends CoreComponent implements OnInit {

  @ViewChild(FormEngineComponent) formEngineComponent?: FormEngineComponent;

  module: '' | 'innovator' | 'accessor' | 'assessment' = '';

  wizard: WizardEngineModel = new WizardEngineModel({});

  summaryList: SummaryParsingType[] = [];

  isQuestionStep(): boolean { return Number.isInteger(Number(this.activatedRoute.snapshot.params.stepId)); }
  isSummaryStep(): boolean { return this.activatedRoute.snapshot.params.stepId === 'summary'; }


  constructor(
    private activatedRoute: ActivatedRoute
  ) {

    super();

    this.module = RoutingHelper.getRouteData(this.activatedRoute.root).module;

  }


  ngOnInit(): void {

    if (this.stores.authentication.isInnovatorType()) {
      this.wizard = ACCOUNT_DETAILS_INNOVATOR;
    } else if (this.stores.authentication.isAccessorType() || this.stores.authentication.isAssessmentType()) {
      this.wizard = ACCOUNT_DETAILS_ACCESSOR;
    }

    const user = this.stores.authentication.getUserInfo();
    this.wizard.setAnswers(this.wizard.runInboundParsing(user)).runRules();

    this.subscriptions.push(
      this.activatedRoute.params.subscribe(params => {

        if (!this.wizard.isValidStepNumber(params.stepId) && params.stepId !== 'summary') {
          this.redirectTo('not-found');
          return;
        }

        if (this.isSummaryStep()) {
          this.summaryList = this.wizard.runSummaryParsing();
          return;
        }

        this.wizard.gotoStep(Number(params.stepId));

      })
    );

  }


  onSubmitStep(action: 'previous' | 'next', event: Event): void {

    event.preventDefault();

    const formData = this.formEngineComponent?.getFormValues();

    if (action === 'next' && !formData?.valid) { // Apply validation only when moving forward.
      return;
    }

    this.wizard.addAnswers(formData?.data || {}).runRules();

    this.redirectTo(this.getNavigationUrl(action));

  }


  onSubmitWizard(): void {

    const body = this.wizard.runOutboundParsing();

    this.stores.authentication.saveUserInfo$(body).pipe(
      concatMap(() => this.stores.authentication.initializeAuthentication$()) // Fetch all new information.
    ).subscribe(
      () => { this.redirectTo(`${this.module}/account/manage-details`, { alert: 'accountDetailsUpdateSuccess' }); },
      () => { this.redirectTo(`${this.module}/account/manage-details`, { alert: 'accountDetailsUpdateError' }); }
    );

  }


  getStepUrl(stepNumber: number | undefined): string {
    return `/${this.module}/account/manage-details/edit/${stepNumber}`;
  }

  getNavigationUrl(action: 'previous' | 'next'): string {

    let url = `/${this.module}/account/manage-details`;

    switch (action) {
      case 'previous':
        if (this.wizard.isFirstStep()) { url += ``; }
        else if (this.isSummaryStep()) { url += `/edit/${this.wizard.steps.length}`; }
        else { url += `/edit/${this.wizard.currentStepNumber - 1}`; }
        break;

      case 'next':
        if (this.isSummaryStep()) { url += ``; }
        else if (this.wizard.isLastStep()) { url += `/edit/summary`; }
        else { url += `/edit/${this.wizard.currentStepNumber + 1}`; }
        break;

      default: // Should NOT happen!
        url += '';
        break;
    }

    return url;

  }

}
