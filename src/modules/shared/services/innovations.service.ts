import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { CoreService } from '@app/base';

import { UrlModel } from '@app/base/models';
import { APIQueryParamsType, DateISOType } from '@app/base/types';

import { UserTypeEnum } from '@modules/stores/authentication/authentication.enums';
import { ACTIVITY_LOG_ITEMS } from '@modules/stores/innovation';
import { getSectionTitle } from '@modules/stores/innovation/innovation.config';

import { InnovationStatisticsEnum } from './statistics.enum';
import { ActivityLogTypesEnum, InnovationActionStatusEnum, InnovationExportRequestStatusEnum, InnovationGroupedStatusEnum, InnovationSectionEnum, InnovationStatusEnum, InnovationSupportStatusEnum } from '@modules/stores/innovation/innovation.enums';
import { mainCategoryItems } from '@modules/stores/innovation/sections/catalogs.config';
import { InnovationActionInfoDTO, InnovationActionsListDTO, InnovationActionsListInDTO, InnovationActivityLogListDTO, InnovationActivityLogListInDTO, InnovationInfoDTO, InnovationNeedsAssessmentInfoDTO, InnovationsListDTO, InnovationStatisticsDTO, InnovationSupportInfoDTO, InnovationSupportsListDTO } from './innovations.dtos';

export enum AssessmentSupportFilterEnum {
  UNASSIGNED = 'UNASSIGNED',
  ENGAGING = 'ENGAGING',
  NOT_ENGAGING = 'NOT_ENGAGING'
}

export type InnovationsListFiltersType = {
  name?: null | string,
  mainCategories?: string[],
  locations?: string[],
  status?: InnovationStatusEnum[],
  assessmentSupportStatus?: AssessmentSupportFilterEnum,
  supportStatuses?: InnovationSupportStatusEnum[],
  groupedStatuses?: InnovationGroupedStatusEnum[],
  engagingOrganisations?: string[],
  assignedToMe?: boolean,
  suggestedOnly?: boolean,
  latestWorkedByMe?: boolean,
  fields?: ('isAssessmentOverdue' | 'assessment' | 'supports' | 'notifications' | 'statistics')[]
}

export type InnovationsActionsListFilterType = {
  innovationId?: string,
  innovationName?: string,
  sections?: InnovationSectionEnum[],
  status?: InnovationActionStatusEnum[],
  createdByMe?: boolean,
  fields?: ('notifications')[]
};

export type GetThreadsListDTO = {
  count: number;
  threads: {
    id: string;
    subject: string;
    messageCount: number;
    createdAt: DateISOType;
    isNew: boolean;
    lastMessage: {
      id: string;
      createdAt: DateISOType;
      createdBy: {
        id: string;
        name: string;
        type: UserTypeEnum;
        organisationUnit?: { id: string, name: string, acronym: string; };
      };
    };
  }[];
};

export type GetThreadInfoDTO = {
  id: string;
  subject: string;
  createdAt: DateISOType;
  createdBy: { id: string, name: string, type: UserTypeEnum; };
};

export type GetThreadMessageInfoDTO = {
  id: string;
  message: string;
  createdAt: DateISOType;
};

export type GetThreadMessagesListInDTO = {
  count: number;
  messages: {
    id: string;
    message: string;
    createdAt: DateISOType;
    createdBy: {
      id: string;
      name: string;
      type: UserTypeEnum;
      organisation?: { id: string, name: string, acronym: string; };
      organisationUnit?: { id: string, name: string, acronym: string; };
    };
    updatedAt: null | DateISOType;
    isNew: boolean;
    isEditable: boolean;
  }[];
};
export type GetThreadMessagesListOutDTO = {
  count: number,
  messages: (
    Omit<GetThreadMessagesListInDTO['messages'][0], 'createdBy'> & {
      createdBy: GetThreadMessagesListInDTO['messages'][0]['createdBy'] & { typeDescription: string; };
    })[]
};

export type CreateThreadDTO = {
  thread: {
    id: string;
    subject: string;
    createdBy: {
      id: string;
    };
    createdAt: DateISOType;
  }
};

export type CreateThreadMessageDTO = {
  threadMessage: {
    createdBy: {
      id: string;
      identityId: string;
    };
    id: string;
    message: string;
    isEditable: boolean;
    createdAt: DateISOType;
  };
};

export type statusChangeDTO = {
  statusChangedAt: null | string;
};

export type InnovationExportRequestItemType = {
  id: string,
  status: InnovationExportRequestStatusEnum,
  isExportable: boolean,
  requestReason: string,
  rejectReason?: null | string,
  expiresAt?: DateISOType, // Returned only when "opened".
  organisation: {
    id: string,
    name: string,
    acronym: null | string,
    organisationUnit: { id: string, name: string, acronym: null | string }
  },
  createdAt: DateISOType,
  createdBy: {
    id: string,
    name: string
  },
  updatedAt: DateISOType
}

export type GetExportRequestsListDTO = {
  count: number;
  data: InnovationExportRequestItemType[]
}

export type GetExportRequestInfoDto = InnovationExportRequestItemType;

@Injectable()
export class InnovationsService extends CoreService {

  constructor() { super(); }


  getInnovationsList(queryParams?: APIQueryParamsType<InnovationsListFiltersType>): Observable<InnovationsListDTO> {
  
    if (!queryParams) {
      queryParams = { take: 100, skip: 0, order: { name: 'ASC' }, filters: {} };
    }

    const requestUserType = this.stores.authentication.getUserType();
    const { filters, ...qParams } = queryParams;

    const qp = {
      ...qParams,
      ...(filters.name ? { name: filters.name } : {}),
      ...(filters.mainCategories ? { mainCategories: filters.mainCategories } : {}),
      ...(filters.locations ? { locations: filters.locations } : {}),
      ...(filters.status ? { status: filters.status } : {}),
      ...(filters.assessmentSupportStatus ? { assessmentSupportStatus: filters.assessmentSupportStatus } : {}),
      ...(filters.supportStatuses ? { supportStatuses: filters.supportStatuses } : {}),
      ...(filters.groupedStatuses ? { groupedStatuses: filters.groupedStatuses } : {}),
      ...(filters.engagingOrganisations ? { engagingOrganisations: filters.engagingOrganisations } : {}),
      ...(filters.assignedToMe !== undefined ? { assignedToMe: filters.assignedToMe } : {}),
      ...(filters.suggestedOnly != undefined ? { suggestedOnly: filters.suggestedOnly } : {}),
      ...(filters.latestWorkedByMe != undefined ? { latestWorkedByMe: filters.latestWorkedByMe } : {}),
      fields: [] as InnovationsListFiltersType['fields']
    };

    if(!filters.latestWorkedByMe) {
      switch (requestUserType) {
        case UserTypeEnum.INNOVATOR:
          qp.fields = ['statistics', 'assessment', 'supports'];
          break;
        case UserTypeEnum.ASSESSMENT:
          qp.fields = ['isAssessmentOverdue', 'assessment', 'supports'];
          break;
        case UserTypeEnum.ACCESSOR:
          qp.status = [InnovationStatusEnum.IN_PROGRESS];
          qp.fields = ['assessment', 'supports', 'notifications'];
          break;
        case UserTypeEnum.ADMIN:
          qp.fields = ['assessment', 'supports'];
          break;
        default:
          break;
      }
    }
  
    const url = new UrlModel(this.API_INNOVATIONS_URL).addPath('v1').setQueryParams(qp);
    return this.http.get<InnovationsListDTO>(url.buildUrl()).pipe(
      take(1),
      map(response => ({
        count: response.count,
        data: response.data.map(item => ({
          ...item,
          mainCategory: item.otherMainCategoryDescription || mainCategoryItems.find(i => i.value === item.mainCategory)?.label || '',
        }))
      }))

    );

  }

  getInnovationInfo(innovationId: string): Observable<InnovationInfoDTO> {

    const requestUserType = this.stores.authentication.getUserType();
    const qp: { fields: ('assessment' | 'supports')[] } = {
      fields: []
    };

    switch (requestUserType) {
      case UserTypeEnum.INNOVATOR:
        qp.fields = ['assessment', 'supports'];
        break;
      case UserTypeEnum.ASSESSMENT:
        qp.fields = ['assessment'];
        break;
      case UserTypeEnum.ACCESSOR:
        qp.fields = ['assessment', 'supports'];
        break;
      default:
        break;
    }

    const url = new UrlModel(this.API_INNOVATIONS_URL).addPath('v1/:innovationId').setPathParams({ innovationId }).setQueryParams(qp);
    return this.http.get<InnovationInfoDTO>(url.buildUrl()).pipe(take(1), map(response => response));

  }

  getInnovationSharesList(innovationId: string): Observable<{ organisation: { id: string, name: string, acronym: string; }; }[]> {

    const url = new UrlModel(this.API_INNOVATIONS_URL).addPath('v1/:innovationId/shares').setPathParams({ innovationId });
    return this.http.get<{ organisation: { id: string, name: string, acronym: string; }; }[]>(url.buildUrl()).pipe(take(1), map(response => response));

  }

  getInnovationSupportsList(innovationId: string, accessorsInfo: boolean): Observable<InnovationSupportsListDTO> {

    const url = new UrlModel(this.API_INNOVATIONS_URL).addPath('v1/:innovationId/supports').setPathParams({ innovationId });

    if (accessorsInfo) {
      url.setQueryParams({ fields: ['engagingAccessors'] });
    }

    return this.http.get<InnovationSupportsListDTO>(url.buildUrl()).pipe(take(1),
      map(response => response.map(item => ({
        id: item.id,
        status: item.status,
        organisation: {
          id: item.organisation.id, name: item.organisation.name, acronym: item.organisation.acronym,
          unit: item.organisation.unit
        },
        engagingAccessors: accessorsInfo ? item.engagingAccessors : []
      })))
    );

  }

  getInnovationSupportInfo(innovationId: string, supportId: string): Observable<InnovationSupportInfoDTO> {

    const url = new UrlModel(this.API_INNOVATIONS_URL).addPath('v1/:innovationId/supports/:supportId').setPathParams({ innovationId, supportId });
    return this.http.get<InnovationSupportInfoDTO>(url.buildUrl()).pipe(take(1), map(response => response));

  }

  getInnovationStatisticsInfo(innovationId: string, qParams: { statistics: InnovationStatisticsEnum[] }): Observable<InnovationStatisticsDTO> {

    const url = new UrlModel(this.API_INNOVATIONS_URL).addPath('v1/:innovationId/statistics').setPathParams({ innovationId }).setQueryParams(qParams);
    return this.http.get<InnovationStatisticsDTO>(url.buildUrl()).pipe(take(1), map(response => response));
  }

  // Needs Assessment
  getInnovationNeedsAssessment(innovationId: string, assessmentId: string): Observable<InnovationNeedsAssessmentInfoDTO> {

    const url = new UrlModel(this.API_INNOVATIONS_URL).addPath('v1/:innovationId/assessments/:assessmentId').setPathParams({ innovationId, assessmentId });
    return this.http.get<InnovationNeedsAssessmentInfoDTO>(url.buildUrl()).pipe(take(1), map(response => response));

  }


  // Actions methods.
  getActionsList(queryParams: APIQueryParamsType<InnovationsActionsListFilterType>): Observable<InnovationActionsListDTO> {

    const { filters, ...qParams } = queryParams;

    const qp = {
      ...qParams,
      ...(filters.innovationId ? { innovationId: filters.innovationId } : {}),
      ...(filters.innovationName ? { innovationName: filters.innovationName } : {}),
      ...(filters.sections ? { sections: filters.sections } : {}),
      ...(filters.status ? { status: filters.status } : {}),
      ...(filters.createdByMe ? { createdByMe: filters.createdByMe } : {}),
      ...(filters.fields ? { fields: filters.fields } : {})
    };

    const url = new UrlModel(this.API_INNOVATIONS_URL).addPath('v1/actions').setQueryParams(qp);
    return this.http.get<InnovationActionsListInDTO>(url.buildUrl()).pipe(take(1),
      map(response => ({
        count: response.count,
        data: response.data.map(item => ({ ...item, ...{ name: `Submit '${this.stores.innovation.getSectionTitle(item.section)}'`, } }))
      }))
    );

  }

  getActionInfo(innovationId: string, actionId: string): Observable<InnovationActionInfoDTO> {

    const url = new UrlModel(this.API_INNOVATIONS_URL).addPath('v1/:innovationId/actions/:actionId').setPathParams({ innovationId, actionId });
    return this.http.get<Omit<InnovationActionInfoDTO, 'name'>>(url.buildUrl()).pipe(take(1),
      map(response => ({
        id: response.id,
        displayId: response.displayId,
        status: response.status,
        name: `Submit '${this.stores.innovation.getSectionTitle(response.section).toLowerCase()}'`,
        description: response.description,
        section: response.section,
        createdAt: response.createdAt,
        createdBy: response.createdBy
      }))
    );

  }

  updateAction(innovationId: string, actionId: string, body: { status: InnovationActionStatusEnum, message?: string }): Observable<{ id: string }> {

    const url = new UrlModel(this.API_INNOVATIONS_URL).addPath('v1/:innovationId/actions/:actionId').setPathParams({ innovationId, actionId });
    return this.http.put<{ id: string }>(url.buildUrl(), body).pipe(
      take(1),
      map(response => response)
    );

  }


  // Threads and messages methods.
  getThreadsList(innovationId: string, queryParams: APIQueryParamsType<{}>): Observable<GetThreadsListDTO> {

    const { filters, ...qp } = queryParams;

    const url = new UrlModel(this.API_INNOVATIONS_URL).addPath('v1/:innovationId/threads').setPathParams({ innovationId }).setQueryParams(qp);
    return this.http.get<GetThreadsListDTO>(url.buildUrl()).pipe(take(1),
      map(response => ({
        count: response.count,
        threads: response.threads
      }))
    );

  }

  getThreadInfo(innovationId: string, threadId: string): Observable<GetThreadInfoDTO> {

    const url = new UrlModel(this.API_INNOVATIONS_URL).addPath('v1/:innovationId/threads/:threadId').setPathParams({ innovationId, threadId });
    return this.http.get<GetThreadInfoDTO>(url.buildUrl()).pipe(take(1),
      map(response => response)
    );

  }

  getThreadMessageInfo(innovationId: string, threadId: string, messageId: string): Observable<GetThreadMessageInfoDTO> {

    const url = new UrlModel(this.API_INNOVATIONS_URL).addPath('v1/:innovationId/threads/:threadId/messages/:messageId').setPathParams({ innovationId, threadId, messageId });

    return this.http.get<GetThreadMessageInfoDTO>(url.buildUrl()).pipe(take(1),
      map(response => response)
    );

  }

  getThreadMessagesList(innovationId: string, threadId: string, queryParams: APIQueryParamsType<{}>): Observable<GetThreadMessagesListOutDTO> {

    const { filters, ...qp } = queryParams;

    const url = new UrlModel(this.API_INNOVATIONS_URL).addPath('v1/:innovationId/threads/:threadId/messages').setPathParams({ innovationId, threadId }).setQueryParams(qp);
    return this.http.get<GetThreadMessagesListInDTO>(url.buildUrl()).pipe(take(1),
      map(response => ({
        count: response.count,
        messages: response.messages.map(message => ({
          ...message,
          createdBy: { ...message.createdBy, typeDescription: this.stores.authentication.getUserTypeDescription(message.createdBy.type) }
        }))
      }))
    );

  }

  createThread(innovationId: string, body: { subject: string, message: string; }): Observable<CreateThreadDTO> {

    const url = new UrlModel(this.API_INNOVATIONS_URL).addPath('v1/:innovationId/threads').setPathParams({ innovationId });
    return this.http.post<CreateThreadDTO>(url.buildUrl(), body).pipe(take(1), map(response => response));

  }

  createThreadMessage(innovationId: string, threadId: string, body: { message: string; }): Observable<CreateThreadMessageDTO> {

    const url = new UrlModel(this.API_INNOVATIONS_URL).addPath('v1/:innovationId/threads/:threadId/messages').setPathParams({ innovationId, threadId });
    return this.http.post<CreateThreadMessageDTO>(url.buildUrl(), body).pipe(take(1), map(response => response));

  }

  editThreadMessage(innovationId: string, threadId: string, messageId: string, body: { message: string; }): Observable<{ id: string; }> {

    const url = new UrlModel(this.API_INNOVATIONS_URL).addPath('v1/:innovationId/threads/:threadId/messages/:messageId').setPathParams({ innovationId, threadId, messageId });
    return this.http.put<{ id: string; }>(url.buildUrl(), body).pipe(take(1), map(response => response));

  }

  getInnovationActivityLog(
    innovationId: string,
    queryParams: APIQueryParamsType<{ activityTypes: ActivityLogTypesEnum[], startDate: string, endDate: string }>
  ): Observable<InnovationActivityLogListDTO> {

    const { filters, ...qParams } = queryParams;
    const qp = {
      ...qParams,
      ...(filters.activityTypes ? { activityTypes: filters.activityTypes } : {}),
      ...(filters.startDate ? { startDate: filters.startDate } : {}),
      ...(filters.endDate ? { endDate: filters.endDate } : {}),
    };

    const userUrlBasePath = this.stores.authentication.userUrlBasePath();
    const url = new UrlModel(this.API_INNOVATIONS_URL).addPath('v1/:innovationId/activities').setPathParams({ innovationId }).setQueryParams(qp);

    return this.http.get<InnovationActivityLogListInDTO>(url.buildUrl()).pipe(
      take(1),
      map(response => ({
        count: response.count,
        data: response.data.map(i => {

          let link: null | { label: string; url: string; } = null;

          switch (ACTIVITY_LOG_ITEMS[i.activity].link) {
            case 'NEEDS_ASSESSMENT':
              link = i.params.assessmentId ? { label: 'Go to Needs assessment', url: `/${userUrlBasePath}/innovations/${response.innovation.id}/assessments/${i.params.assessmentId}` } : null;
              break;
            case 'NEEDS_REASSESSMENT':
              link = i.params.assessment?.id ? { label: 'Go to Needs reassessment', url: `/${userUrlBasePath}/innovations/${response.innovation.id}/assessments/${i.params.assessment.id}` } : null;
              break;
            case 'SUPPORT_STATUS':
              link = { label: 'Go to Support status', url: `/${userUrlBasePath}/innovations/${response.innovation.id}/support` };
              break;
            case 'SECTION':
              link = i.params.sectionId ? { label: 'View section', url: `/${userUrlBasePath}/innovations/${response.innovation.id}/record/sections/${i.params.sectionId}` } : null;
              break;
            case 'THREAD':
              link = { label: 'View messages', url: `/${userUrlBasePath}/innovations/${response.innovation.id}/threads/${i.params.thread?.id}` };
              break;
            case 'ACTION':
              if (['innovator', 'accessor'].includes(userUrlBasePath) && i.params.actionId) { // Don't make sense for assessment users.
                link = { label: 'View action', url: `/${userUrlBasePath}/innovations/${response.innovation.id}/action-tracker/${i.params.actionId}` };
              }
              break;
          }

          return {
            date: i.date,
            type: i.type,
            activity: i.activity,
            innovation: response.innovation,
            params: {
              ...i.params,
              innovationName: response.innovation.name,
              sectionTitle: getSectionTitle(i.params.sectionId || null)
            },
            link
          };

        })
      }))
    );
  }

  getExportRequestsList(innovationId: string, queryParams: APIQueryParamsType<{ statuses?: InnovationExportRequestStatusEnum[]}>): Observable<GetExportRequestsListDTO> {

    const { filters, ...qParams } = queryParams;

    const qp = {
      ...qParams,
      ...({ statuses: filters?.statuses }),
    }

    const url = new UrlModel(this.API_INNOVATIONS_URL).addPath('v1/:innovationId/export-requests').setPathParams({ innovationId }).setQueryParams(qp);
    return this.http.get<GetExportRequestsListDTO>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );

  }

  getExportRequestInfo(innovationId: string, requestId: string): Observable<GetExportRequestInfoDto> {

    const url = new UrlModel(this.API_INNOVATIONS_URL).addPath('v1/:innovationId/export-requests/:requestId').setPathParams({ innovationId, requestId });
    return this.http.get<GetExportRequestInfoDto>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );

  }

  updateExportRequestStatus(innovationId: string, requestId: string, body: { status: keyof typeof InnovationExportRequestStatusEnum, rejectReason?: string }): Observable<{ id: string }> {

    const url = new UrlModel(this.API_INNOVATIONS_URL).addPath('v1/:innovationId/export-requests/:requestId/status').setPathParams({ innovationId, requestId });
    return this.http.patch<{ id: string }>(url.buildUrl(), body).pipe(take(1), map(response => response));

  }
}
