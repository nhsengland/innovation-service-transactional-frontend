import { DateISOType } from '@app/base/types';
import { MappedObjectType } from '@modules/core/interfaces/base.interfaces';
import { WizardEngineModel } from '@modules/shared/forms';

import { InnovationSectionsVersions } from './innovation-record/ir-versions.types';
import {
  ActivityLogItemsEnum,
  ActivityLogTypesEnum,
  InnovationGroupedStatusEnum,
  InnovationSectionEnum
} from './innovation.enums';

// Store state model.
export class InnovationModel {
  constructor() {}
}

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
  section: InnovationSectionEnum | string;
  status: keyof typeof INNOVATION_SECTION_STATUS;
  updatedAt: string;
};

export type InnovationSectionInfoDTO = {
  id: null | string;
  section: InnovationSectionEnum;
  status: keyof typeof INNOVATION_SECTION_STATUS;
  updatedAt: string;
  data: MappedObjectType;
  submittedAt: string;
  submittedBy: null | {
    name: string;
    isOwner?: boolean;
  };
  tasksIds?: string[];
};

export type InnovationAllSectionsInfoDTO = {
  section: {
    section: string;
    status: keyof typeof INNOVATION_SECTION_STATUS;
    submittedAt?: DateISOType;
    submittedBy?: { name: string; displayTag: string };
    openTasksCount: number;
  };
  data: MappedObjectType;
}[];

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
  id: null | string;
  section: InnovationSectionsVersions | string;
  status: keyof typeof INNOVATION_SECTION_STATUS;
  submittedAt: null | DateISOType;
  submittedBy: null | {
    name: string;
    isOwner?: boolean;
  };
  openTasksCount: number;
}[];

export type GetInnovationEvidenceDTO = {
  id: string;
  evidenceType: 'CLINICAL' | 'ECONOMIC' | 'OTHER';
  clinicalEvidenceType:
    | 'DATA_PUBLISHED'
    | 'NON_RANDOMISED_COMPARATIVE_DATA'
    | 'NON_RANDOMISED_NON_COMPARATIVE_DATA'
    | 'CONFERENCE'
    | 'RANDOMISED_CONTROLLED_TRIAL'
    | 'UNPUBLISHED_DATA'
    | 'OTHER';
  description: string;
  summary: string;
  files: { id: string; displayFileName: string; url: string }[];
};

export type SectionsSummaryModel = {
  id: string;
  title: string;
  sections: {
    id: InnovationSectionsVersions | string;
    title: string;
    status: keyof typeof INNOVATION_SECTION_STATUS;
    submittedAt: null | DateISOType;
    submittedBy: null | {
      name: string;
      isOwner?: boolean;
    };
    isCompleted: boolean;
    openTasksCount: number;
  }[];
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

export type OrganisationUnitModelWithOrganisation = OrganisationUnitModel & {
  organisation: Omit<OrganisationModel, 'organisationUnits'>;
};

export type AssessmentSuggestionModel = {
  suggestedOrganisations: OrganisationModel[];
};

export type AccessorSuggestionModel = {
  organisation: OrganisationModel;
  suggestedOrganisations: OrganisationModel[];
};

export type OrganisationSuggestionModel = {
  assessment: AssessmentSuggestionModel;
  accessors: AccessorSuggestionModel[];
};

export type InnovationUnitSuggestionsType = {
  suggestionId: string;
  suggestorUnit: string;
  thread: {
    id: string;
    message: string;
  };
}[];

// Constants.
export const INNOVATION_STATUS = {
  '': null,
  CREATED: { label: 'Created', cssClass: 'nhsuk-tag--wellow' },
  WAITING_NEEDS_ASSESSMENT: { label: 'Awaiting Assessment', cssClass: 'nhsuk-tag--wellow' },
  NEEDS_ASSESSMENT: { label: 'Awaiting Assessment', cssClass: 'nhsuk-tag--wellow' },
  AWAITING_NEEDS_REASSESSMENT: { label: 'Awaiting Reassessment', cssClass: 'nhsuk-tag--wellow' },
  IN_PROGRESS: { label: 'In progress', cssClass: 'nhsuk-tag--wellow' },
  // NEEDS_ASSESSMENT_REVIEW: { label: 'In review', cssClass: 'nhsuk-tag--wellow' },
  ABANDONED: { label: 'Abandoned', cssClass: 'nhsuk-tag--grey' },
  WITHDRAWN: { label: 'Withdrawn', cssClass: 'nhsuk-tag--red' },
  ARCHIVED: { label: 'Archived', cssClass: 'nhsuk-tag--red' }
};

export const INNOVATION_SUPPORT_STATUS = {
  ENGAGING: {
    label: 'Engaging',
    cssClass: 'nhsuk-tag--green',
    description: 'Ready to support, assess or provide guidance.',
    hidden: false
  },
  WAITING: {
    label: 'Waiting',
    cssClass: 'nhsuk-tag--yellow',
    description:
      'The organisation is waiting for information from the innovator, or for an internal decision to progress, or for another organisation close their support offer.',
    hidden: false
  },
  UNASSIGNED: {
    label: 'Unassigned',
    cssClass: 'nhsuk-tag--red',
    description: 'A support status has not been assigned yet.',
    hidden: true
  },
  UNSUITABLE: {
    label: 'Unsuitable',
    cssClass: 'nhsuk-tag--grey',
    description: 'The organisation has no suitable support offer for the innovation.',
    hidden: false
  },
  CLOSED: {
    label: 'Closed',
    cssClass: 'nhsuk-tag--dark-grey',
    description:
      'The organisation has finished supporting the innovation or has decided not to support it because it did not receive the information it needed.',
    hidden: false
  },
  SUGGESTED: {
    label: 'Suggested',
    cssClass: 'nhsuk-tag--purple',
    description: 'A placeholder description for Suggested status',
    hidden: false
  }
};

export const INNOVATION_SECTION_STATUS = {
  UNKNOWN: null,
  NOT_STARTED: { label: 'Not started', isCompleteState: false },
  DRAFT: { label: 'Draft', isCompleteState: false },
  SUBMITTED: { label: 'Submitted', isCompleteState: true }
};

export const ACTIVITY_LOG_ITEMS: {
  [key in ActivityLogItemsEnum]: {
    type: ActivityLogTypesEnum;
    details: null | 'ORGANISATIONS_LIST' | 'SUPPORT_STATUS_UPDATE' | 'COMMENT' | 'MESSAGE';
    link: null | 'NEEDS_ASSESSMENT' | 'SUPPORT_STATUS' | 'SECTION' | 'TASK' | 'THREAD' | 'NEEDS_REASSESSMENT';
  };
} = {
  INNOVATION_CREATION: { type: ActivityLogTypesEnum.INNOVATION_MANAGEMENT, details: null, link: null },
  OWNERSHIP_TRANSFER: { type: ActivityLogTypesEnum.INNOVATION_MANAGEMENT, details: null, link: null },
  SHARING_PREFERENCES_UPDATE: {
    type: ActivityLogTypesEnum.INNOVATION_MANAGEMENT,
    details: 'ORGANISATIONS_LIST',
    link: null
  },
  INNOVATION_PAUSE: { type: ActivityLogTypesEnum.INNOVATION_MANAGEMENT, details: 'MESSAGE', link: null },
  SECTION_DRAFT_UPDATE: { type: ActivityLogTypesEnum.INNOVATION_RECORD, details: null, link: null },
  SECTION_DRAFT_UPDATE_DEPRECATED: { type: ActivityLogTypesEnum.INNOVATION_RECORD, details: null, link: null },
  SECTION_SUBMISSION: { type: ActivityLogTypesEnum.INNOVATION_RECORD, details: null, link: 'SECTION' },
  SECTION_SUBMISSION_DEPRECATED: { type: ActivityLogTypesEnum.INNOVATION_RECORD, details: null, link: 'SECTION' },
  INNOVATION_SUBMISSION: { type: ActivityLogTypesEnum.NEEDS_ASSESSMENT, details: null, link: null },
  NEEDS_ASSESSMENT_START: { type: ActivityLogTypesEnum.NEEDS_ASSESSMENT, details: 'COMMENT', link: null },
  NEEDS_ASSESSMENT_START_EDIT: { type: ActivityLogTypesEnum.NEEDS_ASSESSMENT, details: null, link: null },
  NEEDS_ASSESSMENT_COMPLETED: { type: ActivityLogTypesEnum.NEEDS_ASSESSMENT, details: null, link: 'NEEDS_ASSESSMENT' },
  NEEDS_ASSESSMENT_EDITED: { type: ActivityLogTypesEnum.NEEDS_ASSESSMENT, details: null, link: 'NEEDS_ASSESSMENT' },
  NEEDS_ASSESSMENT_REASSESSMENT_REQUESTED: {
    type: ActivityLogTypesEnum.NEEDS_ASSESSMENT,
    details: null,
    link: null
  },
  ORGANISATION_SUGGESTION: {
    type: ActivityLogTypesEnum.SUPPORT,
    details: 'ORGANISATIONS_LIST',
    link: 'SUPPORT_STATUS'
  },
  SUPPORT_STATUS_UPDATE: { type: ActivityLogTypesEnum.SUPPORT, details: 'SUPPORT_STATUS_UPDATE', link: null },
  COMMENT_CREATION: { type: ActivityLogTypesEnum.COMMENTS, details: 'COMMENT', link: null },
  THREAD_CREATION: { type: ActivityLogTypesEnum.THREADS, details: null, link: 'THREAD' },
  THREAD_MESSAGE_CREATION: { type: ActivityLogTypesEnum.THREADS, details: null, link: 'THREAD' },
  TASK_CREATION: { type: ActivityLogTypesEnum.TASKS, details: 'COMMENT', link: 'TASK' },
  TASK_CREATION_DEPRECATED: { type: ActivityLogTypesEnum.TASKS, details: null, link: null },
  TASK_STATUS_DONE_UPDATE: { type: ActivityLogTypesEnum.TASKS, details: null, link: 'TASK' },
  TASK_STATUS_DECLINED_UPDATE: { type: ActivityLogTypesEnum.TASKS, details: 'COMMENT', link: 'TASK' },
  TASK_STATUS_OPEN_UPDATE: { type: ActivityLogTypesEnum.TASKS, details: null, link: 'TASK' },
  TASK_STATUS_CANCELLED_UPDATE: { type: ActivityLogTypesEnum.TASKS, details: null, link: 'TASK' }
};

export const ASSESSMENT_COMPLETED_STATUSES = [
  InnovationGroupedStatusEnum.AWAITING_SUPPORT,
  InnovationGroupedStatusEnum.RECEIVING_SUPPORT,
  InnovationGroupedStatusEnum.NO_ACTIVE_SUPPORT,
  InnovationGroupedStatusEnum.ARCHIVED
];
