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
    createdAt: string; // '2021-04-16T09:23:49.396Z',
    updatedAt: string; // '2021-04-16T09:23:49.396Z'
    assessment: { id: null | string; }
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
    otherCategoryDescription: null | string;
  };
  contact: {
    name: string;
    email: string;
    phone: null | string;
  };
  assessment?: {
    id: string;
    assignToName: string;
  };
  support?: {
    id: string;
    status: keyof typeof INNOVATION_SUPPORT_STATUS;
    accessors: { id: string; name: string; }[];
  }
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
  support: { id: null | string; }
};

export type getInnovationNeedsAssessmentEndpointOutDTO = {
  innovation: { id: string; name: string; };
  assessment: Omit<getInnovationNeedsAssessmentEndpointInDTO, 'id' | 'innovation' | 'organisations' | 'support'> & { organisations: string[] },
  support: getInnovationNeedsAssessmentEndpointInDTO['support']
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

  getInnovationInfo(innovationId: string): Observable<getInnovationInfoEndpointDTO> {

    return of({
      summary: {
        id: '776227DC-C9A8-EB11-B566-0003FFD6549F',
        name: 'HealthyApp',
        status: 'IN_PROGRESS',
        company: 'HealthyApps, Inc',
        countryName: 'Scotland',
        postCode: '',
        description: 'This innovation serves to get people in shape.',
        categories: ['AI', 'DIGITAL'],
        otherCategoryDescription: null
      },
      contact: {
        name: 'Ricky Martin',
        email: 'ricardo.tavares@bjss.com',
        phone: null
      },
      assessment: {
        id: '6150B099-B8BF-EB11-A7AD-0003FFD65C88',
        assignToName: 'Assessment User'
      },
      support: {
        id: 'aaaaaa',
        status: 'WAITING',
        accessors: [
          { id: 'IdOne', name: 'Brigid Kosgei' },
          { id: 'IdTwo', name: 'Roberto Carlos' }
        ]
      }
    });

    // const url = new UrlModel(this.API_URL).addPath('accessor/:userId/innovations/:innovationId').setPathParams({ userId: this.stores.authentication.getUserId(), innovationId });
    // return this.http.get<getInnovationInfoEndpointDTO>(url.buildUrl()).pipe(
    //   take(1),
    //   map(response => response)
    // );

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
        },
        support: response.support
      })
      )
    );

  }


  getInnovationSupportInfo(innovationId: string, supportId: string): Observable<{ status: string, accessors: any[] }> {

    return of({
      status: 'ENGAGING',
      accessors: [
        {id: 'def', name:'Accessor 2'},
      ],
    });

    const url = new UrlModel(this.API_URL).addPath('accessors/:userId/innovations/:innovationId/support/:supportId').setPathParams({ userId: this.stores.authentication.getUserId(), innovationId, supportId });
    return this.http.get<{ status: string, accessors: string[], comment: string }>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );

  }

  /*
    lista "estatica" dos acessors da unidade
    /accessors
  */
    getAccessorsList(): Observable<{label: string, value: string}[]> {

    return of([
      { value: 'abc', label: 'Accessor 1' },
      { value: 'def', label: 'Accessor 2' },
      { value: 'ghi', label: 'Accessor 3' },
    ]);

  }

}
