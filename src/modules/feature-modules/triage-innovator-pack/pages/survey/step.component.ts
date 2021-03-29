import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base/core.component';
import { FormEngineComponent, FormEngineHelper, FormEngineModel } from '@app/base/forms';

import { TRIAGE_INNOVATOR_PACK_QUESTIONS } from '@app/config/constants.config';
import { environment } from '@app/config/environment.config';
import { SurveyService } from '@triage-innovator-pack-feature-module/services/survey.service';

@Component({
  selector: 'app-triage-innovator-pack-survey-step',
  templateUrl: './step.component.html'
})
export class SurveyStepComponent extends CoreComponent implements OnInit, AfterViewInit {

  @ViewChild(FormEngineComponent) formEngineComponent?: FormEngineComponent;

  stepsData: FormEngineModel[] = [];
  currentStep: {
    number: number;
    data: FormEngineModel;
  };
  totalNumberOfSteps: number;

  currentAnswers: { [key: string]: any };
  summaryList: {
    items: { label: string, value: string, url: string, errorMessage: string | null }[];
    valid: boolean;
  };

  isFirstStep(): boolean { return this.currentStep.number === 1; }
  isLastStep(): boolean { return this.currentStep.number === this.totalNumberOfSteps; }
  isQuestionStep(): boolean { return Number.isInteger(Number(this.activatedRoute.snapshot.params.id)); }
  isSummaryStep(): boolean { return this.activatedRoute.snapshot.params.id === 'summary'; }

  isValidStepId(): boolean {
    const id = this.activatedRoute.snapshot.params.id;
    return ((1 <= Number(id) && Number(id) <= this.stepsData.length) || id === 'summary');
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private surveyService: SurveyService
  ) {

    super();

    this.stepsData = TRIAGE_INNOVATOR_PACK_QUESTIONS;
    this.currentStep = {
      number: Number(this.activatedRoute.snapshot.params.id),
      data: new FormEngineModel({ parameters: [] })
    };
    this.totalNumberOfSteps = this.stepsData.length;

    this.currentAnswers = {};
    this.summaryList = { items: [], valid: false };

  }


  ngOnInit(): void {

    if (this.isRunningOnBrowser()) {

      this.subscriptions.push(
        this.activatedRoute.params.subscribe(params => {

          if (!this.isValidStepId()) {
            this.redirectTo('not-found');
            return;
          }

          if (this.isQuestionStep()) {
            this.currentStep.number = Number(params.id);
            this.currentStep.data = TRIAGE_INNOVATOR_PACK_QUESTIONS[this.currentStep.number - 1];
            this.currentStep.data.defaultData = this.currentAnswers;
          }

          if (this.isSummaryStep()) {
            this.prepareSummaryData();
          }

        })
      );
    }


    if (this.isRunningOnServer()) {

      if (!this.isValidStepId()) {
        this.redirectTo('not-found');
        return;
      }

      const urlQueryParams = this.decodeQueryParams(this.activatedRoute.snapshot.queryParams);
      this.currentAnswers = { ...(urlQueryParams.f || {}), ...this.requestBody };

      if (this.isQuestionStep()) {
        this.currentStep.number = Number(this.activatedRoute.snapshot.params.id);
        this.currentStep.data = TRIAGE_INNOVATOR_PACK_QUESTIONS[this.currentStep.number - 1];
        this.currentStep.data.defaultData = this.currentAnswers;
      }

      if (this.isSummaryStep()) {
        this.prepareSummaryData();
      }

      if (this.isDataRequest()) { // POST request will be treated here!

        switch (urlQueryParams.a) {
          case 'previous':
          case 'next':
            const form = FormEngineHelper.buildForm(this.currentStep.data.parameters, this.currentStep.data.defaultData);
            if (urlQueryParams.a === 'previous' || (urlQueryParams.a === 'next' && form.valid)) { // Apply validation only when moving forward.
              this.redirectTo(this.getNavigationUrl(urlQueryParams.a), { f: this.currentAnswers });
              return;
            }
            break;

          case 'submit':
            this.onSubmitSurvey();
            break;

          default:
            this.redirectTo('not-found'); // Should not happen!
            break;
        }

      }


    }

  }

  ngAfterViewInit(): void {

    if (this.isRunningOnServer() && this.isDataRequest()) {
      this.formEngineComponent?.getFormValues(); // This will trigger errors to show up and be rendered to client.
    }

  }


  onSubmitStep(action: 'previous' | 'next'): void {

    const formData = this.formEngineComponent?.getFormValues();

    if (action === 'next' && !formData?.valid) { // Apply validation only when moving forward.
      return;
    }

    this.currentAnswers = { ...this.currentAnswers, ...formData?.data };

    this.redirectTo(this.getNavigationUrl(action));

  }

  onSubmitSurvey(): void {
    if (this.summaryList.valid) {
      this.surveyService.submitSurvey(this.currentAnswers).subscribe(
        response => this.redirectTo(`${this.getBaseUrl()}/triage-innovator-pack/survey/end`, { surveyId: response.id }),
        error => this.logger.error(error)
      );
    }
  }

  getNavigationUrl(action: 'previous' | 'next'): string {

    let url = `${this.getBaseUrl()}/triage-innovator-pack`;

    switch (action) {
      case 'previous':
        if (this.isFirstStep()) { url += ''; }
        else if (this.isSummaryStep()) { url += `/survey/${this.stepsData.length}`; }
        else { url += `/survey/${this.currentStep.number - 1}`; }
        break;

      case 'next':
        if (this.currentStep.number === this.stepsData.length) { url += '/survey/summary'; }
        else { url += `/survey/${this.currentStep.number + 1}`; }
        break;

      default: // Should NOT happen!
        url += '';
        break;
    }

    if (this.isRunningOnServer()) {
      url = this.encodeUrlQueryParams(url, { a: action, f: this.currentAnswers });
    }

    return url;

  }

  getDataSubmissionUrl(action: 'previous' | 'next' | 'submit'): string {

    let url = `${this.getBaseUrl()}/triage-innovator-pack/survey/`;
    if (this.isQuestionStep()) { url += this.currentStep.number; }
    if (this.isSummaryStep()) { url += 'summary'; }

    return this.encodeUrlQueryParams(url, { a: action, f: this.currentAnswers });

  }

  getBaseUrl(): string {
    return (this.isRunningOnServer()) ? environment.BASE_URL : '';
  }

  prepareSummaryData(): void {

    this.summaryList = { items: [], valid: true };

    const parameters = this.stepsData.map(fd => fd.parameters).reduce((a, p) => [...a, ...p], []);
    const form = FormEngineHelper.buildForm(parameters, this.currentAnswers);
    const errors = FormEngineHelper.getErrors(form);

    this.summaryList.valid = form.valid;
    this.stepsData.forEach((step, stepIndex) => {
      step.parameters.forEach(p => {
        this.summaryList.items.push({ label: step.label || '', value: this.currentAnswers[p.id], url: `/triage-innovator-pack/survey/${stepIndex + 1}`, errorMessage: errors[p.id] || null });
      });
    });

  }

}
