import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { CoreService } from '@app/base';

import { UrlModel } from '@app/base/models';
import { MappedObjectType } from '@app/base/types';

import { InnovationTransferStatusEnum } from '@modules/stores/innovation';


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

  createNeedsReassessment(innovationId: string, body: { updatedInnovationRecord: string, description: string }): Observable<{ id: string }> {

    const url = new UrlModel(this.API_INNOVATIONS_URL).addPath('v1/:innovationId/reassessments').setPathParams({ innovationId });
    return this.http.post<{ id: string }>(url.buildUrl(), body).pipe(take(1), map(response => response));

  }

  submitOrganisationSharing(innovationId: string, body: MappedObjectType): Observable<{ id: string }> {

    const url = new UrlModel(this.API_URL).addPath('innovators/:userId/innovations/:innovationId/shares').setPathParams({ userId: this.stores.authentication.getUserId(), innovationId });
    return this.http.put<{ id: string }>(url.buildUrl(), body).pipe(
      take(1),
      map(response => response)
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

  withdrawInnovation(innovationId: string, message: string): Observable<{ id: string }> {

    const url = new UrlModel(this.API_INNOVATIONS_URL).addPath('v1/:innovationId/withdraw').setPathParams({ innovationId });
    return this.http.patch<{ id: string }>(url.buildUrl(), { message }).pipe(take(1), map(response => response));

  }

  pauseInnovation(innovationId: string, message: string): Observable<{ id: string }> {

    const url = new UrlModel(this.API_INNOVATIONS_URL).addPath('v1/:innovationId/pause').setPathParams({ innovationId });
    return this.http.patch<{ id: string }>(url.buildUrl(), { message }).pipe(take(1), map(response => response));

  }

  deleteUserAccount(body: { reason: string }): Observable<{ id: string }> {

    const url = new UrlModel(this.API_URL).addPath('innovators/:userId/delete').setPathParams({ userId: this.stores.authentication.getUserId() });
    return this.http.patch<{ id: string }>(url.buildUrl(), body).pipe(take(1), map(response => response));

  }

}
