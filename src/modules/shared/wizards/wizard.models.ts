import { Type } from '@angular/core';

import { WizardStepEventType } from './wizard.types';


export class WizardModel<T> {

  steps: WizardStepModel[];
  data: T | Record<string, never>;

  private currentStepNumberHolder: number;

  constructor(data?: Partial<WizardModel<T>>) {
    this.steps = data?.steps || [];
    this.data = data?.data || {};
    this.currentStepNumberHolder = 1;
  }


  addStep(step: WizardStepModel): this {
    this.steps.push(step);
    return this;
  }

  setStepData<StepData>(stepId: string, data: StepData): this {

    const step = this.steps.find(s => s.id === stepId);
    if (step) { step.data = data; }

    return this;

  }

  isFirstStep(): boolean { return this.currentStepNumberHolder === 1; }
  isLastStep(): boolean { return this.currentStepNumberHolder === this.steps.length; }
  currentStep(): WizardStepModel { return this.steps[this.currentStepNumberHolder - 1]; }
  currentStepNumber(): number { return this.currentStepNumberHolder; }

  gotoPreviousStep(): this {

    if (this.currentStepNumberHolder > 0) {
      this.currentStepNumberHolder--;
    }

    return this;
  }


  gotoNextStep(): this {

    if (this.currentStepNumberHolder < this.steps.length) {
      this.currentStepNumberHolder++;
    }

    return this;

  }

  gotoStep(stepNumber: number): void {
    this.currentStepNumberHolder = stepNumber;
  }

}


export class WizardStepModel<InputType = any, OutputType = any> {

  id: string;
  title: string;
  isSubmitStep?: boolean;
  component: Type<any>;
  data: InputType;
  outputs: {
    cancelEvent?: () => void,
    previousStepEvent?: (data: WizardStepEventType<OutputType>) => void,
    nextStepEvent?: (data: WizardStepEventType<OutputType>) => void,
    submitEvent?: (data: WizardStepEventType<OutputType>) => void
  };

  constructor(data: WizardStepModel<InputType, OutputType>) {
    this.id = data.id;
    this.title = data.title;
    this.isSubmitStep = data.isSubmitStep;
    this.component = data.component;
    this.data = data.data;
    this.outputs = data.outputs;
  }

}
