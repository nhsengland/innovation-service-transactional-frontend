import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { CoreService } from '@app/base';

import { UrlModel } from '@app/base/models';
import { MappedObjectType } from '@app/base/types';

import { InnovationActionStatusEnum, InnovationSectionEnum, InnovationSupportStatusEnum, InnovationTransferStatusEnum, INNOVATION_SUPPORT_STATUS } from '@modules/stores/innovation';


type getInnovationActionsListEndpointInDTO = {
  id: string;
  displayId: string;
  status: InnovationActionStatusEnum;
  section: InnovationSectionEnum;
  createdAt: string; // '2021-04-16T09:23:49.396Z',
  notifications: {
    count: number
  },
};

export type getInnovationActionsListEndpointOutDTO = {
  openedActions: (getInnovationActionsListEndpointInDTO & { name: string })[];
  closedActions: (getInnovationActionsListEndpointInDTO & { name: string })[];
};

export type GetSupportLogListInDTO = {
  id: string;
  type: 'ACCESSOR_SUGGESTION' | 'STATUS_UPDATE',
  description: string;
  createdBy: string;
  createdAt: string;
  innovationSupportStatus: InnovationSupportStatusEnum;
  organisationUnit: {
    id: string; name: string; acronym: string;
    organisation: { id: string; name: string; acronym: string; };
  };
  suggestedOrganisationUnits?: {
    id: string; name: string; acronym: string;
    organisation: { id: string; name: string; acronym: string; };
  }[];
};
export type GetSupportLogListOutDTO = GetSupportLogListInDTO & { logTitle: string; suggestedOrganisationUnitsNames: string[]; };

export type GetInnovationTransfersDTO = {
  id: string;
  email: string;
  innovation: { id: string, name: string, owner: string };
}[];


@Injectable()
export class InnovatorService extends CoreService {

  constructor() { super(); }


  createInnovation(
    body: { name: string, description: string, countryName: string, postcode: null | string, organisationShares: string[] },
    useSurvey: boolean
  ): Observable<{ id: string }> {

    const url = new UrlModel(this.API_INNOVATIONS_URL).addPath('v1').setQueryParams({ useSurvey });
    return this.http.post<{ id: string }>(url.buildUrl(), body).pipe(take(1), map(response => response));

  }


  submitOrganisationSharing(innovationId: string, body: MappedObjectType): Observable<{ id: string }> {

    const url = new UrlModel(this.API_URL).addPath('innovators/:userId/innovations/:innovationId/shares').setPathParams({ userId: this.stores.authentication.getUserId(), innovationId });
    return this.http.put<{ id: string }>(url.buildUrl(), body).pipe(
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
          openedActions: response.filter(item => [InnovationActionStatusEnum.REQUESTED, InnovationActionStatusEnum.STARTED, InnovationActionStatusEnum.CONTINUE, InnovationActionStatusEnum.IN_REVIEW].includes(item.status)).map(item => ({
            ...item, ...{ name: `Submit '${this.stores.innovation.getSectionTitle(item.section)}'` }
          })),
          closedActions: response.filter(item => [InnovationActionStatusEnum.DELETED, InnovationActionStatusEnum.DECLINED, InnovationActionStatusEnum.COMPLETED, InnovationActionStatusEnum.CANCELLED].includes(item.status)).map(item => ({
            ...item, ...{ name: `Submit '${this.stores.innovation.getSectionTitle(item.section)}'` }
          })),
        };
      })
    );

  }

  declineAction(innovationId: string, actionId: string, body: MappedObjectType): Observable<{ id: string }> {

    const url = new UrlModel(this.API_URL).addPath('innovators/:userId/innovations/:innovationId/actions/:actionId').setPathParams({ userId: this.stores.authentication.getUserId(), innovationId, actionId });
    return this.http.put<{ id: string }>(url.buildUrl(), body).pipe(
      take(1),
      map(response => response)
    );

  }

  getSupportLogList(innovationId: string): Observable<GetSupportLogListOutDTO[]> {

    const url = new UrlModel(this.API_URL).addPath('innovators/:userId/innovations/:innovationId/support-logs').setPathParams({ userId: this.stores.authentication.getUserId(), innovationId });
    return this.http.get<GetSupportLogListInDTO[]>(url.buildUrl()).pipe(
      take(1),
      map(response => response.map(item => {

        let logTitle = '';

        switch (item.type) {
          case 'ACCESSOR_SUGGESTION':
            logTitle = 'Suggested organisations';
            break;
          case 'STATUS_UPDATE':
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


  getInnovationTransfers(assignToMe = false): Observable<GetInnovationTransfersDTO> {

    const qp: { assignedToMe?: boolean } = assignToMe ? { assignedToMe: true } : {};

    const url = new UrlModel(this.API_INNOVATIONS_URL).addPath('v1/transfers').setQueryParams(qp);
    return this.http.get<GetInnovationTransfersDTO>(url.buildUrl()).pipe(take(1), map(response => response));

  }

  transferInnovation(body: { innovationId: string, email: string }): Observable<{ id: string }> {

    const url = new UrlModel(this.API_INNOVATIONS_URL).addPath('v1/transfers');
    return this.http.post<{ id: string }>(url.buildUrl(), body).pipe(take(1), map(response => response));

  }

  updateTransferInnovation(
    transferId: string,
    status: InnovationTransferStatusEnum.CANCELED | InnovationTransferStatusEnum.DECLINED | InnovationTransferStatusEnum.COMPLETED
  ): Observable<{ id: string }> {

    const url = new UrlModel(this.API_INNOVATIONS_URL).addPath('v1/transfers/:transferId').setPathParams({ transferId });
    return this.http.patch<{ id: string }>(url.buildUrl(), { status }).pipe(take(1), map(response => response));

  }

  archiveInnovation(innovationId: string, reason: string): Observable<{ id: string }> {

    const url = new UrlModel(this.API_URL).addPath('innovators/:userId/innovations/:innovationId/archive').setPathParams({ userId: this.stores.authentication.getUserId(), innovationId });
    return this.http.patch<{ id: string }>(url.buildUrl(), { reason }).pipe(take(1), map(response => response));

  }

  deleteUserAccount(body: { reason: string }): Observable<{ id: string }> {

    const url = new UrlModel(this.API_URL).addPath('innovators/:userId/delete').setPathParams({ userId: this.stores.authentication.getUserId() });
    return this.http.patch<{ id: string }>(url.buildUrl(), body).pipe(take(1), map(response => response));

  }

}
