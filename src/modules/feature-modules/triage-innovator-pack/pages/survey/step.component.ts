import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { FormEngineComponent, FormEngineHelper, FormEngineModel } from '@app/base/forms';
import { AlertType } from '@app/base/models';

import { TRIAGE_INNOVATOR_PACK_QUESTIONS } from '../../config/constants.config';

import { SurveyService } from '../../services/survey.service';

@Component({
  selector: 'app-triage-innovator-pack-survey-step',
  templateUrl: './step.component.html'
})
export class SurveyStepComponent extends CoreComponent implements OnInit, AfterViewInit {

  @ViewChild(FormEngineComponent) formEngineComponent?: FormEngineComponent;

  alert: AlertType = { type: null };

  stepsData: FormEngineModel[] = [];
  currentStep: {
    number: number;
    data: FormEngineModel;
  };
  totalNumberOfSteps: number;

  currentAnswers: { [key: string]: any };
  summaryList: {
    items: {
      label: string,
      value: string,
      url: string,
      // queryParams: MappedObject,
      errorMessage: string | null
    }[];
    valid: boolean;
  };

  endingData: { rule: '' | 'RULE_01' | 'RULE_02' | 'RULE_03', bulletsList: string[] } = { rule: '', bulletsList: [] };

  signupUrl = '';

  isFirstStep(): boolean { return this.currentStep.number === 1; }
  isLastStep(): boolean { return this.currentStep.number === this.totalNumberOfSteps; }
  isQuestionStep(): boolean { return Number.isInteger(Number(this.activatedRoute.snapshot.params.id)); }
  isSummaryStep(): boolean { return this.activatedRoute.snapshot.params.id === 'summary'; }
  isEndStep(): boolean { return this.activatedRoute.snapshot.params.id === 'end'; }

  isValidStepId(): boolean {
    const id = this.activatedRoute.snapshot.params.id;
    return ((1 <= Number(id) && Number(id) <= this.stepsData.length) || id === 'summary' || id === 'end');
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private surveyService: SurveyService
  ) {

    super();

    this.stepsData = TRIAGE_INNOVATOR_PACK_QUESTIONS.map(item => item.question);
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
            this.currentStep.data = TRIAGE_INNOVATOR_PACK_QUESTIONS[this.currentStep.number - 1].question;
            this.currentStep.data.defaultData = this.currentAnswers;
            this.setPageTitle(this.currentStep.data.parameters[0].label || ''); // Only 1 question per page.
          }

          if (this.isSummaryStep()) {
            this.setPageTitle('Check your answers before completing');
            this.prepareSummaryData();
          }

          if (this.isEndStep()) {
            this.setPageTitle('Submitted successfully');
            this.prepareEndingData();
          }

        })
      );
    }


    if (this.isRunningOnServer()) {

      if (!this.isValidStepId()) {
        this.redirectTo('not-found');
        return;
      }

      const urlQueryParams = this.decodeQueryParams(this.activatedRoute.snapshot.queryParams || {});
      this.currentAnswers = { ...(urlQueryParams.f || {}), ...this.requestBody };

      if (this.isQuestionStep()) {
        this.currentStep.number = Number(this.activatedRoute.snapshot.params.id);
        this.currentStep.data = TRIAGE_INNOVATOR_PACK_QUESTIONS[this.currentStep.number - 1].question;
        this.currentStep.data.defaultData = this.currentAnswers;
        this.setPageTitle(this.currentStep.data.parameters[0].label || ''); // Only 1 question per page.
      }

      if (this.isSummaryStep()) {
        this.setPageTitle('Check your answers before completing');
        this.prepareSummaryData();
      }

      if (this.isEndStep()) {
        this.setPageTitle('Submitted successfully');
        this.prepareEndingData();
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
        response => {
          this.redirectTo(`${this.getBaseUrl()}/triage-innovator-pack/survey/end`, { surveyId: response.id });
          this.signupUrl = `${this.stores.environment.APP_URL}/signup?surveyId=${response.id}`;
        },
        error => {
          this.redirectTo(`${this.getBaseUrl()}/triage-innovator-pack/survey/summary`);
        }
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
    return (this.isRunningOnServer()) ? this.stores.environment.ENV.BASE_PATH : '';
  }

  prepareSummaryData(): void {

    this.alert = { type: null };
    this.summaryList = { items: [], valid: true };

    const parameters = this.stepsData.map(fd => fd.parameters).reduce((a, p) => [...a, ...p], []);
    const form = FormEngineHelper.buildForm(parameters, this.currentAnswers);
    const errors = FormEngineHelper.getErrors(form);

    this.summaryList.valid = form.valid;

    if (!this.summaryList.valid) {
      this.alert = { type: 'ERROR', title: 'Unable to fetch innovations transfers', setFocus: true };
    }

    this.stepsData.forEach((step, stepIndex) => {
      step.parameters.forEach(p => {

        let value: string;

        switch (p.dataType) {
          case 'checkbox-array':
            value = ((this.currentAnswers[p.id] || []) as string[]).map(v => (p.items || []).find(i => i.value === v)?.label).join('\n');
            break;
          case 'radio-group':
            value = (p.items || []).find(i => i.value === this.currentAnswers[p.id])?.label || this.currentAnswers[p.id];
            break;
          default:
            value = this.currentAnswers[p.id];
            break;
        }

        this.summaryList.items.push({
          label: step.parameters[0].label || '',
          value,
          url: `/triage-innovator-pack/survey/${stepIndex + 1}`,
          // queryParams: this.isRunningOnServer() ? this.encodeQueryParams({ a: 'next', f: this.currentAnswers }) : {},
          errorMessage: errors[p.id] || null
        });
      });
    });

  }

  prepareEndingData(): void {

    // Rule 01: If innovators answer "YES" from Q3 to Q10, and Q11 contains "I'm only looking for information right now".
    // Rule 02: If innovators answer "YES" from Q3 to Q10, and Q11 does NOT contains "I'm only looking for information right now".
    // Rule 03: None of the previous, adds a text per each questions that is not YES.

    const Q3ToQ10QuestionIds = ['hasProblemTackleKnowledge', 'hasMarketResearch', 'hasWhoBenefitsKnowledge', 'hasBenefits', 'hasTests', 'hasRelevanteCertifications', 'hasEvidence', 'hasCostEvidence'];

    let yesToQuestion3To10 = true;
    Q3ToQ10QuestionIds.forEach(item => {
      yesToQuestion3To10 = yesToQuestion3To10 && this.currentAnswers[item] === 'YES';
    });

    if (yesToQuestion3To10 && this.currentAnswers.supportTypes?.includes('INFORMATION')) {
      this.endingData = { rule: 'RULE_01', bulletsList: [] };
      return;
    } else if (yesToQuestion3To10 && !this.currentAnswers.supportTypes?.includes('INFORMATION')) {
      const Q11 = TRIAGE_INNOVATOR_PACK_QUESTIONS.find(p => p.question.parameters[0].id === 'supportTypes');
      this.endingData = {
        rule: 'RULE_02',
        bulletsList: ((this.currentAnswers.supportTypes || []) as string[]).map(v => (Q11?.question.parameters[0].items || []).find(i => i.value === v)?.label || '')
      };
      return;
    }

    this.endingData = {
      rule: 'RULE_03',
      bulletsList: Q3ToQ10QuestionIds.map(item => {

        const question = TRIAGE_INNOVATOR_PACK_QUESTIONS.find(p => p.question.parameters[0].id === item);
        const answer = question?.summary[this.currentAnswers[item]];

        if (answer) { return answer; }

        return '';

      }).filter(item => item)

    };

  }


  // encodeQueryParams(queryParams: MappedObject): MappedObject {
  //   const toReturn: MappedObject = {};
  //   for (let [key, value] of Object.entries(queryParams || {})) {
  //     if (UtilsHelper.isEmpty(value)) { break; }
  //     if (typeof value === 'object') { value = JSON.stringify(value); }
  //     toReturn[key] = encodeURIComponent(this.encodeInfo(value));
  //   }
  //   return toReturn;
  // }

}
