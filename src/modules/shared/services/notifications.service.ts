import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { CoreService } from '@app/base';
import { UrlModel } from '@app/base/models';
import { APIQueryParamsType, DateISOType } from '@app/base/types';

import { NotificationContextDetailEnum, NotificationCategoryTypeEnum } from '@modules/stores/context/context.enums';
import {
  InnovationSectionEnum,
  InnovationStatusEnum,
  InnovationSupportStatusEnum,
  InnovationTaskStatusEnum
} from '@modules/stores/innovation';

export enum NotificationPreferenceEnum {
  YES = 'YES',
  NO = 'NO'
}

export type NotificationsListInDTO = {
  count: number;
  data: {
    id: string;
    innovation: { id: string; name: string; status: InnovationStatusEnum; ownerName: string };
    contextType: NotificationCategoryTypeEnum;
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

      assessmentId?: string;

      exportRequestId?: string;

      supportId?: string;

      collaboratorId?: string;
    };
  }[];
};
export type NotificationsListOutDTO = {
  count: number;
  data: (Omit<NotificationsListInDTO['data'][0], 'innovation' | 'params'> & {
    link: null | { label: string; url: string; queryParams?: Record<string, string> };
    params:
      | null
      | ({
          innovationId: string;
          innovationName: string;
          innovationOwnerName: string;
          innovationStatus: string;
          sectionNumber?: string;
          taskStatusName?: string;
          supportStatusName?: string;
        } & NotificationsListInDTO['data'][0]['params']);
  })[];
};

export type EmailNotificationPreferencesDTO = {
  [category: string]: NotificationPreferenceEnum;
};

@Injectable()
export class NotificationsService extends CoreService {
  constructor() {
    super();
  }

  getNotificationsList(
    queryParams: APIQueryParamsType<{ contextTypes: NotificationCategoryTypeEnum[]; unreadOnly: boolean }>
  ): Observable<NotificationsListOutDTO> {
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

          switch (item.contextType) {
            // TASK
            case NotificationCategoryTypeEnum.TASK:
              switch (item.contextDetail) {
                case NotificationContextDetailEnum.TA01_TASK_CREATION_TO_INNOVATOR:
                  link = {
                    label: 'Click to view task.',
                    url: `/${this.userUrlBasePath()}/innovations/${item.innovation.id}/tasks/${item.contextId}`
                  };
                  break;
                default:
                  link = {
                    label: 'Click to view message about this task.',
                    url: `/${this.userUrlBasePath()}/innovations/${item.innovation.id}/threads/${item.params?.threadId}`
                  };
                  break;
              }
              break;

            // DOCUMENTS
            case NotificationCategoryTypeEnum.DOCUMENTS:
              link = {
                label: 'Click to view document.',
                url: `/${this.userUrlBasePath()}/innovations/${item.innovation.id}/documents/${item.params?.fileId}`
              };
              break;

            // MESSAGES
            case NotificationCategoryTypeEnum.MESSAGES:
              link = {
                label: 'Click to go to message',
                url: `/${this.userUrlBasePath()}/innovations/${item.innovation.id}/threads/${item.params?.threadId}`
              };
              break;

            // SUPPORT
            case NotificationCategoryTypeEnum.SUPPORT:
              switch (item.contextDetail) {
                case NotificationContextDetailEnum.ST01_SUPPORT_STATUS_TO_ENGAGING:
                case NotificationContextDetailEnum.ST04_SUPPORT_NEW_ASSIGNED_ACCESSORS_TO_INNOVATOR:
                  link = {
                    label: 'Click to go to message',
                    url: `/${this.userUrlBasePath()}/innovations/${item.innovation.id}/threads/${item.params?.threadId}`
                  };
                  break;

                case NotificationContextDetailEnum.ST02_SUPPORT_STATUS_TO_OTHER:
                case NotificationContextDetailEnum.ST03_SUPPORT_STATUS_TO_WAITING:
                case NotificationContextDetailEnum.SS01_SUPPORT_SUMMARY_UPDATE_TO_INNOVATORS:
                case NotificationContextDetailEnum.SS02_SUPPORT_SUMMARY_UPDATE_TO_OTHER_ENGAGING_ACCESSORS:
                  link = {
                    label: 'Click to go to innovation support summary',
                    url: `/${this.userUrlBasePath()}/innovations/${item.innovation.id}/support-summary`,
                    queryParams: { unitId: item.params?.unitId ?? '' }
                  };
                  break;

                case NotificationContextDetailEnum.ST05_SUPPORT_NEW_ASSIGNED_ACCESSOR_TO_NEW_QA:
                case NotificationContextDetailEnum.ST07_SUPPORT_STATUS_CHANGE_REQUEST:
                  link = {
                    label: 'Click to go to innovation overview',
                    url: `/${this.userUrlBasePath()}/innovations/${item.innovation.id}/overview`
                  };
                  break;
              }
              break;

            //NEEDS ASSESMENT
            case NotificationCategoryTypeEnum.NEEDS_ASSESSMENT:
              switch (item.contextDetail) {
                case NotificationContextDetailEnum.NA02_INNOVATOR_SUBMITS_FOR_NEEDS_ASSESSMENT_TO_ASSESSMENT:
                  link = {
                    label: 'Click to go to innovation',
                    url: `/${this.userUrlBasePath()}/innovations/${item.innovation.id}/overview`
                  };
                  break;
                case NotificationContextDetailEnum.NA03_NEEDS_ASSESSMENT_STARTED_TO_INNOVATOR:
                  link = {
                    label: 'Click to go to message',
                    url: `/${this.userUrlBasePath()}/innovations/${item.innovation.id}/threads/${item.params?.threadId}`
                  };
                  break;
                case NotificationContextDetailEnum.NA04_NEEDS_ASSESSMENT_COMPLETE_TO_INNOVATOR:
                  link = {
                    label: 'Click to go to needs assessment',
                    url: `/${this.userUrlBasePath()}/innovations/${item.innovation.id}/assessments/${
                      item.params?.assessmentId
                    }`
                  };
                  break;
                case NotificationContextDetailEnum.NA06_NEEDS_ASSESSOR_REMOVED:
                case NotificationContextDetailEnum.NA07_NEEDS_ASSESSOR_ASSIGNED:
                  link = {
                    label: 'Click to go to innovation',
                    url: `/${this.userUrlBasePath()}/innovations/${item.innovation.id}/overview`
                  };
                  break;
              }
              break;

            // ORGANISATIONS SUGGESTIONS
            case NotificationCategoryTypeEnum.ORGANISATION_SUGGESTIONS:
              switch (item.contextDetail) {
                case NotificationContextDetailEnum.OS01_UNITS_SUGGESTION_TO_SUGGESTED_UNITS_QA:
                case NotificationContextDetailEnum.OS03_INNOVATION_DELAYED_SHARED_SUGGESTION:
                  link = {
                    label: 'Click to go to innovation overview',
                    url: `/${this.userUrlBasePath()}/innovations/${item.innovation.id}/overview`
                  };
                  break;
                case NotificationContextDetailEnum.OS02_UNITS_SUGGESTION_NOT_SHARED_TO_INNOVATOR:
                  link = {
                    label: 'Click to go to sharing preferences',
                    url: `/${this.userUrlBasePath()}/innovations/${item.innovation.id}/support`
                  };
                  break;
              }
              break;

            // INNOVATION MANAGEMENT
            case NotificationCategoryTypeEnum.INNOVATION_MANAGEMENT:
              switch (item.contextDetail) {
                case NotificationContextDetailEnum.RE01_EXPORT_REQUEST_SUBMITTED:
                  link = {
                    label: 'Click to go to request',
                    url: `/${this.userUrlBasePath()}/innovations/${item.innovation.id}/record/export-requests/${
                      item.params?.exportRequestId
                    }`
                  };
                  break;
                case NotificationContextDetailEnum.RE02_EXPORT_REQUEST_APPROVED:
                  link = {
                    label: 'Click to go to innovation record',
                    url: `/${this.userUrlBasePath()}/innovations/${item.innovation.id}/record`
                  };
                  break;
                case NotificationContextDetailEnum.RE03_EXPORT_REQUEST_REJECTED:
                  link = {
                    label: 'Click to go to reason',
                    url: `/${this.userUrlBasePath()}/innovations/${item.innovation.id}/record/export-requests/${
                      item.params?.exportRequestId
                    }`
                  };
                  break;
                case NotificationContextDetailEnum.MC01_COLLABORATOR_INVITE_EXISTING_USER:
                  link = {
                    label: 'Click to go to collaboration',
                    url: `/${this.userUrlBasePath()}/innovations/${item.innovation.id}/collaborations/${
                      item.params?.collaboratorId
                    }`
                  };
                  break;
                case NotificationContextDetailEnum.MC04_COLLABORATOR_UPDATE_ACCEPTS_INVITE:
                case NotificationContextDetailEnum.MC05_COLLABORATOR_UPDATE_DECLINES_INVITE:
                  link = {
                    label: 'Click to go to manage collaborators',
                    url: `/${this.userUrlBasePath()}/innovations/${item.innovation.id}/manage/innovation/collaborators`
                  };
                  break;
                case NotificationContextDetailEnum.TO02_TRANSFER_OWNERSHIP_EXISTING_USER:
                  link = { label: 'Click to go to dashboard', url: `/${this.userUrlBasePath()}/` };
                  break;
                case NotificationContextDetailEnum.TO07_TRANSFER_OWNERSHIP_ACCEPTS_ASSIGNED_ACCESSORS:
                  link = {
                    label: 'Click to go to threads',
                    url: `/${this.userUrlBasePath()}/innovations/${item.innovation.id}/threads`
                  };
                  break;
                case NotificationContextDetailEnum.TO08_TRANSFER_OWNERSHIP_DECLINES_PREVIOUS_OWNER:
                  link = {
                    label: 'Click to go to manage innovation',
                    url: `/${this.userUrlBasePath()}/innovations/${item.innovation.id}/manage/innovation`
                  };
                  break;
                case NotificationContextDetailEnum.AI03_INNOVATION_ARCHIVED_TO_ENGAGING_QA_A:
                  link = {
                    label: 'Click to go to innovation',
                    url: `/${this.userUrlBasePath()}/innovations/${item.innovation.id}/overview`
                  };
              }
              break;

            // ADMIN
            case NotificationCategoryTypeEnum.ADMIN:
              switch (item.contextDetail) {
                case NotificationContextDetailEnum.AP07_UNIT_INACTIVATED_TO_ENGAGING_INNOVATIONS:
                  link = {
                    label: 'Click to go to sharing preferences',
                    url: `/${this.userUrlBasePath()}/innovations/${item.innovation.id}/support`
                  };
                  break;
              }
              break;

            // AUTOMATIC
            case NotificationCategoryTypeEnum.AUTOMATIC:
              switch (item.contextDetail) {
                case NotificationContextDetailEnum.AU01_INNOVATOR_INCOMPLETE_RECORD:
                  link = {
                    label: 'Click to go to innovation record',
                    url: `/${this.userUrlBasePath()}/innovations/${item.innovation.id}/record`
                  };
                  break;
                case NotificationContextDetailEnum.AU02_ACCESSOR_IDLE_ENGAGING_SUPPORT:
                  link = {
                    label: 'Click to go to innovation support summary',
                    url: `/${this.userUrlBasePath()}/innovations/${item.innovation.id}/support-summary`,
                    queryParams: { unitId: item.params?.unitId ?? '' }
                  };
                  break;
                case NotificationContextDetailEnum.AU03_INNOVATOR_IDLE_SUPPORT:
                  link = {
                    label: 'Click to go to how to proceed',
                    url: `/${this.userUrlBasePath()}/innovations/${item.innovation.id}/how-to-proceed`
                  };
                  break;
                case NotificationContextDetailEnum.AU04_SUPPORT_KPI_REMINDER:
                case NotificationContextDetailEnum.AU05_SUPPORT_KPI_OVERDUE:
                case NotificationContextDetailEnum.AU06_ACCESSOR_IDLE_WAITING:
                  link = {
                    label: 'Click to go to innovation overview',
                    url: `/${this.userUrlBasePath()}/innovations/${item.innovation.id}/overview`
                  };
                  break;
                case NotificationContextDetailEnum.AU08_TRANSFER_ONE_WEEK_REMINDER_EXISTING_USER:
                  link = { label: 'Click to go to dashboard', url: `/${this.userUrlBasePath()}/` };
                  break;
                case NotificationContextDetailEnum.AU09_TRANSFER_EXPIRED:
                  link = {
                    label: 'Click to go to dashboard',
                    url: `/${this.userUrlBasePath()}/innovations/${item.innovation.id}/manage/innovation`
                  };
                  break;
              }
              break;

            // NOTIFY ME
            case NotificationCategoryTypeEnum.NOTIFY_ME:
              switch (item.contextDetail) {
                case NotificationContextDetailEnum.SUPPORT_UPDATED:
                  link = {
                    label: 'Click to go to support summary.',
                    url: `/${this.userUrlBasePath()}/innovations/${item.innovation.id}/support-summary`,
                    queryParams: { unitId: item.params?.unitId ?? '' }
                  };
                  break;
                case NotificationContextDetailEnum.PROGRESS_UPDATE_CREATED:
                  link = {
                    label: 'Click to go to support summary.',
                    url: `/${this.userUrlBasePath()}/innovations/${item.innovation.id}/support-summary`,
                    queryParams: { unitId: item.params?.unitId ?? '' }
                  };
                  break;
                case NotificationContextDetailEnum.INNOVATION_RECORD_UPDATED:
                  link = {
                    label: 'Click to go to section.',
                    url: `/${this.userUrlBasePath()}/innovations/${item.innovation.id}/record/sections/${item.params?.section}`
                  };
                  break;
                // case NotificationContextDetailEnum.DOCUMENT_UPLOADED:
                //   link = {
                //     label: 'Click to go to documents.',
                //     url: `/${this.userUrlBasePath()}/innovations/${item.innovation.id}/documents`
                //   };
                //   break;
                case NotificationContextDetailEnum.REMINDER:
                  link = {
                    label: 'Click to go to innovation.',
                    url: `/${this.userUrlBasePath()}/innovations/${item.innovation.id}`
                  };
                  break;
                case NotificationContextDetailEnum.SUGGESTED_SUPPORT_UPDATED:
                  link = {
                    label: 'Click to go to support summary.',
                    url: `/${this.userUrlBasePath()}/innovations/${item.innovation.id}/support-summary`
                  };
                  break;
              }
              break;
          }

          const section = item.params?.section
            ? this.stores.schema.getIrSchemaSectionIdentificationV3(item.params.section)
            : undefined;

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
              taskStatusName: item.params?.taskStatus
                ? this.translate(`shared.catalog.innovation.task_status.${item.params?.taskStatus}.name`)
                : undefined,
              supportStatusName: item.params?.supportStatus
                ? this.translate(`shared.catalog.innovation.support_status.${item.params?.supportStatus}.name`)
                : undefined
            },
            link
          };
        })
      }))
    );
  }

  dismissAllUserNotifications(): Observable<{ affected: number }> {
    const url = new UrlModel(this.API_USERS_URL).addPath('v1/notifications/dismiss');
    return this.http.patch<{ affected: number }>(url.buildUrl(), { dismissAll: true }).pipe(
      take(1),
      map(response => response)
    );
  }

  deleteNotification(notificationId: string): Observable<{ id: string }> {
    const url = new UrlModel(this.API_USERS_URL)
      .addPath('v1/notifications/:notificationId')
      .setPathParams({ notificationId });
    return this.http.delete<{ id: string }>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );
  }

  getEmailNotificationsPreferences(): Observable<EmailNotificationPreferencesDTO> {
    const url = new UrlModel(this.API_USERS_URL).addPath('v1/email-preferences');
    return this.http.get<EmailNotificationPreferencesDTO>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );
  }

  updateEmailNotificationsPreferences(body: { preferences: EmailNotificationPreferencesDTO }): Observable<boolean> {
    const url = new UrlModel(this.API_USERS_URL).addPath('v1/email-preferences');
    return this.http.put(url.buildUrl(), body).pipe(
      take(1),
      map(() => true)
    );
  }
}
export { NotificationCategoryTypeEnum };
