import { MappedObjectType } from '@modules/core/interfaces/base.interfaces';
import { FormEngineHelper } from '../helpers/form-engine.helper';
import { FormEngineModel, FormEngineParameterModel } from './form-engine.models';
import { ThisReceiver } from '@angular/compiler';

export type WizardStepType = FormEngineModel & { saveStrategy?: 'updateAndWait' };

export type WizardSummaryType = {
  type?: 'keyValueLink' | 'button';
  label: string;
  value?: null | string;
  editStepNumber?: number;
  evidenceId?: string;
  allowHTML?: boolean;
  isFile?: boolean;
};

export type StepsParentalRelationsType = {
  [step: string]: string[];
};

export class WizardEngineModel {
  isChangingMode: boolean = false;
  currentQuestionParentsId: string[] = [];
  steps: WizardStepType[];
  stepsParentChildRelations: StepsParentalRelationsType;
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
    this.stepsParentChildRelations = data.stepsParentChildRelations ?? {};
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

  previousStep(): this {
    if (typeof this.currentStepId === 'number') {
      this.currentStepId--;
    } else if (this.showSummary && this.currentStepId === 'summary') {
      this.currentStepId = this.steps.length;
    }

    return this;
  }

  gotoStep(step: number | 'summary'): this {
    if (step === 'summary') {
      this.runSummaryParsing();
    }

    this.currentStepId = parseInt(step as string, 10);

    return this;
  }

  enableChangeAndGoToStep(step: number): this {
    this.currentQuestionParentsId = [];
    this.isChangingMode = true;
    this.gotoStep(step);
    return this;
  }

  nextStep(): this {
    if (this.showSummary && typeof this.currentStepId === 'number' && this.currentStepId === this.steps.length) {
      this.runSummaryParsing();
      this.currentStepId = 'summary';
    } else if (typeof this.currentStepId === 'number') {
      this.currentStepId++;

      if (this.isChangingMode) {
        this.checkStepConditions();
      }
    }

    return this;
  }

  checkStepConditions(): this {
    if (typeof this.currentStepId === 'number') {
      const previousStepId = this.steps[this.currentStepId - 2].parameters[0].id;
      const currentStepId = this.currentStep().parameters[0].id;

      const previousStepIsParentOfCurrent: boolean =
        this.stepsParentChildRelations[previousStepId] &&
        this.stepsParentChildRelations[previousStepId].some(step => currentStepId.includes(step));

      const currentStepIsChildOfSetParent =
        this.currentQuestionParentsId.length &&
        // Create an array with all children of all parents added to currentQuestionParentsId
        Object.entries(this.stepsParentChildRelations)
          .filter(([k, _v]) => this.currentQuestionParentsId.includes(k))
          .flatMap(([_k, v]) => (Array.isArray(v) ? v : v))
          // Check if current step is in said array
          .some(step => currentStepId.includes(step));

      if (previousStepIsParentOfCurrent) {
        this.currentQuestionParentsId.push(previousStepId);
        return this;
      }

      if (!this.currentQuestionParentsId.length) {
        this.runSummaryParsing();
        this.currentStepId = 'summary';
        return this;
      }

      if (currentStepIsChildOfSetParent) {
        return this;
      }

      this.currentStepId++;
    }
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
