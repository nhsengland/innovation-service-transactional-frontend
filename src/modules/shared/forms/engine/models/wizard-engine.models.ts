import { MappedObjectType } from '@modules/core/interfaces/base.interfaces';
import { FormEngineHelper } from '../helpers/form-engine.helper';
import { FormEngineModel, FormEngineParameterModel } from './form-engine.models';

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

export class WizardEngineModel {
  isChangingMode: boolean = false;
  currentChangingParentId: string | null = null;
  steps: WizardStepType[];
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

  nextStep(): this {
    if (
      (this.showSummary && typeof this.currentStepId === 'number' && this.currentStepId === this.steps.length) ||
      // if we are 'changing' and this step has no children or does not have a 'parentId' we can assume it's a 'standalone' step and safely go to 'summary'. Otherwise it might have children/siblings, so ...
      (this.isChangingMode &&
        !(this.canStepHaveChildren(this.currentStep()) || this.currentStep().parameters[0].parentId))
    ) {
      this.runSummaryParsing();
      this.currentStepId = 'summary';
    } else if (typeof this.currentStepId === 'number') {
      this.currentStepId++;
      // ... we go to the next step and then...
      if (this.isChangingMode) {
        this.checkStepConditions();
      }
    }

    return this;
  }

  canStepHaveChildren(step: FormEngineModel): boolean {
    return step.parameters[0].conditionalChildren ?? false;
  }

  checkStepConditions(): this {
    if (typeof this.currentStepId === 'number') {
      const previousStepId = this.steps[this.currentStepId - 2].parameters[0].id;
      const previousCanHaveChildren = this.canStepHaveChildren(this.steps[this.currentStepId - 2]);
      const currentStepParentId = this.currentStep().parameters[0].parentId ?? '';
      const previousIsParentOfCurrent: boolean = previousStepId === currentStepParentId;

      // ... we check if the past step can have children, and if the current one is one of them
      if (previousCanHaveChildren && previousIsParentOfCurrent) {
        // ...if it is, we set it as current parent, so we can check on following steps if they are also child of this one, and return to keep going. Otherwise, go to summary.
        this.currentChangingParentId = this.currentChangingParentId ?? previousCanHaveChildren ? previousStepId : null;
        return this;
      }

      // ... check if this is another child of the parent question, if it is, return and keep going. Otherwise, go to summary.
      if (currentStepParentId && this.currentChangingParentId) {
        return this;
      }
    }
    // if step is 'summary' or none of the above are true, go to summary.
    this.runSummaryParsing();
    this.currentStepId = 'summary';

    return this;
  }

  enableChangeAndGoToStep(step: number): this {
    this.currentChangingParentId = null;
    this.isChangingMode = true;
    this.gotoStep(step);
    return this;
  }

  gotoStep(step: number | 'summary'): this {
    if (step === 'summary') {
      this.runSummaryParsing();
    }

    this.currentStepId = parseInt(step as string, 10);

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
