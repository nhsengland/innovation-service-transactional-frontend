import { EventEmitter } from '@angular/core';


export type WizardStepEventType<T> = { isComplete: boolean, data: T };

export type WizardStepComponentType<InputType, OutputType> = {

  title: string;
  data: InputType;
  // steps: { currentStep: number, totalSteps: number };

  cancelEvent: EventEmitter<WizardStepEventType<OutputType>>;
  previousStepEvent: EventEmitter<WizardStepEventType<OutputType>>;
  nextStepEvent: EventEmitter<WizardStepEventType<OutputType>>;
  submitEvent: EventEmitter<WizardStepEventType<OutputType>>;

  onCancel?: () => void;
  onPreviousStep?: (data?: OutputType) => void;
  onNextStep?: (data?: OutputType) => void;
  onSubmit?: (data?: OutputType) => void;

};
