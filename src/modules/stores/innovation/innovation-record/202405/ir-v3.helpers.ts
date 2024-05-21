import { dummy_schema_V3_202405 } from './ir-v3-schema';
import { FormEngineModel, WizardEngineModel, WizardSummaryType } from '@modules/shared/forms';
import { InnovationSectionStepLabels } from '../ir-versions.types';
import { SectionsSummaryModel } from '../../innovation.models';
import { WizardIRV3EngineModel } from '@modules/shared/forms/engine/models/wizard-ir-engine.model';
import { InnovationSectionEnum } from '../../innovation.enums';
import { FormEngineModelV3 } from '@modules/shared/forms/engine/models/form-engine.models';
import {
  InnovationRecordSubSectionType,
  InnovationSectionInfoDTOV3Type,
  SectionsSummaryModelV3Type,
  dummy_202405_sections
} from './ir-v3-types';

export function getSectionQuestionsLabels(sectionId: string) {
  const toReturn = new Map();

  getSubSectionsListV3()
    .find(s => s.id === sectionId)
    ?.questions.forEach(sub => {
      toReturn.set(sub.id, sub.label);
    });

  return toReturn;
}

export function getSectionsIdsListV3(): string[] {
  return dummy_schema_V3_202405.sections.flatMap(section => section.subSections.flatMap(s => s.id));
}

export function getSectionQuestionsIdList(sectionId: string): string[] {
  return (
    getSubSectionsListV3()
      .find(s => s.id === sectionId)
      ?.questions.map(q => q.id) ?? []
  );
}

export function getSubSectionsListV3(): InnovationRecordSubSectionType[] {
  return dummy_schema_V3_202405.sections.flatMap(section => section.subSections);
}

export function getSectionsSummary(currentSummary: SectionsSummaryModel): SectionsSummaryModelV3Type {
  const sectionsSummary = Object.fromEntries(
    currentSummary
      .flatMap(s => s.sections)
      .map(sub => [
        sub.id,
        {
          status: sub.status,
          submittedAt: sub.submittedAt,
          submittedBy: sub.submittedBy,
          isCompleted: sub.isCompleted,
          openTasksCount: sub.openTasksCount
        }
      ])
  );

  return dummy_202405_sections.map(section => ({
    id: section.id,
    title: section.title,
    sections: section.subsections.map(s => ({
      id: s.id,
      title: s.title,
      status: sectionsSummary[translateSectionIdEnums(s.id)].status,
      submittedAt: sectionsSummary[translateSectionIdEnums(s.id)].submittedAt,
      submittedBy: sectionsSummary[translateSectionIdEnums(s.id)].submittedBy,
      isCompleted: sectionsSummary[translateSectionIdEnums(s.id)].isCompleted,
      openTasksCount: sectionsSummary[translateSectionIdEnums(s.id)].openTasksCount
    }))
  }));
}

export function getSectionInfoV3(sectionId: string): InnovationSectionInfoDTOV3Type {
  return {
    id: '81C1E756-515C-EE11-9937-000D3A7F2739"',
    section: sectionId,
    status: 'SUBMITTED',
    updatedAt: '2024-03-22T10:31:47.981Z',
    data: {
      name: 'Amazing Innovation',
      description: 'Just a great innovation... with updated descriptionas',
      countryName: 'Argentina',
      categories: ['AI', 'PPE', 'OTHER'],
      otherCategoryDescription: 'Random category',
      mainCategory: 'OTHER',
      careSettings: ['OTHER', 'PHARMACY', 'PRIMARY_CARE'],
      otherCareSetting: 'custom care setting',
      mainPurpose: 'MANAGE_CONDITION',
      supportDescription: 'asd',
      currentlyReceivingSupport: 'asdj',
      involvedAACProgrammes: [
        'Artificial Intelligence in Health and Care Award',
        'Early Access to Medicines Scheme',
        'Clinical Entrepreneur Programme',
        'Innovation for Healthcare Inequalities Programme'
      ]
    },
    submittedAt: '2024-02-22T10:31:47.981Z',
    submittedBy: {
      name: 'Pablo',
      isOwner: true
    },
    tasksIds: []
  };
}

export function getInnovationRecordSectionsList(): {
  id: string;
  title: string;
  sections: { id: string; title: string; wizard: WizardEngineModel }[];
}[] {
  return dummy_schema_V3_202405.sections.map(section => ({
    id: section.id,
    title: section.title,
    sections: section.subSections.map(subsection => ({
      id: subsection.id,
      title: subsection.title,
      wizard: new WizardEngineModel({
        steps: subsection.questions.map(
          question =>
            new FormEngineModel({
              parameters: [
                {
                  id: question.id,
                  dataType: question.dataType,
                  label: question.label,
                  description: question.description,
                  ...(question.lengthLimit && { lengthLimit: question.lengthLimit }),
                  ...(question.validations && { validations: {} })
                }
              ]
            })
        )
      })
    }))
  }));
}

export function getInnovationRecordSectionV3(sectionId: string): {
  id: string;
  title: string;
  wizard: WizardIRV3EngineModel;
  allStepsList?: InnovationSectionStepLabels;
  evidences?: WizardIRV3EngineModel;
} {
  const subsection = dummy_schema_V3_202405.sections.flatMap(s => s.subSections).find(sub => sub.id === sectionId);

  return {
    id: subsection?.id ?? '',
    title: subsection?.title ?? '',
    wizard: new WizardIRV3EngineModel({
      steps: subsection!.questions.map(
        question =>
          new FormEngineModelV3({
            parameters: [
              {
                id: question.id,
                dataType: question.dataType,
                label: question.label,
                description: question.description,
                ...(question.lengthLimit && { lengthLimit: question.lengthLimit }),
                ...(question.validations && { validations: question.validations }),
                ...(question.items && { items: question.items })
              }
            ]
          })
      )
    })
  };
}

export function getInnovationRecordSectionIdentificationV3(
  sectionId: string
): null | { group: { number: number; title: string }; section: { number: number; title: string } } {
  const section_group = dummy_schema_V3_202405.sections.find(s => s.subSections.find(sub => sub.id === sectionId));
  const section = section_group?.subSections.find(sub => sub.id === sectionId)?.title ?? '';
  return {
    group: { number: 1, title: section_group?.title ?? '' },
    section: { number: 1, title: section }
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

export function runSectionSummaryParsingV3(): WizardSummaryType[] {
  const summary = {};
  return [{ label: 'asd', value: 'sadasd' }];
}
