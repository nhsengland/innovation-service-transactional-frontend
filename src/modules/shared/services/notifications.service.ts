import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { CoreService } from '@app/base';
import { UrlModel } from '@app/base/models';
import { APIQueryParamsType, DateISOType } from '@app/base/types';

import { NotificationContextDetailEnum, NotificationContextTypeEnum } from '@modules/stores/context/context.enums';
import { InnovationSectionEnum, InnovationStatusEnum, InnovationSupportStatusEnum, InnovationTaskStatusEnum } from '@modules/stores/innovation';


export enum EmailNotificationsTypeEnum { // Subset of NotificationContextTypeEnum.
  TASK = 'TASK',
  MESSAGE = 'MESSAGE',
  SUPPORT = 'SUPPORT'
}

export enum EmailNotificationsPreferencesEnum {
  YES = 'YES',
  NO = 'NO'
}

export enum EmailNotificationCategoryEnum {
  // GENERAL
  // A are only composed by GENERAL ones (not all)
  TASK = 'TASK',
  MESSAGE = 'MESSAGE',
  INNOVATION_MANAGEMENT = 'INNOVATION_MANAGEMENT',
  SUPPORT = 'SUPPORT',
  EXPORT_REQUEST = 'EXPORT_REQUEST',
  ACCOUNT = 'ACCOUNT',
  REMINDER = 'REMINDER',
  // NA
  INNOVATOR_SUBMIT_IR = 'INNOVATOR_SUBMIT_IR',
  ASSIGN_NA = 'ASSIGN_NA',
  // QA
  SUGGEST_SUPPORT = 'SUGGEST_SUPPORT',
  // I
  DOCUMENT = 'DOCUMENT',
  // OTHER BUCKET (THIS NEEDS TO BE REVISED)
  INNOVATION = 'INNOVATION',
  NEEDS_ASSESSMENT = 'NEEDS_ASSESSMENT',
  SUPPORT_SUMMARY = 'SUPPORT_SUMMARY',
  AUTOMATIC = 'AUTOMATIC',
}


export type NotificationsListInDTO = {
  count: number;
  data: {
    id: string;
    innovation: { id: string, name: string, status: InnovationStatusEnum, ownerName: string };
    contextType: EmailNotificationCategoryEnum;
    contextDetail: NotificationContextDetailEnum;
    contextId: string;
    createdAt: DateISOType;
    createdBy: string;
    readAt: null | DateISOType;
    params: null | {
      section?: InnovationSectionEnum;
      actionCode?: string;
      taskStatus?: InnovationTaskStatusEnum;
      supportStatus?: InnovationSupportStatusEnum;
      organisationUnitName?: string;
      // Messages.
      subject?: string;
      messageId?: string;
      // Documents.
      fileId?: string;

      threadId?: string;
      unitId?: string;

    }
  }[];
};
export type NotificationsListOutDTO = {
  count: number;
  data: (
    Omit<NotificationsListInDTO['data'][0], 'innovation' | 'params'>
    & {
      link: null | { label: string; url: string; queryParams?: Record<string, string>},
      params: null | {
        innovationId: string;
        innovationName: string;
        innovationOwnerName: string;
        innovationStatus: string;
        sectionNumber?: string;
        taskStatusName?: string;
        supportStatusName?: string;
      } & NotificationsListInDTO['data'][0]['params'];
    }
  )[]
};

export type EmailNotificationPreferencesDTO = {
  [category: string]: EmailNotificationsPreferencesEnum
};

@Injectable()
export class NotificationsService extends CoreService {

  constructor() { super(); }


  getNotificationsList(queryParams: APIQueryParamsType<{ contextTypes: EmailNotificationCategoryEnum[], unreadOnly: boolean }>): Observable<NotificationsListOutDTO> {

    const { filters, ...qParams } = queryParams;

    const qp = {
      ...qParams,
      contextTypes: filters.contextTypes || undefined,
      unreadOnly: filters.unreadOnly ?? false
    };

    const url = new UrlModel(this.API_USERS_URL).addPath('v1/notifications').setQueryParams(qp);
    return this.http.get<NotificationsListInDTO>(url.buildUrl()).pipe(
      take(1),
      map(response => ({
        count: response.count,
        data: response.data.map(item => {

          let link: null | { label: string; url: string; queryParams?: Record<string, string> } = null;

          switch (item.contextType as any) { // TO DO - REMOVE 'as any' AFTER MIGRATING ALL NOTIFICATIONS
            //// NEW NOTIFICATIONS:
            case EmailNotificationCategoryEnum.DOCUMENT:
              link = { label: 'Click to view document.', url: `/${this.userUrlBasePath()}/innovations/${item.innovation.id}/documents/${item.params?.fileId}`};
              break;
            case EmailNotificationCategoryEnum.TASK:
              switch (item.contextDetail) {
                case NotificationContextDetailEnum.TA01_TASK_CREATION_TO_INNOVATOR:
                  link = { label: 'Click to view task.', url: `/${this.userUrlBasePath()}/innovations/${item.innovation.id}/tasks/${item.contextId}` };
                  break;
                default:
                  link = { label: 'Click to view message about this task.', url: `/${this.userUrlBasePath()}/innovations/${item.innovation.id}/threads/${item.params?.threadId}` };
                  break;
                }
              break;
            case EmailNotificationCategoryEnum.MESSAGE:
                link = { label: 'Click to go to message', url: `/${this.userUrlBasePath()}/innovations/${item.innovation.id}/threads/${item.params?.threadId}` };
                break;

            case EmailNotificationCategoryEnum.SUPPORT:
              switch (item.contextDetail) {
                // This case will probably be changed (just work for now)
                case NotificationContextDetailEnum.SUPPORT_SUMMARY_UPDATE:
                  link = { label: 'Click to go to innovation support summary', url: `/${this.userUrlBasePath()}/innovations/${item.innovation.id}/support-summary`, queryParams: { unitId: item.contextId } };
                  break;

                case NotificationContextDetailEnum.ST01_SUPPORT_STATUS_TO_ENGAGING:
                case NotificationContextDetailEnum.ST04_SUPPORT_NEW_ASSIGNED_ACCESSORS_TO_INNOVATOR:
                  link = { label: 'Click to go to message', url: `/${this.userUrlBasePath()}/innovations/${item.innovation.id}/threads/${item.params?.threadId}` }
                  break;

                case NotificationContextDetailEnum.ST02_SUPPORT_STATUS_TO_OTHER:
                case NotificationContextDetailEnum.ST03_SUPPORT_STATUS_TO_WAITING:
                  link = { label: 'Click to go to innovation support summary', url: `/${this.userUrlBasePath()}/innovations/${item.innovation.id}/support-summary`, queryParams: { unitId: item.params?.unitId ?? '' } };
                  break;

                case NotificationContextDetailEnum.ST05_SUPPORT_NEW_ASSIGNED_ACCESSOR_TO_NEW_QA:
                case NotificationContextDetailEnum.ST06_SUPPORT_NEW_ASSIGNED_ACCESSOR_TO_OLD_QA:
                  link = { label: 'Click to go to innovation overview', url: `/${this.userUrlBasePath()}/innovations/${item.innovation.id}/overview` }
                  break;
                
              }
              break;

            case EmailNotificationCategoryEnum.ASSIGN_NA:
              switch (item.contextDetail) {
                case NotificationContextDetailEnum.NA02_INNOVATOR_SUBMITS_FOR_NEEDS_ASSESSMENT_TO_ASSESSMENT:
                  link = { label: 'Click to go to innovation record', url: `/${this.userUrlBasePath()}/innovations/${item.innovation.id}/record` }
                  break;
                case NotificationContextDetailEnum.NA03_NEEDS_ASSESSMENT_STARTED_TO_INNOVATOR:
                  link = { label: 'Click to go to message', url: `/${this.userUrlBasePath()}/innovations/${item.innovation.id}/threads/${item.params?.threadId}/${item.params?.messageId}` }
                  break;
                case NotificationContextDetailEnum.NA04_NEEDS_ASSESSMENT_COMPLETE_TO_INNOVATOR:
                  link = { label: 'Click to go to needs assessment', url: `/${this.userUrlBasePath()}/innovations/${item.innovation.id}/support` }
                  break;
                case NotificationContextDetailEnum.NA05_NEEDS_ASSESSOR_REMOVED:
                case NotificationContextDetailEnum.NA06_NEEDS_ASSESSOR_ASSIGNED:
                case NotificationContextDetailEnum.NA07_NEEDS_ASSESSOR_ASSIGNED:
                  link = { label: 'Click to go to innovation', url: `/${this.userUrlBasePath()}/innovations/${item.innovation.id}/overview` }
                  break;
              }
              break;

            case EmailNotificationCategoryEnum.AUTOMATIC:
              switch (item.contextDetail) {
                case NotificationContextDetailEnum.AU04_SUPPORT_KPI_REMINDER:
                case NotificationContextDetailEnum.AU05_SUPPORT_KPI_OVERDUE:
                  link = { label: 'Click to go to innovation overview', url: `/${this.userUrlBasePath()}/innovations/${item.innovation.id}/overview` }
              }
              break;

            case EmailNotificationCategoryEnum.SUGGEST_SUPPORT:
              switch (item.contextDetail) {
                case NotificationContextDetailEnum.OS03_INNOVATION_DELAYED_SHARED_SUGGESTION:
                  link = { label: 'Click to go to innovation overview', url: `/${this.userUrlBasePath()}/innovations/${item.innovation.id}/overview` }
              }
              break;
                
            case EmailNotificationCategoryEnum.SUPPORT_SUMMARY:
              link = { label: 'Click to go to innovation support summary', url: `/${this.userUrlBasePath()}/innovations/${item.innovation.id}/support-summary`, queryParams: { unitId: item.params?.unitId ?? '' }  };
              break;

            //// OLD - TO BE REMOVED
            case NotificationContextTypeEnum.NEEDS_ASSESSMENT:
              switch (item.contextDetail) {
                case NotificationContextDetailEnum.NEEDS_ASSESSMENT_STARTED:
                  link = null;
                  break;
                default:
                  link = { label: 'Click to go to innovation assessment', url: `/${this.userUrlBasePath()}/innovations/${item.innovation.id}/assessments/${item.contextId}` };
                  break;
              }
              break;
            case NotificationContextTypeEnum.INNOVATION:
              switch (item.contextDetail) {
                case NotificationContextDetailEnum.COLLABORATOR_INVITE:
                  link = { label: 'Click to go to innovation', url: `/${this.userUrlBasePath()}/innovations/${item.innovation.id}/collaborations/${item.contextId}` };
                  break;
                case NotificationContextDetailEnum.COLLABORATOR_UPDATE:
                  link = { label: 'Click to go to innovation', url: `/${this.userUrlBasePath()}/innovations/${item.innovation.id}/collaborations/${item.contextId}` };
                  break;
                case NotificationContextDetailEnum.INNOVATION_WITHDRAWN:
                  link = null;
                  break;
                case NotificationContextDetailEnum.INNOVATION_ORGANISATION_SUGGESTION_NOT_SHARED:
                  link = { label: 'Click to go to data sharing preferences', url: `/${this.userUrlBasePath()}/innovations/${item.innovation.id}/support` };
                  break;
                default:
                  link = { label: 'Click to go to innovation', url: `/${this.userUrlBasePath()}/innovations/${item.innovation.id}/overview` };
                  break;
              };
              break;

            case NotificationContextTypeEnum.TASK:
              link = { label: 'Click to go to task', url: `/${this.userUrlBasePath()}/innovations/${item.innovation.id}/tasks/${item.contextId}` };
              break;
            case NotificationContextTypeEnum.THREAD:
              link = { label: 'Click to go to message', url: `/${this.userUrlBasePath()}/innovations/${item.innovation.id}/threads/${item.contextId}` };
              break;
            case NotificationContextTypeEnum.DATA_SHARING:
              switch (item.contextDetail) {
                case NotificationContextDetailEnum.INNOVATION_ORGANISATION_SUGGESTION_NOT_SHARED:
                  link = { label: 'Click to go to data sharing preferences', url: `/${this.userUrlBasePath()}/innovations/${item.innovation.id}/support` };
                  break;
                default:
                  link = { label: 'Click to go to innovation data sharing preferences', url: `/${this.userUrlBasePath()}/innovations/${item.innovation.id}/support` };
                  break;
              };
              break;
            // case NotificationContextTypeEnum.COMMENT:
            //   link = { label: 'Click to go to comment', url: `/${this.userUrlBasePath()}/innovations/${item.innovation.id}/comments` };
            //   break;

          }

          const section = item.params?.section ? this.stores.innovation.getInnovationRecordSectionIdentification(item.params.section) : undefined;

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
              innovationOwnerName: item.innovation.ownerName,
              sectionNumber: section ? `${section.group.number}.${section.section.number}` : undefined,
              taskStatusName: item.params?.taskStatus ? this.translate(`shared.catalog.innovation.task_status.${item.params?.taskStatus}.name`) : undefined,
              supportStatusName: item.params?.supportStatus ? this.translate(`shared.catalog.innovation.support_status.${item.params?.supportStatus}.name`) : undefined,
            },
            link
          };

        })
      }))
    );

  }

  dismissAllUserNotifications(): Observable<{ affected: number }> {

    const url = new UrlModel(this.API_USERS_URL).addPath('v1/notifications/dismiss');
    return this.http.patch<{ affected: number }>(url.buildUrl(), { dismissAll: true }).pipe(take(1), map(response => response));

  }

  deleteNotification(notificationId: string): Observable<{ id: string }> {

    const url = new UrlModel(this.API_USERS_URL).addPath('v1/notifications/:notificationId').setPathParams({ notificationId });
    return this.http.delete<{ id: string }>(url.buildUrl()).pipe(take(1), map(response => response));

  }


  getEmailNotificationsPreferences(): Observable<EmailNotificationPreferencesDTO> {

    const url = new UrlModel(this.API_USERS_URL).addPath('v1/email-preferences');
    return this.http.get<EmailNotificationPreferencesDTO>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );

  }

  updateEmailNotificationsPreferences(body: {preferences: EmailNotificationPreferencesDTO}): Observable<boolean> {

    const url = new UrlModel(this.API_USERS_URL).addPath('v1/email-preferences');
    return this.http.put(url.buildUrl(), body).pipe(take(1), map(() => true));

  }

}
