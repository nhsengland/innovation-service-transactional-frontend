import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { CoreService } from '@app/base';
import { DateISOType } from '@app/base/types';

import { UrlModel } from '@app/base/models';
import { MappedObjectType } from '@app/base/types';

import { InnovationCollaboratorStatusEnum, InnovationTransferStatusEnum } from '@modules/stores';

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

export enum InnovationArchiveReasonEnum {
  DEVELOP_FURTHER = 'DEVELOP_FURTHER',
  HAVE_ALL_SUPPORT = 'HAVE_ALL_SUPPORT',
  DECIDED_NOT_TO_PURSUE = 'DECIDED_NOT_TO_PURSUE',
  ALREADY_LIVE_NHS = 'ALREADY_LIVE_NHS',
  OTHER_DONT_WANT_TO_SAY = 'OTHER_DONT_WANT_TO_SAY'
}

export type SurveyType = {
  id: string;
  createdAt: DateISOType;
  info?: {
    type: 'SUPPORT_END';
    supportId: string;
    supportUnit: string;
    supportFinishedAt: null | Date;
  };
};

export type SurveyAnswersType = {
  supportSatisfaction: string;
  ideaOnHowToProceed: string;
  howLikelyWouldYouRecommendIS: string;
  comment: string;
};

@Injectable()
export class InnovatorService extends CoreService {
  constructor() {
    super();
  }

  createInnovation(body: {
    name: string;
    description: string;
    postcode?: string;
    website?: string;
  }): Observable<{ id: string }> {
    const url = new UrlModel(this.API_INNOVATIONS_URL).addPath('v1');
    return this.http.post<{ id: string }>(url.buildUrl(), body).pipe(
      take(1),
      map(response => response)
    );
  }

  submitOrganisationSharing(innovationId: string, body: MappedObjectType): Observable<{ id: string }> {
    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId/shares')
      .setPathParams({ userId: this.ctx.user.getUserId(), innovationId });
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

  withdrawInnovation(innovationId: string, message: string): Observable<{ id: string }> {
    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId/withdraw')
      .setPathParams({ innovationId });
    return this.http.patch<{ id: string }>(url.buildUrl(), { message }).pipe(
      take(1),
      map(response => response)
    );
  }

  archiveInnovation(innovationId: string, reason: InnovationArchiveReasonEnum): Observable<void> {
    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId/archive')
      .setPathParams({ innovationId });
    return this.http.patch<void>(url.buildUrl(), { reason }).pipe(
      take(1),
      map(response => response)
    );
  }

  deleteUserAccount(body: { reason: string }): Observable<void> {
    const url = new UrlModel(this.API_USERS_URL).addPath('v1/me/delete');
    return this.http.patch<void>(url.buildUrl(), body).pipe(take(1));
  }

  getOwnedInnovations(): Observable<GetOwnedInnovations[]> {
    const url = new UrlModel(this.API_USERS_URL).addPath('v1/me/innovations');
    return this.http.get<GetOwnedInnovations[]>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );
  }

  getUnansweredSurveys(innovationId: string): Observable<SurveyType[]> {
    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId/surveys')
      .setPathParams({ innovationId });
    return this.http.get<SurveyType[]>(url.buildUrl()).pipe(take(1));
  }

  answerSurvey(innovationId: string, surveyId: string, body: SurveyAnswersType): Observable<void> {
    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId/surveys/:surveyId')
      .setPathParams({ innovationId, surveyId });
    return this.http.patch<void>(url.buildUrl(), body).pipe(take(1));
  }

  shareAllInnovationsWithOrg(organisationId: string): Observable<never> {
    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/share-with-organisation/:organisationId/')
      .setPathParams({ organisationId });
    return this.http.post<never>(url.buildUrl(), {}).pipe(take(1));
  }
}
