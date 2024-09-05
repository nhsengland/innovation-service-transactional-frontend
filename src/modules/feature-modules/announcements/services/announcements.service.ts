import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { CoreService } from '@app/base';
import { UrlModel } from '@app/base/models';
import { DateISOType } from '@app/base/types';

import {
  AnnouncementParamsType,
  AnnouncementTypeEnum
} from '@modules/feature-modules/admin/services/announcements.service';

export type AnnouncementType = {
  id: string;
  title: string;
  startsAt: DateISOType;
  expiresAt: null | DateISOType;
  params: AnnouncementParamsType;
  innovations?: string[];
};

@Injectable()
export class AnnouncementsService extends CoreService {
  constructor() {
    super();
  }

  getAnnouncements(filters: { type?: AnnouncementTypeEnum[]; innovationId?: string }): Observable<AnnouncementType[]> {
    const qp = {
      ...(filters.type ? { type: filters.type } : {}),
      ...(filters.innovationId ? { innovationId: filters.innovationId } : {})
    };

    const url = new UrlModel(this.API_USERS_URL).addPath('v1/me/announcements').setQueryParams(qp);
    return this.http.get<AnnouncementType[]>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );
  }

  readAnnouncement(announcementId: string, innovationId?: string): Observable<void> {
    const qp = {
      ...(innovationId ? { innovationId: innovationId } : {})
    };

    const url = new UrlModel(this.API_USERS_URL)
      .addPath('v1/me/announcements/:announcementId/read')
      .setPathParams({ announcementId })
      .setQueryParams(qp);

    return this.http.patch<void>(url.buildUrl(), null).pipe(take(1));
  }
}
