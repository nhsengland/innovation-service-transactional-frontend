import { MappedObjectType } from '@modules/core/interfaces/base.interfaces';
import { InnovationSectionEnum } from '../innovation.enums';
import { INNOVATION_SECTION_STATUS } from '../innovation.models';
import { InnovationSectionsListType } from './ir-versions.types';

import { INNOVATION_SECTIONS as SECTIONS_202209 } from './202209/main.config';
import { INNOVATION_SECTIONS as SECTIONS_202304 } from './202304/main.config';
import { categoriesItems as SECTIONS_202209_categoriesItems, clinicalEvidenceItems as SECTIONS_202209_evidencetypeItems } from './202209/forms.config';
import { categoriesItems as SECTIONS_202304_categoriesItems, evidenceTypeItems as SECTIONS_202304_evidenceTypeItems } from './202304/forms.config';


export type AllSectionsOutboundPayloadType = {
  title: string;
  sections: {
    section: string,
    answers: { label: string; value: string; }[];
  }[];
}[];


export function getInnovationRecordConfig(version?: string): InnovationSectionsListType {

  switch (version) {
    case '202209':
      return SECTIONS_202209;
    case '202304':
    default:
      return SECTIONS_202304;
  }

}

export function getAllSectionsSummary(
  data: {
    section: { id: null | string, section: InnovationSectionEnum, status: keyof typeof INNOVATION_SECTION_STATUS, updatedAt: string },
    data: MappedObjectType
  }[]
): AllSectionsOutboundPayloadType {

  return getInnovationRecordConfig().map(i => ({
    title: i.title,
    sections: i.sections.map(s => ({
      section: s.title,
      answers: s.wizard
        .runSummaryParsing(s.wizard.runInboundParsing(data.find(d => d.section.section === s.id)?.data ?? {}))
        .filter(item => item.type !== 'button' || !item.isFile)
        .map(a => ({ label: a.label, value: a.value || '' }))
    }))
  }));

}

export const irVersionsMainCategoryItems = [...SECTIONS_202209_categoriesItems, ...SECTIONS_202304_categoriesItems];
export const irVersionsClinicalMainCategoryItems = [...SECTIONS_202209_evidencetypeItems, ...SECTIONS_202304_evidenceTypeItems];
