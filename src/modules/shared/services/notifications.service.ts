import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { CoreService } from '@app/base';
import { UrlModel } from '@app/base/models';
import { APIQueryParamsType, DateISOType, MappedObjectType } from '@app/base/types';

import { NotificationContextDetailEnum, NotificationContextTypeEnum } from '@modules/stores/environment/environment.enums';
import { InnovationActionStatusEnum, InnovationSectionEnum, InnovationStatusEnum, InnovationSupportStatusEnum } from '@modules/stores/innovation';
import { getSectionNumber } from '@modules/stores/innovation/innovation.config';


export const EMAIL_PREFERENCES_TYPES = {
  ACTION: { title: 'Actions' },
  COMMENT: { title: 'Comments' },
  SUPPORT: { title: 'Support status changes' }
};


export type NotificationsListInDTO = {
  count: number;
  data: {
    id: string;
    innovation: { id: string, name: string, status: InnovationStatusEnum };
    contextType: NotificationContextTypeEnum;
    contextDetail: NotificationContextDetailEnum;
    contextId: string;
    createdAt: DateISOType;
    createdBy: string;
    readAt: null | DateISOType;
    params: null | {
      section?: InnovationSectionEnum;
      actionCode?: string;
      actionStatus?: InnovationActionStatusEnum;
      supportStatus?: InnovationSupportStatusEnum;
      organisationUnitName?: string;
    }
  }[];
};
export type NotificationsListOutDTO = {
  count: number;
  data: (
    Omit<NotificationsListInDTO['data'][0], 'innovation' | 'params'>
    & {
      link: null | { label: string; url: string; },
      params: null | {
        innovationId: string;
        innovationName: string;
        innovationStatus: string;
        sectionNumber?: string;
        actionStatusName?: string;
        supportStatusName?: string;
      } & NotificationsListInDTO['data'][0]['params'];
    }
  )[]
};

type GetEmailNotificationsPreferencesDTO = {
  id: string;
  isSubscribed: boolean;
};


@Injectable()
export class NotificationsService extends CoreService {

  constructor() { super(); }


  getNotificationsList(queryParams: APIQueryParamsType<{ contextTypes: NotificationContextTypeEnum[], unreadOnly: boolean }>): Observable<NotificationsListOutDTO> {

    const { filters, ...qParams } = queryParams;

    const qp = {
      ...qParams,
      contextTypes: filters.contextTypes || undefined,
      unreadOnly: filters.unreadOnly ?? false
    };

    const url = new UrlModel(this.API_URL).addPath('notifications').setQueryParams(qp);
    return this.http.get<NotificationsListInDTO>(url.buildUrl()).pipe(
      take(1),
      map(response => ({
        count: response.count,
        data: response.data.map(item => {

          let link: null | { label: string; url: string; } = null;

          switch (item.contextType) {
            case NotificationContextTypeEnum.NEEDS_ASSESSMENT:
              link = { label: 'Click to go to innovation assessment', url: `/${this.userUrlBasePath()}/innovations/${item.innovation.id}/assessments/${item.contextId}` };
              break;
            case NotificationContextTypeEnum.INNOVATION:
            case NotificationContextTypeEnum.SUPPORT:
              link = { label: 'Click to go to innovation', url: `/${this.userUrlBasePath()}/innovations/${item.innovation.id}/overview` };
              break;
            case NotificationContextTypeEnum.ACTION:
              link = { label: 'Click to go to action', url: `/${this.userUrlBasePath()}/innovations/${item.innovation.id}/action-tracker/${item.contextId}` };
              break;
            case NotificationContextTypeEnum.COMMENT:
              link = { label: 'Click to go to comment', url: `/${this.userUrlBasePath()}/innovations/${item.innovation.id}/comments` };
              break;
          }

          return {
            id: item.id,
            contextType: item.contextType,
            contextDetail: item.contextDetail,
            contextId: item.contextId,
            createdAt: item.createdAt,
            createdBy: item.createdBy,
            readAt: item.readAt,
            params: {
              ...item.params,
              innovationId: item.innovation.id,
              innovationName: item.innovation.name,
              innovationStatus: item.innovation.status,
              sectionNumber: item.params?.section ? getSectionNumber(item.params.section) : undefined,
              actionStatusName: item.params?.actionStatus ? this.translate(`shared.catalog.innovation.action_status.${item.params?.actionStatus}.name`) : undefined,
              supportStatusName: item.params?.supportStatus ? this.translate(`shared.catalog.innovation.support_status.${item.params?.supportStatus}.name`) : undefined,
            },
            link
          };

        })
      }))
    );

  }

  dismissAllUserNotifications(): Observable<{ affected: number }> {

    const url = new UrlModel(this.API_URL).addPath('notifications/dismiss');
    return this.http.patch<{ affected: number }>(url.buildUrl(), { dismissAll: true }).pipe(take(1), map(response => response));

  }

  deleteNotification(notificationId: string): Observable<{ id: string }> {

    const url = new UrlModel(this.API_URL).addPath('notifications/:notificationId').setPathParams({ notificationId });
    return this.http.delete<{ id: string }>(url.buildUrl()).pipe(take(1), map(response => response));

  }


  getEmailNotificationsPreferences(): Observable<GetEmailNotificationsPreferencesDTO[]> {

    const url = new UrlModel(this.API_URL).addPath('email-notifications');
    return this.http.get<GetEmailNotificationsPreferencesDTO[]>(url.buildUrl()).pipe(
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
