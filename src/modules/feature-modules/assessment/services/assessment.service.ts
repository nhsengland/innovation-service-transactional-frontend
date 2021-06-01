import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { CoreService } from '@app/base';

import { MappedObject, UrlModel } from '@modules/core';

import { INNOVATION_STATUS } from '@modules/stores/innovation/innovation.models';


export type getInnovationsListEndpointDTO = {
  count: number;
  data: {
    id: string;
    name: string;
    countryName: string;
    postCode: string;
    mainCategory: string;
    submittedAt: string; // "2021-04-16T09:23:49.396Z",
    assessment: {
      createdAt: string; // "2021-04-16T09:23:49.396Z",
      assignTo: { name: string };
      finishedAt: string; // "2021-04-16T09:23:49.396Z",
    };
    organisations: string[];
  }[];
};

export type getInnovationInfoEndpointDTO = {
  summary: {
    id: string;
    name: string;
    status: keyof typeof INNOVATION_STATUS;
    description: string;
    company: string;
    countryName: string;
    postCode: string;
    categories: string[];
    otherCategoryDescription: string;
  };
  contact: {
    name: string;
    email: string;
    phone: string;
  };
  assessment?: {
    id: string;
    assignToName: string;
  };
};


export type getInnovationNeedsAssessmentEndpointInDTO = {
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
  assessment: Omit<getInnovationNeedsAssessmentEndpointInDTO, 'id' | 'innovation' | 'assignToName' | 'finishedAt' | 'organisations'> & { organisations: string[] }
};


@Injectable()
export class AssessmentService extends CoreService {

  constructor() { super(); }

  getInnovationsList(queryParams: { filters?: { status: string[] }, take: number, skip: number }): Observable<getInnovationsListEndpointDTO> {

    const qp = { take: queryParams.take, skip: queryParams.skip, status: queryParams.filters?.status || [] };

    const url = new UrlModel(this.API_URL).addPath('/assessments/:userId/innovations').setPathParams({ userId: this.stores.authentication.getUserId() }).setQueryParams(qp);
    return this.http.get<getInnovationsListEndpointDTO>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );

  }

  getInnovationInfo(innovationId: string): Observable<getInnovationInfoEndpointDTO> {

    const url = new UrlModel(this.API_URL).addPath('assessments/:userId/innovations/:innovationId').setPathParams({ userId: this.stores.authentication.getUserId(), innovationId });
    return this.http.get<getInnovationInfoEndpointDTO>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );

  }

  getInnovationNeedsAssessment(innovationId: string, assessmentId: string): Observable<getInnovationNeedsAssessmentEndpointOutDTO> {

    const url = new UrlModel(this.API_URL).addPath('assessments/:userId/innovations/:innovationId/assessments/:assessmentId').setPathParams({ userId: this.stores.authentication.getUserId(), innovationId, assessmentId });
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
          organisations: response.organisations.map(item => item.id)
        }
      }))
    );

  }

  createInnovationNeedsAssessment(innovationId: string, data: MappedObject): Observable<{ id: string }> {

    const url = new UrlModel(this.API_URL).addPath('assessments/:userId/innovations/:innovationId/assessments').setPathParams({ userId: this.stores.authentication.getUserId(), innovationId });
    return this.http.post<{ id: string }>(url.buildUrl(), data).pipe(
      take(1),
      map(response => response)
    );

  }

  updateInnovationNeedsAssessment(innovationId: string, assessmentId: string, isSubmission: boolean, data: MappedObject): Observable<any> {

    const body = Object.assign({}, data);

    if (isSubmission) {
      body.isSubmission = true;
    }

    const url = new UrlModel(this.API_URL).addPath('assessments/:userId/innovations/:innovationId/assessments/:assessmentId').setPathParams({ userId: this.stores.authentication.getUserId(), innovationId, assessmentId });
    return this.http.put<any>(url.buildUrl(), body).pipe(
      take(1),
      map(response => response)
    );

  }

}
