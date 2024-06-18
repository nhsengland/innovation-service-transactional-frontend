import { dummy_schema_V3_202405 } from './ir-v3-schema';
import { InnovationSectionStepLabels } from '../ir-versions.types';
import { SectionsSummaryModel } from '../../innovation.models';
import { WizardIRV3EngineModel } from '@modules/shared/forms/engine/models/wizard-irv3-engine.model';
import { InnovationSectionEnum } from '../../innovation.enums';
import { FormEngineModelV3 } from '@modules/shared/forms/engine/models/form-engine.models';
import {
  InnovationRecordQuestionStepType,
  InnovationRecordSchemaV3Type,
  SectionsSummaryModelV3Type,
  dummy_202405_sections
} from './ir-v3-types';
import { IrV3TranslatePipe } from '@modules/shared/pipes/ir-v3-translate.pipe';
import { SectionStepsList } from '@modules/shared/pages/innovation/sections/section-summary.component';
import {
  InnovationRecordSchemaInfoType,
  IrSchemaTranslatorMapType
} from '../innovation-record-schema/innovation-record-schema.models';

// export function getInnovationRecordSchemaSectionQuestionsLabels(sectionId: string) {
//   const toReturn = new Map();

//   dummy_schema_V3_202405.sections
//     .flatMap(section => section.subSections)
//     .find(s => s.id === sectionId)
//     ?.questions.forEach(sub => {
//       toReturn.set(sub.id, sub.label);
//     });

//   return toReturn;
// }

// export function getIRSchemaSectionsIdsListV3(): string[] {
//   return dummy_schema_V3_202405.sections.flatMap(section => section.subSections.flatMap(s => s.id));
// }

// export function getInnovationRecordSchemaSectionQuestionsIdsList(sectionId: string): string[] {
//   return (
//     dummy_schema_V3_202405.sections
//       .flatMap(section => section.subSections)
//       .find(s => s.id === sectionId)
//       ?.questions.map(q => q.id) ?? []
//   );
// }

// export function getInnovationRecordSectionsTreeV3(
//   type: string,
//   innovationId: string
// ): {
//   label: string;
//   url: string;
//   children: { label: string; id: string; url: string }[];
// }[] {
//   return dummy_schema_V3_202405.sections.map((section, i) => ({
//     label: `${i + 1}. ${section.title}`,
//     url: `/${type}/innovations/${innovationId}/record/sections/${section.subSections[0].id}`,
//     children: section.subSections.map((sub, k) => ({
//       label: `${i + 1}.${k + 1} ${sub.title}`,
//       id: `${sub.id}`,
//       url: `/${type}/innovations/${innovationId}/record/sections/${sub.id}`
//     }))
//   }));
// }

// export function getInnovationRecordSchemaQuestion(stepId: string): InnovationRecordQuestionStepType {
//   return (
//     dummy_schema_V3_202405.sections
//       .flatMap(section => section.subSections.flatMap(s => s.questions))
//       .find(q => q.id === stepId) ?? { id: '', dataType: 'text', label: '' }
//   );
// }

// export function getInnovationRecordStepConditionsMap(): Map<string, string | undefined> {
//   const flattenedQuestions = dummy_schema_V3_202405.sections.flatMap(s => s.subSections.flatMap(sub => sub.questions));

//   console.log(flattenedQuestions);
//   return new Map(flattenedQuestions.map(q => [q.id, q.condition]));
// }
// ``;

export function irSchemaTranslationsMap(schema?: InnovationRecordSchemaV3Type): IrSchemaTranslatorMapType {
  const schemaSections = schema ? schema.sections : dummy_schema_V3_202405.sections;

  // Sections & Subsections labels
  const flattenedSections = schemaSections.flatMap(s => ({ id: s.id, label: s.title }));

  const flattenedSubSections = schemaSections.flatMap(s =>
    s.subSections.flatMap(sub => ({ id: sub.id, label: sub.title }))
  );

  // Questions labels and items

  const allQuestionsFlattened = [
    ...schemaSections.flatMap(s =>
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
    ...schemaSections.flatMap(s =>
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

  // Items labels
  const flattenedItems = schemaSections
    .flatMap(s => s.subSections.flatMap(sub => sub.questions).flatMap(q => q.items))
    .flatMap(i => ({ id: i?.id ?? '', label: i?.label ?? '' }));

  const flattenedAddQuestionItems = schemaSections
    .flatMap(s => s.subSections.flatMap(sub => sub.questions).flatMap(q => q.addQuestion?.items))
    .flatMap(i => ({ id: i?.id ?? '', label: i?.label ?? '' }));

  return {
    sections: new Map(flattenedSections.map(s => [s.id, s.label])),
    subsections: new Map(flattenedSubSections.map(sub => [sub.id, sub.label])),
    questions: flattenedQuestionsLabelsAndItems
  };
}

// export function getInnovationRecordSchemaTranslationsMap(): {
//   sections: Map<string, string>;
//   subsections: Map<string, string>;
//   questions: Map<string, string>;
//   items: Map<string, string>;
// } {
//   // Sections & Subsections labels
//   const flattenedSections = dummy_schema_V3_202405.sections.flatMap(s => ({ id: s.id, label: s.title }));

//   const flattenedSubSections = dummy_schema_V3_202405.sections.flatMap(s =>
//     s.subSections.flatMap(sub => ({ id: sub.id, label: sub.title }))
//   );

//   // Questions labels
//   const flattenedQuestionsLabels = dummy_schema_V3_202405.sections.flatMap(s =>
//     s.subSections.flatMap(sub => sub.questions).flatMap(q => ({ id: q.id, label: q.label }))
//   );
//   const flattenedAddQuestionsLabels = dummy_schema_V3_202405.sections
//     .flatMap(s => s.subSections.flatMap(sub => sub.questions).flatMap(q => q.addQuestion))
//     .flatMap(i => ({ id: i?.id ?? '', label: i?.label ?? '' }));

//   // Items labels
//   const flattenedItems = dummy_schema_V3_202405.sections
//     .flatMap(s => s.subSections.flatMap(sub => sub.questions).flatMap(q => q.items))
//     .flatMap(i => ({ id: i?.id ?? '', label: i?.label ?? '' }));

//   const flattenedAddQuestionItems = dummy_schema_V3_202405.sections
//     .flatMap(s => s.subSections.flatMap(sub => sub.questions).flatMap(q => q.addQuestion?.items))
//     .flatMap(i => ({ id: i?.id ?? '', label: i?.label ?? '' }));

//   return {
//     sections: new Map(flattenedSections.map(s => [s.id, s.label])),
//     subsections: new Map(flattenedSubSections.map(sub => [sub.id, sub.label])),
//     questions: new Map([...flattenedQuestionsLabels, ...flattenedAddQuestionsLabels].map(q => [q.id, q.label])),
//     items: new Map([...flattenedItems, ...flattenedAddQuestionItems].map(i => [i.id, i.label]))
//   };
// }

// export function getSectionsSummary(currentSummary: SectionsSummaryModel): SectionsSummaryModelV3Type {
//   const sectionsSummary = Object.fromEntries(
//     currentSummary
//       .flatMap(s => s.sections)
//       .map(sub => [
//         sub.id,
//         {
//           status: sub.status,
//           submittedAt: sub.submittedAt,
//           submittedBy: sub.submittedBy,
//           isCompleted: sub.isCompleted,
//           openTasksCount: sub.openTasksCount
//         }
//       ])
//   );

//   return dummy_202405_sections.map(section => ({
//     id: section.id,
//     title: section.title,
//     sections: section.subsections.map(s => ({
//       id: s.id,
//       title: s.title,
//       status: sectionsSummary[translateSectionIdEnums(s.id)].status,
//       submittedAt: sectionsSummary[translateSectionIdEnums(s.id)].submittedAt,
//       submittedBy: sectionsSummary[translateSectionIdEnums(s.id)].submittedBy,
//       isCompleted: sectionsSummary[translateSectionIdEnums(s.id)].isCompleted,
//       openTasksCount: sectionsSummary[translateSectionIdEnums(s.id)].openTasksCount
//     }))
//   }));
// }

// export function getInnovationRecordSectionV3(sectionId: string): {
//   id: string;
//   title: string;
//   wizard: WizardIRV3EngineModel;
//   evidences?: WizardIRV3EngineModel;
// } {
//   const subsection = dummy_schema_V3_202405.sections.flatMap(s => s.subSections).find(sub => sub.id === sectionId);

//   return {
//     id: subsection?.id ?? '',
//     title: subsection?.title ?? '',
//     wizard: new WizardIRV3EngineModel({
//       sectionId: subsection?.id,
//       steps: subsection!.questions.map(
//         question =>
//           new FormEngineModelV3({
//             parameters: []
//           })
//       )
//     })
//   };
// }

// export function getInnovationRecordSectionIdentificationV3(
//   sectionId: string
// ): null | { group: { number: number; title: string }; section: { number: number; title: string } } {
//   const section_group =
//     dummy_schema_V3_202405.sections.findIndex(s => s.subSections.find(sub => sub.id === sectionId)) ?? 0;
//   const section =
//     dummy_schema_V3_202405.sections[section_group].subSections.findIndex(sub => sub.id === sectionId) ?? 0;
//   return {
//     group: { number: section_group + 1, title: dummy_schema_V3_202405.sections[section_group].title },
//     section: { number: section + 1, title: dummy_schema_V3_202405.sections[section_group].subSections[section].title }
//   };
// }

// export function getSectionAllStepsList(sectionId: string): SectionStepsList {
//   const section = dummy_schema_V3_202405.sections.flatMap(s => s.subSections).find(sub => sub.id === sectionId);
//   const flattenedQuestions =
//     section?.questions.flatMap(q => [
//       { label: q.label, conditional: !!q.condition },
//       ...(q.addQuestion ? [{ label: q.addQuestion.label, conditional: true }] : [])
//     ]) ?? [];

//   return flattenedQuestions;
// }

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
