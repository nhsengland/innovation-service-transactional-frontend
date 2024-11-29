import { EventEmitter } from '@angular/core';

export type WizardStepEventType<T> = { isComplete: boolean; data: T };

export type WizardStepComponentTypePOC<InputType, OutputType> = {
  title: string;
  data: InputType;

  submitEvent?: EventEmitter<WizardStepEventType<OutputType>>;
  sendDataEvent?: EventEmitter<WizardStepEventType<OutputType>>;
  goToStepEvent?: EventEmitter<string>;

  onSubmit?: (data?: OutputType) => void;
  onSendData?: (data?: OutputType) => void;
  onGoToStep?: (stepId: string) => void;
};
