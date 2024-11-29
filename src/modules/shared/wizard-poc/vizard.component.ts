import { VizardService } from './vizard.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { VizardStep } from './vizard.types';

import { CoreComponent } from '@app/base';

@Component({
  selector: 'app-vizard',
  templateUrl: './vizard.component.html'
})
export class VizardComponent<T> extends CoreComponent implements OnInit {
  @Input({ required: true }) steps: VizardStep[] = [];
  @Input({ required: true }) answers: T = {} as T;
  @Input() entryPointUrl: string | null = null;

  @Output() runRulesEvent = new EventEmitter<{ currentStep: VizardStep; answers: T }>();
  @Output() submitEvent = new EventEmitter<T>();

  currentStepNumber = 1;

  constructor(private vizardService: VizardService<T>) {
    super();
    console.log('VizardComponent constructor');

    this.subscriptions.push(
      this.vizardService.previousSubject$.subscribe(outputData => {
        console.log('previousSubject$', outputData);
        this.goToPreviousStep(outputData);
      }),

      this.vizardService.nextSubject$.subscribe(outputData => {
        console.log('nextSubject$', outputData);
        this.goToNextStep(outputData);
      }),

      this.vizardService.submitSubject$.subscribe(() => {
        console.log('submitSubject$');
        this.submit();
      }),

      this.vizardService.goToStepSubject$.subscribe(stepId => {
        console.log('goToStepSubject$', stepId);
        this.goToStep(stepId);
      }),

      this.vizardService.addStepSubject$.subscribe(({ newStep, stepNumber }) => {
        console.log('addStepSubject$', newStep, stepNumber);
        this.addStep(newStep, stepNumber);
      }),

      this.vizardService.removeStepSubject$.subscribe(stepId => {
        console.log('removeStepSubject$', stepId);
        this.removeStep(stepId);
      })
    );
  }

  ngOnInit(): void {
    this.setPageStatus('READY');
  }

  getStepById(id: string): VizardStep | undefined {
    return this.steps.find(step => step.id === id);
  }

  addStep(newStep: VizardStep, stepNumber?: number): void {
    if (!this.steps.some(step => step.id === newStep.id)) {
      if (stepNumber !== undefined) {
        this.steps.splice(stepNumber - 1, 0, newStep);
      } else {
        this.steps.push(newStep);
      }
    }
  }

  removeStep(stepId: string): void {
    this.steps = this.steps.filter(step => step.id !== stepId);
  }

  isFirstStep(): boolean {
    return this.currentStepNumber === 1;
  }

  isLastStep(): boolean {
    return this.currentStepNumber === this.steps.length;
  }

  getCurrentStep(): VizardStep {
    return this.steps[this.currentStepNumber - 1];
  }

  getCurrentStepNumber(): number {
    return this.currentStepNumber;
  }

  setCurrentStepByNumber(stepNumber: number): void {
    this.currentStepNumber = stepNumber;
  }

  goToPreviousStep(outputData?: Partial<T>): void {
    if (this.currentStepNumber > 1) {
      if (outputData) this.addCurrentStepOutputToAnswers(outputData);
      this.setCurrentStepByNumber(this.currentStepNumber - 1);
    } else {
      const redirectUrl =
        this.entryPointUrl ??
        this.ctx.layout.previousUrl() ??
        `/${this.stores.authentication.userUrlBasePath()}/dashboard`;
      this.redirectTo(redirectUrl);
    }
  }

  goToNextStep(outputData?: Partial<T>): void {
    if (this.currentStepNumber < this.steps.length) {
      if (outputData) this.addCurrentStepOutputToAnswers(outputData);
      this.runRules();
      this.setCurrentStepByNumber(this.currentStepNumber + 1);
    }
  }

  goToStep(stepId: string): void {
    const stepNumber = this.steps.findIndex(step => step.id === stepId) + 1;
    if (stepNumber) {
      this.setCurrentStepByNumber(stepNumber);
    }
  }

  addCurrentStepOutputToAnswers(outputData: Partial<T>) {
    this.answers = { ...this.answers, ...outputData };
  }

  getCurrentStepInputs() {
    const currentStep = this.getCurrentStep();
    return {
      title: currentStep.title,
      answers: this.answers,
      ...(currentStep?.supportData && { supportData: currentStep.supportData })
    };
  }

  runRules(): void {
    this.runRulesEvent.emit({ currentStep: this.getCurrentStep(), answers: this.answers });
  }

  submit(): void {
    this.submitEvent.emit(this.answers);
  }
}
