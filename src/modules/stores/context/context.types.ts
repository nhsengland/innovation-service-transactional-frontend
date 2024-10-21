import { DateISOType, LinkType } from '@app/base/types';
import { InnovationStatusEnum, InnovationSupportStatusEnum } from '../innovation/innovation.enums';

import { ReassessmentSendType } from '@modules/feature-modules/innovator/pages/innovation/needs-reassessment/needs-reassessment-send.config';
import { InnovationRecordSchemaInfoType } from '../innovation/innovation-record/innovation-record-schema/innovation-record-schema.models';
import { NotificationCategoryTypeEnum } from './context.enums';

export type ContextPageAlertType = {
  type: null | 'ACTION' | 'INFORMATION' | 'SUCCESS' | 'WARNING' | 'ERROR';
  title?: string;
  message?: string;
  setFocus?: boolean;
};

export type ContextPageBackLinkType = { label: null | string; hiddenLabel?: string; url?: string };

export type ContextPageStatusType = 'LOADING' | 'READY' | 'ERROR';

export type ContextPageTitleType = { main: null | string; secondary?: string };

export type ContextPageLayoutType = {
  alert: {
    type: null | 'ACTION' | 'INFORMATION' | 'SUCCESS' | 'WARNING' | 'ERROR';
    title?: string;
    message?: string;
    listStyleType?: 'bullet';
    itemsList?: { title: string; description?: string; fieldId?: string; callback?: string | ((...p: any) => void) }[];
    width?: 'full' | '2.thirds';
    setFocus?: boolean;
    persistOneRedirect?: boolean;
  };
  backLink: {
    label: null | string;
    url?: string;
    callback?: (...p: any) => void;
    hiddenLabel?: string;
  };
  status: 'LOADING' | 'READY' | 'ERROR';
  title: {
    main: null | string;
    secondary?: string;
    size?: 'xl' | 'l';
    width?: 'full' | '2.thirds';
    actions?: LinkType[];
  };
};

export type ContextInnovationType = {
  id: string;
  name: string;
  status: InnovationStatusEnum;
  statusUpdatedAt: null | DateISOType;
  archivedStatus?: InnovationStatusEnum;
  hasBeenAssessed: boolean;
  countryName: string | null;
  description: string | null;
  postCode: string | null;
  categories: string[];
  otherCategoryDescription: string | null;
  owner?: {
    name: string;
    isActive: boolean;
    organisation?: { name: string; size: null | string; registrationNumber: null | string };
  };
  loggedUser: { isOwner: boolean };
  assessment?: {
    id: string;
    currentMajorAssessmentId: null | string;
    majorVersion: number;
    minorVersion: number;
    createdAt: DateISOType;
    finishedAt: null | DateISOType;
  };
  assignedTo?: { id: string; userRoleId: string; name: string };
  support?: { id: string; status: InnovationSupportStatusEnum };
  notifications?: { [key in NotificationCategoryTypeEnum]?: number };
  collaboratorId?: string;
  createdAt?: DateISOType;
  expiryAt: number;
};

export type ContextSchemaType = {
  schema: InnovationRecordSchemaInfoType | null;
  expiryAt: number;
};

// InnovationNeedsAssessmentInfoDTO + expiryAt
export type ContextAssessmentType = {
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
} & { expiryAt: number };
