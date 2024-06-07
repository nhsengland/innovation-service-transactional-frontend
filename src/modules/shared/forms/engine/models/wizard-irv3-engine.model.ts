import { FormEngineHelperV3 } from '../helpers/form-engine-v3.helper';
import { FormEngineModel, FormEngineModelV3, FormEngineParameterModelV3 } from './form-engine.models';
import { ValidatorFn } from '@angular/forms';
import {
  getInnovationRecordSchemaQuestion,
  getInnovationRecordSchemaTranslationsMap
} from '@modules/stores/innovation/innovation-record/202405/ir-v3.helpers';
import { dummy_schema_V3_202405 } from '@modules/stores/innovation/innovation-record/202405/ir-v3-schema';
import { IrV3TranslatePipe } from '@modules/shared/pipes/ir-v3-translate.pipe';
import {
  InnovationRecordConditionType,
  InnovationRecordQuestionStepType
} from '@modules/stores/innovation/innovation-record/202405/ir-v3-types';
import { IRV3Helper } from '@modules/stores/innovation/innovation-record/202405/ir-v3-translator.helper';
import { StringsHelper } from '@app/base/helpers';
import { MappedObjectType } from '@app/base/types';
import { Console } from 'console';

export type WizardStepType = FormEngineModel & { saveStrategy?: 'updateAndWait' };
export type WizardStepTypeV3 = FormEngineModelV3 & { saveStrategy?: 'updateAndWait' };

export type WizardSummaryV3Type = {
  stepId: string;
  label: string;
  value?: string;
  editStepNumber: number;
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

  constructor(data: Partial<WizardIRV3EngineModel>) {
    this.sectionId = data.sectionId ?? '';
    this.steps = data.steps ?? [];
    this.formValidations = data.formValidations ?? [];
    this.stepsChildParentRelations = data.stepsChildParentRelations ?? {};
    this.currentStepId = parseInt(data.currentStepId as string, 10) || 1;
    this.currentAnswers = data.currentAnswers ?? {};
    this.showSummary = data.showSummary ?? true;
    this.translations = getInnovationRecordSchemaTranslationsMap();
  }

  isFirstStep(): boolean {
    return Number(this.currentStepId) === 1;
  }

  isLastStep(): boolean {
    return Number(this.currentStepId) === this.steps.length;
  }

  isQuestionStep(): boolean {
    return this.currentStepId !== 'summary' ? true : false;
  }
  isSummaryStep(): boolean {
    return this.showSummary && this.currentStepId === 'summary';
  }

  currentStep(): WizardStepTypeV3 & FormEngineModelV3 {
    if (typeof this.currentStepId === 'number') {
      return this.steps[this.currentStepId - 1];
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

  gotoSummary(): this {
    this.visitedSteps.clear();

    this.parseSummary();
    this.showSummary = true;
    this.currentStepId = 'summary';

    return this;
  }

  gotoStep(stepId: number | 'summary', isChangeMode: boolean = false): this {
    this.currentStepId = parseInt(stepId as string, 10);

    // if (stepId === 'summary') {
    //   this.parseSummary();
    // }

    this.isChangingMode = isChangeMode;

    this.visitedSteps.add(this.getCurrentStepObjId());

    return this;
  }

  nextStep(isChangeMode: boolean = false): number | 'summary' {
    let nextStepId = this.currentStepId;

    if (this.showSummary && typeof this.currentStepId === 'number' && this.isLastStep()) {
      return 'summary';
    } else if (typeof nextStepId === 'number') {
      nextStepId++;

      this.visitedSteps.add(this.getStepObjectId(nextStepId));

      if (isChangeMode) {
        let isCurrentStepChildOfAnyVisitedSteps = this.visitedSteps.has(
          this.stepsChildParentRelations[this.getStepObjectId(nextStepId)]
        );

        while (!isCurrentStepChildOfAnyVisitedSteps) {
          // go through all steps to see if there are any children at some point
          isCurrentStepChildOfAnyVisitedSteps = this.visitedSteps.has(
            this.stepsChildParentRelations[this.getStepObjectId(nextStepId)]
          );

          // if we reach the end and no other children have been found, return summary
          if (nextStepId === this.steps.length) {
            nextStepId = 'summary';
            break;
          }

          if (!isCurrentStepChildOfAnyVisitedSteps) {
            this.visitedSteps.delete(this.getStepObjectId(nextStepId));
          }

          nextStepId++;
        }
      }
    }
    console.log(`returning value: ${nextStepId}`);
    return nextStepId;
  }

  getStepObjectId(stepId: number) {
    return this.steps[stepId - 1].parameters[0].id.split('_')[0] ?? '';
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
    console.log('updated answers', this.currentAnswers);

    return this;
  }

  setAnswers(data: { [key: string]: any }): this {
    this.currentAnswers = data;
    return this;
  }

  checkIfStepConditionIsMet(condition: InnovationRecordConditionType | undefined): boolean {
    if (!condition) return true;

    return !!condition.options.includes(this.currentAnswers[condition.id]);
  }

  getSummary(): WizardSummaryV3Type[] {
    return this.summary;
  }

  // inboundParsing(data: MappedObjectType): { [key: string]: any } {
  //   let toReturn: { [key: string]: any } = {};
  //   for (const step of this.steps) {
  //     const params = step.parameters[0];
  //     console.log('params', params);
  //     if (!params.isNestedField) {
  //       toReturn[params.id] = data[params.id] ?? undefined;
  //     }

  //     // assign nested values to all type of conditional steps (i.e: field-groups, addQuestions)
  //     if (params.isNestedField && params.parentAddQuestionId && params.parentStepId) {
  //       const index = Number(params.id.split('_')[1]);
  //       toReturn[params.id] = data[params.parentStepId][index][params.parentAddQuestionId];
  //     }
  //   }
  //   console.log('inbound parsing:', toReturn);

  //   return toReturn;
  // }

  runRules(): this {
    this.stepsChildParentRelations = IRV3Helper.stepChildParent(this.sectionId);
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
              ...(q.condition && { condition: q.condition }),

              isNestedField: false
            }
          ]
        });

        // Replace step's items list, when field `itemsFromAnswer` is present, with answers from the previously answered question with that id.
        const itemsFromAnswer = getInnovationRecordSchemaQuestion(q.id).items?.find(
          i => i.itemsFromAnswer
        )?.itemsFromAnswer;

        if (itemsFromAnswer) {
          const conditionalAnswerId =
            subsection?.questions.find(q => q.id === itemsFromAnswer)?.items?.find(item => item.conditional)
              ?.conditional?.id ?? '';

          const itemsDependencyAnswer: string[] = this.currentAnswers[itemsFromAnswer]
            ? (this.currentAnswers[itemsFromAnswer] as string[])
            : [];

          const updatedItemsList = itemsDependencyAnswer.map(item => ({
            id: item,
            label: item === 'other' ? this.currentAnswers[conditionalAnswerId] : this.translations.items.get(item)
          }));

          step.parameters[0].items = updatedItemsList;
        }

        this.steps.push(step);
      } else {
        // Clear field if condition doesn't pass
        this.currentAnswers[q.id] = undefined;
      }

      /*
      Special rules for updating data on nested object fields (ex.: 'fields-group' and 'checkbox-group')
      */

      // For 'fields-group', delete any 'q.id' answer item without 'field.id' value. Can happen when user goes back!
      if (q.dataType === 'fields-group' && this.currentAnswers[q.id]) {
        this.currentAnswers[q.id] = (this.currentAnswers[q.id] as [{ [key: string]: string }]).filter(
          item => item[q.field!.id]
        );

        // Updates nested values
        if (q.addQuestion && q.field) {
          Object.keys(this.currentAnswers)
            .filter(key => (key as string).startsWith(q.addQuestion!.id))
            .forEach(key => {
              const index = Number(key.split('_')[1]);
              if (index > -1) {
                ((this.currentAnswers[q.id] as [{ [key: string]: string }]) ?? [])[index][q.addQuestion!.id] =
                  this.currentAnswers[key as any];
              }
              delete this.currentAnswers[key as any];
            });
        }
      }

      /* End of special rules */

      // runtimerules for `addQuestions`
      if (q.addQuestion && this.getAnswers()[q.id]) {
        (this.getAnswers()[q.id] as string[]).forEach((answer, i) => {
          let label = q.addQuestion!.label;
          if (q.field) {
            label = q.addQuestion!.label.replace(
              `{{item.${q.field.id}}}`,
              this.currentAnswers[q.id][i][q.field.id] ?? q.addQuestion!.label
            );
          } else {
            label = q.addQuestion!.label.replace(
              '{{item}}',
              this.translations.items.get(this.currentAnswers[q.id][i][q.id]) ?? label
            );
          }

          this.steps.push(
            new FormEngineModelV3({
              parameters: [
                {
                  id: `${q.addQuestion!.id}_${i}`,
                  dataType: q.addQuestion!.dataType,
                  label: label,
                  description: q.addQuestion!.description,
                  ...(q.addQuestion!.lengthLimit && { lengthLimit: q.addQuestion!.lengthLimit }),
                  ...(q.addQuestion!.validations && { validations: q.addQuestion!.validations }),
                  ...(q.addQuestion!.items && { items: q.addQuestion!.items }),
                  ...(q.addQuestion!.addNewLabel && { addNewLabel: q.addQuestion!.addNewLabel }),
                  ...(q.addQuestion!.addQuestion && { addQuestion: q.addQuestion!.addQuestion }),
                  ...(q.addQuestion!.field && { field: q.addQuestion!.field }),
                  ...(q.addQuestion!.condition && { condition: q.addQuestion!.condition }),
                  ...(q.parentAddQuestionId && { parentAddQuestionId: q.parentAddQuestionId }),
                  parentAddQuestionId: q.addQuestion!.id,
                  parentStepId: q.id,
                  ...(q.field && { parentFieldId: q.field.id }),
                  isNestedField: !!(q.dataType === 'fields-group' || q.dataType === 'checkbox-array')
                }
              ]
            })
          );
          if (q.dataType === 'fields-group' || q.dataType === 'checkbox-array') {
            this.currentAnswers[`${q.addQuestion!.id}_${i}`] = this.currentAnswers[q.id][i][q.addQuestion!.id];
          }
        });
      }
    });

    console.log('runrules steps:', this.steps);
    return this;
  }

  parseSummary(): WizardSummaryV3Type[] {
    console.log('this.currentAnswers', this.currentAnswers);

    let editStepNumber = 0;
    this.summary = [];

    // const currentAnswers = this.currentAnswers
    const currentAnswers = this.outboundParsing();

    // Parse condition step's answers
    for (const [i, step] of this.steps.entries()) {
      let params = step.parameters[0];
      let stepId = params.id;
      let label = this.translations.questions.get(stepId.split('|')[0]) ?? '';
      let value: string | undefined = currentAnswers[params.id];
      let isNotMandatory = !!!params.validations?.isRequired;
      editStepNumber++;

      switch (params.dataType) {
        case 'fields-group':
          {
            const currAnswer = currentAnswers[params.id] as [{ [key: string]: string }];
            value = currAnswer ? currAnswer.map(item => item[params.field!.id]).join(', ') : undefined;

            // Push "parent"
            this.summary.push({
              stepId: stepId,
              label: label,
              value: value,
              editStepNumber: editStepNumber,
              isNotMandatory: isNotMandatory
            });

            // Push "children" if any
            if (params.addQuestion && currAnswer) {
              currAnswer.forEach((item, i) => {
                editStepNumber++;

                this.summary.push({
                  stepId: `${params.addQuestion?.id}_${i}`,
                  label: `${params.addQuestion?.label.replace(`{{item.${params.field!.id}}}`, currAnswer[i][params.field!.id])}`,
                  value: currAnswer[i][params.addQuestion!.id],
                  editStepNumber: editStepNumber
                });
              });
            }
          }
          break;
        case 'autocomplete-array':
        case 'checkbox-array':
          {
            let stepAnswers: string[] | { [key: string]: string }[] | undefined = undefined;

            // Set value of parent, depending on type of answer, and translate it
            if (!params.addQuestion) {
              stepAnswers = currentAnswers[params.id] as string[];

              value = stepAnswers ? stepAnswers.map(item => this.translations.items.get(item)).join(', ') : undefined;
            } else {
              stepAnswers = currentAnswers[params.id] as [{ [key: string]: string }];

              value = stepAnswers
                ? stepAnswers.map(item => this.translations.items.get(item[params.id])).join(', ')
                : undefined;
            }

            // Push "parent"
            this.summary.push({
              stepId: stepId,
              label: label,
              value: value,
              editStepNumber: editStepNumber,
              isNotMandatory: isNotMandatory
            });

            // Push "children" if any
            if (params.addQuestion && stepAnswers) {
              const stepAnswers = currentAnswers[params.id] as [{ [key: string]: string }];
              stepAnswers.forEach((item, i) => {
                editStepNumber++;

                this.summary.push({
                  stepId: stepId,
                  label: params.addQuestion!.label.replace(
                    '{{item}}',
                    this.translations.items.get(stepAnswers[i][params.id]) ?? stepAnswers[i][params.id]
                  ),
                  value: stepAnswers[i][params.addQuestion!.id],
                  editStepNumber: editStepNumber
                });
              });
            }
          }
          break;
        default: {
          if (!params.parentFieldId && !params.parentAddQuestionId)
            this.summary.push({
              stepId: stepId,
              label: label,
              value: value,
              editStepNumber: editStepNumber,
              isNotMandatory: isNotMandatory
            });

          break;
        }
      }
    }

    console.log('summary:', this.summary);
    this.outboundParsing();
    return this.summary;
  }

  outboundParsing(): { [key: string]: any } {
    let toReturn: { [key: string]: string } = {};
    for (const [i, step] of this.steps.entries()) {
      const params = step.parameters[0];

      // Ignore fields that are already inside nested objects
      if (!params.isNestedField) {
        toReturn = {
          ...toReturn,
          ...(this.currentAnswers[params.id] && { [params.id]: this.currentAnswers[params.id] })
        };
      }
    }

    console.log('outbound parsing:', toReturn);
    return toReturn;
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
