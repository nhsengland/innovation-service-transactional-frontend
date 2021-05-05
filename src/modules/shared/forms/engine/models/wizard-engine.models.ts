import { MappedObject } from '@modules/core';
import { FormEngineModel } from './form-engine.models';

export class WizardEngineModel {

  steps: FormEngineModel[];
  runtimeRules: ((steps: FormEngineModel[], currentValues: { [key: string]: any }, currentStep: number) => void)[];
  inboundParsing?: (data: any) => MappedObject;
  outboundParsing?: (data: any) => MappedObject;
  currentStepNumber: number;


  constructor(data: Partial<WizardEngineModel>) {
    this.steps = data.steps || [];
    this.runtimeRules = data.runtimeRules || [];
    this.inboundParsing = data.inboundParsing;
    this.outboundParsing = data.outboundParsing;
    this.currentStepNumber = data.currentStepNumber || 1;
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
