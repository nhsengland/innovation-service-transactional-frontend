import { InnovationSectionEnum } from '../../innovation.enums';
import { InnovationRecordSchemaV3Type } from './ir-v3-types';
import { IrSchemaTranslatorMapType } from '../innovation-record-schema/innovation-record-schema.models';

export function irSchemaTranslationsMap(schema: InnovationRecordSchemaV3Type): IrSchemaTranslatorMapType {
  // Sections & Subsections labels
  const flattenedSections = schema.sections.flatMap(s => ({ id: s.id, label: s.title }));

  const flattenedSubSections = schema.sections.flatMap(s =>
    s.subSections.flatMap(sub => ({ id: sub.id, label: sub.title }))
  );

  // Questions labels and items

  const allQuestionsFlattened = [
    ...schema.sections.flatMap(s =>
      s.subSections.flatMap(sub =>
        sub.steps
          .flatMap(st => st.questions)
          .flatMap(q => ({
            id: q.id,
            label: q.label,
            items: q?.items?.map(item => ({
              id: item.id,
              label: item.label,
              group: item.group
            }))
          }))
      )
    ),
    ...schema.sections.flatMap(s =>
      s.subSections.flatMap(sub =>
        sub.steps
          .flatMap(st => st.questions)
          .flatMap(q => q.addQuestion)
          .flatMap(addQuestion => ({
            id: addQuestion?.id ?? '',
            label: addQuestion?.label ?? '',
            items: addQuestion?.items?.map(item => ({
              id: item.id,
              label: item.label,
              group: item.group
            }))
          }))
      )
    )
  ];

  const flattenedQuestionsLabelsAndItems = new Map<
    string,
    { label: string; items: Map<string, { label: string; group: string }> }
  >(
    allQuestionsFlattened.map(q => [
      q.id,
      {
        label: q.label,
        items: new Map<string, { label: string; group: string }>(
          q.items?.map(i => [i?.id ?? '', { label: i?.label ?? '', group: i?.group ?? '' }])
        )
      }
    ])
  );

  return {
    sections: new Map(flattenedSections.map(s => [s.id, s.label])),
    subsections: new Map(flattenedSubSections.map(sub => [sub.id, sub.label])),
    questions: flattenedQuestionsLabelsAndItems
  };
}

