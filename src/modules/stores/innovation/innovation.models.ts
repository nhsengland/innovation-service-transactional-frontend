import { WizardEngineModel } from '@modules/shared/forms';

// Store state model.
export class InnovationModel { constructor() { } }


// Types.
export type InnovationSectionConfigType = {
  title: string;
  sections: {
    id: InnovationSectionsIds;
    title: string;
    wizard: WizardEngineModel;
    evidences?: WizardEngineModel;
  }[];
};


export const INNOVATION_STATUS = {
  '': null,
  CREATED: { label: 'Created', cssClass: 'nhsuk-tag--wellow' },
  WAITING_NEEDS_ASSESSMENT: { label: 'Waiting', cssClass: 'nhsuk-tag--wellow' },
  NEEDS_ASSESSMENT: { label: 'Waiting', cssClass: 'nhsuk-tag--wellow' },
  IN_PROGRESS: { label: 'In progress', cssClass: 'nhsuk-tag--wellow' },
  // NEEDS_ASSESSMENT_REVIEW: { label: 'In review', cssClass: 'nhsuk-tag--wellow' },
  ABANDONED: { label: 'Abandoned', cssClass: 'nhsuk-tag--grey' },
  COMPLETE: { label: 'Complete', cssClass: 'nhsuk-tag--green' }
};

export const INNOVATION_SUPPORT_STATUS = {
  UNNASSIGNED: { label: 'Unassigned', cssClass: 'nhsuk-tag--red', description: '1' },
  FURTHER_INFO_REQUIRED: { label: 'Further info', cssClass: 'nhsuk-tag--yellow', description: '2' },
  WAITING: { label: 'Waiting', cssClass: 'nhsuk-tag--grey', description: '3' },
  NOT_YET: { label: 'Waiting', cssClass: 'nhsuk-tag--grey', description: '4' },
  ENGAGING: { label: 'Engaging', cssClass: 'nhsuk-tag--green', description: 'Your organisation is ready to actively engage with this innovation through providing support, guidance, or assessment. You have to assign at least one person from your organisation to this innovation.' },
  UNSUITABLE: { label: 'Waiting', cssClass: 'nhsuk-tag--grey', description: '6' },
  WITHDRAWN: { label: 'Waiting', cssClass: 'nhsuk-tag--grey', description: '7' },
  COMPLETE: { label: 'Waiting', cssClass: 'nhsuk-tag--grey', description: '8' },
};

export const INNOVATION_SECTION_STATUS = {
  UNKNOWN: null,
  NOT_STARTED: { label: 'Not started', isCompleteState: false },
  DRAFT: { label: 'Draft', isCompleteState: false },
  SUBMITTED: { label: 'Submitted', isCompleteState: true }
};

export const INNOVATION_SECTION_ACTION_STATUS = {
  '': null,
  REQUESTED: { label: 'Requested', cssClass: 'nhsuk-tag--blue' },
  STARTED: { label: 'Started', cssClass: 'nhsuk-tag--green' },
  CONTINUE: { label: 'Continue', cssClass: 'nhsuk-tag--blue' },
  IN_REVIEW: { label: 'In review', cssClass: 'nhsuk-tag--yellow' },
  DELETED: { label: 'Deleted', cssClass: 'nhsuk-tag--grey' },
  DECLINED: { label: 'Declined', cssClass: 'nhsuk-tag--grey' },
  COMPLETED: { label: 'Completed', cssClass: 'nhsuk-tag--green' }
};


export enum InnovationSectionsIds {
  INNOVATION_DESCRIPTION = 'INNOVATION_DESCRIPTION',
  VALUE_PROPOSITION = 'VALUE_PROPOSITION',
  UNDERSTANDING_OF_NEEDS = 'UNDERSTANDING_OF_NEEDS',
  UNDERSTANDING_OF_BENEFITS = 'UNDERSTANDING_OF_BENEFITS',
  EVIDENCE_OF_EFFECTIVENESS = 'EVIDENCE_OF_EFFECTIVENESS',
  MARKET_RESEARCH = 'MARKET_RESEARCH',
  INTELLECTUAL_PROPERTY = 'INTELLECTUAL_PROPERTY',
  REGULATIONS_AND_STANDARDS = 'REGULATIONS_AND_STANDARDS',
  CURRENT_CARE_PATHWAY = 'CURRENT_CARE_PATHWAY',
  TESTING_WITH_USERS = 'TESTING_WITH_USERS',
  COST_OF_INNOVATION = 'COST_OF_INNOVATION',
  COMPARATIVE_COST_BENEFIT = 'COMPARATIVE_COST_BENEFIT',
  REVENUE_MODEL = 'REVENUE_MODEL',
  IMPLEMENTATION_PLAN = 'IMPLEMENTATION_PLAN',
}



export type sectionType = {
  id: null | string;
  section: InnovationSectionsIds;
  status: keyof typeof INNOVATION_SECTION_STATUS;
  actionStatus: keyof typeof INNOVATION_SECTION_ACTION_STATUS;
  updatedAt: string;
};

export type getInnovationInfoEndpointDTO = {
  id: string;
  name: string;
  company: string;
  description: string;
  countryName: string;
  postcode: string;
  actions: string[]; // actionsCount: number;
  comments: string[]; // commentsCount: number
};

export type getInnovationInfoResponse = {
  id: string;
  name: string;
  company: string;
  location: string;
  description: string;
  openActionsNumber: number;
  openCommentsNumber: number;
};

export type getInnovationSectionsDTO = {
  id: string;
  name: string;
  status: keyof typeof INNOVATION_STATUS;
  sections: sectionType[];
};


export type getInnovationEvidenceDTO = {
  evidenceType: 'CLINICAL' | 'ECONOMIC' | 'OTHER',
  clinicalEvidenceType: string,
  description: string,
  summary: string
  files: { id: string; displayFileName: string; url: string }[];
};


export type SectionsSummaryModel = {
  title: string;
  sections: {
    id: InnovationSectionsIds;
    title: string;
    status: keyof typeof INNOVATION_SECTION_STATUS;
    actionStatus: keyof typeof INNOVATION_SECTION_ACTION_STATUS;
    isCompleted: boolean;
  }[]
};
