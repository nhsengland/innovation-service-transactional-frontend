import { Params } from '@angular/router';
import { AccessorOrganisationRoleEnum, InnovatorOrganisationRoleEnum } from '@app/base/enums';
import { DateISOType } from '@app/base/types';

import { ActivityLogItemsEnum, InnovationActionStatusEnum, InnovationSectionEnum, InnovationStatusEnum, InnovationSupportStatusEnum } from '@modules/stores/innovation/innovation.enums';
import { InnovationStatisticsEnum } from './statistics.enum';


export type InnovationsListDTO = {
  count: number,
  data: {
    id: string,
    name: string,
    description: null | string,
    status: InnovationStatusEnum,
    submittedAt: null | DateISOType,
    updatedAt: null | DateISOType,
    countryName: null | string,
    postCode: null | string,
    mainCategory: null | string,
    otherMainCategoryDescription: null | string,
    isAssessmentOverdue?: boolean,
    assessment?: null | { id: string, createdAt: DateISOType, finishedAt: null | DateISOType, assignedTo: { name: string; }, reassessmentCount: number },
    statusUpdatedAt: null | DateISOType,
    supports?: {
      id: string,
      status: InnovationSupportStatusEnum,
      updatedAt: DateISOType,
      organisation: {
        id: string, name: string, acronym: null | string,
        unit: {
          id: string, name: string, acronym: string,
          // Users only exists while a support is ENGAGING.
          users?: { name: string, role: AccessorOrganisationRoleEnum | InnovatorOrganisationRoleEnum }[]
        }
      }
    }[],
    notifications?: number,
    statistics?: {
      messages: number,
      actions: number
    }
  }[]
};


export type InnovationInfoDTO = {
  id: string,
  name: string,
  description: null | string,
  status: InnovationStatusEnum,
  submittedAt: null | DateISOType,
  countryName: null | string,
  postCode: null | string,
  categories: string[],
  otherCategoryDescription: null | string,
  owner: {
    id: string,
    name: string,
    email?: string,
    mobilePhone?: null | string,
    isActive: boolean,
    organisations: null | { name: string, size: null | string }[],
    lastLoginAt?: DateISOType
  },
  lastEndSupportAt: null | DateISOType,
  export: { canUserExport: boolean, pendingRequestsCount: number },
  assessment?: null | { id: string, createdAt: DateISOType, finishedAt: null | DateISOType, assignedTo: { name: string }, reassessmentCount: number },
  supports?: null | { id: string, status: InnovationSupportStatusEnum, organisationUnitId: string }[],
  statusUpdatedAt: null | DateISOType
};

export type InnovationNeedsAssessmentInfoDTO = {
  id: string,
  reassessment?: { updatedInnovationRecord: string, description: string; },
  summary: null | string,
  description: null | string,
  finishedAt: null | DateISOType,
  assignTo: { id: string, name: string; },
  maturityLevel: null | string,
  maturityLevelComment: null | string,
  hasRegulatoryApprovals: null | string,
  hasRegulatoryApprovalsComment: null | string,
  hasEvidence: null | string,
  hasEvidenceComment: null | string,
  hasValidation: null | string,
  hasValidationComment: null | string,
  hasProposition: null | string,
  hasPropositionComment: null | string,
  hasCompetitionKnowledge: null | string,
  hasCompetitionKnowledgeComment: null | string,
  hasImplementationPlan: null | string,
  hasImplementationPlanComment: null | string,
  hasScaleResource: null | string,
  hasScaleResourceComment: null | string,
  suggestedOrganisations: { id: string, name: string, acronym: null | string, units: { id: string, name: string, acronym: string }[]; }[],
  updatedAt: null | DateISOType,
  updatedBy: { id: string, name: string }
};


export type InnovationSupportsListDTO = {
  id: string,
  status: InnovationSupportStatusEnum,
  organisation: {
    id: string, name: string, acronym: string,
    unit: { id: string, name: string, acronym: string; };
  },
  engagingAccessors: { id: string, organisationUnitUserId: string, name: string; }[];
}[];


export type InnovationSupportInfoDTO = {
  id: string,
  status: InnovationSupportStatusEnum,
  engagingAccessors: { id: string, organisationUnitUserId: string, name: string; }[];
};

export type InnovationSubmissionDTO = {
  submittedAllSections: boolean,
  submittedForNeedsAssessment: boolean
};

export type InnovationActionsListInDTO = {
  count: number,
  data: {
    id: string,
    displayId: string,
    description: string,
    innovation: { id: string, name: string; },
    status: InnovationActionStatusEnum,
    section: InnovationSectionEnum,
    createdAt: DateISOType,
    updatedAt: DateISOType,
    notifications: number;
  }[];
};
export type InnovationActionsListDTO = { count: number, data: (InnovationActionsListInDTO['data'][0] & { name: string; })[]; };

export type InnovationActionInfoDTO = {
  id: string,
  displayId: string,
  status: InnovationActionStatusEnum,
  section: InnovationSectionEnum,
  name: string,
  description: string,
  createdAt: DateISOType,
  createdBy: string;
};


export type InnovationActivityLogListInDTO = {
  count: number,
  innovation: { id: string, name: string },
  data: {
    date: DateISOType,
    type: keyof ActivityLogItemsEnum;
    activity: ActivityLogItemsEnum;
    params: {

      actionUserName: string,
      interveningUserName?: string,

      assessmentId?: string,
      sectionId?: InnovationSectionEnum,
      actionId?: string,
      innovationSupportStatus?: InnovationSupportStatusEnum,

      organisations?: string[],
      organisationUnit?: string,
      comment?: { id: string; value: string; },
      thread?: { id: string, subject: string, messageId: string },
      totalActions?: number,

      assessment?: { id: string },
      reassessment?: { id: string },

      message?: string,

    }
  }[]
};
export type InnovationActivityLogListDTO = {
  count: number;
  data: (Omit<InnovationActivityLogListInDTO['data'][0], 'innovation' | 'params'>
    & {
      params: InnovationActivityLogListInDTO['data'][0]['params'] & {
        innovationName: string,
        sectionTitle: string
      },
      link: null | { label: string, url: string }
    })[]
};

export type InnovationStatisticsDTO = {
  [InnovationStatisticsEnum.ACTIONS_TO_SUBMIT_COUNTER]: { count: number; lastSubmittedSection: null | string; lastSubmittedAt: null | DateISOType;},
  [InnovationStatisticsEnum.SECTIONS_SUBMITTED_COUNTER]: { count: number; total: number; lastSubmittedSection: null | string; lastSubmittedAt: null | DateISOType;},
  [InnovationStatisticsEnum.UNREAD_MESSAGES_COUNTER]: { count: number; lastSubmittedAt: null | DateISOType;},
  [InnovationStatisticsEnum.ACTIONS_TO_REVIEW_COUNTER]: { count: number; lastSubmittedSection: null | string; lastSubmittedAt: null | DateISOType;},
  [InnovationStatisticsEnum.SECTIONS_SUBMITTED_SINCE_SUPPORT_START_COUNTER]: { count: number; total: number; lastSubmittedSection: null | string; lastSubmittedAt: null | DateISOType;},

  [InnovationStatisticsEnum.SECTIONS_SUBMITTED_SINCE_ASSESSMENT_START_COUNTER]: { count: number; total: number; lastSubmittedSection: null | string; lastSubmittedAt: null | DateISOType;},
  [InnovationStatisticsEnum.UNREAD_MESSAGES_THREADS_INITIATED_BY_COUNTER]: { count: number; lastSubmittedAt: null | DateISOType;},
}

export type BaseStatisticsCard = {
  title: string,
  label: string,
  link: string
  queryParams?: Params;
};

export type StatisticsCard = {
  count: number,
  total?: number,
  lastMessage?: string;
  overdue?: string,
  date?: DateISOType | null,
  emptyMessageTitle?: string,
  emptyMessage?: string,
} & BaseStatisticsCard;

export enum SupportLogType {
  ACCESSOR_SUGGESTION = 'ACCESSOR_SUGGESTION',
  STATUS_UPDATE = 'STATUS_UPDATE',
}

export type InnovationSupportsLog = {
  id: string;
  type: SupportLogType;
  description: string;
  createdBy: string;
  createdAt: DateISOType;
  innovationSupportStatus: keyof typeof InnovationSupportStatusEnum;
  organisationUnit: {
    id: string; name: string; acronym: string;
    organisation: { id: string; name: string; acronym: string; };
  };
  suggestedOrganisationUnits?: {
    id: string; name: string; acronym: string;
    organisation: { id: string; name: string; acronym: string; };
  }[];
};

export type InnovationSupportsLogDTO = InnovationSupportsLog & { logTitle: string; suggestedOrganisationUnitsNames: string[]; };