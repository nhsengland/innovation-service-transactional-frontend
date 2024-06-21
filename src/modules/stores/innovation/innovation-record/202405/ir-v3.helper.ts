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
        sub.questions.flatMap(q => ({
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
        sub.questions
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

export function translateSectionIdEnums(newId: string): string {
  switch (newId) {
    case 'innovationDescription':
      return InnovationSectionEnum.INNOVATION_DESCRIPTION;
    case 'INNOVATION_DESCRIPTION':
      return 'innovationDescription';

    case 'valueProposition':
      return InnovationSectionEnum.VALUE_PROPOSITION;
    case 'VALUE_PROPOSITION':
      return 'valueProposition';

    case 'understandingOfNeeds':
      return InnovationSectionEnum.UNDERSTANDING_OF_NEEDS;
    case 'UNDERSTANDING_OF_NEEDS':
      return 'understandingOfNeeds';

    case 'evidenceOfEffectiveness':
      return InnovationSectionEnum.EVIDENCE_OF_EFFECTIVENESS;
    case 'EVIDENCE_OF_EFFECTIVENESS':
      return 'evidenceOfEffectiveness';

    case 'marketResearch':
      return InnovationSectionEnum.MARKET_RESEARCH;
    case 'MARKET_RESEARCH':
      return 'marketResearch';

    case 'currentCarePathway':
      return InnovationSectionEnum.CURRENT_CARE_PATHWAY;
    case 'CURRENT_CARE_PATHWAY':
      return 'currentCarePathway';

    case 'testingWithUsers':
      return InnovationSectionEnum.TESTING_WITH_USERS;
    case 'TESTING_WITH_USERS':
      return 'testingWithUsers';

    case 'regulationsAndStandards':
      return InnovationSectionEnum.REGULATIONS_AND_STANDARDS;
    case 'REGULATIONS_AND_STANDARDS':
      return 'regulationsAndStandards';

    case 'intellectualProperty':
      return InnovationSectionEnum.INTELLECTUAL_PROPERTY;
    case 'INTELLECTUAL_PROPERTY':
      return 'intellectualProperty';

    case 'revenueModel':
      return InnovationSectionEnum.REVENUE_MODEL;
    case 'REVENUE_MODEL':
      return 'revenueModel';

    case 'costOfInnovation':
      return InnovationSectionEnum.COST_OF_INNOVATION;
    case 'COST_OF_INNOVATION':
      return 'costOfInnovation';

    case 'deployment':
      return InnovationSectionEnum.DEPLOYMENT;
    case 'DEPLOYMENT':
      return 'deployment';

    default:
      return '';
  }
}
