import { MappedObject } from '@modules/core';
import { FormEngineModel, FormEngineParameterModel } from './form-engine.models';

export type SummaryParsingType = {
  label: string;
  value: null | undefined | string;
  editStepNumber?: number;
  evidenceId?: string;
};

export class WizardEngineModel {

  steps: FormEngineModel[];
  currentStepNumber: number;
  currentAnswers: { [key: string]: any };
  runtimeRules: ((steps: FormEngineModel[], currentValues: any, currentStep: number) => void)[];
  inboundParsing?: (data: any) => MappedObject;
  outboundParsing?: (data: any) => MappedObject;
  summaryParsing?: (data: any) => SummaryParsingType[];

  constructor(data: Partial<WizardEngineModel>) {
    this.steps = data.steps || [];
    this.currentStepNumber = data.currentStepNumber || 1;
    this.currentAnswers = data.currentAnswers || {};
    this.runtimeRules = data.runtimeRules || [];
    this.inboundParsing = data.inboundParsing;
    this.outboundParsing = data.outboundParsing;
    this.summaryParsing = data.summaryParsing;
  }

  runRules(data?: MappedObject): this {

    const v = data || this.currentAnswers;

    this.runtimeRules.forEach(rule => rule(this.steps, v, this.currentStepNumber));
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
    const v = data || this.currentAnswers;
    return this.summaryParsing ? this.summaryParsing(v) : [];
  }



  isFirstStep(): boolean { return this.currentStepNumber === 1; }
  isLastStep(): boolean { return this.currentStepNumber === this.steps.length; }
  isValidStepNumber(stepNumber: number | string): boolean {
    return ((1 <= Number(stepNumber) && Number(stepNumber) <= this.steps.length));
  }


  currentStep(): FormEngineModel {
    return this.steps[this.currentStepNumber - 1];
  }

  currentStepParameters(): FormEngineParameterModel[] {
    return this.steps[this.currentStepNumber - 1].parameters;
  }

  previousStep(): this {
    this.currentStepNumber++;
    return this;
  }

  nextStep(): this {
    this.currentStepNumber++;
    return this;
  }

  gotoStep(stepNumber: number): this {
    this.currentStepNumber = stepNumber;
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

}
