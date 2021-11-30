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

export const INNOVATION_STATUS = {
  '': null,
  CREATED: { label: 'Created', cssClass: 'nhsuk-tag--wellow' },
  WAITING_NEEDS_ASSESSMENT: { label: 'Awaiting Assessment', cssClass: 'nhsuk-tag--wellow' },
  NEEDS_ASSESSMENT: { label: 'Awaiting Assessment', cssClass: 'nhsuk-tag--wellow' },
  IN_PROGRESS: { label: 'In progress', cssClass: 'nhsuk-tag--wellow' },
  // NEEDS_ASSESSMENT_REVIEW: { label: 'In review', cssClass: 'nhsuk-tag--wellow' },
  ABANDONED: { label: 'Abandoned', cssClass: 'nhsuk-tag--grey' },
  COMPLETE: { label: 'Complete', cssClass: 'nhsuk-tag--green' }
};

export const INNOVATION_SUPPORT_STATUS = {
  ENGAGING: {
    label: 'Engaging', cssClass: 'nhsuk-tag--green',
    description: 'Your organisation is ready to actively engage with this innovation through providing support, guidance, or assessment. You have to assign at least one person from your organisation to this innovation.',
    innovatorDescription: 'Ready to support, assess or provide guidance.',
    hidden: false
  },
  FURTHER_INFO_REQUIRED: {
    label: 'Further info', cssClass: 'nhsuk-tag--white',
    description: 'Further info is needed from the innovator to make a decision. You must provide a comment on what information is needed.',
    innovatorDescription: 'The organisation needs further information from you to make a decision.',
    hidden: false
  },
  WAITING: {
    label: 'Waiting', cssClass: 'nhsuk-tag--yellow',
    description: 'Waiting for an internal decision to progress.',
    innovatorDescription: 'The organisation is waiting for an internal decision to progress.',
    hidden: false
  },
  NOT_YET: {
    label: 'Not yet', cssClass: 'nhsuk-tag--blue',
    description: 'The innovation is not yet ready for your support offer. You must provide a comment outlining your decision.',
    innovatorDescription: 'Your innovation is not yet ready for the organisation\'s support offer.',
    hidden: false
  },
  UNASSIGNED: {
    label: 'Unassigned', cssClass: 'nhsuk-tag--red',
    description: 'No status assigned yet.',
    innovatorDescription: 'No status assigned yet.',
    hidden: true
  },
  UNSUITABLE: {
    label: 'Unsuitable', cssClass: 'nhsuk-tag--red',
    description: 'You have no suitable support offer for the innovation. You must provide a comment outlining your decision.',
    innovatorDescription: 'The organisation has no suitable support offer for your innovation.',
    hidden: false,
  },
  WITHDRAWN: {
    label: 'Withdrawn', cssClass: 'nhsuk-tag--red',
    description: '',
    innovatorDescription: '',
    hidden: true
  },
  COMPLETE: {
    label: 'Completed', cssClass: 'nhsuk-tag--dark-grey',
    description: 'Your organisation has completed this engagement. You must provide a comment outlining your decision.',
    innovatorDescription: 'The organisation has completed their engagement with your innovation.',
    hidden: false
  }
};

export const INNOVATION_SECTION_STATUS = {
  UNKNOWN: null,
  NOT_STARTED: { label: 'Not started', isCompleteState: false },
  DRAFT: { label: 'Draft', isCompleteState: false },
  SUBMITTED: { label: 'Submitted', isCompleteState: true }
};

export const INNOVATION_SECTION_ACTION_STATUS = {
  '': { label: '', cssClass: '', description: '' },
  REQUESTED: {
    label: 'Requested',
    cssClass: 'nhsuk-tag--blue',
    description: 'An accessor has requested that the innovation owner submit information to a specific section of their innovation record.'
  },
  STARTED: {
    label: 'Started',
    cssClass: 'nhsuk-tag--green',
    description: ''
  },
  CONTINUE: {
    label: 'Continue',
    cssClass: 'nhsuk-tag--blue',
    description: ''
  },
  IN_REVIEW: {
    label: 'In review',
    cssClass: 'nhsuk-tag--yellow',
    description: 'The innovation owner has submitted information requested by an accessor and are waiting for them to review it.'
  },
  DELETED: {
    label: 'Deleted',
    cssClass: 'nhsuk-tag--grey',
    description: ''
  },
  DECLINED: {
    label: 'Declined',
    cssClass: 'nhsuk-tag--grey',
    description: 'The innovation owner has declined the action requested.'
  },
  COMPLETED: {
    label: 'Completed',
    cssClass: 'nhsuk-tag--green',
    description: 'An accessor has closed the action after reviewing the information.'
  }
};


export enum ActivityLogTypesEnum {
  INNOVATION_MANAGEMENT = 'INNOVATION_MANAGEMENT',
  INNOVATION_RECORD = 'INNOVATION_RECORD',
  NEEDS_ASSESSMENT = 'NEEDS_ASSESSMENT',
  SUPPORT = 'SUPPORT',
  COMMENTS = 'COMMENTS',
  ACTIONS = 'ACTIONS'
}

export enum ActivityLogItemsEnum {
  INNOVATION_CREATION = 'INNOVATION_CREATION',
  OWNERSHIP_TRANSFER = 'OWNERSHIP_TRANSFER',
  SHARING_PREFERENCES_UPDATE = 'SHARING_PREFERENCES_UPDATE',
  SECTION_DRAFT_UPDATE = 'SECTION_DRAFT_UPDATE',
  SECTION_SUBMISSION = 'SECTION_SUBMISSION',
  INNOVATION_SUBMISSION = 'INNOVATION_SUBMISSION',
  NEEDS_ASSESSMENT_START = 'NEEDS_ASSESSMENT_START',
  NEEDS_ASSESSMENT_COMPLETED = 'NEEDS_ASSESSMENT_COMPLETED',
  ORGANISATION_SUGGESTION = 'ORGANISATION_SUGGESTION',
  SUPPORT_STATUS_UPDATE = 'SUPPORT_STATUS_UPDATE',
  COMMENT_CREATION = 'COMMENT_CREATION',
  ACTION_CREATION = 'ACTION_CREATION',
  ACTION_STATUS_IN_REVIEW_UPDATE = 'ACTION_STATUS_IN_REVIEW_UPDATE',
  ACTION_STATUS_DECLINED_UPDATE = 'ACTION_STATUS_DECLINED_UPDATE',
  ACTION_STATUS_COMPLETED_UPDATE = 'ACTION_STATUS_COMPLETED_UPDATE'
}


export const ACTIVITY_LOG_ITEMS: {
  [key in ActivityLogItemsEnum]: {
    type: ActivityLogTypesEnum;
    details: null | 'ORGANISATIONS_LIST' | 'SUPPORT_STATUS_UPDATE' | 'COMMENT';
    link: null | 'NEEDS_ASSESSMENT' | 'SUPPORT_STATUS' | 'SECTION' | 'ACTION';
  }
} = {
  INNOVATION_CREATION: {
    type: ActivityLogTypesEnum.INNOVATION_MANAGEMENT,
    details: null,
    link: null
  },
  OWNERSHIP_TRANSFER: {
    type: ActivityLogTypesEnum.INNOVATION_MANAGEMENT,
    details: null,
    link: null
  },
  SHARING_PREFERENCES_UPDATE: {
    type: ActivityLogTypesEnum.INNOVATION_MANAGEMENT,
    details: 'ORGANISATIONS_LIST',
    link: null
  },

  SECTION_DRAFT_UPDATE: {
    type: ActivityLogTypesEnum.INNOVATION_RECORD,
    details: null,
    link: null
  },
  SECTION_SUBMISSION: {
    type: ActivityLogTypesEnum.INNOVATION_RECORD,
    details: null,
    link: 'SECTION'
  },

  INNOVATION_SUBMISSION: {
    type: ActivityLogTypesEnum.NEEDS_ASSESSMENT,
    details: null,
    link: null
  },
  NEEDS_ASSESSMENT_START: {
    type: ActivityLogTypesEnum.NEEDS_ASSESSMENT,
    details: 'COMMENT',
    link: null
  },
  NEEDS_ASSESSMENT_COMPLETED: {
    type: ActivityLogTypesEnum.NEEDS_ASSESSMENT,
    details: null,
    link: 'NEEDS_ASSESSMENT'
  },

  ORGANISATION_SUGGESTION: {
    type: ActivityLogTypesEnum.SUPPORT,
    details: 'ORGANISATIONS_LIST',
    link: 'SUPPORT_STATUS'
  },
  SUPPORT_STATUS_UPDATE: {
    type: ActivityLogTypesEnum.SUPPORT,
    details: 'SUPPORT_STATUS_UPDATE',
    link: null
  },

  COMMENT_CREATION: {
    type: ActivityLogTypesEnum.COMMENTS,
    details: 'COMMENT',
    link: null
  },

  ACTION_CREATION: {
    type: ActivityLogTypesEnum.ACTIONS,
    details: 'COMMENT',
    link: 'ACTION'
  },
  ACTION_STATUS_IN_REVIEW_UPDATE: {
    type: ActivityLogTypesEnum.ACTIONS,
    details: null,
    link: null
  },
  ACTION_STATUS_DECLINED_UPDATE: {
    type: ActivityLogTypesEnum.ACTIONS,
    details: 'COMMENT',
    link: 'ACTION'
  },
  ACTION_STATUS_COMPLETED_UPDATE: {
    type: ActivityLogTypesEnum.ACTIONS,
    details: 'COMMENT',
    link: 'ACTION'
  }
};


export type InnovationDataResolverType = {
  id: string;
  name: string;
  status: keyof typeof INNOVATION_STATUS;
  assessment: {
    id: undefined | string;
  };
  support?: {
    id: undefined | string;
    status: keyof typeof INNOVATION_SUPPORT_STATUS;
  }
};



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
  actions: string[];
  comments: string[];
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
  submittedAt: string | undefined;
  sections: sectionType[];
};


export type getInnovationEvidenceDTO = {
  evidenceType: 'CLINICAL' | 'ECONOMIC' | 'OTHER',
  clinicalEvidenceType: string,
  description: string,
  summary: string
  files: { id: string; displayFileName: string; url: string }[];
};

export type getInnovationCommentsDTO = {
  id: string;
  message: string;
  createdAt: string;
  user: {
    id: string;
    type: 'ASSESSMENT' | 'ACCESSOR' | 'INNOVATOR';
    name: string;
    organisationUnit?: { id: string; name: string; };
  };
  notifications?: { count: number }
  replies: {
    id: string;
    message: string;
    createdAt: string;
    user: {
      id: string;
      type: 'ASSESSMENT' | 'ACCESSOR' | 'INNOVATOR';
      name: string;
      organisationUnit?: { id: string; name: string; };
    };
    notifications?: { count: number };
  }[];
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

export type OrganisationModel = {
  id: string;
  name: string;
  acronym: string;
  organisationUnits?: OrganisationUnitModel[];
};

export type OrganisationUnitModel = {
  id: string;
  name: string;
  acronym: string;
};

export type AssessmentSuggestionModel = {
  id: string;
  suggestedOrganisations: OrganisationModel[];
};

export type AccessorSuggestionModel = {
  organisationUnit: {
    id: string;
    name: string;
    acronym: string;
    organisation: OrganisationModel,
  };
  suggestedOrganisations: OrganisationModel[];
};

export type OrganisationSuggestionModel = {
  assessment: AssessmentSuggestionModel;
  accessors: AccessorSuggestionModel[];
};
