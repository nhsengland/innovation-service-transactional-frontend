import { MappedObjectType } from '@modules/core/interfaces/base.interfaces';
import { FormEngineHelperV3 } from '../helpers/form-engine-v3.helper';
import { FormEngineModel, FormEngineModelV3, FormEngineParameterModelV3 } from './form-engine.models';
import { ValidatorFn } from '@angular/forms';
import {
  getInnovationRecordSchemaQuestion,
  getInnovationRecordSchemaTranslationsMap,
  getInnovationRecordSchemaSectionQuestionsLabels
} from '@modules/stores/innovation/innovation-record/202405/ir-v3.helpers';
import {
  InnovationRecordFieldGroupAnswerType,
  InnovationRecordQuestionStepType,
  InnovationRecordSubSectionType
} from '@modules/stores/innovation/innovation-record/202405/ir-v3-types';
import { Parser } from 'expr-eval';
import { StringsHelper } from '@app/base/helpers';
import { dummy_schema_V3_202405 } from '@modules/stores/innovation/innovation-record/202405/ir-v3-schema';

export type WizardStepType = FormEngineModel & { saveStrategy?: 'updateAndWait' };
export type WizardStepTypeV3 = FormEngineModelV3 & { saveStrategy?: 'updateAndWait' };

export type WizardSummaryV3Type = {
  stepId: string;
  label: string;
  value?: string;
  editStepNumber?: number;
  evidenceId?: string;
  type?: 'keyValueLink' | 'button';
  allowHTML?: boolean;
  isFile?: boolean;
  isNotMandatory?: boolean;
};

export type StepsParentalRelationsType = {
  [child: string]: string;
};

export class WizardIRV3EngineModel {
  sectionId: string;
  isChangingMode: boolean = false;
  visitedSteps: Set<string> = new Set<string>();
  steps: WizardStepTypeV3[];
  formValidations: ValidatorFn[];
  stepsChildParentRelations: StepsParentalRelationsType;
  currentStepId: string;
  currentStepIndex: number;
  currentAnswers: { [key: string]: any };
  showSummary: boolean;
  translations: {
    sections: Map<string, string>;
    subsections: Map<string, string>;
    questions: Map<string, string>;
    items: Map<string, string>;
  };

  private summary: WizardSummaryV3Type[] = [];

  constructor(data: Partial<WizardIRV3EngineModel>) {
    this.sectionId = data.sectionId ?? '';
    this.steps = data.steps ?? [];
    this.formValidations = data.formValidations ?? [];
    this.stepsChildParentRelations = data.stepsChildParentRelations ?? {};
    this.currentStepId = data.currentStepId ?? '';
    this.currentStepIndex = data.currentStepIndex ?? 0;
    this.currentAnswers = data.currentAnswers ?? {};
    this.showSummary = data.showSummary ?? false;
    this.translations = getInnovationRecordSchemaTranslationsMap();

    // this.runtimeRules = data.runtimeRules ?? [];
    // this.inboundParsing = data.inboundParsing;
    // this.outboundParsing = data.outboundParsing;
    // this.summaryParsing = data.summaryParsing;
  }

  // runRules(data?: MappedObjectType): this {
  //   //   this.runtimeRules.forEach(rule => rule(this.steps, data ?? this.currentAnswers, this.currentStepId));
  //   return this;
  // }

  // runInboundParsing(data: MappedObjectType): MappedObjectType {
  //   return {};
  //   // return this.inboundParsing ? this.inboundParsing(data) : data;
  // }

  // runOutboundParsing(data?: MappedObjectType): MappedObjectType {
  //   return {};
  //   // const v = data || this.currentAnswers;
  //   // return this.outboundParsing ? this.outboundParsing(v) : v;
  // }

  // runSummaryParsing(data?: MappedObjectType): WizardSummaryType[] {
  // if (!this.summaryParsing) {
  //   return [];
  // }

  // // this.summary = this.summaryParsing(data || this.currentAnswers, this.steps);
  // this.summary = [];

  // return this.summary;
  //   return [];
  // }

  // isFirstStep(): boolean {
  //   return Number(this.currentStepId) === 1;
  // }
  // isLastStep(): boolean {
  //   return Number(this.currentStepId) === this.steps.length;
  // }
  // isValidStep(step: number | 'summary'): boolean {
  //   return (1 <= Number(step) && Number(step) <= this.steps.length) || step === 'summary';
  // }
  isQuestionStep(): boolean {
    return this.currentStepId !== 'summary' ? true : false;
  }
  isSummaryStep(): boolean {
    return this.showSummary && this.currentStepId === 'summary';
  }

  currentStep(): FormEngineModelV3 & WizardStepTypeV3 {
    return (
      this.steps.find(step => step.parameters[0].id === this.currentStepId) ?? {
        ...new FormEngineModelV3({ parameters: [] })
      }
    );

    // if (typeof this.currentStepId === 'number') {
    //   return this.steps[this.currentStepId - 1];
    // } else {
    //   return { ...new FormEngineModel({ parameters: [] }) };
    // }
  }

  currentStepTitle(): string {
    const step = this.currentStep();
    return step.label ?? step.parameters[0]?.label ?? '';
  }

  currentStepParameters(): FormEngineParameterModelV3[] {
    // console.log('this.currentStep()');
    // console.log(this.currentStep());
    return this.currentStep().parameters;
  }

  getFormValidations(): ValidatorFn[] {
    return this.formValidations;
  }

  // previousStep(): this {
  // if (this.showSummary && this.currentStepId === 'summary') {
  //   this.currentStepId = this.steps.length;
  // } else if (typeof this.currentStepId === 'number') {
  //   this.currentStepId--;
  //   if (this.isChangingMode) {
  //     if (this.visitedSteps.has(this.getCurrentStepObjId())) {
  //       return this;
  //     } else {
  //       this.previousStep();
  //     }
  //   }
  // }
  //   return this;
  // }

  gotoSummary(): void {
    // this.runSummaryParsing();
    this.currentStepId = 'summary';
  }

  gotoStep(stepId: string, isChangeMode: boolean = false): this {
    this.visitedSteps.clear();
    this.currentStepId = stepId;

    // this.isChangingMode = isChangeMode;

    // this.visitedSteps.add(this.getCurrentStepObjId());

    return this;
  }

  // nextStep(): this {
  //   if (this.showSummary && typeof this.currentStepId === 'number' && this.currentStepId === this.steps.length) {
  //     this.gotoSummary();
  //   } else if (typeof this.currentStepId === 'number') {
  //     this.currentStepId++;
  //     this.visitedSteps.add(this.getCurrentStepObjId());

  //     if (this.isChangingMode) {
  //       this.checkStepConditions();
  //     }
  //   }

  //   return this;
  // }

  // checkStepConditions(): this {
  //   if (typeof this.currentStepId === 'number') {
  //     const isCurrentStepChildOfAnyVisitedSteps = this.visitedSteps.has(
  //       this.stepsChildParentRelations[this.getCurrentStepObjId()]
  //     );

  //     // Check if visitedSteps has no 'parent' steps in it, if so go to summary.
  //     if (![...this.visitedSteps].some(step => Object.values(this.stepsChildParentRelations).includes(step))) {
  //       this.gotoSummary();
  //       return this;
  //     }

  //     if (isCurrentStepChildOfAnyVisitedSteps) {
  //       return this;
  //     } else {
  //       this.visitedSteps.delete(this.getCurrentStepObjId());
  //       this.nextStep();
  //     }
  //   }

  //   return this;
  // }

  // getCurrentStepObjId(): string {
  //   // split on '_' to account for dynamic named steps (i.e.: 'standardHasMet_xxxxxxx' => 'standardHasMet')

  //   return this.currentStep()?.parameters[0].id.split('_')[0] ?? '';
  // }

  getAnswers(): { [key: string]: any } {
    return this.currentAnswers;
  }

  addAnswers(data: { [key: string]: any }): this {
    console.log('previous answers', this.currentAnswers);
    this.currentAnswers = { ...this.currentAnswers, ...data };
    console.log('updated answers', this.currentAnswers);

    return this;
  }

  setAnswers(data: { [key: string]: any }): this {
    this.currentAnswers = data;
    return this;
  }

  setCurrentStepId(stepId: string) {
    this.currentStepId = stepId;
  }

  checkIfStepConditionIsMet(condition: string | undefined): boolean {
    if (condition !== undefined) {
      return !!Parser.evaluate(condition, { data: this.currentAnswers });
    } else {
      return true;
    }
  }

  getSummary(): WizardSummaryV3Type[] {
    return this.summary;
  }

  parseSummary(sectionId: string): WizardSummaryV3Type[] {
    this.summary = [];
    console.log('parsing summary');

    // Parse condition step's answers
    for (const step of this.steps) {
      const stepId = step.parameters[0].id;
      const label = this.translations.questions.get(step.parameters[0].id) ?? '';

      // Parse if has `condition` and it's met
      const condition = step.parameters[0].condition;
      if (!(condition && !this.checkIfStepConditionIsMet(condition))) {
        this.summary.push({
          stepId: stepId,
          label: label,
          value: this.currentAnswers[step.parameters[0].id]
        });

        // TODO Parse FieldGroup
        // if (typeof this.currentAnswers[step.parameters[0].id] === 'object') {
        //   this.summary.push({
        //     stepId: stepId,
        //     label: label,
        //     value: Object.values(this.currentAnswers[step.parameters[0].id]).map(s => s)
        //   });
        // }
      }
    }
    // // Parse condition step's answers
    // for (const entry of sectionIdLabels.keys()) {
    //   const condition = getInnovationRecordSchemaQuestion(entry).condition;
    //   if (!(condition !== undefined && !this.checkIfStepConditionIsMet(condition))) {
    //     this.summary.push({
    //       stepId: entry,
    //       label: this.translations.questions.get(entry) ?? '',
    //       value: this.currentAnswers[entry]
    //     });
    //   }
    // }

    // Parse FieldGroup's answers

    return this.summary;
  }

  runRules(sectionId: string): this {
    console.log('running rules');
    this.steps = [];
    const subsection = dummy_schema_V3_202405.sections.flatMap(s => s.subSections).find(sub => sub.id === sectionId);

    subsection?.questions.forEach(q => {
      // Check if step has conditions. If it doesn't, push. If it does, check if met, and only then push accordingly.
      if (this.checkIfStepConditionIsMet(q.condition)) {
        const step = new FormEngineModelV3({
          parameters: [
            {
              id: q.id,
              dataType: q.dataType,
              label: q.label,
              description: q.description,
              ...(q.lengthLimit && { lengthLimit: q.lengthLimit }),
              ...(q.validations && { validations: q.validations }),
              ...(q.items && { items: q.items }),
              ...(q.addNewLabel && { addNewLabel: q.addNewLabel }),
              ...(q.addQuestion && { addQuestion: q.addQuestion }),
              ...(q.field && { field: q.field }),
              ...(q.condition && { condition: q.condition })
            }
          ]
        });

        // Replace step's items list, when field `itemsFromAnswer` is present, with answers from the previously answered question with that id.
        const itemsFromAnswer = getInnovationRecordSchemaQuestion(q.id).items?.find(
          i => i.itemsFromAnswer
        )?.itemsFromAnswer;

        if (itemsFromAnswer) {
          const itemsDependencyAnswer: string[] = this.currentAnswers[itemsFromAnswer] as string[];
          const updatedItemsList = itemsDependencyAnswer.map(i => ({ id: i, label: this.translations.items.get(i) }));
          step.parameters[0].items = updatedItemsList;
        }

        this.steps.push(step);
      }

      // runtimerules for `addQuestions`
      if (q.addQuestion && q.field && this.getAnswers()[q.id]) {
        (this.getAnswers()[q.id] as string[]).forEach(answer =>
          this.steps.push(
            new FormEngineModelV3({
              parameters: [
                {
                  id: typeof answer === 'object' ? `userTestFeedback_${answer[q.field!.id]}` : '',
                  dataType: q.addQuestion!.dataType,
                  label: q.addQuestion!.label,
                  description: q.addQuestion!.description,
                  validations: q.addQuestion!.validations,
                  lengthLimit: q.addQuestion!.lengthLimit ?? 's'
                }
              ]
            })
          )
        );
      }
    });

    return this;
  }

  validateData(): { valid: boolean; errors: { title: string; description: string }[] } {
    const parameters = this.steps.flatMap(step => step.parameters);
    const form = FormEngineHelperV3.buildForm(parameters, this.currentAnswers);

    return {
      valid: form.valid,
      errors: Object.entries(FormEngineHelperV3.getErrors(form)).map(([key, value]) => ({
        title: parameters.find(p => p.id === key)?.label || '',
        description: value || ''
      }))
    };
  }
}
