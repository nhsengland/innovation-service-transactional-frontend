import { MappedObject } from '@modules/core';
import { FormEngineModel } from './form-engine.models';

export class WizardEngineModel {

  steps: FormEngineModel[];
  currentStepNumber: number;
  runtimeRules: ((steps: FormEngineModel[], currentValues: { [key: string]: any }, currentStep: number) => void)[];
  inboundParsing?: (data: any) => MappedObject;
  outboundParsing?: (data: any) => MappedObject;
  summaryParsing?: (steps: FormEngineModel[], data: any) => { label: string, value: string, stepNumber: number }[];


  constructor(data: Partial<WizardEngineModel>) {
    this.steps = data.steps || [];
    this.currentStepNumber = data.currentStepNumber || 1;
    this.runtimeRules = data.runtimeRules || [];
    this.inboundParsing = data.inboundParsing;
    this.outboundParsing = data.outboundParsing;
    this.summaryParsing = data.summaryParsing;
  }

  runRules(currentValues: { [key: string]: any }): this {
    this.runtimeRules.forEach(rule => rule(this.steps, currentValues, this.currentStepNumber));
    return this;
  }

  runInboundParsing(data: MappedObject): MappedObject {
    return this.inboundParsing ? this.inboundParsing(data) : data;
  }

  runOutboundParsing(data: MappedObject): MappedObject {
    return this.outboundParsing ? this.outboundParsing(data) : data;
  }

  runSummaryParsing(data: MappedObject): { label: string, value: string, stepNumber: number }[] {
    return this.summaryParsing ? this.summaryParsing(this.steps, data) : [];
  }



  isFirstStep(): boolean { return this.currentStepNumber === 1; }
  isLastStep(): boolean { return this.currentStepNumber === this.steps.length; }


  currentStep(): FormEngineModel {
    return this.steps[this.currentStepNumber - 1];
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



}
