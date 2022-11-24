import { DateISOType } from '@app/base/types';
import { MappedObjectType } from '@modules/core/interfaces/base.interfaces';
import { WizardEngineModel } from '@modules/shared/forms';

import { ActivityLogItemsEnum, ActivityLogTypesEnum, InnovationSectionEnum, InnovationStatusEnum } from './innovation.enums';


// Store state model.
export class InnovationModel { constructor() { } }


// Types.
export type InnovationSectionConfigType = {
  title: string;
  sections: {
    id: InnovationSectionEnum;
    title: string;
    wizard: WizardEngineModel;
    evidences?: WizardEngineModel;
  }[];
};

export type sectionType = {
  id: null | string;
  section: InnovationSectionEnum;
  status: keyof typeof INNOVATION_SECTION_STATUS;
  updatedAt: string;
};

export type InnovationSectionInfoDTO = {
  id: null | string;
  section: InnovationSectionEnum;
  status: keyof typeof INNOVATION_SECTION_STATUS;
  updatedAt: string;
  data: MappedObjectType;
}

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

export type InnovationSectionsListDTO = {
  id: null | string,
  section: InnovationSectionEnum,
  status: keyof typeof INNOVATION_SECTION_STATUS,
  submittedAt: null | DateISOType,
  openActionsCount: number
}[];

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
  updatedAt: string;
  isEditable: boolean;
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
    updatedAt: string;
    isEditable: boolean;
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
  title: string,
  sections: {
    id: InnovationSectionEnum,
    title: string,
    status: keyof typeof INNOVATION_SECTION_STATUS,
    isCompleted: boolean,
    openActionsCount: number
  }[]
}[];

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


// Constants.
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
    description: 'Further info is needed from the innovator to make a decision. You must provide a message on what information is needed.',
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
    description: 'The innovation is not yet ready for your support offer. You must provide a message outlining your decision.',
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
    description: 'You have no suitable support offer for the innovation. You must provide a message outlining your decision.',
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
    description: 'Your organisation has completed this engagement. You must provide a message outlining your decision.',
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
  },
  CANCELLED: {
    label: 'Cancelled',
    cssClass: 'nhsuk-tag--red',
    description: 'An accessor has cancelled the action.'
  }
};


export const ACTIVITY_LOG_ITEMS: {
  [key in ActivityLogItemsEnum]: {
    type: ActivityLogTypesEnum;
    details: null | 'ORGANISATIONS_LIST' | 'SUPPORT_STATUS_UPDATE' | 'COMMENT';
    link: null | 'NEEDS_ASSESSMENT' | 'SUPPORT_STATUS' | 'SECTION' | 'ACTION' | 'THREAD' | 'NEEDS_REASSESSMENT';
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
  NEEDS_ASSESSMENT_EDITED: {
    type: ActivityLogTypesEnum.NEEDS_ASSESSMENT,
    details: null,
    link: 'NEEDS_ASSESSMENT'
  },
  NEEDS_ASSESSMENT_REASSESSMENT_REQUESTED: {
    type: ActivityLogTypesEnum.NEEDS_ASSESSMENT,
    details: null,
    link: 'NEEDS_REASSESSMENT'
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

  THREAD_CREATION: {
    type: ActivityLogTypesEnum.THREADS,
    details: null,
    link: 'THREAD'
  },
  THREAD_MESSAGE_CREATION: {
    type: ActivityLogTypesEnum.THREADS,
    details: null,
    link: 'THREAD'
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
    details: null,
    link: 'ACTION'
  },
  ACTION_STATUS_REQUESTED_UPDATE: {
    type: ActivityLogTypesEnum.ACTIONS,
    details: null,
    link: 'ACTION'
  },
  ACTION_STATUS_CANCELLED_UPDATE: {
    type: ActivityLogTypesEnum.ACTIONS,
    details: null,
    link: null
  }

};
