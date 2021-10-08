import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { CoreService } from '@app/base';

import { MappedObject, UrlModel } from '@modules/core';


export enum NotificationContextType {
  INNOVATION = 'INNOVATION',
  ACTION = 'ACTION',
  COMMENT = 'COMMENT',
  SUPPORT = 'SUPPORT',
  DATA_SHARING = 'DATA_SHARING',
}

export type NotificationDismissResultDTO = {
  affected: number;
  updated: any[];
  error?: any;
};

export type getEmailNotificationTypeDTO = {
  id: string;
  isSubscribed: boolean;
};

export type getUnreadNotificationsEndpointDTO = {
  [key: string]: number;
};

export const EMAIL_NOTIFICATION_TYPE = {
  ACTION: { title: 'Actions' },
  COMMENT: { title: 'Comments' },
  SUPPORT_STATUS_CHANGE: { title: 'Support status changes' }
};

@Injectable()
export class NotificationService extends CoreService {

  notifications: { [key: string]: number } = {};

  constructor() { super(); }

  dismissNotification(contextId: string, contextType: string): Observable<NotificationDismissResultDTO> {

    const url = new UrlModel(this.API_URL).addPath('notifications');
    return this.http.patch<NotificationDismissResultDTO>(url.buildUrl(), { contextId, contextType }).pipe(
      take(1),
      map(response => response)
    );

  }

  getAllUnreadNotificationsGroupedByContext(innovationId?: string): Observable<getUnreadNotificationsEndpointDTO> {

    let url = new UrlModel(this.API_URL).addPath('notifications/context');

    if (innovationId) {
      url = url.setQueryParams({ innovationId });
    }

    return this.http.get<getUnreadNotificationsEndpointDTO>(url.buildUrl()).pipe(
      take(1),
      map(response => {
        this.notifications = response;
        return response;
      })
    );

  }

  getAllUnreadNotificationsGroupedByStatus(scope: string): Observable<getUnreadNotificationsEndpointDTO> {

    const url = new UrlModel(this.API_URL).addPath('notifications/status').setQueryParams({ scope });

    return this.http.get<getUnreadNotificationsEndpointDTO>(url.buildUrl()).pipe(
      take(1),
      map(response => {
        this.notifications = response;
        return response;
      })
    );

  }

  getEmailNotificationTypes(): Observable<getEmailNotificationTypeDTO[]> {

    const url = new UrlModel(this.API_URL).addPath('email-notifications');
    return this.http.get<getEmailNotificationTypeDTO[]>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );

  }

  updateUserNotificationPreferences(body: MappedObject): Observable<{ id: string }> {

    const url = new UrlModel(this.API_URL).addPath('email-notifications');
    return this.http.put<{ id: string }>(url.buildUrl(), body).pipe(
      take(1),
      map(response => response)
    );

  }

}
