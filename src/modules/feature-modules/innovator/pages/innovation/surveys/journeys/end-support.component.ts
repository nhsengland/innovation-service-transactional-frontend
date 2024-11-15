import { Component, OnInit, signal, ViewChild } from '@angular/core';

import { FormEngineComponent, WizardEngineModel } from '@app/base/forms';
import { ACCOUNT_DETAILS_INNOVATOR } from './end-support.config';
import { CoreComponent } from '@app/base';
import { ActivatedRoute } from '@angular/router';
import { InnovatorService, SurveyAnswersType } from '@modules/feature-modules/innovator/services/innovator.service';
import { HttpErrorResponse } from '@angular/common/http';
import { cloneDeep } from 'lodash';
import { InnovationErrorsEnum } from '@app/base/enums';

@Component({
  selector: 'innovator-end-support-survey-journey',
  templateUrl: './end-support.component.html'
})
export class EndSupportSurveyJourney extends CoreComponent implements OnInit {
  @ViewChild(FormEngineComponent) formEngineComponent?: FormEngineComponent;

  wizard: WizardEngineModel = cloneDeep(ACCOUNT_DETAILS_INNOVATOR);

  innovationId: string;
  surveyId: string;
  baseUrl: string;
  onlyOneSurveyToAnswer: boolean = false;

  unitName = signal<null | string>(null);
  pageButton = signal<string>('Continue');
  isInfoPage = signal<boolean>(true);

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovatorService: InnovatorService
  ) {
    super();
    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.surveyId = this.activatedRoute.snapshot.params.surveyId;
    this.baseUrl = `/innovator/innovations/${this.innovationId}`;
    const state = this.router.getCurrentNavigation()?.extras.state;
    if (state) {
      this.unitName.set('unitName' in state && state.unitName);
      this.onlyOneSurveyToAnswer = 'onlyOneSurveyToAnswer' in state && state.onlyOneSurveyToAnswer;
    }

    this.setPageTitle('End support survey', { showPage: false });
  }

  ngOnInit(): void {
    if (!this.unitName()) {
      this.redirectTo(this.baseUrl + '/surveys');
      return;
    }

    this.wizard.setAnswers(this.wizard.runInboundParsing({ unitName: this.unitName() })).runRules();

    this.setBackLink('Go back', this.onSubmitStep.bind(this, 'previous'));
    this.setPageStatus('READY');
  }

  onSubmitStep(action: 'previous' | 'next'): void {
    const formData = this.formEngineComponent?.getFormValues() ?? { valid: false, data: {} };

    if (action === 'next' && !formData.valid) return;

    this.wizard.addAnswers(formData.data).runRules();

    switch (action) {
      case 'previous':
        if (this.isInfoPage()) {
          // We have this difference because if there is only one survey going to the "survey" selection page
          // would make it being redirected once again for this journey and be on a infinite loop.
          if (this.onlyOneSurveyToAnswer) {
            this.redirectTo(this.baseUrl);
          } else {
            this.redirectTo(this.baseUrl + '/surveys');
          }
        } else if (this.wizard.isFirstStep()) {
          this.isInfoPage.set(true);
        } else {
          this.wizard.previousStep();
        }
        break;
      case 'next':
        if (this.wizard.isLastStep()) {
          this.onSubmitWizard();
          return;
        }
        this.wizard.nextStep();
        break;
    }

    this.pageButton.set(this.wizard.isLastStep() ? 'Submit' : 'Continue');
  }

  onSubmitWizard(): void {
    const data = this.wizard.runOutboundParsing();
    const body: SurveyAnswersType = {
      comment: data.comment,
      ideaOnHowToProceed: data.ideaOnHowToProceed,
      supportSatisfaction: data.supportSatisfaction,
      howLikelyWouldYouRecommendIS: data.howLikelyWouldYouRecommendIS
    };

    this.innovatorService.answerSurvey(this.innovationId, this.surveyId, body).subscribe({
      next: () => {
        this.setRedirectAlertSuccess('You have successfully submitted your feedback.', {
          message:
            "Remember to update your innovation record with progress you've done while you were receiving support."
        });
        if (this.onlyOneSurveyToAnswer) {
          this.router.navigateByUrl(this.baseUrl);
        } else {
          this.router.navigateByUrl(this.baseUrl + '/surveys', { state: { redirectedFromAnswer: true } });
        }
      },
      error: ({ error: err }: HttpErrorResponse) => {
        if (err.error === InnovationErrorsEnum.INNOVATION_ALREADY_EXISTS) {
          this.setAlertError('This innovation survey was already answered');
        } else {
          this.setAlertError(
            'An error occurred while answering the feedback survey. Please try again or contact us for further help'
          );
        }
      }
    });
  }
}
