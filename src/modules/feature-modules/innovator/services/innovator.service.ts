import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { CoreService } from '@app/base';

import { MappedObject, UrlModel } from '@modules/core';
import { InnovationSectionsIds, INNOVATION_SECTION_ACTION_STATUS, INNOVATION_STATUS, INNOVATION_SUPPORT_STATUS } from '@modules/stores/innovation/innovation.models';


type getInnovationActionsListEndpointInDTO = {
  id: string;
  displayId: string;
  status: keyof typeof INNOVATION_SECTION_ACTION_STATUS;
  section: InnovationSectionsIds;
  createdAt: string; // '2021-04-16T09:23:49.396Z',
  notifications: {
    count: number
  },
};

export type getInnovationInfoEndpointDTO = {
  id: string;
  name: string;
  status: keyof typeof INNOVATION_STATUS;
  description: string;
  countryName: string;
  postcode: string;
  submittedAt?: string;
  assessment?: {
    id: string;
  };
  actions: {
    requestedCount: number;
    inReviewCount: number;
  },
  notifications: { [key: string]: number }
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

export type getInnovationSupportsInDTO = {
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

export type getInnovationActionsListEndpointOutDTO = {
  openedActions: (getInnovationActionsListEndpointInDTO & { name: string })[];
  closedActions: (getInnovationActionsListEndpointInDTO & { name: string })[];
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
  updatedBy: null | string;
  updatedAt: null | string;
  createdAt: null | string;
  createdBy: null | string;
};
export type getInnovationNeedsAssessmentEndpointOutDTO = {
  innovation: { id: string; name: string; };
  assessment: Omit<getInnovationNeedsAssessmentEndpointInDTO, 'id' | 'innovation' | 'organisations'> & { organisations: string[], orgNames: string[] }
};

export type getInnovationTransfersDTO = {
  id: string;
  email: string;
  name?: string;
  innovation: { id: string, name: string, owner?: string };
};

@Injectable()
export class InnovatorService extends CoreService {

  constructor() { super(); }

  submitFirstTimeSigninInfo(type: 'FIRST_TIME_SIGNIN' | 'TRANSFER', data: { [key: string]: any }): Observable<{ id: string }> {

    const body: {
      actionType: '' | 'first_time_signin' | 'transfer',
      user: { displayName: string },
      transferId?: string,
      innovation?: { name: string, description: string, countryName: string, postcode: string, organisationShares: string[] },
      organisation?: { name: string, size: string }
    } = {
      actionType: '',
      user: { displayName: data.innovatorName },
      organisation: data.isCompanyOrOrganisation.toUpperCase() === 'YES' ? { name: data.organisationName, size: data.organisationSize } : undefined
    };

    switch (type) {
      case 'FIRST_TIME_SIGNIN':
        body.actionType = 'first_time_signin';
        body.innovation = {
          name: data.innovationName,
          description: data.innovationDescription,
          countryName: data.locationCountryName || data.location,
          postcode: data.englandPostCode || '',
          organisationShares: data.organisationShares || []
        };
        break;

      case 'TRANSFER':
        body.actionType = 'transfer';
        body.transferId = data.transferId;
        break;

      default:
        break;
    }

    const url = new UrlModel(this.API_URL).addPath('innovators');
    return this.http.post<{ id: string }>(url.buildUrl(), body).pipe(take(1), map(response => response));

  }

  createInnovation(body: { name: string, description: string, countryName: string, postcode: string, organisationShares: string[] }): Observable<{ id: string }> {

    const url = new UrlModel(this.API_URL).addPath('innovators/:userId/innovations').setPathParams({ userId: this.stores.authentication.getUserId() });
    return this.http.post<{ id: string }>(url.buildUrl(), body).pipe(
      take(1),
      map(response => response)
    );

  }

  getInnovationInfo(innovationId: string): Observable<getInnovationInfoEndpointDTO> {

    const url = new UrlModel(this.API_URL).addPath('innovators/:userId/innovations/:innovationId').setPathParams({ userId: this.stores.authentication.getUserId(), innovationId });
    return this.http.get<getInnovationInfoEndpointDTO>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );

  }

  getInnovationSupports(innovationId: string, returnAccessorsInfo: boolean): Observable<getInnovationSupportsInDTO[]> {

    const url = new UrlModel(this.API_URL).addPath('innovators/:userId/innovations/:innovationId/supports').setPathParams({ userId: this.stores.authentication.getUserId(), innovationId }).setQueryParams({ full: returnAccessorsInfo });
    return this.http.get<getInnovationSupportsInDTO[]>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );
  }

  getInnovationActionsList(innovationId: string): Observable<getInnovationActionsListEndpointOutDTO> {

    const url = new UrlModel(this.API_URL).addPath('innovators/:userId/innovations/:innovationId/actions').setPathParams({ userId: this.stores.authentication.getUserId(), innovationId });
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

    const url = new UrlModel(this.API_URL).addPath('innovators/:userId/innovations/:innovationId/actions/:actionId').setPathParams({ userId: this.stores.authentication.getUserId(), innovationId, actionId });
    return this.http.get<getInnovationActionInfoInDTO>(url.buildUrl()).pipe(
      take(1),
      map(response => ({
        id: response.id,
        displayId: response.displayId,
        status: response.status,
        name: `Submit '${this.stores.innovation.getSectionTitle(response.section).toLowerCase()}'`,
        description: response.description,
        section: response.section,
        createdAt: response.createdAt,
        createdBy: response.createdBy.name
      }))
    );

  }

  declineAction(innovationId: string, actionId: string, body: MappedObject): Observable<{ id: string }> {

    const url = new UrlModel(this.API_URL).addPath('innovators/:userId/innovations/:innovationId/actions/:actionId').setPathParams({ userId: this.stores.authentication.getUserId(), innovationId, actionId });
    return this.http.put<{ id: string }>(url.buildUrl(), body).pipe(
      take(1),
      map(response => response)
    );

  }

  getInnovationShares(innovationId: string): Observable<{ id: string, status: keyof typeof INNOVATION_SUPPORT_STATUS }[]> {

    const url = new UrlModel(this.API_URL).addPath('innovators/:userId/innovations/:innovationId/shares').setPathParams({ userId: this.stores.authentication.getUserId(), innovationId });
    return this.http.get<{ id: string, status: keyof typeof INNOVATION_SUPPORT_STATUS }[]>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );

  }

  submitOrganisationSharing(innovationId: string, body: MappedObject): Observable<{ id: string }> {

    const url = new UrlModel(this.API_URL).addPath('innovators/:userId/innovations/:innovationId/shares').setPathParams({ userId: this.stores.authentication.getUserId(), innovationId });
    return this.http.put<{ id: string }>(url.buildUrl(), body).pipe(
      take(1),
      map(response => response)
    );
  }

  getInnovationNeedsAssessment(innovationId: string, assessmentId: string): Observable<getInnovationNeedsAssessmentEndpointOutDTO> {

    const url = new UrlModel(this.API_URL).addPath('innovators/:userId/innovations/:innovationId/assessments/:assessmentId').setPathParams({ userId: this.stores.authentication.getUserId(), innovationId, assessmentId });
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
          organisations: response.organisations.map(item => item.id),
          orgNames: response.organisations.map(item => item.name),
          finishedAt: response.finishedAt,
          assignToName: response.assignToName,
          updatedAt: response.updatedAt,
          updatedBy: response.updatedBy,
          createdAt: response.createdAt,
          createdBy: response.createdBy,
        }
      }))
    );

  }


  getInnovationTransfers(assignToMe = false): Observable<getInnovationTransfersDTO[]> {

    const qp: { assignedToMe?: boolean } = assignToMe ? { assignedToMe: true } : {};

    const url = new UrlModel(this.API_URL).addPath('innovators/innovation-transfers').setQueryParams(qp);
    return this.http.get<getInnovationTransfersDTO[]>(url.buildUrl()).pipe(take(1), map(response => response));

  }

  // getInnovationTransfer(id: string): Observable<getInnovationTransfersDTO> {

  //   return of({
  //     id: 'someId',
  //     email: 'some@email.com',
  //     name: 'Guy that sent!',
  //     innovation: { id: 'innoID', name: 'innovation Name', owner: 'Inno owner' }
  //   });

  //   const url = new UrlModel(this.API_URL).addPath('innovators/innovation-transfers/:id').setPathParams({ id });
  //   return this.http.get<getInnovationTransfersDTO>(url.buildUrl()).pipe(
  //     take(1),
  //     map(response => response)
  //   );

  // }

  transferInnovation(body: { innovationId: string, email: string }): Observable<{ id: string }> {

    const url = new UrlModel(this.API_URL).addPath('innovators/innovation-transfers');
    return this.http.post<{ id: string }>(url.buildUrl(), body).pipe(take(1), map(response => response));

  }

  updateTransferInnovation(transferId: string, status: 'CANCELED' | 'DECLINED' | 'COMPLETED'): Observable<{ id: string }> {

    const url = new UrlModel(this.API_URL).addPath('innovators/innovation-transfers/:transferId').setPathParams({ transferId });
    return this.http.patch<{ id: string }>(url.buildUrl(), { status }).pipe(take(1), map(response => response));

  }

  archiveInnovation(innovationId: string, reason: string): Observable<{ id: string }> {

    const url = new UrlModel(this.API_URL).addPath('innovators/:userId/innovations/:innovationId/archive').setPathParams({ userId: this.stores.authentication.getUserId(), innovationId });
    return this.http.patch<{ id: string }>(url.buildUrl(), { reason }).pipe(take(1), map(response => response));

  }

  deleteUserAccount(userId: string, body: { reason: string }): Observable<{ id: string }> {

    const url = new UrlModel(this.API_URL).addPath('innovators/:userId/delete').setPathParams({ userId: this.stores.authentication.getUserId() });
    return this.http.patch<{ id: string }>(url.buildUrl(), body).pipe(take(1), map(response => response));

  }

}
