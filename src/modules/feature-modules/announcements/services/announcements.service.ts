import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { CoreService } from '@app/base';
import { UrlModel } from '@app/base/models';
import { DateISOType } from '@app/base/types';

import { UserRoleEnum } from '@app/base/enums';
import { AnnouncementParamsType, AnnouncementTemplateType } from '../enums/announcement.enum';

export type Announcement = {
  id: string,
  template: AnnouncementTemplateType,
  targetRoles: UserRoleEnum[],
  params: AnnouncementParamsType[keyof AnnouncementParamsType] | null,
  createdAt: DateISOType
}

type GetAnnouncementsDTO = Announcement[];

@Injectable()
export class AnnouncementsService extends CoreService {

  constructor() { super(); }

  getAnnouncements(): Observable<GetAnnouncementsDTO> {
    const url = new UrlModel(this.API_USERS_URL).addPath('v1/announcements');
    return this.http.get<GetAnnouncementsDTO>(url.buildUrl()).pipe(take(1), map(response => response));
  }

  readAnnouncement(id: string): Observable<void> {
    const url = new UrlModel(this.API_USERS_URL).addPath('v1/announcements/:announcementId/read').setPathParams({ announcementId: id });
    return this.http.patch<void>(url.buildUrl(), null).pipe(take(1));
  }

}
