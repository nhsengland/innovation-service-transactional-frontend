import { InnovationRecordSchemaV3Type } from './ir-v3-types';
import {
  InnovationRecordSchemaInfoType,
  IrSchemaTranslatorMapType
} from '../innovation-record-schema/innovation-record-schema.models';

export function irSchemaTranslationsMap(schema: InnovationRecordSchemaV3Type): IrSchemaTranslatorMapType {
  const flattenedSections = new Map();
  const flattenedSubSections = new Map();
  const allQuestionsLabelsAndItems = new Map();

  const sectionsQuestions: {
    id: string;
    label: string;
    items:
      | {
          itemsFromAnswer?: string | undefined;
          id: string | undefined;
          label: string | undefined;
          group: string | undefined;
        }[]
      | undefined;
  }[] = [];

  for (const section of schema.sections) {
    flattenedSections.set(section.id, section.title);

    for (const sub of section.subSections) {
      flattenedSubSections.set(sub.id, sub.title);

      for (const q of sub.steps.flatMap(s => s.questions)) {
        // push main question
        sectionsQuestions.push({
          id: q.id,
          label: q.label,
          items: q?.items?.map(item => ({
            id: item.id,
            label: item.label,
            group: item.group,
            ...(item.itemsFromAnswer && { itemsFromAnswer: item.itemsFromAnswer })
          }))
        });

        // check for addQuestions
        if (q.addQuestion) {
          sectionsQuestions.push({
            id: q.addQuestion?.id ?? '',
            label: q.addQuestion?.label ?? '',
            items: q.addQuestion?.items?.map(item => ({
              id: item.id,
              label: item.label,
              group: item.group,
              ...(item.itemsFromAnswer && { itemsFromAnswer: item.itemsFromAnswer })
            }))
          });
        }
      }
    }
  }

  sectionsQuestions.forEach(q => {
    if (q.items?.some(i => i.itemsFromAnswer)) {
      const itesmFromAnswerId = q.items.find(i => i.itemsFromAnswer)?.itemsFromAnswer;
      const correspondingAnswer = sectionsQuestions.find(q => q.id === itesmFromAnswerId);
      allQuestionsLabelsAndItems.set(q.id, {
        label: q.label,
        items: new Map<string, { label: string; group: string }>(
          correspondingAnswer?.items?.map(i => [i?.id ?? '', { label: i?.label ?? '', group: i?.group ?? '' }])
        )
      });
    } else {
      allQuestionsLabelsAndItems.set(q.id, {
        label: q.label,
        items: new Map<string, { label: string; group: string }>(
          q.items?.map(i => [i?.id ?? '', { label: i?.label ?? '', group: i?.group ?? '' }])
        )
      });
    }
  });

  return {
    sections: flattenedSections,
    subsections: flattenedSubSections,
    questions: allQuestionsLabelsAndItems
  };
}

export function getIrSchemaQuestionItemsValueAndLabel(
  schema: InnovationRecordSchemaInfoType,
  questionId: string
): { value: string; label: string }[] {
  const toReturn: { value: string; label: string }[] = [];
  irSchemaTranslationsMap(schema.schema)
    .questions.get(questionId)
    ?.items.forEach((v, k) => toReturn.push({ value: k, label: v.label }));
  return toReturn;
}
