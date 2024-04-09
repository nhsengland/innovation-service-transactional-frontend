import { MappedObjectType } from '@modules/core/interfaces/base.interfaces';
import { FormEngineHelper } from '../helpers/form-engine.helper';
import { FormEngineModel, FormEngineParameterModel } from './form-engine.models';
import { ValidatorFn } from '@angular/forms';

export type WizardStepType = FormEngineModel & { saveStrategy?: 'updateAndWait' };

export type WizardSummaryType = {
  type?: 'keyValueLink' | 'button';
  label: string;
  value?: null | string;
  editStepNumber?: number;
  evidenceId?: string;
  allowHTML?: boolean;
  isFile?: boolean;
  isOptional?: boolean;
};

export type StepsParentalRelationsType = {
  [child: string]: string;
};

export class WizardEngineModel {
  isChangingMode: boolean = false;
  visitedSteps: Set<string> = new Set<string>();
  steps: WizardStepType[];
  formValidations: ValidatorFn[];
  stepsChildParentRelations: StepsParentalRelationsType;
  currentStepId: number | 'summary';
  currentAnswers: { [key: string]: any };
  showSummary: boolean;
  runtimeRules: ((steps: FormEngineModel[], currentValues: any, currentStep: number | 'summary') => void)[];
  inboundParsing?: (data: any) => MappedObjectType;
  outboundParsing?: (data: any) => MappedObjectType;
  summaryParsing?: (data: any, steps?: FormEngineModel[]) => WizardSummaryType[];
  summaryPDFParsing?: (data: any, steps?: FormEngineModel[]) => WizardSummaryType[];

  private summary: WizardSummaryType[] = [];

  constructor(data: Partial<WizardEngineModel>) {
    this.steps = data.steps ?? [];
    this.formValidations = data.formValidations ?? [];
    this.stepsChildParentRelations = data.stepsChildParentRelations ?? {};
    this.currentStepId = parseInt(data.currentStepId as string, 10) || 1;
    this.currentAnswers = data.currentAnswers ?? {};
    this.showSummary = data.showSummary ?? false;
    this.runtimeRules = data.runtimeRules ?? [];
    this.inboundParsing = data.inboundParsing;
    this.outboundParsing = data.outboundParsing;
    this.summaryParsing = data.summaryParsing;
  }

  runRules(data?: MappedObjectType): this {
    this.runtimeRules.forEach(rule => rule(this.steps, data ?? this.currentAnswers, this.currentStepId));
    return this;
  }

  runInboundParsing(data: MappedObjectType): MappedObjectType {
    return this.inboundParsing ? this.inboundParsing(data) : data;
  }

  runOutboundParsing(data?: MappedObjectType): MappedObjectType {
    const v = data || this.currentAnswers;
    return this.outboundParsing ? this.outboundParsing(v) : v;
  }

  runSummaryParsing(data?: MappedObjectType): WizardSummaryType[] {
    if (!this.summaryParsing) {
      return [];
    }

    this.summary = this.summaryParsing(data || this.currentAnswers, this.steps);

    return this.summary;
  }

  isFirstStep(): boolean {
    return Number(this.currentStepId) === 1;
  }
  isLastStep(): boolean {
    return Number(this.currentStepId) === this.steps.length;
  }
  isValidStep(step: number | 'summary'): boolean {
    return (1 <= Number(step) && Number(step) <= this.steps.length) || step === 'summary';
  }
  isQuestionStep(): boolean {
    if (typeof this.currentStepId !== 'number') {
      return false;
    }

    return 1 <= Number(this.currentStepId) && Number(this.currentStepId) <= this.steps.length;
  }
  isSummaryStep(): boolean {
    return this.showSummary && this.currentStepId === 'summary';
  }

  currentStep(): FormEngineModel & WizardStepType {
    if (typeof this.currentStepId === 'number') {
      return this.steps[this.currentStepId - 1];
    } else {
      return { ...new FormEngineModel({ parameters: [] }) };
    }
  }
  currentStepTitle(): string {
    const step = this.currentStep();
    return step.label || step.parameters[0]?.label || '';
  }
  currentStepParameters(): FormEngineParameterModel[] {
    return this.currentStep().parameters;
  }

  getFormValidations(): ValidatorFn[] {
    console.log('form validations:', this.formValidations);
    return this.formValidations;
  }

  previousStep(): this {
    if (this.showSummary && this.currentStepId === 'summary') {
      this.currentStepId = this.steps.length;
    } else if (typeof this.currentStepId === 'number') {
      this.currentStepId--;
      if (this.isChangingMode) {
        if (this.visitedSteps.has(this.getCurrentStepObjId())) {
          return this;
        } else {
          this.previousStep();
        }
      }
    }
    return this;
  }

  gotoSummary(): void {
    this.runSummaryParsing();
    this.currentStepId = 'summary';
  }

  gotoStep(step: number | 'summary', isChangeMode: boolean = false): this {
    this.visitedSteps.clear();

    this.isChangingMode = isChangeMode;

    if (step === 'summary') {
      this.runSummaryParsing();
    }

    this.currentStepId = parseInt(step as string, 10);

    this.visitedSteps.add(this.getCurrentStepObjId());

    return this;
  }

  nextStep(): this {
    if (this.showSummary && typeof this.currentStepId === 'number' && this.currentStepId === this.steps.length) {
      this.gotoSummary();
    } else if (typeof this.currentStepId === 'number') {
      this.currentStepId++;
      this.visitedSteps.add(this.getCurrentStepObjId());

      if (this.isChangingMode) {
        this.checkStepConditions();
      }
    }

    return this;
  }

  checkStepConditions(): this {
    if (typeof this.currentStepId === 'number') {
      const isCurrentStepChildOfAnyVisitedSteps = this.visitedSteps.has(
        this.stepsChildParentRelations[this.getCurrentStepObjId()]
      );

      // Check if visitedSteps has no 'parent' steps in it, if so go to summary.
      if (![...this.visitedSteps].some(step => Object.values(this.stepsChildParentRelations).includes(step))) {
        this.gotoSummary();
        return this;
      }

      if (isCurrentStepChildOfAnyVisitedSteps) {
        return this;
      } else {
        this.visitedSteps.delete(this.getCurrentStepObjId());
        this.nextStep();
      }
    }

    return this;
  }

  getCurrentStepObjId(): string {
    // split on '_' to account for dynamic named steps (i.e.: 'standardHasMet_xxxxxxx' => 'standardHasMet')
    return this.currentStep()?.parameters[0].id.split('_')[0] ?? '';
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
  setInboundParsedAnswers(data?: MappedObjectType): this {
    this.currentAnswers = (this.inboundParsing ? this.inboundParsing(data) : data) ?? {};
    return this;
  }

  getSummary(): WizardSummaryType[] {
    return this.summary;
  }

  validateData(): { valid: boolean; errors: { title: string; description: string }[] } {
    const parameters = this.steps.flatMap(step => step.parameters);
    const form = FormEngineHelper.buildForm(parameters, this.currentAnswers);

    return {
      valid: form.valid,
      errors: Object.entries(FormEngineHelper.getErrors(form)).map(([key, value]) => ({
        title: parameters.find(p => p.id === key)?.label || '',
        description: value || ''
      }))
    };
  }
}
