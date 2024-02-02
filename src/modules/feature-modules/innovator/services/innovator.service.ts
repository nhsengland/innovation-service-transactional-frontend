import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { CoreService } from '@app/base';
import { DateISOType } from '@app/base/types';

import { UrlModel } from '@app/base/models';
import { MappedObjectType } from '@app/base/types';

import { InnovationTransferStatusEnum } from '@modules/stores/innovation';
import { InnovationCollaboratorStatusEnum } from '@modules/stores/innovation/innovation.enums';

export type GetInnovationTransfersDTO = {
  id: string;
  email: string;
  innovation: { id: string; name: string; owner?: string };
}[];

export type GetInnovationCollaboratorInvitesDTO = {
  id: string;
  invitedAt: string;
  innovation: {
    id: string;
    name: string;
    description: string;
    owner?: {
      id: string;
      name?: string;
    };
  };
};

export type GetOwnedInnovations = {
  id: string;
  name: string;
  collaboratorsCount: number;
  expirationTransferDate: DateISOType | null;
};

@Injectable()
export class InnovatorService extends CoreService {
  constructor() {
    super();
  }

  createInnovation(body: {
    name: string;
    description: string;
    countryName: string;
    postcode?: string;
    website?: string;
  }): Observable<{ id: string }> {
    const url = new UrlModel(this.API_INNOVATIONS_URL).addPath('v1');
    return this.http.post<{ id: string }>(url.buildUrl(), body).pipe(
      take(1),
      map(response => response)
    );
  }

  createNeedsReassessment(
    innovationId: string,
    body: { updatedInnovationRecord: string; description: string }
  ): Observable<{ id: string }> {
    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId/reassessments')
      .setPathParams({ innovationId });
    return this.http.post<{ id: string }>(url.buildUrl(), body).pipe(
      take(1),
      map(response => response)
    );
  }

  submitOrganisationSharing(innovationId: string, body: MappedObjectType): Observable<{ id: string }> {
    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId/shares')
      .setPathParams({ userId: this.stores.authentication.getUserId(), innovationId });
    return this.http.put<{ id: string }>(url.buildUrl(), body).pipe(
      take(1),
      map(response => response)
    );
  }

  getInnovationInviteCollaborations(): Observable<GetInnovationCollaboratorInvitesDTO[]> {
    const url = new UrlModel(this.API_USERS_URL).addPath('v1/invites');

    return this.http.get<GetInnovationCollaboratorInvitesDTO[]>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );
  }

  getInviteCollaborationInfo(
    innovationId: string,
    collaboratorId: string
  ): Observable<GetInnovationCollaboratorInvitesDTO> {
    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId/collaborators/:collaboratorId')
      .setPathParams({ innovationId, collaboratorId });

    return this.http.get<GetInnovationCollaboratorInvitesDTO>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );
  }

  updateCollaborationStatus(
    innovationId: string,
    collaboratorId: string,
    status: InnovationCollaboratorStatusEnum
  ): Observable<{ id: string }> {
    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId/collaborators/:collaboratorId')
      .setPathParams({ innovationId, collaboratorId });

    return this.http.patch<{ id: string }>(url.buildUrl(), { status }).pipe(
      take(1),
      map(response => response)
    );
  }

  getInnovationTransfers(assignToMe = false): Observable<GetInnovationTransfersDTO> {
    const qp: { assignedToMe?: boolean } = assignToMe ? { assignedToMe: true } : {};

    const url = new UrlModel(this.API_INNOVATIONS_URL).addPath('v1/transfers').setQueryParams(qp);
    return this.http.get<GetInnovationTransfersDTO>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );
  }

  transferInnovation(body: {
    innovationId: string;
    email: string;
    ownerToCollaborator: boolean;
  }): Observable<{ id: string }> {
    const url = new UrlModel(this.API_INNOVATIONS_URL).addPath('v1/transfers');
    return this.http.post<{ id: string }>(url.buildUrl(), body).pipe(
      take(1),
      map(response => response)
    );
  }

  updateTransferInnovation(
    transferId: string,
    status:
      | InnovationTransferStatusEnum.CANCELED
      | InnovationTransferStatusEnum.DECLINED
      | InnovationTransferStatusEnum.COMPLETED
  ): Observable<{ id: string }> {
    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/transfers/:transferId')
      .setPathParams({ transferId });
    return this.http.patch<{ id: string }>(url.buildUrl(), { status }).pipe(
      take(1),
      map(response => response)
    );
  }

  withdrawInnovation(innovationId: string, message: string): Observable<void> {
    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId/withdraw')
      .setPathParams({ innovationId });
    return this.http.patch<void>(url.buildUrl(), { message }).pipe(
      take(1),
      map(response => response)
    );
  }

  archiveInnovation(innovationId: string, message: string): Observable<{ id: string }> {
    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId/archive')
      .setPathParams({ innovationId });
    return this.http.patch<{ id: string }>(url.buildUrl(), { message }).pipe(
      take(1),
      map(response => response)
    );
  }

  deleteUserAccount(body: { reason: string }): Observable<{ id: string }> {
    const url = new UrlModel(this.API_USERS_URL).addPath('v1/me/delete');
    return this.http.patch<{ id: string }>(url.buildUrl(), body).pipe(
      take(1),
      map(response => response)
    );
  }

  getOwnedInnovations(): Observable<GetOwnedInnovations[]> {
    const url = new UrlModel(this.API_USERS_URL).addPath('v1/me/innovations');
    return this.http.get<GetOwnedInnovations[]>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );
  }
}
