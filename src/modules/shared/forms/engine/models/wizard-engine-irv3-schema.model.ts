import { FormEngineHelperV3 } from '../helpers/form-engine-v3.helper';
import { FormEngineModel, FormEngineModelV3, FormEngineParameterModelV3 } from './form-engine.models';
import { ValidatorFn } from '@angular/forms';
import {
  InnovationRecordConditionType,
  InnovationRecordSchemaV3Type,
  arrStringAnswer,
  nestedObjectAnswer
} from '@modules/stores/innovation/innovation-record/202405/ir-v3-types';
import { MappedObjectType } from '@app/base/types';
import { URLS } from '@app/base/constants';
import {
  InnovationRecordSchemaInfoType,
  InnovationRecordSectionUpdateType,
  IrSchemaTranslatorMapType
} from '@modules/stores/ctx/schema/schema.types';

export type WizardStepType = FormEngineModel & { saveStrategy?: 'updateAndWait' };
export type WizardStepTypeV3 = FormEngineModelV3 & { saveStrategy?: 'updateAndWait' };

export type WizardSummaryV3Type = {
  stepId: string;
  label: string;
  value: string | string[];
  editStepNumber: number;
  evidenceId?: string;
  type?: 'keyValueLink' | 'button';
  allowHTML?: boolean;
  isFile?: boolean;
  isNotMandatory?: boolean;
};

export type EvidenceV3Type = {
  evidenceId: string;
  label: string;
  value: string;
};

export type StepsParentalRelationsType = Record<string, string>;

export class WizardIRV3EngineModel {
  sectionId: string;
  isChangingMode = false;
  visitedSteps: Set<string> = new Set<string>();
  steps: WizardStepTypeV3[];
  schema: InnovationRecordSchemaInfoType | null;
  itemsWithItemsFromAnswer: Map<string, string>;
  formValidations: ValidatorFn[];
  stepsChildParentRelations: StepsParentalRelationsType;
  currentStepId: number | 'summary';
  currentAnswers: Record<string, any>;
  showSummary: boolean;
  translations: IrSchemaTranslatorMapType;

  private summary: WizardSummaryV3Type[] = [];

  constructor(data: Partial<WizardIRV3EngineModel>) {
    this.sectionId = data.sectionId ?? '';
    this.schema = data.schema ?? { id: '', version: 0, schema: { sections: [] } };
    this.steps = data.steps ?? [];
    this.formValidations = data.formValidations ?? [];
    this.stepsChildParentRelations = data.stepsChildParentRelations ?? {};
    this.currentStepId = parseInt(data.currentStepId as string, 10) || 1;
    this.currentAnswers = data.currentAnswers ?? {};
    this.showSummary = data.showSummary ?? true;
    this.translations = data.translations ?? {
      sections: new Map([]),
      subsections: new Map([]),
      questions: new Map([])
    };
    this.itemsWithItemsFromAnswer = this.getItemsFromAnswersListMap(this.schema.schema);
  }

  getItemsFromAnswersListMap(schema: InnovationRecordSchemaV3Type): Map<string, string> {
    return new Map(
      this.schema?.schema.sections
        .flatMap(s => s.subSections)
        .find(s => s.id === this.sectionId)
        ?.steps.flatMap(st => st.questions)
        .filter(q => q.items?.some(i => i.itemsFromAnswer))
        .map(i => [i.id, i.items?.find(item => item.itemsFromAnswer)!.itemsFromAnswer!])
    );
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

  gotoSummary(): this {
    this.visitedSteps.clear();

    this.parseSummary();
    this.showSummary = true;
    this.currentStepId = 'summary';

    return this;
  }

  gotoStep(stepId: number | 'summary', isChangeMode = false): this {
    this.currentStepId = parseInt(stepId as string, 10);

    this.isChangingMode = isChangeMode;

    this.visitedSteps.add(this.getCurrentStepObjId());

    return this;
  }

  getPreviousStep(isChangeMode = false): number | 'summary' {
    let previousStepId = this.currentStepId;
    if (this.isFirstStep() || (!isChangeMode && this.visitedSteps.size === 1)) {
      return -1;
    }
    if (typeof previousStepId === 'number') {
      previousStepId--;
      return this.visitedSteps.has(this.getStepObjectId(previousStepId)) ? previousStepId : -1;
    }
    return previousStepId;
  }

  getNextStep(isChangeMode = false): number | 'summary' {
    let nextStepId = this.currentStepId;

    if ((this.showSummary && typeof this.currentStepId === 'number') || this.isLastStep()) {
      return 'summary';
    } else if (typeof nextStepId === 'number') {
      if (isChangeMode) {
        nextStepId++;
        this.visitedSteps.add(this.getStepObjectId(nextStepId));

        let isCurrentStepChildOfAnyVisitedSteps =
          this.visitedSteps.has(this.stepsChildParentRelations[this.getStepObjectId(nextStepId)]) ?? false;

        while (!isCurrentStepChildOfAnyVisitedSteps) {
          // if we reach the end and no other children have been found, return summary
          if (nextStepId === this.steps.length) {
            nextStepId = 'summary';
            break;
          }

          // go through all steps to see if there are any children at some point
          isCurrentStepChildOfAnyVisitedSteps = this.visitedSteps.has(
            this.stepsChildParentRelations[this.getStepObjectId(nextStepId)]
          );

          if (!isCurrentStepChildOfAnyVisitedSteps) {
            this.visitedSteps.delete(this.getStepObjectId(nextStepId));
          }

          nextStepId++;
        }
      } else {
        // Skip if step is hidden
        if (this.steps[nextStepId as number].parameters[0].isHidden === true) {
          nextStepId += 2;
        } else {
          nextStepId++;
        }
      }
    }
    return nextStepId;
  }

  getStepObjectId(stepId: number) {
    return this.steps[stepId - 1].parameters[0].id.split('_')[0] ?? '';
  }

  getCurrentStepObjId(): string {
    // split on '_' to account for dynamic named steps (i.e.: 'standardHasMet_x' => 'standardHasMet')
    return this.currentStep()?.parameters[0].id.split('_')[0] ?? '';
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

  checkIfStepConditionIsMet(condition: InnovationRecordConditionType | undefined): boolean {
    if (!condition) return true;

    return !!condition.options.includes(this.currentAnswers[condition.id]);
  }

  getSummary(): WizardSummaryV3Type[] {
    return this.summary;
  }

  getChildParentRelations(sectionId: string): MappedObjectType {
    const stepsChildParentRelationsMap = new Map();

    this.schema?.schema.sections.forEach(section => {
      section.subSections.forEach(subSection => {
        const stepsChildParentRelations: MappedObjectType = {};

        subSection.steps.forEach(step => {
          step.questions.forEach(question => {
            if (step.condition) {
              stepsChildParentRelations[question.id] = step.condition.id;
            }

            if (
              question.items &&
              question.items[0].itemsFromAnswer &&
              this.currentAnswers[question.items[0].itemsFromAnswer]?.length > 1
            ) {
              stepsChildParentRelations[question.id] = question.items[0].itemsFromAnswer;
            }

            if (question.addQuestion && !question.field) {
              stepsChildParentRelations[question.addQuestion.id] = question.id;
            }

            if (question.addQuestion && question.field) {
              stepsChildParentRelations[question.addQuestion.id] = question.id;
            }
          });

          subSection.stepsChildParentRelations = stepsChildParentRelations;
          stepsChildParentRelationsMap.set(subSection.id, stepsChildParentRelations);
        });
      });
    });
    return stepsChildParentRelationsMap.get(sectionId);
  }

  translateDescriptionUrls(description: string) {
    const regex = new RegExp(/href=\"{{urls\.([^{}]*)}}\"/, 'g');
    const matches = description.matchAll(regex);

    for (const match of matches) {
      description = description.replace(`{{urls.${match[1]}}}`, `${URLS[match[1] as keyof typeof URLS]}`);
    }

    return description;
  }

  runRules(): this {
    this.stepsChildParentRelations = this.getChildParentRelations(this.sectionId);
    this.steps = [];
    const subsection = this.schema?.schema.sections.flatMap(s => s.subSections).find(sub => sub.id === this.sectionId);
    subsection?.steps.forEach(s => {
      // Check if step has conditions. If it doesn't, push. If it does, check if met, and only then push accordingly.
      if (this.checkIfStepConditionIsMet(s.condition)) {
        const step = new FormEngineModelV3({ parameters: [] });
        const addSteps: FormEngineModelV3[] = [];

        s.questions.forEach(q => {
          const param: FormEngineParameterModelV3 = {
            id: q.id,
            dataType: q.dataType,
            label: q.label,
            ...(q.description && { description: this.translateDescriptionUrls(q.description) }),
            ...(q.lengthLimit && { lengthLimit: q.lengthLimit }),
            ...(q.validations && { validations: q.validations }),
            ...(q.items && { items: q.items.map(i => i) }),
            ...(q.addNewLabel && { addNewLabel: q.addNewLabel }),
            ...(q.addQuestion && { addQuestion: q.addQuestion }),
            ...(q.field && { field: q.field }),
            ...(q.condition && { condition: q.condition }),
            isNestedField: false,
            checkboxAnswerId: q.checkboxAnswerId,
            isHidden: false
          };

          // Replace step's items list, when field `itemsFromAnswer` is present, with answers from the previously answered question with that id.
          const relatedQuestionItems = this.schema?.schema.sections
            .flatMap(section => section.subSections.flatMap(s => s.steps.flatMap(st => st.questions)))
            .find(question => question.id === q.id)?.items;

          const itemsFromAnswer = relatedQuestionItems?.find(i => i.itemsFromAnswer)?.itemsFromAnswer;
          if (itemsFromAnswer) {
            const conditionalAnswerId =
              subsection?.steps
                .flatMap(st => st.questions)
                .find(q => q.id === itemsFromAnswer)
                ?.items?.find(item => item.conditional)?.conditional?.id ?? '';

            const itemsDependencyAnswer: string[] = this.currentAnswers[itemsFromAnswer]
              ? (this.currentAnswers[itemsFromAnswer] as arrStringAnswer)
              : [];

            const updatedItemsList = itemsDependencyAnswer.map(item => ({
              id: item,
              label:
                item === 'OTHER'
                  ? this.currentAnswers[conditionalAnswerId]
                  : this.translations.questions.get(itemsFromAnswer)?.items.get(item)?.label
            }));

            param.items = updatedItemsList;

            if (param.items?.length === 1) {
              // Hide step, but keep it in 'this.steps' in order to properly add its value to outbound payload
              param.isHidden = true;
            }
          }

          step.parameters.push(param);

          // runtimerules for `addQuestions`
          const conditionalItem = q.items?.find(i => i.conditional);

          if (q.addQuestion && this.getAnswers()[q.id]) {
            (this.getAnswers()[q.id] as arrStringAnswer).forEach((answer, i) => {
              // replace variables on label's placeholders for fields-groups
              let label = q.addQuestion!.label;

              if (q.dataType === 'fields-group' && q.field) {
                label = q.addQuestion!.label.replace(
                  /{{[^{}]*}}/,
                  this.currentAnswers[q.id][i][q.field.id] ?? q.addQuestion!.label
                );
              } else if (q.dataType === 'checkbox-array' && q.addQuestion) {
                const itemAnswer: string =
                  typeof this.currentAnswers[q.id][i] === 'object'
                    ? this.currentAnswers[q.id][i][this.getCheckBoxAnswerId(q)]
                    : this.currentAnswers[q.id][i];

                label = this.translations.questions.get(q.id)?.items.get(itemAnswer)?.label ?? '';

                // search for conditional on question items, then check if answer is from a conditional. If so, get conditional answer
                if (conditionalItem?.conditional && conditionalItem.id === itemAnswer) {
                  label = this.currentAnswers[conditionalItem.conditional.id];
                }

                // replace variable (i.e. '{{item}}') on label's placeholders for checkbox-arrays with addQuestions
                label = q.addQuestion.label.replace(/{{[^{}]*}}/, label);
              }

              // push addQuestions (checking again for addQuestions for failsafe, we do on outer if, but is not recognized inside forEach)
              if (q.addQuestion) {
                addSteps.push(
                  new FormEngineModelV3({
                    parameters: [
                      {
                        id: `${q.addQuestion.id}_${i}`,
                        dataType: q.addQuestion.dataType,
                        label: label,
                        ...(q.addQuestion.description && {
                          description: this.translateDescriptionUrls(q.addQuestion.description)
                        }),
                        ...(q.addQuestion.lengthLimit && { lengthLimit: q.addQuestion.lengthLimit }),
                        ...(q.addQuestion.validations && { validations: q.addQuestion.validations }),
                        ...(q.addQuestion.items && { items: q.addQuestion.items }),
                        ...(q.addQuestion.addNewLabel && { addNewLabel: q.addQuestion.addNewLabel }),
                        ...(q.addQuestion.addQuestion && { addQuestion: q.addQuestion.addQuestion }),
                        ...(q.addQuestion.field && { field: q.addQuestion.field }),
                        ...(q.addQuestion.condition && { condition: q.addQuestion.condition }),
                        isNestedField: !!(
                          (q.dataType === 'fields-group' && q.addQuestion) ||
                          q.dataType === 'checkbox-array'
                        ),
                        parentId: q.id
                      }
                    ]
                  })
                );
              }
            });
          }
          // }
        });
        this.steps = [...this.steps, step, ...addSteps];
      } else {
        // Clear field's values if condition doesn't pass
        s.questions.forEach(q => {
          this.currentAnswers[q.id] = undefined;
        });
      }
    });

    return this;
  }

  parseSummary(): WizardSummaryV3Type[] {
    let editStepNumber = 0;
    this.summary = [];

    const currentAnswers = this.currentAnswers;

    // Parse condition step's answers
    for (const [i, step] of this.steps.entries()) {
      const stepParams = step.parameters[0];
      let stepId = stepParams.id;
      let label = stepId.split('|')[0];
      let value: string | string[] | undefined = currentAnswers[stepParams.id];
      const isNotMandatory = !stepParams.validations?.isRequired;
      editStepNumber++;

      if (!stepParams.parentId && !stepParams.isHidden) {
        switch (stepParams.dataType) {
          case 'fields-group':
            {
              const stepAnswers = currentAnswers[stepParams.id] as nestedObjectAnswer;

              if (stepAnswers) {
                value = stepAnswers.map(item => item[stepParams.field!.id]);
              }

              // Push "parent"
              this.addSummaryStep(stepId, value, editStepNumber, label, isNotMandatory);

              if (stepParams.addQuestion && stepParams.field) {
                value = undefined;
                // Push "children" if any
                if (stepAnswers) {
                  stepAnswers.forEach((question, i) => {
                    editStepNumber++;

                    stepId = `${stepParams.addQuestion!.id}_${i}`;
                    // replace label item
                    label = stepParams.addQuestion!.label.replace(
                      /{{[^{}]*}}/,
                      this.currentAnswers[stepParams.id][i][stepParams.field!.id]
                    );
                    value = stepAnswers[i][stepParams.addQuestion!.id];
                    this.addSummaryStep(stepId, value, editStepNumber, label, isNotMandatory);
                  });
                }
              }
            }
            break;

          case 'radio-group':
            const stepAnswers = currentAnswers[stepParams.id];
            value = stepAnswers;

            if (!stepParams.parentId) {
            }

            // add if conditional field and answer is present
            const itemWithConditional = stepParams.items?.find(i => i.conditional);

            if (itemWithConditional && currentAnswers[itemWithConditional.conditional!.id]) {
              value = [stepAnswers, currentAnswers[itemWithConditional.conditional!.id]];
            }
            // Push "parent"
            this.addSummaryStep(stepId, value, editStepNumber, label, isNotMandatory);

            break;

          case 'autocomplete-array':
            {
              value = [];
              const stepAnswers = currentAnswers[stepParams.id];
              if (stepAnswers) {
                value = typeof stepAnswers === 'string' ? stepAnswers : (stepAnswers as string[]);
              }

              this.addSummaryStep(stepId, value, editStepNumber, label, isNotMandatory);
            }

            break;
          case 'checkbox-array':
            {
              value = undefined;
              let stepAnswers: string[] = [];

              if (currentAnswers[stepParams.id]) {
                stepAnswers = [...(currentAnswers[stepParams.id] as arrStringAnswer)];

                // Set value of parent, depending on type of answer
                if (stepParams.addQuestion || stepParams.checkboxAnswerId) {
                  value = stepAnswers;

                  label = stepParams.label ?? '';
                }

                // If answer is filled out, and conditional are present, replace their fields' value (i.e. 'OTHER') with user's provided answer.
                if (stepAnswers) {
                  const conditionalItem = stepParams.items?.find(i => i.conditional);
                  const conditionalItemId = conditionalItem?.id;

                  if (conditionalItem && conditionalItemId && stepAnswers.includes(conditionalItemId)) {
                    const conditionalId = conditionalItem.conditional?.id ?? '';
                    const conditonalAnswer = currentAnswers[conditionalId];

                    value = conditonalAnswer ? conditonalAnswer : value;

                    stepAnswers[stepAnswers.findIndex(i => i === conditionalItemId)] = currentAnswers[conditionalId];
                  }
                  value = stepAnswers;
                }
              }

              this.addSummaryStep(stepId, value, editStepNumber, label, isNotMandatory);

              // Push "children" if any
              if (stepParams.addQuestion && stepAnswers) {
                stepAnswers.forEach((item, i) => {
                  editStepNumber++;

                  stepId = `${stepParams.addQuestion?.id}_${i}`;

                  // Replace label variables
                  label = stepParams.addQuestion!.label.replace(
                    /{{[^{}]*}}/,
                    this.translations.questions.get(stepParams.id)?.items.get(item)?.label ?? item
                  );
                  value = currentAnswers[stepId];

                  this.addSummaryStep(stepId, value, editStepNumber, label, isNotMandatory);
                });
              }
            }

            break;
          default: {
            this.addSummaryStep(stepId, value, editStepNumber, label, isNotMandatory);
            break;
          }
        }
      }
    }

    return this.summary;
  }

  runInboundParsing(): this {
    const toReturn: MappedObjectType = {};

    this.steps.forEach(step => {
      const stepParams = step.parameters[0];
      if (this.currentAnswers[stepParams.id]) {
        switch (stepParams.dataType) {
          case 'fields-group':
            if (!stepParams.addQuestion && stepParams.field) {
              // Convert array to nested object, if dataType is 'fields-group' without 'addQuestion'
              toReturn[stepParams.id] = (this.currentAnswers[stepParams.id] as arrStringAnswer).map(item => ({
                [stepParams.field!.id]: item
              }));
            } else {
              (this.currentAnswers[stepParams.id] as nestedObjectAnswer).forEach((answer, i) => {
                toReturn[`${stepParams.addQuestion!.id}_${i}`] = answer[stepParams.addQuestion!.id];
              });
            }

            break;

          case 'checkbox-array':
            if (stepParams.addQuestion || (stepParams.checkboxAnswerId && this.currentAnswers)) {
              // add parent question previous value
              toReturn[stepParams.id] = (this.currentAnswers[stepParams.id] as nestedObjectAnswer).map(
                answer => answer[stepParams.checkboxAnswerId ?? stepParams.id]
              );

              // add all addQuestions previous values
              (this.currentAnswers[stepParams.id] as nestedObjectAnswer).forEach((answer, i) => {
                toReturn[`${stepParams.addQuestion!.id}_${i}`] = answer[stepParams.addQuestion!.id];
              });
            }
            break;
          default:
            break;
        }
      }
    });
    this.currentAnswers = { ...this.currentAnswers, ...toReturn };

    return this;
  }

  runOutboundParsing(): InnovationRecordSectionUpdateType {
    const toReturn: Record<string, any> = {};

    // Filter out steps containing values from nested objects, as these will be already calculated by their parent
    for (const step of this.steps.filter(s => !s.parameters[0].isNestedField).values()) {
      const stepParams = step.parameters[0];
      const currentAnswer = this.currentAnswers[stepParams.id];

      if (currentAnswer) {
        toReturn[stepParams.id] = currentAnswer;
      }

      if (stepParams.dataType === 'checkbox-array') {
        // create nested object if it has addQuestions
        if ((stepParams.addQuestion || stepParams.checkboxAnswerId) && currentAnswer) {
          toReturn[stepParams.id] = (currentAnswer as arrStringAnswer).map((answer, i) => {
            const addQuestionId = `${stepParams.addQuestion!.id}_${i}`;

            return {
              [this.getCheckBoxAnswerId(stepParams)]: answer,
              ...(this.currentAnswers[addQuestionId] && {
                [stepParams.addQuestion!.id]: this.currentAnswers[addQuestionId]
              })
            };
          });
        }
      }

      if (stepParams.dataType === 'autocomplete-array' && currentAnswer) {
        if (Array.isArray(currentAnswer)) {
          toReturn[stepParams.id] = stepParams.validations?.max?.length === 1 ? currentAnswer[0] : currentAnswer;
        } else {
          toReturn[stepParams.id] = currentAnswer;
        }
      }

      if (stepParams.dataType === 'fields-group' && currentAnswer) {
        if (!stepParams.addQuestion) {
          // flatten fields-group with no addQuestions
          toReturn[stepParams.id] = (currentAnswer as nestedObjectAnswer).map(item => {
            return item[stepParams.field!.id];
          });
        } else {
          // add answers from all addQuestions steps to the fields-group object
          (currentAnswer as nestedObjectAnswer).forEach(
            (item, i) => (item[stepParams.addQuestion!.id] = this.currentAnswers[`${stepParams.addQuestion!.id}_${i}`])
          );
          toReturn[stepParams.id] = currentAnswer;
        }
      }

      if (stepParams.dataType === 'radio-group') {
        if (stepParams.items?.length == 1 && stepParams.isHidden) {
          toReturn[stepParams.id] = stepParams.items[0].id;
        }
      }

      // add conditionals
      const conditionalItems = stepParams.items?.filter(i => i.conditional);
      conditionalItems?.forEach(c => {
        if (c.conditional && this.currentAnswers[c.conditional.id]) {
          toReturn[c.conditional.id] = this.currentAnswers[c.conditional.id];
        }
      });

      /* Special logic for questions with itemsFromAnswer */

      const itemsFromAnswerItem = this.itemsWithItemsFromAnswer.get(stepParams.id);
      const answersFromParentAnswer = itemsFromAnswerItem ? this.currentAnswers[itemsFromAnswerItem] : undefined;

      // check if itemsFromAnswer answer is still valid, if not, clear
      if (itemsFromAnswerItem && answersFromParentAnswer) {
        toReturn[stepParams.id] = answersFromParentAnswer.includes(currentAnswer)
          ? this.currentAnswers[stepParams.id]
          : undefined;

        // if 'related' question has 1 value only, set it also as current one's.
        if (this.currentAnswers[itemsFromAnswerItem].length === 1) {
          toReturn[stepParams.id] = this.currentAnswers[itemsFromAnswerItem][0];
        }
      }
    }

    return {
      version: this.schema?.version ?? 0,
      data: toReturn
    };
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

  getCheckBoxAnswerId(stepParams: FormEngineParameterModelV3): string {
    return stepParams.checkboxAnswerId ?? stepParams.id;
  }

  addSummaryStep(
    stepId: string,
    value: string | string[] | undefined,
    editStepNumber: number,
    label?: string,
    isNotMandatory?: boolean
  ) {
    this.summary.push({
      stepId: stepId,
      label: label ?? '',
      value: value ?? '',
      editStepNumber: editStepNumber,
      isNotMandatory: isNotMandatory ?? false
    });
  }

  translateSummaryForIRDocumentExport() {
    // special translation for CSV and PDF export

    const summary = this.parseSummary();

    const translatedSummary = summary.map(item => {
      // get label translation
      const label = this.translations.questions.get(item.label.split('_')[0])?.label ?? item.label;
      let value = '';

      if (typeof item.value === 'string') {
        // translate item
        value = this.translations.questions.get(item.stepId.split('_')[0])?.items.get(item.value)?.label ?? item.value;
      } else if (item.value instanceof Array) {
        const translatedArr: string[] = [];

        // translate each item of Array
        item.value.forEach(v =>
          translatedArr.push(this.translations.questions.get(item.stepId)?.items?.get(v)?.label ?? v)
        );
        value = translatedArr.join('\n');
      }

      return { label: label, value: value };
    });

    // Add evidences when available
    if (this.currentAnswers['evidences']) {
      (this.currentAnswers['evidences'] as { id: string; name: string; summary: string }[]).forEach((evidence, i) =>
        translatedSummary.push({ label: `Evidence ${i + 1}`, value: evidence.name })
      );
    }

    return translatedSummary;
  }
}
