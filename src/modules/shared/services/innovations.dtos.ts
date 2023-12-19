import { AccessorOrganisationRoleEnum, InnovatorOrganisationRoleEnum } from '@app/base/enums';
import { FileUploadType } from '@app/base/forms';
import { DateISOType } from '@app/base/types';

import { PhoneUserPreferenceEnum } from '@modules/stores/authentication/authentication.service';
import {
  catalogCareSettings,
  catalogCategory,
  catalogInvolvedAACProgrammes,
  catalogKeyHealthInequalities,
  catalogOfficeLocation
} from '@modules/stores/innovation/innovation-record/202304/catalog.types';

import {
  ActivityLogItemsEnum,
  InnovationCollaboratorStatusEnum,
  InnovationExportRequestStatusEnum,
  InnovationGroupedStatusEnum,
  InnovationSectionEnum,
  InnovationStatusEnum,
  InnovationSupportStatusEnum,
  InnovationTaskStatusEnum
} from '@modules/stores/innovation/innovation.enums';

// Innovations.
export type InnovationsListFiltersType = {
  name?: null | string;
  mainCategories?: string[];
  locations?: catalogOfficeLocation[];
  status?: InnovationStatusEnum[];
  assessmentSupportStatus?: 'UNASSIGNED' | 'ENGAGING' | 'NOT_ENGAGING';
  supportStatuses?: InnovationSupportStatusEnum[];
  groupedStatuses?: InnovationGroupedStatusEnum[];
  engagingOrganisations?: string[];
  engagingOrganisationUnits?: string[];
  assignedToMe?: boolean;
  suggestedOnly?: boolean;
  latestWorkedByMe?: boolean;
  hasAccessThrough?: ('owner' | 'collaborator')[];
  dateFilter?: {
    field: 'submittedAt';
    startDate?: DateISOType;
    endDate?: DateISOType;
  }[];
  fields?: ('assessment' | 'supports' | 'notifications' | 'statistics' | 'groupedStatus')[];
};

export type InnovationsListInDTO = {
  count: number;
  data: {
    id: string;
    name: string;
    description: null | string;
    status: InnovationStatusEnum;
    groupedStatus?: InnovationGroupedStatusEnum;
    submittedAt: null | DateISOType;
    updatedAt: null | DateISOType;
    countryName: null | string;
    postCode: null | string;
    mainCategory: null | string;
    otherMainCategoryDescription: null | string;
    assessment?: null | {
      id: string;
      isExempted?: boolean;
      createdAt: DateISOType;
      finishedAt: null | DateISOType;
      assignedTo: { name: string };
      reassessmentCount: number;
    };
    statusUpdatedAt: null | DateISOType;
    supports?: {
      id: string;
      status: InnovationSupportStatusEnum;
      updatedAt: DateISOType;
      organisation: {
        id: string;
        name: string;
        acronym: null | string;
        unit: {
          id: string;
          name: string;
          acronym: string;
          // Users only exists while a support is ENGAGING.
          users?: { name: string; role: AccessorOrganisationRoleEnum | InnovatorOrganisationRoleEnum }[];
        };
      };
    }[];
    notifications?: number;
    statistics?: { messages: number; tasks: number };
  }[];
};
export type InnovationsListDTO = {
  count: number;
  data: (InnovationsListInDTO['data'][0] & {
    overdueStatus: null | string;
    daysFromSubmittedAtToToday: null | number;
  })[];
};

export type InnovationListSelectType =
  | 'id'
  | 'name'
  | 'status'
  | 'groupedStatus'
  | 'submittedAt'
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
  | 'support.status'
  | 'support.updatedAt';

export type InnovationListNewFullDTO = {
  id: string;
  name: string;
  status: InnovationStatusEnum;
  groupedStatus: InnovationGroupedStatusEnum;
  submittedAt: DateISOType | null;
  updatedAt: DateISOType;

  // Document fields
  careSettings: catalogCareSettings[] | null;
  otherCareSetting: string | null;
  categories: catalogCategory[] | null;
  countryName: string | null;
  postcode: string | null;
  diseasesAndConditions: string[] | null; // not strongly typed atm
  involvedAACProgrammes: catalogInvolvedAACProgrammes[] | null;
  keyHealthInequalities: catalogKeyHealthInequalities[] | null;
  mainCategory: catalogCategory | null;
  otherCategoryDescription: string | null;

  // Relation fields
  engagingOrganisations: { organisationId: string; name: string; acronym: string }[];
  engagingUnits: { unitId: string; name: string; acronym: string }[];
  suggestedUnits: { unitId: string; name: string; acronym: string }[];
  owner: { id: string; name: string | null; companyName: string | null } | null;
  support: { status: InnovationSupportStatusEnum; updatedAt: DateISOType | null };
};

export type InnovationInfoDTO = {
  id: string;
  name: string;
  description: null | string;
  status: InnovationStatusEnum;
  groupedStatus: InnovationGroupedStatusEnum;
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
    organisation?: { name: string; size: null | string };
    lastLoginAt?: DateISOType;
  };
  lastEndSupportAt: null | DateISOType;
  assessment?: null | {
    id: string;
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
  innovation: { id: string; name: string; description: null | string; owner: { id: string; name?: string } };
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
    };
  }[];
};
export type SupportSummaryOrganisationHistoryDTO = {
  id: string;
  type: 'SUPPORT_UPDATE' | 'SUGGESTED_ORGANISATION' | 'PROGRESS_UPDATE';
  createdAt: DateISOType;
  createdBy: { id: string; name: string; displayRole: string };
  params: {
    supportStatus?: InnovationSupportStatusEnum;
    title?: string;
    message?: string;
    suggestedByName?: string;
    file?: { id: string; name: string; url: string };
  };
}[];
export type CreateSupportSummaryProgressUpdateType = {
  title: string;
  description: string;
  document?: { name: string; description?: string; file?: Omit<FileUploadType, 'url'> };
};

// Support log
export enum SupportLogType {
  ACCESSOR_SUGGESTION = 'ACCESSOR_SUGGESTION',
  STATUS_UPDATE = 'STATUS_UPDATE'
}

// Needs Assessment.
export type InnovationNeedsAssessmentInfoDTO = {
  id: string;
  reassessment?: { updatedInnovationRecord: string; description: string };
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
  section: InnovationSectionEnum;
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
  section: InnovationSectionEnum;
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
      sectionId?: InnovationSectionEnum;
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
