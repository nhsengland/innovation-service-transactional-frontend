import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { CoreService } from '@app/base';
import { UserRoleEnum } from '@app/base/enums';
import { UrlModel } from '@app/base/models';
import { APIQueryParamsType, DateISOType } from '@app/base/types';

export enum AnnouncementStatusEnum {
  SCHEDULED = 'SCHEDULED',
  ACTIVE = 'ACTIVE',
  DONE = 'DONE',
  DELETED = 'DELETED'
}

export enum AnnouncementTypeEnum {
  LOG_IN = 'LOG_IN',
  HOMEPAGE = 'HOMEPAGE'
}

export type AnnouncementParamsType = {
  content: string;
  link?: { label: string; url: string };
};

export type InnovationRecordFilterPayloadType = { section: string; question: string; answers: string[] }[];

export type GetAnnouncementsListType = {
  count: number;
  data: {
    id: string;
    title: string;
    status: AnnouncementStatusEnum;
    startsAt: DateISOType;
    expiresAt: null | DateISOType;
    type: AnnouncementTypeEnum;
  }[];
};

export type GetAnnouncementInfoType = {
  id: string;
  title: string;
  userRoles: UserRoleEnum[];
  status: AnnouncementStatusEnum;
  params: AnnouncementParamsType;
  startsAt: DateISOType;
  expiresAt: null | DateISOType;
  type: AnnouncementTypeEnum;
  filters?: InnovationRecordFilterPayloadType;
  sendEmail: boolean;
};

export type UpsertAnnouncementType = {
  title: string;
  userRoles: UserRoleEnum[];
  params: AnnouncementParamsType;
  startsAt: DateISOType;
  expiresAt?: DateISOType;
  type: AnnouncementTypeEnum;
  filters?: InnovationRecordFilterPayloadType;
  sendEmail: boolean;
};

@Injectable()
export class AnnouncementsService extends CoreService {
  constructor() {
    super();
  }

  getAnnouncementsList(queryParams: APIQueryParamsType<{}>): Observable<GetAnnouncementsListType> {
    const { filters, ...qp } = queryParams;

    const url = new UrlModel(this.API_ADMIN_URL).addPath('v1/announcements').setQueryParams(qp);
    return this.http.get<GetAnnouncementsListType>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );
  }

  getAnnouncementInfo(announcementId: string): Observable<GetAnnouncementInfoType> {
    const url = new UrlModel(this.API_ADMIN_URL)
      .addPath('v1/announcements/:announcementId')
      .setPathParams({ announcementId });
    return this.http.get<GetAnnouncementInfoType>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );
  }

  createAnnouncement(data: UpsertAnnouncementType): Observable<{ id: string }> {
    const url = new UrlModel(this.API_ADMIN_URL).addPath('v1/announcements');
    return this.http.post<{ id: string }>(url.buildUrl(), data).pipe(
      take(1),
      map(response => response)
    );
  }

  updateAnnouncement(
    announcementId: string,
    status: AnnouncementStatusEnum,
    data: UpsertAnnouncementType
  ): Observable<void> {
    let body: Parameters<typeof this.updateAnnouncement>[1] | { expiresAt?: DateISOType } = data;

    if (status === AnnouncementStatusEnum.ACTIVE) {
      body = { expiresAt: data.expiresAt };
    }

    const url = new UrlModel(this.API_ADMIN_URL)
      .addPath('v1/announcements/:announcementId')
      .setPathParams({ announcementId });
    return this.http.put<void>(url.buildUrl(), body).pipe(
      take(1),
      map(response => response)
    );
  }

  deleteAnnouncement(announcementId: string): Observable<void> {
    const url = new UrlModel(this.API_ADMIN_URL)
      .addPath('v1/announcements/:announcementId')
      .setPathParams({ announcementId });
    return this.http.delete<void>(url.buildUrl()).pipe(take(1));
  }
}
