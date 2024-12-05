import { MappedObjectType } from '@modules/core/interfaces/base.interfaces';
import { FormEngineHelper } from '../helpers/form-engine.helper';
import { FormEngineModel, FormEngineParameterModel } from './form-engine.models';
import { ValidatorFn } from '@angular/forms';
import { FormGroup } from '@app/base/forms';
import { InnovationRecordSchemaInfoType } from '@modules/stores/ctx/schema/schema.types';

export type WizardStepType = FormEngineModel & { saveStrategy?: 'updateAndWait' };

export type WizardSummaryType = {
  type?: 'keyValueLink' | 'button';
  label: string;
  value?: null | string;
  editStepNumber?: number;
  evidenceId?: string;
  allowHTML?: boolean;
  isFile?: boolean;
  isNotMandatory?: boolean;
};

export type StepsParentalRelationsType = Record<string, string>;

export class WizardEngineModel {
  schema: InnovationRecordSchemaInfoType | undefined;
  isChangingMode: boolean;
  visitedSteps: Set<string>;
  steps: WizardStepType[];
  formValidations: ValidatorFn[];
  stepsChildParentRelations: StepsParentalRelationsType;
  currentStepId: number | 'summary';
  currentAnswers: Record<string, any>;
  showSummary: boolean;
  runtimeRules: ((
    steps: FormEngineModel[],
    currentValues: any,
    currentStep: number | 'summary',
    schema?: InnovationRecordSchemaInfoType
  ) => void)[];
  inboundParsing?: (data: any) => MappedObjectType;
  outboundParsing?: (data: any) => MappedObjectType;
  summaryParsing?: (
    data: any,
    steps?: FormEngineModel[],
    schema?: InnovationRecordSchemaInfoType
  ) => WizardSummaryType[];
  summaryPDFParsing?: (data: any, steps?: FormEngineModel[]) => WizardSummaryType[];

  private summary: WizardSummaryType[] = [];

  constructor(data: Partial<WizardEngineModel>) {
    this.schema = data.schema ?? undefined;
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
    this.visitedSteps = new Set<string>();
    this.isChangingMode = false;
  }

  runRules(data?: MappedObjectType): this {
    this.runtimeRules.forEach(rule => rule(this.steps, data ?? this.currentAnswers, this.currentStepId, this.schema));
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

    this.summary = this.summaryParsing(data || this.currentAnswers, this.steps, this.schema);

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
    return this.formValidations;
  }

  previousStep(): this {
    if (this.showSummary && this.currentStepId === 'summary') {
      if (this.isChangingMode) {
        // If we are in changing mode, we should go to the last visited step.
        const lastVisitedStepObjId = [...this.visitedSteps][0]; // in changing mode, when the current step is the summary, we only have one visited step;
        const lastVisitedStepId = this.steps.findIndex(step => this.getStepObjId(step) === lastVisitedStepObjId);

        this.currentStepId = lastVisitedStepId + 1;

        return this;
      } else {
        this.currentStepId = this.steps.length;
      }
    } else if (typeof this.currentStepId === 'number') {
      if (this.isChangingMode) {
        const stepObjIdBeforeDecrement = this.getCurrentStepObjId();
        while (true) {
          this.currentStepId--;
          // If the new current step is a child of any visited step, we should visit it.
          if (this.visitedSteps.has(this.getCurrentStepObjId())) {
            return this;
          }
          // If the new current step is the first step, we should go to the summary.
          if (this.currentStepId === 1) {
            this.visitedSteps.clear();
            this.visitedSteps.add(stepObjIdBeforeDecrement);
            this.gotoSummary();
            return this;
          }
        }
      } else {
        this.currentStepId--;
      }
    }
    return this;
  }

  gotoSummary(): void {
    this.runSummaryParsing();
    this.currentStepId = 'summary';
  }

  gotoStep(step: number | 'summary'): this {
    this.visitedSteps.clear();

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
      if (this.isChangingMode) {
        this.checkStepConditions();
      } else {
        this.currentStepId++;
      }
    }

    return this;
  }

  checkStepConditions(): this {
    if (typeof this.currentStepId === 'number') {
      const stepObjIdBeforeIncrement = this.getCurrentStepObjId();
      while (true) {
        this.currentStepId++;

        // Check if the new current step is a child of any visited step.
        const isCurrentStepChildOfAnyVisitedSteps = this.visitedSteps.has(
          this.stepsChildParentRelations[this.getCurrentStepObjId()]
        );

        // If the new current step is a child of any visited step, we should visit it.
        if (isCurrentStepChildOfAnyVisitedSteps) {
          this.visitedSteps.add(this.getCurrentStepObjId());
          return this;
        }

        // If we reach the last step, we should go to the summary.
        if (this.currentStepId === this.steps.length) {
          this.visitedSteps.clear();
          this.visitedSteps.add(stepObjIdBeforeIncrement);
          this.gotoSummary();
          return this;
        }
      }
    } else {
      this.gotoSummary();
    }

    return this;
  }

  getStepObjId(step: FormEngineModel): string {
    // split on '_' to account for dynamic named steps (i.e.: 'standardHasMet_xxxxxxx' => 'standardHasMet')
    return step?.parameters[0].id.split('_')[0] ?? '';
  }

  getCurrentStepObjId(): string {
    return this.getStepObjId(this.currentStep());
  }

  getAnswers(): Record<string, any> {
    return this.currentAnswers;
  }
  addAnswers(data: Record<string, any>): this {
    this.currentAnswers = { ...this.currentAnswers, ...data };
    return this;
  }
  setAnswers(data: Record<string, any>): this {
    this.currentAnswers = data;
    return this;
  }
  setInboundParsedAnswers(data?: MappedObjectType): this {
    this.currentAnswers = (this.inboundParsing ? this.inboundParsing(data) : data) ?? {};
    this.schema = data?.schema;
    return this;
  }

  setIsChangingMode(value: boolean): this {
    this.isChangingMode = value;
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

  checkCurrentStepErrors(form?: FormGroup): { fieldId: string; message: string }[] | null {
    const currentStep = this.currentStep();
    if (form) {
      const formErrors = FormEngineHelper.getErrors(form, true);
      return Object.entries(formErrors).map(([key, value]) => {
        const parameter = currentStep.parameters.find(p => p.id === key)!;
        return {
          fieldId:
            parameter.dataType === 'checkbox-array' || parameter.dataType === 'radio-group'
              ? parameter.id + '0'
              : parameter.dataType === 'date-input'
                ? 'day-' + parameter.id
                : parameter.id,
          message: value ?? ''
        };
      });
    }

    return null;
  }
}
