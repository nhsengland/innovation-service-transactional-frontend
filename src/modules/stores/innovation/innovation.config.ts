import { MappedObjectType } from '@modules/core/interfaces/base.interfaces';
import { InnovationSectionEnum } from './innovation.enums';
import { InnovationSectionConfigType, INNOVATION_SECTION_ACTION_STATUS, INNOVATION_SECTION_STATUS } from './innovation.models';

import { SECTION_1_1 } from './sections/section-1-1.config';
import { SECTION_1_2 } from './sections/section-1-2.config';

import { SECTION_2_1 } from './sections/section-2-1.config';
import { SECTION_2_2 } from './sections/section-2-2.config';
import { SECTION_2_3 } from './sections/section-2-3.config';

import { SECTION_3_1 } from './sections/section-3-1.config';
import { SECTION_3_2 } from './sections/section-3-2.config';

import { SECTION_4_1 } from './sections/section-4-1.config';

import { SECTION_5_1 } from './sections/section-5-1.config';
import { SECTION_5_2 } from './sections/section-5-2.config';

import { SECTION_6_1 } from './sections/section-6-1.config';
import { SECTION_6_2 } from './sections/section-6-2.config';

import { SECTION_7_1 } from './sections/section-7-1.config';

import { SECTION_8_1 } from './sections/section-8-1.config';


export const INNOVATION_SECTIONS: InnovationSectionConfigType[] = [
  { title: 'About your product or service', sections: [SECTION_1_1, SECTION_1_2] },
  { title: 'Needs, benefits and effectiveness', sections: [SECTION_2_1, SECTION_2_2, SECTION_2_3] },
  { title: 'Business opportunity', sections: [SECTION_3_1, SECTION_3_2] },
  { title: 'Standards and certifications', sections: [SECTION_4_1] },
  { title: 'Care pathway and testing with users', sections: [SECTION_5_1, SECTION_5_2] },
  { title: 'Cost, savings, and benefits', sections: [SECTION_6_1, SECTION_6_2] },
  { title: 'Revenue model', sections: [SECTION_7_1] },
  { title: 'Deployment', sections: [SECTION_8_1] }
];


// Export innovation types and static methods.
type AllSectionsInboundPayloadType = {
  section: {
    id: null | string;
    section: InnovationSectionEnum;
    status: keyof typeof INNOVATION_SECTION_STATUS;
    updatedAt: string;
  },
  data: MappedObjectType
}[];

export type AllSectionsOutboundPayloadType = {
  title: string;
  sections: {
    section: string,
    answers: { label: string; value: string; }[];
  }[];
}[];



export function getSectionNumber(sectionId: InnovationSectionEnum): string {

  const groupNumber = INNOVATION_SECTIONS.findIndex(sectionGroup => sectionGroup.sections.some(section => section.id === sectionId));
  if (groupNumber === -1) { return ''; }

  const sectionNumber = INNOVATION_SECTIONS[groupNumber].sections.findIndex(section => section.id === sectionId);
  if (sectionNumber === -1) { return ''; }

  return `${groupNumber + 1}.${sectionNumber + 1}`;

}

export function getSectionTitle(sectionId: null | InnovationSectionEnum): string {

  if (!sectionId) { return ''; }

  return INNOVATION_SECTIONS.find(sectionGroup => sectionGroup.sections.some(section => section.id === sectionId))?.sections.find(section => section.id === sectionId)?.title || '';

}


export function getAllSectionsSummary(data: AllSectionsInboundPayloadType): AllSectionsOutboundPayloadType {

  return INNOVATION_SECTIONS.map(i => ({
    title: i.title,
    sections: i.sections.map(s => ({
      section: s.title,
      answers: s.wizard.runSummaryPDFParsing(s.wizard.runInboundParsing(data.find(d => d.section.section === s.id)?.data ?? {})).map(a => ({ label: a.label, value: a.value || '' })
      )
    }))
  }));

}
