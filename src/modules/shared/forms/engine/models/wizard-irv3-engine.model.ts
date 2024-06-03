import { MappedObjectType } from '@modules/core/interfaces/base.interfaces';
import { FormEngineHelperV3 } from '../helpers/form-engine-v3.helper';
import { FormEngineModel, FormEngineModelV3, FormEngineParameterModelV3 } from './form-engine.models';
import { ValidatorFn } from '@angular/forms';
import {
  getInnovationRecordSchemaQuestion,
  getInnovationRecordSchemaTranslationsMap,
  getInnovationRecordSchemaSectionQuestionsLabels
} from '@modules/stores/innovation/innovation-record/202405/ir-v3.helpers';
import { dummy_innovation_data_V3_202405 } from '@modules/stores/innovation/innovation-record/202405/ir-v3-answers-dummy-data';
import {
  InnovationRecordFieldGroupAnswerType,
  InnovationRecordQuestionStepType,
  InnovationRecordSectionAnswersType,
  InnovationRecordSubSectionType
} from '@modules/stores/innovation/innovation-record/202405/ir-v3-types';
import { Parser } from 'expr-eval';
import { StringsHelper } from '@app/base/helpers';
import { IrV3TranslatePipe } from '@modules/shared/pipes/ir-v3-translate.pipe';
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
  currentStepId: number | 'summary';
  currentAnswers: { [key: string]: any };
  showSummary: boolean;
  translations: {
    sections: Map<string, string>;
    subsections: Map<string, string>;
    questions: Map<string, string>;
    items: Map<string, string>;
  };

  private summary: WizardSummaryV3Type[] = [];

  constructor(
    data: Partial<WizardIRV3EngineModel>,
    private pipe: IrV3TranslatePipe
  ) {
    this.sectionId = data.sectionId ?? '';
    this.steps = data.steps ?? [];
    this.formValidations = data.formValidations ?? [];
    this.stepsChildParentRelations = data.stepsChildParentRelations ?? {};
    this.currentStepId = parseInt(data.currentStepId as string, 10);
    this.currentAnswers = data.currentAnswers ?? {};
    this.showSummary = data.showSummary ?? false;
    this.translations = getInnovationRecordSchemaTranslationsMap();
  }

  isQuestionStep(): boolean {
    return this.currentStepId !== 'summary' ? true : false;
  }
  isSummaryStep(): boolean {
    return this.showSummary && this.currentStepId === 'summary';
  }

  currentStep(): WizardStepTypeV3 & FormEngineModelV3 {
    if (typeof this.currentStepId === 'number') {
      return this.steps[this.currentStepId];
    } else {
      return { ...new FormEngineModelV3({ parameters: [] }) };
    }
  }

  currentStepTitle(): string {
    return this.currentStep().label ?? this.currentStep().parameters[0]?.label ?? '';
  }

  currentStepParameters(): FormEngineParameterModelV3[] {
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

  gotoStep(stepId: number | 'summary', isChangeMode: boolean = false): this {
    // this.visitedSteps.clear();

    this.currentStepId = parseInt(stepId as string, 10);

    // this.isChangingMode = isChangeMode;

    // this.visitedSteps.add(this.getCurrentStepObjId());

    return this;
  }

  nextStep(): this {
    // if(this.currentStepId + 1>)
    //   if (this.showSummary && typeof this.currentStepId === 'number' && this.currentStepId === this.steps.length) {
    //     this.gotoSummary();
    //   } else if (typeof this.currentStepId === 'number') {
    //     this.currentStepId++;
    //     this.visitedSteps.add(this.getCurrentStepObjId());

    //     if (this.isChangingMode) {
    //       this.checkStepConditions();
    //     }
    //   }

    return this;
  }

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
    this.currentAnswers = { ...this.currentAnswers, ...data };
    console.log('updated answers', this.currentAnswers);

    return this;
  }

  setAnswers(data: { [key: string]: any }): this {
    this.currentAnswers = data;
    return this;
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

  private parseFieldsGroupSummary(id: string): string | undefined {
    for (const section of dummy_schema_V3_202405.sections) {
      for (const subSection of section.subSections) {
        for (const question of subSection.questions) {
          if (question.id !== id) continue;

          const re = new RegExp(`^${question.field!.id}|\d+$`);

          return Object.keys(this.currentAnswers)
            .filter(name => re.test(name))
            .map(name => {
              const params = name.split('|');
              
              return {
                answer: this.currentAnswers[name],
                index: parseInt(params[1])
              };
            })
            .sort((a, b) => a.index - b.index)
            .map(d => d.answer)
            .join(', ');
        }
      }
    }

    return undefined;
  }

  parseSummary(sectionId: string): WizardSummaryV3Type[] {
    this.summary = [];

    // Parse condition step's answers
    for (const step of this.steps) {
      const stepId = step.parameters[0].id;
      const label = this.translations.questions.get(step.parameters[0].id.split('|')[0]) ?? '';

      const condition = step.parameters[0].condition;

      // Parse if has `condition` and it's met or has no condition
      if (!(condition && !this.checkIfStepConditionIsMet(condition))) {
        if (step.parameters[0].dataType === 'fields-group') {
          console.log(step.parameters[0])
          this.summary.push({
            stepId: stepId,
            label: label,
            value: this.parseFieldsGroupSummary(step.parameters[0].id)
          });
        } else {
          this.summary.push({
            stepId: stepId,
            label: label,
            value: this.currentAnswers[step.parameters[0].id]
          });
        }

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

  runRules(): this {
    console.log('running rules');
    this.steps = [];
    const subsection = dummy_schema_V3_202405.sections
      .flatMap(s => s.subSections)
      .find(sub => sub.id === this.sectionId);

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
      if (q.addQuestion && this.getAnswers()[q.id]) {
        (this.getAnswers()[q.id] as string[]).forEach(answer =>
          this.steps.push(
            new FormEngineModelV3({
              parameters: [
                {
                  id:
                    typeof answer === 'object'
                      ? `${q.addQuestion!.id}|${answer['kind']}`
                      : `${q.addQuestion!.id}|${answer}`,
                  dataType: q.addQuestion!.dataType,
                  label: q.addQuestion?.label ?? '',
                  description: q.addQuestion!.description,
                  ...(q.addQuestion?.lengthLimit && { lengthLimit: q.addQuestion?.lengthLimit }),
                  ...(q.addQuestion?.validations && { validations: q.addQuestion?.validations }),
                  ...(q.addQuestion?.items && { items: q.addQuestion?.items }),
                  ...(q.addQuestion?.addNewLabel && { addNewLabel: q.addQuestion?.addNewLabel }),
                  ...(q.addQuestion?.addQuestion && { addQuestion: q.addQuestion?.addQuestion }),
                  ...(q.addQuestion?.field && { field: q.addQuestion?.field }),
                  ...(q.addQuestion?.condition && { condition: q.addQuestion?.condition })
                }
              ]
            })
          )
        );
      }
    });

    console.log('runrules steps:', this.steps);
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
