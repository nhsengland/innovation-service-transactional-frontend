import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { CoreService } from '@app/base';

import { MappedObject, UrlModel } from '@modules/core';
import { INNOVATION_STATUS } from '@modules/stores/innovation/innovation.models';


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
  SUPPORT: { title: 'Support status changes' }
};


@Injectable()
export class NotificationService extends CoreService {

  // TODO: Remove this property when possible as this should not be a statefull service!
  notifications: { [key: string]: number } = {};

  constructor() { super(); }

  // Specific context notifications methods.
  innovationStatusNotifications(): Observable<Partial<{ [key in keyof typeof INNOVATION_STATUS]: number }>> {

    const url = new UrlModel(this.API_URL).addPath('notifications/status').setQueryParams({ scope: 'INNOVATION_STATUS' });
    return this.http.get<Partial<{ [key in keyof typeof INNOVATION_STATUS]: number }>>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );

  }


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

  // TODO: Remove this in the future for a specific and typed one!
  getAllUnreadNotificationsGroupedByStatus(scope: 'SUPPORT_STATUS'): Observable<getUnreadNotificationsEndpointDTO> {

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
