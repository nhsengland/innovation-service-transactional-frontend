import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { CoreService } from '@app/base';
import { MappedObject, UrlModel, APIQueryParamsType } from '@modules/core';

import { InnovationSectionsIds, INNOVATION_SECTION_ACTION_STATUS, INNOVATION_STATUS, INNOVATION_SUPPORT_STATUS } from '@modules/stores/innovation/innovation.models';
import { mainCategoryItems } from '@modules/stores/innovation/sections/catalogs.config';


export enum SupportLogType {
  ACCESSOR_SUGGESTION = 'ACCESSOR_SUGGESTION',
  STATUS_UPDATE = 'STATUS_UPDATE',
}


export type getInnovationsListEndpointInDTO = {
  count: number;
  data: {
    id: string;
    name: string;
    mainCategory: string;
    otherMainCategoryDescription: string;
    countryName: string;
    postcode: string;
    submittedAt: string; // '2021-04-16T09:23:49.396Z',
    support: {
      id: string;
      status: keyof typeof INNOVATION_SUPPORT_STATUS;
      createdAt: string; // '2021-04-16T09:23:49.396Z',
      updatedAt: string; // '2021-04-16T09:23:49.396Z'
      accessors: { id: string; name: string; }[];
    };
    organisations: string[];
    assessment: { id: null | string; };
    notifications?: {
      count: number;
      hasNew: boolean;
    }
  }[];
};
export type getInnovationsListEndpointOutDTO = {
  count: number;
  data: (Omit<getInnovationsListEndpointInDTO['data'][0], 'otherMainCategoryDescription' | 'postcode'>)[],
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
  },
  notifications: { [key: string]: number },
};

type getInnovationActionsListEndpointInDTO = {
  id: string;
  displayId: string;
  status: keyof typeof INNOVATION_SECTION_ACTION_STATUS;
  section: InnovationSectionsIds;
  createdAt: string; // '2021-04-16T09:23:49.396Z',
  notifications: {
    count: number,
    hasNew: boolean;
  },
};
export type getInnovationActionsListEndpointOutDTO = {
  openedActions: (getInnovationActionsListEndpointInDTO & { name: string })[];
  closedActions: (getInnovationActionsListEndpointInDTO & { name: string })[];
};

export type getInnovationActionInfoInDTO = {
  id: string;
  displayId: string;
  status: keyof typeof INNOVATION_SECTION_ACTION_STATUS;
  description: string;
  section: InnovationSectionsIds;
  createdAt: string; // '2021-04-16T09:23:49.396Z',
  createdBy: { id: string; name: string; };
};
export type getInnovationActionInfoOutDTO = Omit<getInnovationActionInfoInDTO, 'createdBy'> & { name: string, createdBy: string };

export type getActionsListEndpointInDTO = {
  count: number;
  data: {
    id: string;
    displayId: string;
    status: keyof typeof INNOVATION_SECTION_ACTION_STATUS;
    section: InnovationSectionsIds;
    createdAt: string; // '2021-04-16T09:23:49.396Z',
    updatedAt: string; // '2021-04-16T09:23:49.396Z',
    innovation: {
      id: string;
      name: string;
    };
    notifications?: {
      count: number;
    }
  }[];
};
export type getActionsListEndpointOutDTO = { count: number, data: (getActionsListEndpointInDTO['data'][0] & { name: string })[] };

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
  organisations: {
    id: string; name: string; acronym: null | string;
    organisationUnits: { id: string; name: string; acronym: null | string; }[];
  }[];
  assignToName: string;
  finishedAt: null | string;
  support: { id: null | string; }
};

export type getInnovationNeedsAssessmentEndpointOutDTO = {
  innovation: { id: string; name: string; };
  assessment: Omit<getInnovationNeedsAssessmentEndpointInDTO, 'id' | 'innovation' | 'support'>,
  support: getInnovationNeedsAssessmentEndpointInDTO['support']
};


export type getInnovationSupportsDTO = {
  id: string;
  status: keyof typeof INNOVATION_SUPPORT_STATUS;
  organisationUnit: {
    id: string;
    name: string;
    organisation: {
      id: string;
      name: string;
      acronym: string;
    };
  };
  accessors?: { id: string, name: string }[];
  notifications?: { [key: string]: number };
};


export type getSupportLogInDTO = {
  id: string;
  type: SupportLogType;
  description: string;
  createdBy: string;
  createdAt: string;
  innovationSupportStatus: keyof typeof INNOVATION_SUPPORT_STATUS;
  organisationUnit: {
    id: string; name: string; acronym: string;
    organisation: { id: string; name: string; acronym: string; };
  };
  suggestedOrganisationUnits?: {
    id: string; name: string; acronym: string;
    organisation: { id: string; name: string; acronym: string; };
  }[];
};
export type getSupportLogOutDTO = getSupportLogInDTO & { logTitle: string; suggestedOrganisationUnitsNames: string[]; };


@Injectable()
export class AccessorService extends CoreService {

  constructor() { super(); }

  getInnovationsList(queryParams: APIQueryParamsType): Observable<getInnovationsListEndpointOutDTO> {

    const { filters, ...qParams } = queryParams;

    const qp = {
      ...qParams,
      supportStatus: filters.status as string,
      assignedToMe: filters.assignedToMe ? 'true' : 'false'
    };

    const url = new UrlModel(this.API_URL).addPath('/accessors/:userId/innovations').setPathParams({ userId: this.stores.authentication.getUserId() }).setQueryParams(qp);

    return this.http.get<getInnovationsListEndpointInDTO>(url.buildUrl()).pipe(
      take(1),
      map(response => ({
        count: response.count,
        data: response.data.map(item => ({
          id: item.id,
          name: item.name,
          mainCategory: item.otherMainCategoryDescription || mainCategoryItems.find(i => i.value === item.mainCategory)?.label || '',
          countryName: `${item.countryName}${item.postcode ? ', ' + item.postcode : ''}`,
          submittedAt: item.submittedAt,
          support: {
            id: item.support?.id,
            status: item.support?.status,
            createdAt: item.support?.createdAt,
            updatedAt: item.support?.updatedAt,
            accessors: item.support?.accessors
          },
          organisations: item.organisations,
          assessment: item.assessment,
          notifications: item.notifications,
        }))
      }))
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

    const url = new UrlModel(this.API_URL).addPath('accessors/:userId/innovations/:innovationId/actions').setPathParams({ userId: this.stores.authentication.getUserId(), innovationId });

    return this.http.get<getInnovationActionsListEndpointInDTO[]>(url.buildUrl()).pipe(
      take(1),
      map(response => {
        return {
          openedActions: response.filter(item => ['REQUESTED', 'STARTED', 'CONTINUE', 'IN_REVIEW'].includes(item.status)).map(item => ({ ...item, ...{ name: `Submit '${this.stores.innovation.getSectionTitle(item.section)}'` } })),
          closedActions: response.filter(item => ['DELETED', 'DECLINED', 'COMPLETED'].includes(item.status)).map(item => ({ ...item, ...{ name: `Submit '${this.stores.innovation.getSectionTitle(item.section)}'` } })),
        };
      })
    );

  }

  getInnovationActionInfo(innovationId: string, actionId: string): Observable<getInnovationActionInfoOutDTO> {

    const url = new UrlModel(this.API_URL).addPath('accessors/:userId/innovations/:innovationId/actions/:actionId').setPathParams({ userId: this.stores.authentication.getUserId(), innovationId, actionId });
    return this.http.get<getInnovationActionInfoInDTO>(url.buildUrl()).pipe(
      take(1),
      map(response => ({
        id: response.id,
        displayId: response.displayId,
        status: response.status,
        name: `Submit '${this.stores.innovation.getSectionTitle(response.section).toString().toLowerCase()}'`,
        description: response.description,
        section: response.section,
        createdAt: response.createdAt,
        createdBy: response.createdBy.name
      }))
    );

  }


  getActionsList(queryParams: APIQueryParamsType): Observable<getActionsListEndpointOutDTO> {

    const { filters, ...qParams } = queryParams;

    const qp = {
      ...qParams,
      openActions: filters.openActions as string || ''
    };

    const url = new UrlModel(this.API_URL).addPath('/accessors/:userId/actions').setPathParams({ userId: this.stores.authentication.getUserId() }).setQueryParams(qp);
    return this.http.get<getActionsListEndpointInDTO>(url.buildUrl()).pipe(
      take(1),
      map(response => ({
        count: response.count,
        data: response.data.map(item => ({ ...item, ...{ name: `Submit '${this.stores.innovation.getSectionTitle(item.section)}'`, } }))
      }))
    );

  }

  createAction(innovationId: string, body: MappedObject): Observable<{ id: string }> {

    const url = new UrlModel(this.API_URL).addPath('accessors/:userId/innovations/:innovationId/actions').setPathParams({ userId: this.stores.authentication.getUserId(), innovationId });
    return this.http.post<{ id: string }>(url.buildUrl(), body).pipe(
      take(1),
      map(response => response)
    );

  }

  updateAction(innovationId: string, actionId: string, body: MappedObject): Observable<{ id: string }> {

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
          organisations: response.organisations,
          assignToName: response.assignToName,
          finishedAt: response.finishedAt,
        },
        support: response.support
      })
      )
    );

  }


  getInnovationSupportInfo(innovationId: string, supportId: string): Observable<{ id: string, status: keyof typeof INNOVATION_SUPPORT_STATUS, accessors: { id: string, name: string }[] }> {

    const url = new UrlModel(this.API_URL).addPath('accessors/:userId/innovations/:innovationId/supports/:supportId').setPathParams({ userId: this.stores.authentication.getUserId(), innovationId, supportId });
    return this.http.get<{ id: string, status: keyof typeof INNOVATION_SUPPORT_STATUS, accessors: { id: string, name: string }[] }>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );

  }


  getAccessorsList(): Observable<{ id: string, name: string }[]> {

    const url = new UrlModel(this.API_URL).addPath('accessors');
    return this.http.get<{ id: string, name: string }[]>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );

  }

  getInnovationSupports(innovationId: string, returnAccessorsInfo: boolean): Observable<getInnovationSupportsDTO[]> {

    const url = new UrlModel(this.API_URL).addPath('accessors/:userId/innovations/:innovationId/supports').setPathParams({ userId: this.stores.authentication.getUserId(), innovationId }).setQueryParams({ full: returnAccessorsInfo });
    return this.http.get<getInnovationSupportsDTO[]>(url.buildUrl()).pipe(
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

  getSupportLog(innovationId: string): Observable<getSupportLogOutDTO[]> {

    const url = new UrlModel(this.API_URL).addPath('accessors/:userId/innovations/:innovationId/support-logs').setPathParams({ userId: this.stores.authentication.getUserId(), innovationId });
    return this.http.get<getSupportLogInDTO[]>(url.buildUrl()).pipe(
      take(1),
      map(response => response.map(item => {

        let logTitle = '';

        switch (item.type) {
          case SupportLogType.ACCESSOR_SUGGESTION:
            logTitle = 'Suggested organisations';
            break;
          case SupportLogType.STATUS_UPDATE:
            logTitle = 'Updated support status';
            break;
          default:
            break;
        }

        return {
          ...item,
          logTitle,
          suggestedOrganisationUnitsNames: (item.suggestedOrganisationUnits || []).map(o => o.name)
        };

      }))
    );
  }

  suggestNewOrganisations(innovationId: string, body: { organisationUnits: string[], type: SupportLogType, description: string }): Observable<{ id: string }> {

    const url = new UrlModel(this.API_URL).addPath('accessors/:userId/innovations/:innovationId/support-logs').setPathParams({ userId: this.stores.authentication.getUserId(), innovationId });
    return this.http.post<{ id: string }>(url.buildUrl(), body).pipe(
      take(1),
      map(response => response)
    );

  }


}
