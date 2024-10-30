import { DateISOType } from '@app/base/types';
import { InnovationStatusEnum } from '../../innovation/innovation.enums';
import { ReassessmentSendType } from '@modules/feature-modules/innovator/pages/innovation/needs-reassessment/needs-reassessment-send.config';

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
