import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { finalize, map, take } from 'rxjs/operators';

import { CoreService } from '@app/base';
import { UrlModel } from '@app/base/models';
import { APIQueryParamsType, DateISOType } from '@app/base/types';

import { UserRoleEnum } from '@modules/stores/authentication/authentication.enums';

import { KeysUnion } from '@modules/core/helpers/types.helper';
import { APIListResponse, Paginated } from '@modules/core/models/api.model';
import {
  ActivityLogItemsEnum,
  ActivityLogTypesEnum,
  InnovationCollaboratorStatusEnum,
  InnovationExportRequestStatusEnum,
  InnovationStatusEnum,
  InnovationSupportStatusEnum,
  InnovationTaskStatusEnum
} from '@modules/stores';
import { ACTIVITY_LOG_ITEMS, InnovationSectionInfoDTO } from '@modules/stores/ctx/innovation/innovation.models';
import { FileUploadType } from '../forms/engine/config/form-engine.config';
import {
  CreateSupportSummaryProgressUpdateType,
  InnovationActionsListInDTO,
  InnovationActivityLogListDTO,
  InnovationActivityLogListInDTO,
  InnovationAssessmentListDTO,
  InnovationCollaboratorsListDTO,
  InnovationExportRequestInfoDTO,
  InnovationExportRequestsListDTO,
  InnovationInfoDTO,
  InnovationListFullDTO,
  InnovationListSelectType,
  InnovationNeedsAssessmentInfoDTO,
  InnovationRulesDTO,
  InnovationSearchFullDTO,
  InnovationSearchSelectType,
  InnovationSharesListDTO,
  InnovationSupportInfoDTO,
  InnovationSupportsListDTO,
  InnovationTaskInfoDTO,
  InnovationTasksListDTO,
  InnovationValidationRules,
  InnovationsListFiltersType,
  SupportSummaryOrganisationHistoryDTO,
  SupportSummaryOrganisationsListDTO,
  getInnovationCollaboratorInfoDTO
} from './innovations.dtos';
import { ReassessmentSendType } from '@modules/feature-modules/innovator/pages/innovation/needs-reassessment/needs-reassessment-send.config';
import { KeyProgressAreasPayloadType } from '@modules/theme/components/key-progress-areas-card/key-progress-areas-card.component';

export type InnovationsTasksListFilterType = {
  innovationId?: string;
  innovationName?: string;
  sections?: string[];
  status?: InnovationTaskStatusEnum[];
  innovationStatus?: InnovationStatusEnum[];
  createdByMe?: boolean;
  allTasks?: boolean;
  fields?: 'notifications'[];
};

export type GetThreadsListDTO = {
  count: number;
  data: {
    id: string;
    subject: string;
    createdBy: { id: string; displayTeam?: string };
    lastMessage: {
      id: string;
      createdAt: Date;
      createdBy: { id: string; displayTeam?: string };
    };
    messageCount: number;
    hasUnreadNotifications: boolean;
  }[];
};

export type GetThreadInfoDTO = {
  id: string;
  subject: string;
  context?: {
    id: string;
    type: 'TASK' | 'SUPPORT' | 'NEEDS_ASSESSMENT';
  };
  createdAt: DateISOType;
  createdBy: { id: string; name: string; type: UserRoleEnum };
};

export type GetThreadMessageInfoDTO = {
  id: string;
  message: string;
  createdAt: DateISOType;
};

export type GetThreadFollowersDTO = {
  followers: {
    id: string;
    name: string;
    isLocked: boolean;
    isOwner?: boolean;
    role: { id: string; role: UserRoleEnum };
    organisationUnit?: { id: string; name: string; acronym: string } | null;
  }[];
};

export type GetThreadMessagesListInDTO = {
  count: number;
  messages: {
    id: string;
    file: {
      id: string;
      name: string;
      url: string;
    };
    message: string;
    createdAt: DateISOType;
    createdBy: {
      id: string;
      name: string;
      role: UserRoleEnum;
      isOwner?: boolean;
      organisation?: { id: string; name: string; acronym: string };
      organisationUnit?: { id: string; name: string; acronym: string };
    };
    updatedAt: null | DateISOType;
    isNew: boolean;
    isEditable: boolean;
  }[];
};
export type GetThreadMessagesListOutDTO = {
  count: number;
  messages: (Omit<GetThreadMessagesListInDTO['messages'][0], 'createdBy'> & {
    createdBy: GetThreadMessagesListInDTO['messages'][0]['createdBy'] & { typeDescription: string };
  })[];
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

export enum InnovationRelevantOrganisationsStatusEnum {
  ENGAGING = 'ENGAGING',
  SUGGESTED = 'SUGGESTED',
  WAITING = 'WAITING',
  PREVIOUS_ENGAGED = 'PREVIOUS_ENGAGED'
}

export type ThreadAvailableRecipientsDTO = {
  id: string;
  status: InnovationRelevantOrganisationsStatusEnum;
  organisation: {
    id: string;
    name: string;
    acronym: string;
    unit: { id: string; name: string; acronym: string };
  };
  recipients: { id: string; roleId: string; name: string }[];
}[];

export type InnovationThreadListFiltersType = {
  subject?: string;
  following?: boolean;
};

export type UploadThreadDocumentType = {
  followerUserRoleIds: string[];
  subject: string;
  message: string;
  file?: {
    name: string;
    description?: string;
    file: Omit<FileUploadType, 'url'>;
  };
};

export type UploadThreadMessageDocumentType = {
  message: string;
  file?: {
    name: string;
    description?: string;
    file: Omit<FileUploadType, 'url'>;
  };
};

export type ChangeSupportStatusDocumentType = {
  status: Partial<InnovationSupportStatusEnum>;
  accessors: {
    id: string;
    userRoleId: string;
  }[];
  message: string;
  file?: {
    name: string;
    description?: string;
    file: Omit<FileUploadType, 'url'>;
  };
};

@Injectable()
export class InnovationsService extends CoreService {
  constructor() {
    super();
  }

  // Innovations.
  getInnovationsList<
    // filters
    F extends InnovationsListFiltersType,
    // selects
    // This can be improved but currently i'm not allowing selects on all related fields to automate this (see KeysUnion in the future for this and implement in the BE)
    S extends KeysUnion<InnovationListFullDTO> extends infer U
      ? U extends InnovationListSelectType
        ? U
        : never
      : never
  >(
    fields: S[] = ['id', 'name'] as S[],
    filters: F = {} as F,
    pagination: Paginated<S[]> = { take: 100, skip: 0 }
  ): Observable<APIListResponse<InnovationListFullDTO, S>> {
    const url = new UrlModel(this.API_INNOVATIONS_URL).addPath('v1').setQueryParams({
      fields,
      ...filters,
      ...pagination
    });
    return this.http.get<APIListResponse<InnovationListFullDTO, S>>(url.buildUrl()).pipe(take(1));
  }

  getInnovationsSearch<
    F extends InnovationsListFiltersType,
    S extends KeysUnion<InnovationSearchFullDTO> extends infer U
      ? U extends InnovationSearchSelectType
        ? U
        : never
      : never
  >(
    fields: S[] = ['id', 'name'] as S[],
    filters: F = {} as F,
    pagination: Paginated<S[]> = { take: 100, skip: 0 }
  ): Observable<APIListResponse<InnovationSearchFullDTO, S>> {
    const url = new UrlModel(this.API_INNOVATIONS_URL).addPath('v1/search').setQueryParams({
      fields,
      ...filters,
      ...pagination
    });
    return this.http.get<APIListResponse<InnovationSearchFullDTO, S>>(url.buildUrl()).pipe(take(1));
  }

  getInnovationInfo(innovationId: string): Observable<InnovationInfoDTO> {
    const requestUserType = this.stores.authentication.getUserType();
    const qp: { fields: ('assessment' | 'supports')[] } = { fields: [] };

    switch (requestUserType) {
      case UserRoleEnum.INNOVATOR:
        qp.fields = ['assessment', 'supports'];
        break;
      case UserRoleEnum.ASSESSMENT:
        qp.fields = ['assessment'];
        break;
      case UserRoleEnum.ACCESSOR:
      case UserRoleEnum.QUALIFYING_ACCESSOR:
        qp.fields = ['assessment', 'supports'];
        break;
      case UserRoleEnum.ADMIN:
        qp.fields = ['assessment', 'supports'];
        break;
      default:
        break;
    }

    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId')
      .setPathParams({ innovationId })
      .setQueryParams(qp);
    return this.http.get<InnovationInfoDTO>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );
  }

  getInnovationProgress(
    innovationId: string,
    filterInnovationId: boolean = false
  ): Observable<KeyProgressAreasPayloadType> {
    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId/progress')
      .setPathParams({ innovationId });
    return this.http.get<KeyProgressAreasPayloadType>(url.buildUrl()).pipe(
      take(1),
      map(response =>
        filterInnovationId
          ? Object.fromEntries(Object.entries(response).filter(([key, _]) => key !== 'innovationId'))
          : response
      )
    );
  }

  getInnovationSubmission(
    innovationId: string
  ): Observable<{ submittedAllSections: boolean; submittedForNeedsAssessment: boolean }> {
    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId/submissions')
      .setPathParams({ innovationId });
    return this.http.get<{ submittedAllSections: boolean; submittedForNeedsAssessment: boolean }>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );
  }

  getInnovationSharesList(innovationId: string): Observable<InnovationSharesListDTO> {
    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId/shares')
      .setPathParams({ innovationId });
    return this.http.get<InnovationSharesListDTO>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );
  }

  getInnovationRules(
    innovationId: string,
    operation: InnovationValidationRules,
    inputData: {
      [name: string]: string;
    }
  ): Observable<InnovationRulesDTO> {
    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId/validate')
      .setPathParams({ innovationId })
      .setQueryParams({
        operation,
        ...inputData
      });

    return this.http.get<InnovationRulesDTO>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );
  }

  // Innovation collaborators.
  getInnovationCollaboratorsList(
    innovationId: string,
    type: ('pending' | 'active' | 'history')[]
  ): Observable<InnovationCollaboratorsListDTO> {
    const qp: { take: number; skip: number; status: InnovationCollaboratorStatusEnum[] } = {
      take: 100,
      skip: 0,
      status: []
    };

    if (type.includes('pending')) {
      qp.status.push(InnovationCollaboratorStatusEnum.PENDING);
    }
    if (type.includes('active')) {
      qp.status.push(InnovationCollaboratorStatusEnum.ACTIVE);
    }
    if (type.includes('history')) {
      qp.status.push(
        InnovationCollaboratorStatusEnum.CANCELLED,
        InnovationCollaboratorStatusEnum.DECLINED,
        InnovationCollaboratorStatusEnum.EXPIRED,
        InnovationCollaboratorStatusEnum.LEFT,
        InnovationCollaboratorStatusEnum.REMOVED
      );
    }

    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId/collaborators')
      .setPathParams({ innovationId })
      .setQueryParams(qp);
    return this.http.get<InnovationCollaboratorsListDTO>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );
  }

  getInnovationCollaboratorInfo(
    innovationId: string,
    collaboratorId: string
  ): Observable<getInnovationCollaboratorInfoDTO> {
    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId/collaborators/:collaboratorId')
      .setPathParams({ innovationId, collaboratorId });
    return this.http.get<getInnovationCollaboratorInfoDTO>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );
  }

  createInnovationCollaborator(
    innovationId: string,
    body: { email: string; role: null | string }
  ): Observable<{ id: string }> {
    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId/collaborators')
      .setPathParams({ innovationId });
    return this.http.post<{ id: string }>(url.buildUrl(), body).pipe(
      take(1),
      map(response => response)
    );
  }

  updateInnovationCollaborator(
    innovationId: string,
    collaborationId: string,
    body: { status?: InnovationCollaboratorStatusEnum; role?: string }
  ): Observable<{ id: string }> {
    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId/collaborators/:collaborationId')
      .setPathParams({ innovationId, collaborationId });
    return this.http.patch<{ id: string }>(url.buildUrl(), body).pipe(
      take(1),
      map(response => response)
    );
  }

  // Innovation support.
  getInnovationSupportsList(innovationId: string, accessorsInfo: boolean): Observable<InnovationSupportsListDTO> {
    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId/supports')
      .setPathParams({ innovationId });

    if (accessorsInfo) {
      url.setQueryParams({ fields: ['engagingAccessors'] });
    }

    return this.http.get<InnovationSupportsListDTO>(url.buildUrl()).pipe(
      take(1),
      map(response =>
        response.map(item => ({
          id: item.id,
          status: item.status,
          organisation: {
            id: item.organisation.id,
            name: item.organisation.name,
            acronym: item.organisation.acronym,
            unit: item.organisation.unit
          },
          engagingAccessors: accessorsInfo ? item.engagingAccessors : []
        }))
      )
    );
  }

  getInnovationSupportInfo(innovationId: string, supportId: string): Observable<InnovationSupportInfoDTO> {
    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId/supports/:supportId')
      .setPathParams({ innovationId, supportId });
    return this.http.get<InnovationSupportInfoDTO>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );
  }

  // Support summary.
  getSupportSummaryOrganisationsList(innovationId: string): Observable<SupportSummaryOrganisationsListDTO> {
    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId/support-summary')
      .setPathParams({ innovationId });
    return this.http.get<SupportSummaryOrganisationsListDTO>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );
  }

  getSupportSummaryOrganisationHistory(
    innovationId: string,
    organisationUnitId: string
  ): Observable<SupportSummaryOrganisationHistoryDTO> {
    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId/support-summary/units/:organisationUnitId')
      .setPathParams({ innovationId, organisationUnitId });
    return this.http.get<SupportSummaryOrganisationHistoryDTO>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );
  }

  createSupportSummaryProgressUpdate(
    innovationId: string,
    data: CreateSupportSummaryProgressUpdateType
  ): Observable<{ id: string }> {
    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId/support-summary/progress-update')
      .setPathParams({ innovationId });
    return this.http.post<{ id: string }>(url.buildUrl(), data).pipe(
      take(1),
      map(response => response)
    );
  }
  deleteSupportSummaryProgressUpdate(innovationId: string, id: string): Observable<void> {
    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId/support-summary/progress-update/:id')
      .setPathParams({ innovationId, id });
    return this.http.delete<void>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );
  }

  // Needs Assessment.
  // TODO: Check if this could be totally replaced by the ctx.assessment.getOrLoad()
  getInnovationNeedsAssessment(
    innovationId: string,
    assessmentId: string
  ): Observable<InnovationNeedsAssessmentInfoDTO> {
    // Leverage the store if possible
    if (this.ctx.assessment.info()?.id === assessmentId) {
      return this.ctx.assessment.getOrLoad(innovationId, assessmentId);
    } else {
      const url = new UrlModel(this.API_INNOVATIONS_URL)
        .addPath('v1/:innovationId/assessments/:assessmentId')
        .setPathParams({ innovationId, assessmentId });
      return this.http.get<InnovationNeedsAssessmentInfoDTO>(url.buildUrl()).pipe(
        take(1),
        map(response => response)
      );
    }
  }

  // Tasks methods.
  getTasksList(queryParams: APIQueryParamsType<InnovationsTasksListFilterType>): Observable<InnovationTasksListDTO> {
    const { filters, ...qParams } = queryParams;

    const qp = {
      ...qParams,
      ...(filters.innovationId ? { innovationId: filters.innovationId } : {}),
      ...(filters.innovationName ? { innovationName: filters.innovationName } : {}),
      ...(filters.sections ? { sections: filters.sections } : {}),
      ...(filters.status ? { status: filters.status } : {}),
      ...(filters.innovationStatus ? { innovationStatus: filters.innovationStatus } : {}),
      ...(filters.createdByMe ? { createdByMe: filters.createdByMe } : {}),
      ...(filters.allTasks ? { allTasks: filters.allTasks } : {}),
      ...(filters.fields ? { fields: filters.fields } : {})
    };

    const url = new UrlModel(this.API_INNOVATIONS_URL).addPath('v1/tasks').setQueryParams(qp);
    return this.http.get<InnovationActionsListInDTO>(url.buildUrl()).pipe(
      take(1),
      map(response => ({
        count: response.count,
        data: response.data.map(item => {
          const sectionIdentification = this.ctx.schema.getIrSchemaSectionIdentificationV3(item.section);

          return {
            ...item,
            ...{
              name: sectionIdentification
                ? `Update ${sectionIdentification.group.number}.${sectionIdentification.section.number} '${sectionIdentification.section.title}'`
                : 'Section no longer available'
            }
          };
        })
      }))
    );
  }

  getTaskInfo(innovationId: string, taskId: string): Observable<InnovationTaskInfoDTO> {
    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId/tasks/:taskId')
      .setPathParams({ innovationId, taskId });
    return this.http.get<Omit<InnovationTaskInfoDTO, 'name'>>(url.buildUrl()).pipe(
      take(1),
      map(response => {
        const sectionIdentification = this.ctx.schema.getIrSchemaSectionIdentificationV3(response.section);

        return {
          id: response.id,
          displayId: response.displayId,
          status: response.status,
          descriptions: response.descriptions,
          section: response.section,
          name: sectionIdentification
            ? `Update'${sectionIdentification.section.title}'`
            : 'Section no longer available',
          createdAt: response.createdAt,
          updatedAt: response.updatedAt,
          updatedBy: response.updatedBy,
          createdBy: response.createdBy,
          sameOrganisation: response.sameOrganisation,
          threadId: response.threadId
        };
      })
    );
  }

  createAction(innovationId: string, body: { section: string; description: string }): Observable<{ id: string }> {
    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId/tasks')
      .setPathParams({ innovationId });
    return this.http.post<{ id: string }>(url.buildUrl(), body).pipe(
      take(1),
      map(response => response)
    );
  }

  updateTask(
    innovationId: string,
    taskId: string,
    body: { status: InnovationTaskStatusEnum; message?: string }
  ): Observable<{ id: string }> {
    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId/tasks/:taskId')
      .setPathParams({ innovationId, taskId });
    return this.http.put<{ id: string }>(url.buildUrl(), body).pipe(take(1));
  }

  // Threads and messages methods.
  getThreadsList(
    innovationId: string,
    queryParams: APIQueryParamsType<InnovationThreadListFiltersType>
  ): Observable<GetThreadsListDTO> {
    const { filters, ...qParams } = queryParams;
    const qp = {
      ...qParams,
      ...(filters.subject && { subject: filters.subject }),
      ...(filters.following && { following: filters.following })
    };

    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId/threads')
      .setPathParams({ innovationId })
      .setQueryParams(qp);
    return this.http.get<GetThreadsListDTO>(url.buildUrl()).pipe(take(1));
  }

  getThreadInfo(innovationId: string, threadId: string): Observable<GetThreadInfoDTO> {
    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId/threads/:threadId')
      .setPathParams({ innovationId, threadId });
    return this.http.get<GetThreadInfoDTO>(url.buildUrl()).pipe(take(1));
  }

  getThreadMessageInfo(innovationId: string, threadId: string, messageId: string): Observable<GetThreadMessageInfoDTO> {
    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId/threads/:threadId/messages/:messageId')
      .setPathParams({ innovationId, threadId, messageId });
    return this.http.get<GetThreadMessageInfoDTO>(url.buildUrl()).pipe(take(1));
  }

  getThreadFollowers(innovationId: string, threadId: string): Observable<GetThreadFollowersDTO> {
    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId/threads/:threadId/followers')
      .setPathParams({ innovationId, threadId });
    return this.http.get<GetThreadFollowersDTO>(url.buildUrl()).pipe(take(1));
  }

  addThreadFollowers(
    innovationId: string,
    threadId: string,
    body: { followerUserRoleIds: string[] }
  ): Observable<void> {
    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId/threads/:threadId/followers')
      .setPathParams({ innovationId, threadId });
    return this.http.patch<void>(url.buildUrl(), body).pipe(take(1));
  }

  deleteThreadFollower(innovationId: string, threadId: string, roleId: string): Observable<void> {
    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId/threads/:threadId/followers/:roleId')
      .setPathParams({ innovationId, threadId, roleId });
    return this.http.delete<void>(url.buildUrl()).pipe(take(1));
  }

  getThreadMessagesList(
    innovationId: string,
    threadId: string,
    queryParams: APIQueryParamsType<{}>
  ): Observable<GetThreadMessagesListOutDTO> {
    const { filters, ...qp } = queryParams;

    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId/threads/:threadId/messages')
      .setPathParams({ innovationId, threadId })
      .setQueryParams(qp);
    return this.http.get<GetThreadMessagesListInDTO>(url.buildUrl()).pipe(
      take(1),
      map(response => ({
        count: response.count,
        messages: response.messages.map(message => ({
          ...message,
          createdBy: {
            ...message.createdBy,
            typeDescription:
              message.createdBy.role === 'INNOVATOR'
                ? message.createdBy.isOwner
                  ? 'Owner'
                  : 'Collaborator'
                : this.stores.authentication.getRoleDescription(message.createdBy.role)
          }
        }))
      }))
    );
  }

  createThread(innovationId: string, body: UploadThreadDocumentType): Observable<{ id: string }> {
    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId/threads')
      .setPathParams({ innovationId });
    return this.http.post<{ id: string }>(url.buildUrl(), body).pipe(take(1));
  }

  getThreadAvailableRecipients(innovationId: string): Observable<ThreadAvailableRecipientsDTO> {
    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId/threads/available-recipients')
      .setPathParams({ innovationId });

    return this.http.get<ThreadAvailableRecipientsDTO>(url.buildUrl()).pipe(take(1));
  }

  createThreadMessage(
    innovationId: string,
    threadId: string,
    body: UploadThreadMessageDocumentType
  ): Observable<CreateThreadMessageDTO> {
    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId/threads/:threadId/messages')
      .setPathParams({ innovationId, threadId });
    return this.http.post<CreateThreadMessageDTO>(url.buildUrl(), body).pipe(take(1));
  }

  editThreadMessage(
    innovationId: string,
    threadId: string,
    messageId: string,
    body: { message: string }
  ): Observable<{ id: string }> {
    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId/threads/:threadId/messages/:messageId')
      .setPathParams({ innovationId, threadId, messageId });
    return this.http.put<{ id: string }>(url.buildUrl(), body).pipe(take(1));
  }

  getInnovationActivityLog(
    innovationId: string,
    queryParams: APIQueryParamsType<{
      activityTypes: ActivityLogTypesEnum[];
      dateFilters?: { key: 'createdAt'; startDate: null | DateISOType; endDate: null | DateISOType }[];
    }>
  ): Observable<InnovationActivityLogListDTO> {
    const { filters, ...qParams } = queryParams;
    const userUrlBasePath = this.stores.authentication.userUrlBasePath();
    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId/activities')
      .setPathParams({ innovationId })
      .setQueryParams({ ...filters, ...qParams });

    return this.http.get<InnovationActivityLogListInDTO>(url.buildUrl()).pipe(
      take(1),
      map(response => ({
        count: response.count,
        data: response.data.map(i => {
          let link: null | { label: string; url: string } = null;
          const sectionIdentification = i.params.sectionId
            ? this.ctx.schema.getIrSchemaSectionIdentificationV3(i.params.sectionId)
            : '';

          // Handle sections from previous innovation record versions
          if (!sectionIdentification) {
            switch (i.activity) {
              case ActivityLogItemsEnum.SECTION_DRAFT_UPDATE:
                i.activity = ActivityLogItemsEnum.SECTION_DRAFT_UPDATE_DEPRECATED;
                break;
              case ActivityLogItemsEnum.SECTION_SUBMISSION:
                i.activity = ActivityLogItemsEnum.SECTION_SUBMISSION_DEPRECATED;
                break;
              case ActivityLogItemsEnum.TASK_CREATION:
                i.activity = ActivityLogItemsEnum.TASK_CREATION_DEPRECATED;
                break;
            }
          }

          switch (ACTIVITY_LOG_ITEMS[i.activity].link) {
            case 'NEEDS_ASSESSMENT':
              link = i.params.assessmentId
                ? {
                    label: 'Go to Needs assessment',
                    url: `/${userUrlBasePath}/innovations/${response.innovation.id}/assessments/${i.params.assessmentId}`
                  }
                : null;
              break;
            case 'NEEDS_REASSESSMENT':
              link = i.params.assessment?.id
                ? {
                    label: 'Go to Needs reassessment',
                    url: `/${userUrlBasePath}/innovations/${response.innovation.id}/assessments/${i.params.assessment.id}`
                  }
                : null;
              break;
            case 'SUPPORT_STATUS':
              link = {
                label: 'Go to Support status',
                url: `/${userUrlBasePath}/innovations/${response.innovation.id}/support`
              };
              break;
            case 'SECTION':
              link =
                i.params.sectionId && sectionIdentification
                  ? {
                      label: 'View section',
                      url: `/${userUrlBasePath}/innovations/${response.innovation.id}/record/sections/${i.params.sectionId}`
                    }
                  : null;
              break;
            case 'THREAD':
              link = {
                label: 'View messages',
                url: `/${userUrlBasePath}/innovations/${response.innovation.id}/threads/${i.params.thread?.id}`
              };
              break;
            case 'TASK':
              if (
                ['innovator', 'accessor', 'assessment'].includes(userUrlBasePath) &&
                sectionIdentification &&
                i.params.taskId
              ) {
                link = {
                  label: 'View task',
                  url: `/${userUrlBasePath}/innovations/${response.innovation.id}/tasks/${i.params.taskId}`
                };
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
              sectionTitle: sectionIdentification ? `${sectionIdentification.section.title}` : '',
              actionUserRole: i.params.actionUserRole
                ? `(${this.stores.authentication.getRoleDescription(i.params.actionUserRole)})`
                : ''
            },
            link
          };
        })
      }))
    );
  }

  // Export requests.
  getExportRequestsList(
    innovationId: string,
    queryParams: APIQueryParamsType<{ statuses?: InnovationExportRequestStatusEnum[] }>
  ): Observable<InnovationExportRequestsListDTO> {
    const { filters, ...qParams } = queryParams;

    const qp = {
      ...qParams,
      ...{ statuses: filters?.statuses }
    };

    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId/export-requests')
      .setPathParams({ innovationId })
      .setQueryParams(qp);
    return this.http.get<InnovationExportRequestsListDTO>(url.buildUrl()).pipe(take(1));
  }

  getExportRequestInfo(innovationId: string, requestId: string): Observable<InnovationExportRequestInfoDTO> {
    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId/export-requests/:requestId')
      .setPathParams({ innovationId, requestId });
    return this.http.get<InnovationExportRequestInfoDTO>(url.buildUrl()).pipe(take(1));
  }

  createExportRequest(innovationId: string, body: { requestReason: string }) {
    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId/export-requests')
      .setPathParams({ innovationId });
    return this.http.post<{ id: string }>(url.buildUrl(), body).pipe(take(1));
  }

  updateExportRequestStatus(
    innovationId: string,
    requestId: string,
    body: { status: keyof typeof InnovationExportRequestStatusEnum; rejectReason?: string }
  ): Observable<void> {
    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId/export-requests/:requestId')
      .setPathParams({ innovationId, requestId });
    return this.http.patch<void>(url.buildUrl(), body).pipe(take(1));
  }

  // Sections
  getSectionInfo(
    innovationId: string,
    sectionId: string,
    filters: { fields?: 'tasks'[] }
  ): Observable<InnovationSectionInfoDTO> {
    const qp = {
      ...(filters.fields ? { fields: filters.fields } : {})
    };

    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId/sections/:sectionId')
      .setPathParams({ innovationId, sectionId })
      .setQueryParams(qp);
    return this.http.get<InnovationSectionInfoDTO>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );
  }

  getInnovationAvailableSupportStatuses(
    innovationId: string
  ): Observable<{ availableStatus: InnovationSupportStatusEnum[] }> {
    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId/supports/available-status')
      .setPathParams({ innovationId });
    return this.http.get<{ availableStatus: InnovationSupportStatusEnum[] }>(url.buildUrl()).pipe(take(1));
  }

  createNeedsReassessment(innovationId: string, body: ReassessmentSendType): Observable<{ id: string }> {
    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId/reassessments')
      .setPathParams({ innovationId });
    return this.http.post<{ id: string }>(url.buildUrl(), body).pipe(
      take(1),
      finalize(() => this.ctx.innovation.clear())
    );
  }

  getInnovationAssessmentsList(innovationId: string): Observable<InnovationAssessmentListDTO[]> {
    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId/assessments')
      .setPathParams({ innovationId });
    return this.http.get<InnovationAssessmentListDTO[]>(url.buildUrl()).pipe(take(1));
  }
}
