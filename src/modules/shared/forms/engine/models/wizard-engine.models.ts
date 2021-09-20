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
    this.runtimeRules.forEach(rule => rule(this.steps, data || this.currentAnswers, this.currentStepNumber));
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

    return this.summaryParsing(data || this.currentAnswers);

  }



  isFirstStep(): boolean { return this.currentStepNumber === 1; }
  isLastStep(): boolean { return this.currentStepNumber === this.steps.length; }
  isValidStepNumber(stepNumber: number | string): boolean {
    return (1 <= Number(stepNumber) && Number(stepNumber) <= this.steps.length);
  }


  currentStep(): FormEngineModel {
    return this.steps[this.currentStepNumber - 1];
  }

  currentStepParameters(): FormEngineParameterModel[] {
    return this.steps[this.currentStepNumber - 1].parameters;
  }

  previousStep(): this {
    this.currentStepNumber--;
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
