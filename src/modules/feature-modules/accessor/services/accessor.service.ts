import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { CoreService } from '@app/base';

import { UrlModel } from '@modules/core';

import { INNOVATION_STATUS, INNOVATION_SUPPORT_STATUS } from '@modules/stores/innovation/innovation.models';


export type getInnovationsListEndpointDTO = {
  count: number;
  data: {
    id: string;
    status: keyof typeof INNOVATION_STATUS;
    name: string;
    supportStatus: keyof typeof INNOVATION_SUPPORT_STATUS;
    createdAt: string; // "2021-04-16T09:23:49.396Z",
    updatedAt: string; // "2021-04-16T09:23:49.396Z"
    assessment: { id: null | string; }
  }[];
};

type getInnovationNeedsAssessmentEndpointInDTO = {
  id: string;
  innovation: { id: string; name: string; };
  description: null | string;
  maturityLevel: null | string;
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
  summary: null | string;
  organisations: { id: string; name: string; acronym: null | string; }[];
  assignToName: string;
  finishedAt: null | string;
};

export type getInnovationNeedsAssessmentEndpointOutDTO = {
  innovation: { id: string; name: string; };
  assessment: Omit<getInnovationNeedsAssessmentEndpointInDTO, 'id' | 'innovation' | 'organisations'> & { organisations: string[] }
};


@Injectable()
export class AccessorService extends CoreService {

  constructor() { super(); }

  getInnovationsList(queryParams: { take: number, skip: number }): Observable<getInnovationsListEndpointDTO> {

    const url = new UrlModel(this.API_URL).addPath('/accessors/:userId/innovations').setPathParams({ userId: this.stores.authentication.getUserId() }).setQueryParams(queryParams);
    return this.http.get<getInnovationsListEndpointDTO>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );

  }


  getInnovationNeedsAssessment(innovationId: string, assessmentId: string): Observable<getInnovationNeedsAssessmentEndpointOutDTO> {

    const url = new UrlModel(this.API_URL).addPath('accessors/:userId/innovations/:innovationId/assessments/:assessmentId').setPathParams({ userId: this.stores.authentication.getUserId(), innovationId, assessmentId });
    return this.http.get<getInnovationNeedsAssessmentEndpointInDTO>(url.buildUrl()).pipe(
      take(1),
      map(response => ({
        innovation: response.innovation,
        assessment: {
          description: response.description,
          maturityLevel: response.maturityLevel,
          hasRegulatoryApprovals: response.hasRegulatoryApprovals,
          hasRegulatoryApprovalsComment: response.hasRegulatoryApprovalsComment,
          hasEvidence: response.hasEvidence,
          hasEvidenceComment: response.hasEvidenceComment,
          hasValidation: response.hasValidation,
          hasValidationComment: response.hasValidationComment,
          hasProposition: response.hasProposition,
          hasPropositionComment: response.hasPropositionComment,
          hasCompetitionKnowledge: response.hasCompetitionKnowledge,
          hasCompetitionKnowledgeComment: response.hasCompetitionKnowledgeComment,
          hasImplementationPlan: response.hasImplementationPlan,
          hasImplementationPlanComment: response.hasImplementationPlanComment,
          hasScaleResource: response.hasScaleResource,
          hasScaleResourceComment: response.hasScaleResourceComment,
          summary: response.summary,
          organisations: response.organisations.map(item => item.name),
          assignToName: response.assignToName,
          finishedAt: response.finishedAt,
        }
      })
      )
    );

  }


  getInnovationSupportInfo(innovationId: string, supportId: string): Observable<{ status: string, accessors: string[], comment: string }> {

    return of({
      status: 'UNNASSIGNED',
      accessors: [],
      comment: 'so para teste'
    });

    const url = new UrlModel(this.API_URL).addPath('accessors/:userId/innovations/:innovationId/support/:supportId').setPathParams({ userId: this.stores.authentication.getUserId(), innovationId, supportId });
    return this.http.get<{ status: string, accessors: string[], comment: string }>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );

  }

}
