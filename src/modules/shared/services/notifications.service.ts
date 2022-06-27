import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { CoreService } from '@app/base';
import { UrlModel } from '@app/base/models';
import { APIQueryParamsType, DateISOType, MappedObjectType } from '@app/base/types';

import { NotificationContextDetailEnum, NotificationContextTypeEnum } from '@modules/stores/environment/environment.enums';
import { InnovationStatusEnum } from '../enums';


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

// export type getUnreadNotificationsEndpointDTO = {
//   [key: string]: number;
// };

export const EMAIL_NOTIFICATION_TYPE = {
  ACTION: { title: 'Actions' },
  COMMENT: { title: 'Comments' },
  SUPPORT: { title: 'Support status changes' }
};

type NotificationsListInDTO = {
  count: number;
  data: {
    id: string;
    innovation: { id: string, status: InnovationStatusEnum };
    contextType: NotificationContextTypeEnum;
    contextDetail: NotificationContextDetailEnum;
    createdAt: DateISOType;
    readAt: null | DateISOType;
    params: {
      someParam?: string;
    }
  }[];
};
export type NotificationsListOutDTO = {
  count: number;
  data: (NotificationsListInDTO['data'][0] & { link: null | { label: string; url: string; } })[]
};


@Injectable()
export class NotificationsService extends CoreService {

  // TODO: Remove this property when possible as this should not be a statefull service!
  notifications: { [key: string]: number } = {};

  constructor() { super(); }


  getNotificationsList(queryParams: APIQueryParamsType<{ contextTypes: NotificationContextTypeEnum[] }>): Observable<NotificationsListOutDTO> {

    return of({
      count: 30,
      data: [
        {
          id: '0000111',
          innovation: { id: 'innoId', status: InnovationStatusEnum.IN_PROGRESS }, contextType: NotificationContextTypeEnum.INNOVATION, contextDetail: NotificationContextDetailEnum.LOCK_USER,
          createdAt: '2020-01-01T00:00:00.000Z', readAt: null,
          link: { label: 'Link text', url: '' },
          params: {}
        },
        {
          id: '0000222',
          innovation: { id: 'innoId', status: InnovationStatusEnum.IN_PROGRESS }, contextType: NotificationContextTypeEnum.COMMENT, contextDetail: NotificationContextDetailEnum.COMMENT_CREATION,
          createdAt: '2020-01-01T00:00:00.000Z', readAt: '2020-01-01T00:00:00.000Z',
          link: { label: 'Link text', url: '' },
          params: {}
        }
      ]

    });

    const { filters, ...qParams } = queryParams;

    const qp = {
      ...qParams,
      contextTypes: filters.contextTypes || undefined
    };

    const url = new UrlModel(this.API_URL).addPath('/notifications').setQueryParams(qp);
    return this.http.get<NotificationsListInDTO>(url.buildUrl()).pipe(
      take(1),
      map(response => ({
        count: response.count,
        data: response.data.map(item => {

          let link: null | { label: string; url: string; } = null;

          switch (item.contextType) {
            case NotificationContextTypeEnum.INNOVATION:
              link = { label: 'Go to innovation', url: `/${this.userUrlBasePath()}/innovations/${item.innovation.id}` };
              break;
          }

          return { ...item, link };

        })
      }))
    );
  }

  deleteNotification(notificationId: string): Observable<{ id: string }> {

    const url = new UrlModel(this.API_URL).addPath('notifications/:notificationId').setPathParams({ notificationId });
    return this.http.delete<{ id: string }>(url.buildUrl()).pipe(take(1), map(response => response));

  }


  markAsReadAllNotifications(): Observable<null> {

    const url = new UrlModel(this.API_URL).addPath('notifications');
    return this.http.patch<null>(url.buildUrl(), {}).pipe(
      take(1),
      map(response => response)
    );

  }

  // Specific context notifications methods.
  // innovationStatusNotifications(): Observable<Partial<{ [key in keyof typeof INNOVATION_STATUS]: number }>> {

  //   const url = new UrlModel(this.API_URL).addPath('notifications/status').setQueryParams({ scope: 'INNOVATION_STATUS' });
  //   return this.http.get<Partial<{ [key in keyof typeof INNOVATION_STATUS]: number }>>(url.buildUrl()).pipe(
  //     take(1),
  //     map(response => response)
  //   );

  // }


  dismissNotification(contextId: string, contextType: string): Observable<NotificationDismissResultDTO> {

    const url = new UrlModel(this.API_URL).addPath('notifications');
    return this.http.patch<NotificationDismissResultDTO>(url.buildUrl(), { contextId, contextType }).pipe(
      take(1),
      map(response => response)
    );

  }

  // getAllUnreadNotificationsGroupedByContext(innovationId?: string): Observable<getUnreadNotificationsEndpointDTO> {

  //   let url = new UrlModel(this.API_URL).addPath('notifications/context');

  //   if (innovationId) {
  //     url = url.setQueryParams({ innovationId });
  //   }

  //   return this.http.get<getUnreadNotificationsEndpointDTO>(url.buildUrl()).pipe(
  //     take(1),
  //     map(response => {
  //       this.notifications = response;
  //       return response;
  //     })
  //   );

  // }

  // TODO: Remove this in the future for a specific and typed one!
  // getAllUnreadNotificationsGroupedByStatus(scope: 'SUPPORT_STATUS'): Observable<getUnreadNotificationsEndpointDTO> {

  //   const url = new UrlModel(this.API_URL).addPath('notifications/status').setQueryParams({ scope });

  //   return this.http.get<getUnreadNotificationsEndpointDTO>(url.buildUrl()).pipe(
  //     take(1),
  //     map(response => {
  //       this.notifications = response;
  //       return response;
  //     })
  //   );

  // }

  getEmailNotificationsPreferences(): Observable<getEmailNotificationTypeDTO[]> {

    const url = new UrlModel(this.API_URL).addPath('email-notifications');
    return this.http.get<getEmailNotificationTypeDTO[]>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );

  }

  updateEmailNotificationsPreferences(body: MappedObjectType): Observable<{ id: string }> {

    const url = new UrlModel(this.API_URL).addPath('email-notifications');
    return this.http.put<{ id: string }>(url.buildUrl(), body).pipe(
      take(1),
      map(response => response)
    );

  }

}
