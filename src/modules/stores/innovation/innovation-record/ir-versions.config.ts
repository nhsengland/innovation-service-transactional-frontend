import { MappedObjectType } from '@modules/core/interfaces/base.interfaces';
import { InnovationSectionEnum } from '../innovation.enums';
import { INNOVATION_SECTION_STATUS } from '../innovation.models';
import { InnovationSectionStepLabels, InnovationSectionsListType } from './ir-versions.types';
import { FormEngineParameterModel, WizardEngineModel } from '@modules/shared/forms';

import {
  categoriesItems as SECTIONS_202209_categoriesItems,
  clinicalEvidenceItems as SECTIONS_202209_evidencetypeItems
} from './202209/forms.config';
import { INNOVATION_SECTIONS as SECTIONS_202209 } from './202209/main.config';
import {
  categoriesItems as SECTIONS_202304_categoriesItems,
  evidenceTypeItems as SECTIONS_202304_evidenceTypeItems
} from './202304/forms.config';
import { INNOVATION_SECTIONS as SECTIONS_202304 } from './202304/main.config';
import { getInnovationRecordSectionsList } from './202405/ir-v3.helpers';

export type AllSectionsOutboundPayloadType = {
  title: string;
  sections: {
    section: string;
    answers: { label: string; value: string }[];
    status: 'SUBMITTED' | 'UNKNOWN' | 'NOT_STARTED' | 'DRAFT';
  }[];
}[];

export const irVersionsMainCategoryItems = [...SECTIONS_202209_categoriesItems, ...SECTIONS_202304_categoriesItems];
export const irVersionsClinicalMainCategoryItems = [
  ...SECTIONS_202209_evidencetypeItems,
  ...SECTIONS_202304_evidenceTypeItems
];

// These sections should accept documents/files even before the innovation is submitted for NA.
export const innovationSectionsWithFiles = [
  'UNDERSTANDING_OF_NEEDS',
  'EVIDENCE_OF_EFFECTIVENESS',
  'TESTING_WITH_USERS',
  'REGULATIONS_AND_STANDARDS',
  'DEPLOYMENT'
];

export function getInnovationRecordConfig(version?: string): InnovationSectionsListType {
  switch (version) {
    case '202209':
      return SECTIONS_202209;
    case '202304':
    default:
      return SECTIONS_202304;
  }
}

export function getInnovationRecordConfigV3() {
  return getInnovationRecordSectionsList();
}

export function getAllSectionsSummary(
  data: {
    section: {
      id: null | string;
      section: InnovationSectionEnum;
      status: keyof typeof INNOVATION_SECTION_STATUS;
      updatedAt: string;
    };
    data: MappedObjectType;
  }[],
  version?: string
): AllSectionsOutboundPayloadType {
  const sectionMap = new Map(data.map(d => [d.section.section, d]));

  return getInnovationRecordConfig(version).map(i => ({
    title: i.title,
    sections: i.sections.map(s => ({
      section: s.title,
      status: sectionMap.get(s.id as any)?.section.status ?? 'UNKNOWN',
      answers: s.wizard
        .runSummaryParsing(s.wizard.runInboundParsing(sectionMap.get(s.id as any)?.data ?? {}))
        .filter(item => item.type !== 'button' && !item.isFile)
        .map(a => ({ label: a.label, value: a.value || '' }))
    }))
  }));
}

export function getAllSectionsList(): { value: string; label: string }[] {
  return getInnovationRecordConfig().reduce((sectionGroupAcc: { value: string; label: string }[], sectionGroup, i) => {
    return [
      ...sectionGroupAcc,
      ...sectionGroup.sections.reduce((sectionAcc: { value: string; label: string }[], section, j) => {
        return [...sectionAcc, ...[{ value: section.id, label: `${i + 1}.${j + 1} ${section.title}` }]];
      }, [])
    ];
  }, []);
}
