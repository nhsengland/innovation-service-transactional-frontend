import { InnovationSections } from '@modules/stores/innovation/innovation-record/202304/catalog.types';

export const InnovationSectionGroups = [
  'ABOUT_INNOVATION',
  'VALUE_PROPOSITION',
  'MARKET_RESEARCH_AND_CURRENT_CARE_PATHWAY',
  'TESTING_WITH_USERS',
  'REGULATIONS_STANDARDS_CERTIFICATIONS_AND_INTELLECTUAL_PROPERTY',
  'REVENUE_MODEL',
  'COST_AND_SAVINGS',
  'DEPLOYMENT'
];
export type InnovationSectionGroupsType = (typeof InnovationSectionGroups)[number];

export type InnovationRecordUpdateStepInputType = {
  innovationRecordSections: InnovationSectionGroupsType[];
  selectedInnovationRecordSections: InnovationSectionGroupsType[];
};

export type InnovationRecordUpdateStepOutputType = {
  innovationRecordSections: InnovationSectionGroupsType[];
};
