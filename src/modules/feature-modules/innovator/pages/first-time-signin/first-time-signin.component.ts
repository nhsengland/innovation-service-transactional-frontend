import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base/core.component';
import { FormEngineComponent, FormEngineHelper, FormEngineModel } from '@app/base/forms';

import { FIRST_TIME_SIGNIN_QUESTIONS } from '@app/config/constants.config';
import { environment } from '@app/config/environment.config';

import { InnovatorService } from '../../services/innovator.service';

@Component({
  selector: 'app-innovator-pages-first-time-signin',
  templateUrl: './first-time-signin.component.html'
})
export class FirstTimeSigninComponent extends CoreComponent implements OnInit, AfterViewInit {

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

  isVisibleStep(stepId: number): boolean {
    const step = this.stepsData[stepId - 1];
    return (!step.visibility || (step.visibility && step.visibility.values.includes(this.currentAnswers[step.visibility.parameter])));
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovatorService: InnovatorService
  ) {

    super();

    this.stepsData = FIRST_TIME_SIGNIN_QUESTIONS;
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

          this.currentStep.number = Number(params.id);

          if (!this.isValidStepId()) {
            this.redirectTo('not-found');
            return;
          }

          if (this.isQuestionStep()) {

            if (!this.isVisibleStep(this.currentStep.number)) {

              // Remove previously anwsered questions if it is currenly invisible.
              this.stepsData[this.currentStep.number - 1].parameters.forEach(p => {
                delete this.currentAnswers[p.id];
              });

              this.redirectTo(this.getNavigationUrl(this.activatedRoute.snapshot.queryParams.a));
              return;
            }

            this.currentStep.data = this.stepsData[this.currentStep.number - 1];
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
        this.currentStep.data = FIRST_TIME_SIGNIN_QUESTIONS[this.currentStep.number - 1];
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

    if (this.isLastStep() && action === 'next') { this.onSubmitSurvey(); }
    else { this.redirectTo(this.getNavigationUrl(action), { a: action }); }

  }

  onSubmitSurvey(): void {

    this.prepareSummaryData();

    if (this.summaryList.valid) {
      this.innovatorService.submitFirstTimeSigninInfo(this.currentAnswers).subscribe(
        response => {
          this.redirectTo(`${this.getBaseUrl()}/innovator/dashboard`, { surveyId: response });
          return;
        },
        error => {
          console.log(error);
          this.redirectTo(`${this.getBaseUrl()}/innovator/first-time-signin/summary`);
        }
      );
    }

  }

  getNavigationUrl(action: 'previous' | 'next'): string {

    let url = `${this.getBaseUrl()}/innovator`;

    switch (action) {
      case 'previous':
        if (this.isFirstStep()) { url += ''; }
        else if (this.isSummaryStep()) { url += `/first-time-signin/${this.stepsData.length}`; }
        else { url += `/first-time-signin/${this.currentStep.number - 1}`; }
        break;

      case 'next':
        if (this.currentStep.number === this.stepsData.length) { url += '/first-time-signin/summary'; }
        else { url += `/first-time-signin/${this.currentStep.number + 1}`; }
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

    let url = `${this.getBaseUrl()}/innovator/first-time-signin/`;
    if (this.isQuestionStep()) { url += this.currentStep.number; }
    if (this.isSummaryStep()) { url += 'summary'; }

    return this.encodeUrlQueryParams(url, { a: action, f: this.currentAnswers });

  }

  getBaseUrl(): string {
    return (this.isRunningOnServer()) ? environment.BASE_URL : '';
  }

  prepareSummaryData(): void {

    this.summaryList = { items: [], valid: true };

    const parameters = this.stepsData.filter((step, i) => this.isVisibleStep(i + 1)).map(fd => fd.parameters).reduce((a, p) => [...a, ...p], []);
    const form = FormEngineHelper.buildForm(parameters, this.currentAnswers);
    const errors = FormEngineHelper.getErrors(form);

    this.summaryList.valid = form.valid;
    this.stepsData.forEach((step, stepIndex) => {
      if (this.isVisibleStep(stepIndex + 1)) {
        step.parameters.forEach(p => {
          this.summaryList.items.push({ label: step.label || '', value: this.currentAnswers[p.id], url: `/innovator/first-time-signin/${stepIndex + 1}`, errorMessage: errors[p.id] || null });
        });
      }
    });

  }

}
