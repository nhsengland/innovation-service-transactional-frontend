import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { FormEngineComponent, WizardEngineModel } from '@app/base/forms';
import { RoutingHelper } from '@app/base/helpers';

import { WizardSummaryType } from '@modules/shared/forms';

import { ACCOUNT_DETAILS_INNOVATOR } from './manage-details-edit-innovator.config';
import { ACCOUNT_DETAILS_ACCESSOR } from './manage-details-edit-accessor.config';
import { ACCOUNT_DETAILS_ADMIN } from './manage-details-edit-admin.config';
import { UpdateUserInfo } from '@modules/stores/ctx/user/user.service';

@Component({
  selector: 'shared-pages-account-manage-details-edit',
  templateUrl: './manage-details-edit.component.html'
})
export class PageAccountManageDetailsEditComponent extends CoreComponent implements OnInit {
  @ViewChild(FormEngineComponent) formEngineComponent?: FormEngineComponent;

  module: '' | 'innovator' | 'accessor' | 'assessment' | 'admin' = '';

  wizard: WizardEngineModel = new WizardEngineModel({});

  summaryList: WizardSummaryType[] = [];

  isQuestionStep(): boolean {
    return Number.isInteger(Number(this.activatedRoute.snapshot.params.stepId));
  }
  isSummaryStep(): boolean {
    return this.activatedRoute.snapshot.params.stepId === 'summary';
  }

  constructor(private activatedRoute: ActivatedRoute) {
    super();

    this.module = RoutingHelper.getRouteData<any>(this.activatedRoute.root).module;
  }

  ngOnInit(): void {
    if (this.ctx.user.isInnovator()) {
      this.wizard = ACCOUNT_DETAILS_INNOVATOR;
    } else if (this.ctx.user.isAccessorOrAssessment()) {
      this.wizard = ACCOUNT_DETAILS_ACCESSOR;
    } else if (this.ctx.user.isAdmin()) {
      this.wizard = ACCOUNT_DETAILS_ADMIN;
    }

    const user = this.ctx.user.getUserInfo();
    this.wizard.setAnswers(this.wizard.runInboundParsing(user)).runRules();

    this.subscriptions.push(
      this.activatedRoute.params.subscribe(params => {
        if (!this.wizard.isValidStep(params.stepId)) {
          this.redirectTo('/not-found');
          return;
        }

        if (this.isSummaryStep()) {
          this.setPageTitle('Check your answers', { size: 'l' });
          this.setBackLink('Go back', this.onSubmitStep.bind(this, 'previous', new Event('')));
          this.summaryList = this.wizard.runSummaryParsing();
          this.setPageStatus('READY');
          return;
        }

        this.setPageTitle(this.wizard.currentStepTitle(), { showPage: false });
        this.setBackLink('Go back', this.onSubmitStep.bind(this, 'previous', new Event('')));
        this.wizard.gotoStep(Number(params.stepId));

        this.setPageStatus('READY');
      })
    );
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
    const wizardData = this.wizard.runOutboundParsing();

    let body: UpdateUserInfo = {
      displayName: wizardData.displayName
    };

    if (this.ctx.user.isInnovator()) {
      body = {
        displayName: wizardData.displayName,
        contactByPhone: wizardData.contactByPhone,
        contactByEmail: wizardData.contactByEmail,
        contactByPhoneTimeframe: wizardData.contactByPhoneTimeframe || null,
        mobilePhone: wizardData.mobilePhone || null,
        contactDetails: wizardData.contactDetails || null,
        ...(wizardData.organisation ? { organisation: wizardData.organisation } : {}),
        howDidYouFindUsAnswers: {}
      };
    }

    this.ctx.user.updateUserInfo$(body).subscribe({
      next: () => {
        this.setRedirectAlertSuccess('Your information has been saved');
        this.redirectTo(`${this.module}/account/manage-details`);
      },
      error: () => {
        this.setAlertError(
          'An error occurred while updating information. Please try again or contact us for further help'
        );
      }
    });
  }

  getStepUrl(stepNumber: number | undefined): string {
    return `/${this.module}/account/manage-details/edit/${stepNumber}`;
  }

  getNavigationUrl(action: 'previous' | 'next'): string {
    let url = `/${this.module}/account/manage-details`;

    switch (action) {
      case 'previous':
        if (this.wizard.isFirstStep()) {
          url += ``;
        } else if (this.isSummaryStep()) {
          url += `/edit/${this.wizard.steps.length}`;
        } else {
          url += `/edit/${Number(this.wizard.currentStepId) - 1}`;
        }
        break;

      case 'next':
        if (this.isSummaryStep()) {
          url += ``;
        } else if (this.wizard.isLastStep()) {
          url += `/edit/summary`;
        } else {
          url += `/edit/${Number(this.wizard.currentStepId) + 1}`;
        }
        break;

      default: // Should NOT happen!
        url += '';
        break;
    }

    return url;
  }
}
