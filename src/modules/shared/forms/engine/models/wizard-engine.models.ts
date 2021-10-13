import { MappedObject } from '@modules/core/interfaces/base.interfaces';
import { FormEngineModel, FormEngineParameterModel } from './form-engine.models';


export type SummaryParsingType = {
  label: string;
  value: null | undefined | string;
  editStepNumber?: number;
  evidenceId?: string;
  allowHTML?: boolean;
};


export class WizardEngineModel {

  steps: FormEngineModel[];
  currentStepId: number | 'summary';
  currentAnswers: { [key: string]: any };
  showSummary: boolean;
  runtimeRules: ((steps: FormEngineModel[], currentValues: any, currentStep: number | 'summary') => void)[];
  inboundParsing?: (data: any) => MappedObject;
  outboundParsing?: (data: any) => MappedObject;
  summaryParsing?: (data: any, steps?: FormEngineModel[]) => SummaryParsingType[];

  private summary: SummaryParsingType[] = [];

  constructor(data: Partial<WizardEngineModel>) {
    this.steps = data.steps || [];
    this.currentStepId = data.currentStepId || 1;
    this.currentAnswers = data.currentAnswers || {};
    this.showSummary = data.showSummary || false;
    this.runtimeRules = data.runtimeRules || [];
    this.inboundParsing = data.inboundParsing;
    this.outboundParsing = data.outboundParsing;
    this.summaryParsing = data.summaryParsing;
  }

  runRules(data?: MappedObject): this {
    this.runtimeRules.forEach(rule => rule(this.steps, data || this.currentAnswers, this.currentStepId));
    return this;
  }

  runInboundParsing(data: MappedObject): MappedObject {
    return this.inboundParsing ? this.inboundParsing(data) : data;
  }

  runOutboundParsing(data?: MappedObject): MappedObject {
    const v = data || this.currentAnswers;
    return this.outboundParsing ? this.outboundParsing(v) : v;
  }

  runSummaryParsing(data?: MappedObject): SummaryParsingType[] {

    if (!this.summaryParsing) { return []; }

    this.summary = this.summaryParsing(data || this.currentAnswers, this.steps);

    return this.summary;

  }

  isFirstStep(): boolean { return Number(this.currentStepId) === 1; }
  isLastStep(): boolean { return Number(this.currentStepId) === this.steps.length; }
  isValidStep(step: number | 'summary'): boolean {
    return ((1 <= Number(step) && Number(step) <= this.steps.length) || step === 'summary');
  }
  isQuestionStep(): boolean {

    if (typeof this.currentStepId !== 'number') { return false; }

    return (1 <= Number(this.currentStepId) && Number(this.currentStepId) <= this.steps.length);

  }
  isSummaryStep(): boolean {
    return (this.showSummary && this.currentStepId === 'summary');
  }


  currentStep(): FormEngineModel {
    if (typeof this.currentStepId === 'number') {
      return this.steps[this.currentStepId - 1];
    } else {
      return new FormEngineModel({ parameters: [] });
    }
  }

  currentStepParameters(): FormEngineParameterModel[] {
    if (typeof this.currentStepId === 'number') {
      return this.steps[this.currentStepId - 1].parameters;
    } else {
      return [];
    }
  }

  previousStep(): this {

    if (typeof this.currentStepId === 'number') {
      this.currentStepId--;
    } else if (this.showSummary && this.currentStepId === 'summary') {
      this.currentStepId = this.steps.length;
    }

    return this;

  }

  nextStep(): this {

    if (this.showSummary && typeof this.currentStepId === 'number' && this.currentStepId === this.steps.length) {
      this.runSummaryParsing();
      this.currentStepId = 'summary';
    } else if (typeof this.currentStepId === 'number') {
      this.currentStepId++;
    }

    return this;

  }

  gotoStep(step: number | 'summary'): this {

    if (step === 'summary') { this.runSummaryParsing(); }

    this.currentStepId = step;

    return this;
  }

  getAnswers(): { [key: string]: any } {
    return this.currentAnswers;
  }
  addAnswers(data: { [key: string]: any }): this {
    this.currentAnswers = { ...this.currentAnswers, ...data };
    return this;
  }
  setAnswers(data: { [key: string]: any }): this {
    this.currentAnswers = data;
    return this;
  }

  getSummary(): SummaryParsingType[] { return this.summary; }

}
