import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { CoreService } from '@app/base';

import { MappedObject, UrlModel } from '@modules/core';

import { InnovationSectionsIds, INNOVATION_SECTION_ACTION_STATUS, INNOVATION_STATUS, INNOVATION_SUPPORT_STATUS } from '@modules/stores/innovation/innovation.models';


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
  };
  assessment?: {
    id: string;
  };
  support?: {
    id: string;
    status: keyof typeof INNOVATION_SUPPORT_STATUS;
  }
};

type getInnovationActionsListEndpointInDTO = {
  id: string;
  status: keyof typeof INNOVATION_SECTION_ACTION_STATUS;
  section: InnovationSectionsIds;
  createdAt: string; // '2021-04-16T09:23:49.396Z',
};
export type getInnovationActionsListEndpointOutDTO = {
  openedActions: (getInnovationActionsListEndpointInDTO & { name: string })[];
  closedActions: (getInnovationActionsListEndpointInDTO & { name: string })[];
};


export type getInnovationActionInfoInDTO = {
  id: string;
  status: keyof typeof INNOVATION_SECTION_ACTION_STATUS;
  description: string;
  section: InnovationSectionsIds;
  createdAt: string; // '2021-04-16T09:23:49.396Z',
  createdBy: { id: string; name: string; };
};
export type getInnovationActionInfoOutDTO = Omit<getInnovationActionInfoInDTO, 'createdBy'> & { name: string, createdBy: string };


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

    const url = new UrlModel(this.API_URL).addPath('accessors/:userId/innovations/:innovationId').setPathParams({ userId: this.stores.authentication.getUserId(), innovationId });
    return this.http.get<getInnovationInfoEndpointDTO>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );

  }

  getInnovationActionsList(innovationId: string): Observable<getInnovationActionsListEndpointOutDTO> {

    // return of({
    //   openedActions: [
    //     { id: 'ID01', section: InnovationSectionsIds.COST_OF_INNOVATION, status: 'REQUESTED', name: `Submit ${this.stores.innovation.getSectionTitle(InnovationSectionsIds.COST_OF_INNOVATION)}`, createdAt: '2021-04-16T09:23:49.396Z' },
    //     { id: 'ID01', section: InnovationSectionsIds.COST_OF_INNOVATION, status: 'STARTED', name: `Submit ${this.stores.innovation.getSectionTitle(InnovationSectionsIds.COST_OF_INNOVATION)}`, createdAt: '2021-04-16T09:23:49.396Z' }
    //   ],
    //   closedActions: [
    //     { id: 'ID01', section: InnovationSectionsIds.COST_OF_INNOVATION, status: 'COMPLETED', name: `Submit ${this.stores.innovation.getSectionTitle(InnovationSectionsIds.COST_OF_INNOVATION)}`, createdAt: '2021-04-16T09:23:49.396Z' },
    //     { id: 'ID01', section: InnovationSectionsIds.COST_OF_INNOVATION, status: 'COMPLETED', name: `Submit ${this.stores.innovation.getSectionTitle(InnovationSectionsIds.COST_OF_INNOVATION)}`, createdAt: '2021-04-16T09:23:49.396Z' }
    //   ]
    // });

    const url = new UrlModel(this.API_URL).addPath('accessors/:userId/innovations/:innovationId/actions').setPathParams({ userId: this.stores.authentication.getUserId(), innovationId });

    return this.http.get<getInnovationActionsListEndpointInDTO[]>(url.buildUrl()).pipe(
      take(1),
      map( response => {
        return {
          openedActions: response.filter(item => ['REQUESTED', 'STARTED', 'CONTINUE', 'IN_REVIEW'].includes(item.status)).map(item => ({ ...item, ...{ name: `Submit ${this.stores.innovation.getSectionTitle(InnovationSectionsIds.COST_OF_INNOVATION)}` } })),
          closedActions: response.filter(item => ['DELETED', 'DECLINED', 'COMPLETED'].includes(item.status)).map(item => ({ ...item, ...{ name: `Submit ${this.stores.innovation.getSectionTitle(InnovationSectionsIds.COST_OF_INNOVATION)}` } })),
        };
      })
    );

  }

  getInnovationActionInfo(innovationId: string, actionId: string): Observable<getInnovationActionInfoOutDTO> {

    // return of({
    //   id: 'ID01',
    //   status: 'REQUESTED',
    //   name: `Submit ${this.stores.innovation.getSectionTitle(InnovationSectionsIds.COST_OF_INNOVATION)}`,
    //   description: 'some description',
    //   section: InnovationSectionsIds.COST_OF_INNOVATION,
    //   createdAt: '2021-04-16T09:23:49.396Z',
    //   createdBy: 'One guy name'
    // });

    const url = new UrlModel(this.API_URL).addPath('accessors/:userId/innovations/:innovationId/actions/:actionId').setPathParams({ userId: this.stores.authentication.getUserId(), innovationId, actionId });
    return this.http.get<getInnovationActionInfoInDTO>(url.buildUrl()).pipe(
      take(1),
      map(response => ({
        id: response.id,
        status: response.status,
        name: `Submit ${this.stores.innovation.getSectionTitle(response.section)}`,
        description: response.description,
        section: response.section,
        createdAt: response.createdAt,
        createdBy: response.createdBy.name
      }))
    );

  }

  createAction(innovationId: string, body: MappedObject): Observable<{ id: string }> {

    // return of({ id: 'ID01' });
    // return throwError('error');

    const url = new UrlModel(this.API_URL).addPath('accessors/:userId/innovations/:innovationId/actions').setPathParams({ userId: this.stores.authentication.getUserId(), innovationId });
    return this.http.post<{ id: string }>(url.buildUrl(), body).pipe(
      take(1),
      map(response => response)
    );

  }

  updateAction(innovationId: string, actionId: string, body: MappedObject): Observable<{ id: string }> {

    // return of({ id: 'ID01' });
    // return throwError('error');

    const url = new UrlModel(this.API_URL).addPath('accessors/:userId/innovations/:innovationId/actions/:actionId').setPathParams({ userId: this.stores.authentication.getUserId(), innovationId, actionId });
    return this.http.put<{ id: string }>(url.buildUrl(), body).pipe(
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
        },
        support: response.support
      })
      )
    );

  }


  getInnovationSupportInfo(innovationId: string, supportId: string): Observable<{ status: string, accessors: any[] }> {

    const url = new UrlModel(this.API_URL).addPath('accessors/:userId/innovations/:innovationId/supports/:supportId').setPathParams({ userId: this.stores.authentication.getUserId(), innovationId, supportId });
    return this.http.get<{ status: string, accessors: string[] }>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );

  }

  /*
    List of accessors from a given Organisation Unit
    The organisation unit is obtained in the backend from the JWT
  */
  getAccessorsList(): Observable<{ id: string, name: string }[]> {

    const url = new UrlModel(this.API_URL).addPath('accessors');
    return this.http.get<{ id: string, name: string }[]>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );

  }

  saveSupportStatus(innovationId: string, body: MappedObject, supportId?: string): Observable<{ id: string }> {

    if (!supportId) {

      const url = new UrlModel(this.API_URL).addPath('accessors/:userId/innovations/:innovationId/supports').setPathParams({ userId: this.stores.authentication.getUserId(), innovationId });
      return this.http.post<{ id: string }>(url.buildUrl(), body).pipe(
        take(1),
        map(response => response)
      );

    } else {

      const url = new UrlModel(this.API_URL).addPath('accessors/:userId/innovations/:innovationId/supports/:supportId').setPathParams({ userId: this.stores.authentication.getUserId(), innovationId, supportId });
      return this.http.put<{ id: string }>(url.buildUrl(), body).pipe(
        take(1),
        map(response => response)
      );

    }

  }

}
