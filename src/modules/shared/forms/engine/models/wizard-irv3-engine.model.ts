import { FormEngineHelperV3 } from '../helpers/form-engine-v3.helper';
import { FormEngineModel, FormEngineModelV3, FormEngineParameterModelV3 } from './form-engine.models';
import { ValidatorFn } from '@angular/forms';
import { InnovationRecordConditionType } from '@modules/stores/innovation/innovation-record/202405/ir-v3-types';
import {
  InnovationRecordSchemaInfoType,
  InnovationRecordSectionUpdateType,
  IrSchemaTranslatorMapType
} from '@modules/stores/innovation/innovation-record/innovation-record-schema/innovation-record-schema.models';
import { MappedObjectType } from '@app/base/types';
import { cond } from 'lodash';
import e from 'express';

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

export type StepsParentalRelationsType = {
  [child: string]: string;
};

export class WizardIRV3EngineModel {
  sectionId: string;
  isChangingMode: boolean = false;
  visitedSteps: Set<string> = new Set<string>();
  steps: WizardStepTypeV3[];
  schema: InnovationRecordSchemaInfoType | null;
  formValidations: ValidatorFn[];
  stepsChildParentRelations: StepsParentalRelationsType;
  currentStepId: number | 'summary';
  currentAnswers: { [key: string]: any };
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

  gotoStep(stepId: number | 'summary', isChangeMode: boolean = false): this {
    this.currentStepId = parseInt(stepId as string, 10);

    this.isChangingMode = isChangeMode;

    this.visitedSteps.add(this.getCurrentStepObjId());

    return this;
  }

  getPreviousStep(isChangeMode: boolean = false): number | 'summary' {
    let previousStepId = this.currentStepId;
    if (typeof previousStepId === 'number') {
      previousStepId--;
      if (isChangeMode) {
        return this.visitedSteps.has(this.getStepObjectId(previousStepId)) ? previousStepId : -1;
      }
      return previousStepId--;
    }
    return previousStepId;
  }

  getNextStep(isChangeMode: boolean = false): number | 'summary' {
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

            if (question.items && question.items[0].itemsFromAnswer) {
              stepsChildParentRelations[question.id] = question.items[0].itemsFromAnswer;
            }

            if (question.addQuestion && !question.field) {
              stepsChildParentRelations[question.addQuestion.id] = question.id;
            }

            if (question.addQuestion && question.field) {
              stepsChildParentRelations[question.addQuestion.id] = question.id;
            }
          });

          if (Object.keys(stepsChildParentRelations).length) {
            subSection.stepsChildParentRelations = stepsChildParentRelations;
            stepsChildParentRelationsMap.set(subSection.id, stepsChildParentRelations);
          }
        });
      });
    });
    return stepsChildParentRelationsMap.get(sectionId);
  }

  runRules(): this {
    console.log('CURRENT SCHEMA:', this.schema);

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
            description: q.description,
            ...(q.lengthLimit && { lengthLimit: q.lengthLimit }),
            ...(q.validations && { validations: q.validations }),
            ...(q.items && { items: q.items.map(i => i) }),
            ...(q.addNewLabel && { addNewLabel: q.addNewLabel }),
            ...(q.addQuestion && { addQuestion: q.addQuestion }),
            ...(q.field && { field: q.field }),
            ...(q.condition && { condition: q.condition }),
            isNestedField: false
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
              ? (this.currentAnswers[itemsFromAnswer] as string[])
              : [];

            const updatedItemsList = itemsDependencyAnswer.map(item => ({
              id: item,
              label:
                item === 'OTHER'
                  ? this.currentAnswers[conditionalAnswerId]
                  : this.translations.questions.get(itemsFromAnswer)?.items.get(item)?.label
            }));

            param.items = updatedItemsList;
          }

          step.parameters.push(param);

          // if (q.dataType === 'fields-group' && this.currentAnswers[q.id]) {
          // this.currentAnswers[q.id] = (this.currentAnswers[q.id] as [{ [key: string]: string }]).filter(
          //   item => item[q.field!.id]
          // );

          //   // Updates nested values
          //   if (q.addQuestion && q.field) {
          //     Object.keys(this.currentAnswers)
          //       .filter(key => (key as string).startsWith(q.addQuestion!.id))
          //       .forEach(key => {
          //         const index = Number(key.split('_')[1]);
          //         if (index > -1) {
          //           ((this.currentAnswers[q.id] as [{ [key: string]: string }]) ?? [])[index][q.addQuestion!.id] =
          //             this.currentAnswers[key as any];
          //         }
          //         delete this.currentAnswers[key as any];
          //       });
          //   }
          // }

          /* End of special rules */

          // runtimerules for `addQuestions`
          if (q.addQuestion && this.getAnswers()[q.id]) {
            (this.getAnswers()[q.id] as string[]).forEach((answer, i) => {
              // replace variables on label's placeholders for fields-groups
              let label = q.addQuestion!.label;
              if (q.dataType === 'fields-group' && q.field) {
                label = q.addQuestion!.label.replace(
                  `{{item.${q.field.id}}}`,
                  this.currentAnswers[q.id][i][q.field.id] ?? q.addQuestion!.label
                );
              } else if (q.dataType === 'checkbox-array') {
                // replace variables on label's placeholders for checkbox-arrays with addQuestions
                label = q.addQuestion!.label.replace(
                  '{{item}}',
                  this.translations.questions.get(this.currentAnswers[q.id][i][q.id])?.label ?? label
                );
              }

              addSteps.push(
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
                      isNestedField: !!(
                        (q.dataType === 'fields-group' && q.addQuestion) ||
                        q.dataType === 'checkbox-array'
                      )
                    }
                  ]
                })
              );
              if (q.dataType === 'fields-group' || q.dataType === 'checkbox-array') {
                this.currentAnswers[`${q.addQuestion!.id}_${i}`] = this.currentAnswers[q.id][i][q.addQuestion!.id];
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
    console.log('this.steps:', this.steps);
    this.runInboundParsing();
    return this;
  }

  translateSummaryForIRDocumentExport() {
    const summary = this.parseSummary();

    const translatedSummary = summary.map(item => {
      // get label translation
      const label = this.translations.questions.get(item.label.split('_')[0])?.label ?? item.label;
      let value = '';

      if (typeof item.value === 'string') {
        // translate item
        value = this.translations.questions.get(item.stepId.split('_')[0])?.items.get(item.value)?.label ?? item.value;
      } else if (item.value instanceof Array) {
        let translatedArr: string[] = [];

        // translate each item of Array
        item.value.forEach(v =>
          translatedArr.push(this.translations.questions.get(item.stepId)?.items?.get(v)?.label ?? v)
        );
        value = translatedArr.join(', ');
      }

      return { label: label, value: value };
    });

    return translatedSummary;
  }

  parseSummary(): WizardSummaryV3Type[] {
    let editStepNumber = 0;
    this.summary = [];

    const currentAnswers = this.currentAnswers;

    // Parse condition step's answers
    for (const [i, step] of this.steps.entries()) {
      let params = step.parameters[0];
      let stepId = params.id;
      let label = stepId.split('|')[0];
      let value: string | string[] | undefined = currentAnswers[params.id];
      let isNotMandatory = !!!params.validations?.isRequired;
      editStepNumber++;

      switch (params.dataType) {
        case 'fields-group':
          {
            const currAnswer = currentAnswers[params.id] as [{ [key: string]: string }];

            // Push "parent"
            this.summary.push({
              stepId: stepId,
              label: label,
              value: currAnswer ? currAnswer.map(item => item[params.field!.id]).join(', ') : '',
              editStepNumber: editStepNumber,
              isNotMandatory: isNotMandatory
            });

            if (params.addQuestion) {
              // Push "children" if any
              currAnswer.forEach((_, i) => {
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

        case 'radio-group':
          let stepAnswers: string;
          stepAnswers = currentAnswers[params.id];

          value = stepAnswers;

          // add if conditional field and answer is present
          const itemWithConditional = params.items?.find(i => i.conditional);

          if (itemWithConditional && currentAnswers[itemWithConditional!.conditional!.id]) {
            value = [stepAnswers, currentAnswers[itemWithConditional!.conditional!.id]];
          }

          // Push "parent"
          this.summary.push({
            stepId: stepId,
            label: label,
            value: value ?? '',
            editStepNumber: editStepNumber,
            isNotMandatory: isNotMandatory
          });
          break;

        case 'autocomplete-array':
        case 'checkbox-array':
          {
            let stepAnswers: string[] | { [key: string]: string }[] | undefined = undefined;

            // Set value of parent, depending on type of answer
            if (!params.addQuestion) {
              stepAnswers = [...(currentAnswers[params.id] as string[])];

              // If present, replace conditional fields' answers with typed answer.
              if (stepAnswers) {
                const conditionalItem = params.items?.find(i => i.conditional);
                const conditionalItemId = conditionalItem?.id;

                if (conditionalItem && conditionalItemId && stepAnswers.includes(conditionalItemId)) {
                  const conditionalId = conditionalItem.conditional?.id ?? '';
                  const conditonalAnswer = currentAnswers[conditionalId];

                  value = conditonalAnswer ? conditonalAnswer : value;

                  stepAnswers[stepAnswers.findIndex(i => i === conditionalItemId)] = currentAnswers[conditionalId];
                }
                value = stepAnswers;
              }
            } else {
              stepAnswers = currentAnswers[params.id] as [{ [key: string]: string }];

              value = stepAnswers ? stepAnswers.map(item => item[params.id]) : undefined;
            }

            // Push "parent"
            this.summary.push({
              stepId: stepId,
              label: label,
              value: value ?? '',
              editStepNumber: editStepNumber,
              isNotMandatory: isNotMandatory
            });

            // Push "children" if any

            if (params.addQuestion && stepAnswers) {
              const stepAnswers = currentAnswers[params.id] as [{ [key: string]: string }];
              stepAnswers.forEach((item, i) => {
                editStepNumber++;
                this.summary.push({
                  stepId: `${params.addQuestion?.id}_${i}`,
                  label: params.addQuestion!.label.replace(
                    '{{item}}',
                    this.translations.questions.get(params.id)?.items.get(stepAnswers[i][params.id])?.label ??
                      stepAnswers[i][params.id]
                  ),
                  value: stepAnswers[i][params.addQuestion!.id],
                  editStepNumber: editStepNumber
                });
              });
            }
          }
          break;
        default: {
          this.summary.push({
            stepId: stepId,
            label: label,
            value: value ?? '',
            editStepNumber: editStepNumber,
            isNotMandatory: isNotMandatory
          });

          break;
        }
      }
    }

    console.log('summary:', this.summary);
    return this.summary;
  }

  runInboundParsing(): this {
    this.steps.forEach(step => {
      const stepParams = step.parameters[0];
      if (this.currentAnswers[stepParams.id]) {
        // Convert array to nested object, if dataType is 'fields-group' without 'addQuestion'
        if (stepParams.dataType === 'fields-group' && stepParams.field) {
          if (!stepParams.addQuestion) {
            this.currentAnswers[stepParams.id] = (this.currentAnswers[stepParams.id] as string[]).map(item => ({
              [stepParams.field!.id]: item
            }));
          }
        }
      }
    });

    return this;
  }

  runOutboundParsing(): InnovationRecordSectionUpdateType {
    let toReturn: { [key: string]: any } = {};

    for (const [i, step] of this.steps.entries()) {
      const stepParams = step.parameters[0];

      // Ignore fields that are already inside nested objects
      if (!stepParams.isNestedField && this.currentAnswers[stepParams.id]) {
        toReturn[stepParams.id] = this.currentAnswers[stepParams.id];
      }

      if (stepParams.dataType === 'autocomplete-array') {
        toReturn[stepParams.id] =
          stepParams.validations?.max?.length === 1
            ? this.currentAnswers[stepParams.id][0]
            : this.currentAnswers[stepParams.id];
      }

      // flatten fields-group with no addQuestions
      if (stepParams.dataType === 'fields-group' && !stepParams.addQuestion && this.currentAnswers[stepParams.id]) {
        toReturn[stepParams.id] = (this.currentAnswers[stepParams.id] as [{ [key: string]: string }]).map(item => {
          return item[stepParams.field!.id];
        });
      }

      // add conditionals
      const conditionalItems = stepParams.items?.filter(i => i.conditional);
      conditionalItems?.forEach(c => {
        if (c.conditional && this.currentAnswers[c.conditional.id]) {
          toReturn[c.conditional.id] = this.currentAnswers[c.conditional.id];
        }
      });
    }

    // parse Calculated Fields
    const calculatedFields = this.schema?.schema.sections
      .flatMap(s => s.subSections)
      .find(sub => sub.id === this.sectionId)?.calculatedFields;
    if (calculatedFields) {
      for (const [field, conditions] of Object.entries(calculatedFields)) {
        conditions.forEach(f => {
          if (toReturn[f.id] && (f.options.includes(toReturn[f.id]) || !f.options.length)) {
            toReturn[field] = toReturn[f.id];
            return;
          }
        });
      }
    }

    console.log('outbound parsing:', { version: this.schema?.version ?? 0, data: toReturn });
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
}
