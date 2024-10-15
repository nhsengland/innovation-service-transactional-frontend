import { FileUploadType } from '@app/base/forms';
import { DateISOType } from '@app/base/types';
import { ReassessmentSendType } from '@modules/feature-modules/innovator/pages/innovation/needs-reassessment/needs-reassessment-send.config';

import { PhoneUserPreferenceEnum } from '@modules/stores/authentication/authentication.service';

import {
  ActivityLogItemsEnum,
  InnovationCollaboratorStatusEnum,
  InnovationExportRequestStatusEnum,
  InnovationGroupedStatusEnum,
  InnovationStatusEnum,
  InnovationSupportStatusEnum,
  InnovationTaskStatusEnum
} from '@modules/stores/innovation/innovation.enums';
import { InnovationSupportCloseReasonEnum } from '@modules/stores/innovation/innovation.enums';

// Innovations.
export type InnovationsListFiltersType = Partial<{
  search: string;
  assignedToMe: boolean;
  closedByMyOrganisation: boolean;
  diseasesAndConditions: string[];
  dateFilters: {
    field: 'submittedAt' | 'lastAssessmentRequestAt';
    startDate: undefined | DateISOType;
    endDate: undefined | DateISOType;
  }[];
  engagingOrganisations: string[];
  engagingUnits: string[];
  groupedStatuses: InnovationGroupedStatusEnum[];
  hasAccessThrough: ('owner' | 'collaborator')[];
  latestWorkedByMe: boolean;
  locations: string[];
  suggestedOnly: boolean;
  supportStatuses: InnovationSupportStatusEnum[];
  supportUnit: string;
}>;

export type InnovationsListDTO<T extends Partial<InnovationListFullDTO>> = {
  count: number;
  data: T[];
};

export type InnovationListSelectType =
  | 'id'
  | 'name'
  | 'status'
  | 'statusUpdatedAt'
  | 'groupedStatus'
  | 'submittedAt'
  | 'lastAssessmentRequestAt'
  | 'updatedAt'
  // Document fields
  | 'careSettings'
  | 'otherCareSetting'
  | 'categories'
  | 'countryName'
  | 'diseasesAndConditions'
  | 'involvedAACProgrammes'
  | 'keyHealthInequalities'
  | 'mainCategory'
  | 'otherCategoryDescription'
  | 'postcode'
  // Relation fields
  | 'owner.id'
  | 'owner.name'
  | 'owner.companyName'
  | 'engagingOrganisations'
  | 'engagingUnits'
  | 'suggestedOrganisations'
  | 'suggestion.suggestedBy'
  | 'suggestion.suggestedOn'
  | 'support.status'
  | 'support.updatedAt'
  | 'support.updatedBy'
  | 'support.closeReason'
  | 'assessment.id'
  | 'assessment.majorVersion'
  | 'assessment.minorVersion'
  | 'assessment.assignedTo'
  | 'assessment.isExempt'
  | 'assessment.finishedAt'
  | 'assessment.updatedAt'
  | 'statistics.notifications'
  | 'statistics.tasks'
  | 'statistics.messages';

export type InnovationSearchSelectType = InnovationListSelectType | 'highlights';

export type InnovationListFullDTO = {
  id: string;
  name: string;
  status: InnovationStatusEnum;
  statusUpdatedAt: DateISOType;
  groupedStatus: InnovationGroupedStatusEnum;
  submittedAt: DateISOType | null;
  lastAssessmentRequestAt: DateISOType | null;
  updatedAt: DateISOType;
  // Document fields
  careSettings: string[] | null;
  otherCareSetting: string | null;
  categories: string[] | null;
  countryName: string | null;
  postcode: string | null;
  diseasesAndConditions: string[] | null; // not strongly typed atm
  involvedAACProgrammes: string[] | null;
  keyHealthInequalities: string[] | null;
  mainCategory: string | null;
  otherCategoryDescription: string | null;

  // Relation fields
  engagingOrganisations: { organisationId: string; name: string; acronym: string }[] | null;
  engagingUnits:
    | { unitId: string; name: string; acronym: string; assignedAccessors: { id: string; name: string }[] | null }[]
    | null;
  suggestedUnits: { unitId: string; name: string; acronym: string }[];
  owner: { id: string; name: string | null; companyName: string | null } | null;
  support: {
    status: InnovationSupportStatusEnum;
    updatedAt: DateISOType | null;
    updatedBy: string | null;
    closeReason: InnovationSupportCloseReasonEnum | null;
  } | null;
  suggestion: { suggestedBy: string[]; suggestedOn: DateISOType } | null;
  assessment: {
    id: string;
    majorVersion: number;
    minorVersion: number;
    assignedTo: string | null;
    finishedAt: DateISOType | null;
    updatedAt: DateISOType;
    isExempt: boolean;
  } | null;
  statistics: { notifications: number; tasks: number; messages: number };
};

export type InnovationSearchFullDTO = InnovationListFullDTO & {
  highlights?: Record<string, string[]>;
};

export type InnovationInfoDTO = {
  id: string;
  name: string;
  description: null | string;
  status: InnovationStatusEnum;
  archivedStatus?: InnovationStatusEnum;
  groupedStatus: InnovationGroupedStatusEnum;
  hasBeenAssessed: boolean;
  submittedAt: null | DateISOType;
  countryName: null | string;
  postCode: null | string;
  categories: string[];
  otherCategoryDescription: null | string;
  owner?: {
    id: string;
    name: string;
    email?: string;
    contactByEmail?: boolean;
    contactByPhone?: boolean;
    contactByPhoneTimeframe?: PhoneUserPreferenceEnum | null;
    mobilePhone?: null | string;
    contactDetails?: null | string;
    isActive: boolean;
    organisation?: { name: string; size: null | string; registrationNumber: null | string };
    lastLoginAt?: DateISOType;
  };
  lastEndSupportAt: null | DateISOType;
  assessment?: null | {
    id: string;
    majorVersion: number;
    minorVersion: number;
    createdAt: DateISOType;
    finishedAt: null | DateISOType;
    assignedTo?: { id: string; name: string; userRoleId: string };
    reassessmentCount: number;
  };
  supports?: null | { id: string; status: InnovationSupportStatusEnum; organisationUnitId: string }[];
  statusUpdatedAt: null | DateISOType;
  collaboratorId?: string;
  createdAt: DateISOType;
};

export type InnovationSharesListDTO = { organisation: { id: string; name: string; acronym: string } }[];

export enum InnovationValidationRules {
  checkIfSupportHadAlreadyStartedAtDate = 'checkIfSupportHadAlreadyStartedAtDate'
}

export type InnovationRulesDTO = {
  validations: { rule: InnovationValidationRules; valid: boolean; details?: any }[];
};

// Innovation collaborators.
export type InnovationCollaboratorsListDTO = {
  count: number;
  data: {
    id: string;
    status: InnovationCollaboratorStatusEnum;
    name?: string;
    role?: string;
    email?: string;
    isActive?: boolean;
  }[];
};

export type getInnovationCollaboratorInfoDTO = {
  id: string;
  name?: string;
  role?: string;
  email: string;
  status: InnovationCollaboratorStatusEnum;
  invitedAt: DateISOType;
  innovation: { id: string; name: string; owner: { id: string; name?: string } };
};

// Innovation support.
export type InnovationSupportsListDTO = {
  id: string;
  status: InnovationSupportStatusEnum;
  organisation: {
    id: string;
    name: string;
    acronym: string;
    unit: { id: string; name: string; acronym: string };
  };
  engagingAccessors: { id: string; userRoleId: string; name: string; isActive: boolean }[];
}[];

export type InnovationSupportInfoDTO = {
  id: string;
  status: InnovationSupportStatusEnum;
  engagingAccessors: { id: string; userRoleId: string; name: string }[];
};

// Support summary.
const SupportSummarySectionType = ['ENGAGING', 'BEEN_ENGAGED', 'SUGGESTED'] as const;
export type SupportSummarySectionType = (typeof SupportSummarySectionType)[number];
export type SupportSummaryOrganisationsListDTO = {
  [key in SupportSummarySectionType]: {
    id: string;
    name: string;
    sameOrganisation: boolean;
    support: {
      id?: string;
      status: InnovationSupportStatusEnum;
      start?: DateISOType;
      end?: DateISOType;
      minStart?: DateISOType;
    };
    organisation: {
      id: string;
      acronym: string;
    };
  }[];
};
export type SupportSummaryOrganisationHistoryDTO = {
  id: string;
  type: 'SUPPORT_UPDATE' | 'SUGGESTED_ORGANISATION' | 'PROGRESS_UPDATE' | 'INNOVATION_ARCHIVED' | 'STOP_SHARE';
  createdAt: DateISOType;
  createdBy: { id: string; name: string; displayRole: string };
  params: {
    supportStatus?: InnovationSupportStatusEnum;
    title?: string;
    message?: string;
    suggestedByName?: string;
    file?: { id: string; name: string; url: string };
    categories?: string[];
    category?: string;
    subCategories?: string[];
  };
}[];

type SimpleProgressUpdateParams = { title: string };
type OneLevelProgressUpdateParams = { categories: string[] };
type TwoLevelProgressUpdateParams = { category: string; subCategories: string[] };

export type CreateSupportSummaryProgressUpdateType = {
  description: string;
  document?: { name: string; description?: string; file?: Omit<FileUploadType, 'url'> };
  createdAt: DateISOType;
} & (SimpleProgressUpdateParams | OneLevelProgressUpdateParams | TwoLevelProgressUpdateParams);

// Support log
export enum SupportLogType {
  ACCESSOR_SUGGESTION = 'ACCESSOR_SUGGESTION',
  STATUS_UPDATE = 'STATUS_UPDATE'
}

// Needs Assessment.
export type InnovationNeedsAssessmentInfoDTO = {
  id: string;
  majorVersion: number;
  minorVersion: number;
  editReason: null | string;
  previousAssessment?: { id: string; majorVersion: number; minorVersion: number };
  reassessment?: ReassessmentSendType & {
    sectionsUpdatedSinceLastAssessment: string[];
    createdAt: DateISOType;
    previousCreatedAt: DateISOType;
  };
  summary: null | string;
  description: null | string;
  finishedAt: null | DateISOType;
  assignTo?: { id: string; name: string };
  maturityLevel: null | string;
  maturityLevelComment: null | string;
  hasRegulatoryApprovals: null | string;
  hasRegulatoryApprovalsComment: null | string;
  hasEvidence: null | string;
  hasEvidenceComment: null | string;
  hasValidation: null | string;
  hasValidationComment: null | string;
  hasProposition: null | string;
  hasPropositionComment: null | string;
  hasCompetitionKnowledge: null | string;
  hasCompetitionKnowledgeComment: null | string;
  hasImplementationPlan: null | string;
  hasImplementationPlanComment: null | string;
  hasScaleResource: null | string;
  hasScaleResourceComment: null | string;
  suggestedOrganisations: {
    id: string;
    name: string;
    acronym: null | string;
    units: { id: string; name: string; acronym: string }[];
  }[];
  updatedAt: null | DateISOType;
  updatedBy: { id: string; name: string };
  isLatest: boolean;
};

export type InnovationActionsListInDTO = {
  count: number;
  data: InnovationTaskData[];
};
export type InnovationTasksListDTO = {
  count: number;
  data: (InnovationActionsListInDTO['data'][0] & { name: string })[];
};

export type InnovationTaskData = {
  id: string;
  displayId: string;
  description: string;
  innovation: { id: string; name: string };
  status: InnovationTaskStatusEnum;
  section: string;
  createdAt: DateISOType;
  updatedAt: DateISOType;
  updatedBy: { name: string; displayTag: string };
  createdBy: { name: string; displayTag: string };
  notifications: number;
  sameOrganisation: boolean;
};

export type InnovationTaskInfoDTO = {
  id: string;
  displayId: string;
  status: InnovationTaskStatusEnum;
  descriptions: InnovationDescription[];
  section: string;
  name: string;
  createdAt: DateISOType;
  updatedAt: DateISOType;
  updatedBy: { name: string; displayTag: string };
  createdBy: { name: string; displayTag: string };
  sameOrganisation: boolean;
  threadId: string;
};

export type InnovationDescription = { description: string; createdAt: DateISOType; name: string; displayTag: string };

export type InnovationActivityLogListInDTO = {
  count: number;
  innovation: { id: string; name: string };
  data: {
    date: DateISOType;
    type: keyof ActivityLogItemsEnum;
    activity: ActivityLogItemsEnum;
    params: {
      actionUserName: string;
      interveningUserName?: string;
      actionUserRole?: string;
      actionUserOrganisationUnit?: string;

      assessmentId?: string;
      sectionId?: string;
      taskId?: string;
      innovationSupportStatus?: InnovationSupportStatusEnum;

      organisations?: string[];
      organisationUnit?: string;
      comment?: { id: string; value: string };
      thread?: { id: string; subject: string; messageId: string };
      totalActions?: number;

      assessment?: { id: string };
      reassessment?: { id: string };

      message?: string;
    };
  }[];
};
export type InnovationActivityLogListDTO = {
  count: number;
  data: (Omit<InnovationActivityLogListInDTO['data'][0], 'innovation' | 'params'> & {
    params: InnovationActivityLogListInDTO['data'][0]['params'] & {
      innovationName: string;
      sectionTitle: string;
    };
    link: null | { label: string; url: string };
  })[];
};

// Export requests.
export type InnovationExportRequestsListDTO = {
  count: number;
  data: {
    id: string;
    status: InnovationExportRequestStatusEnum;
    createdAt: DateISOType;
    createdBy: { name: string; displayRole?: string; displayTeam?: string };
  }[];
};
export type InnovationExportRequestInfoDTO = {
  id: string;
  status: InnovationExportRequestStatusEnum;
  requestReason: string;
  rejectReason?: string;
  createdAt: DateISOType;
  createdBy: {
    id: string;
    name: string;
    displayRole?: string;
    displayTeam?: string;
    organisationUnit?: { id: string };
  };
  updatedAt: DateISOType;
  updatedBy: { name: string };
};

export type InnovationAssessmentListDTO = {
  id: string;
  majorVersion: number;
  minorVersion: number;
  startedAt: Date;
  finishedAt: Date;
};
