import { DateISOType, LinkType } from '@app/base/types';

import { ReassessmentSendType } from '@modules/feature-modules/innovator/pages/innovation/needs-reassessment/needs-reassessment-send.config';

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
