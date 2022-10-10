import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { CoreService } from '@app/base';

import { UrlModel } from '@app/base/models';
import { APIQueryParamsType, DateISOType } from '@app/base/types';

import { UserTypeEnum } from '@modules/stores/authentication/authentication.enums';
import { InnovationSectionEnum, InnovationStatusEnum } from '@modules/stores/innovation/innovation.enums';
import { INNOVATION_SECTION_ACTION_STATUS } from '@modules/stores/innovation/innovation.models';


export type getInnovationInfoEndpointDTO = {
  id: string;
  name: string;
  status: InnovationStatusEnum;
  description: string;
  countryName: string;
  postcode: string;
  submittedAt?: string;
  assessment?: {
    id: string;
  };
  actions: {
    requestedCount: number;
    inReviewCount: number;
  },
  notifications: { [key: string]: number }
};


export type getInnovationActionInfoInDTO = {
  id: string;
  displayId: string;
  status: keyof typeof INNOVATION_SECTION_ACTION_STATUS;
  description: string;
  section: InnovationSectionEnum;
  createdAt: string; // '2021-04-16T09:23:49.396Z',
  createdBy: { id: string; name: string; };
};
export type getInnovationActionInfoOutDTO = Omit<getInnovationActionInfoInDTO, 'createdBy'> & { name: string, createdBy: string };

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
        organisationUnit?: { id: string, name: string, acronym: string };
      }
    }
  }[];
};

export type GetThreadInfoDTO = {
  id: string;
  subject: string;
  createdAt: DateISOType;
  createdBy: { id: string, name: string, type: UserTypeEnum }
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
      organisation?: { id: string, name: string, acronym: string };
      organisationUnit?: { id: string, name: string, acronym: string };
    };
    updatedAt: null | DateISOType;
    isNew: boolean;
    isEditable: boolean;
  }[];
};
export type GetThreadMessagesListOutDTO = {
  count: number;
  messages: (
    Omit<GetThreadMessagesListInDTO['messages'][0], 'createdBy'> & {
      createdBy: GetThreadMessagesListInDTO['messages'][0]['createdBy'] & { typeDescription: string }
    })[];
};


@Injectable()
export class InnovationsService extends CoreService {

  constructor() { super(); }

  getInnovationsList(): Observable<{ id: string, name: string, description: string }[]> {

    const url = new UrlModel(this.API_URL).addPath('innovators/:userId/innovations').setPathParams({ userId: this.stores.authentication.getUserId() });
    return this.http.get<{ id: string, name: string, description: string }[]>(url.buildUrl()).pipe(take(1), map(response => response));

  }

  getInnovatorInnovationInfo(innovationId: string): Observable<getInnovationInfoEndpointDTO> {

    const url = new UrlModel(this.API_URL).addPath('innovators/:userId/innovations/:innovationId').setPathParams({ userId: this.stores.authentication.getUserId(), innovationId });
    return this.http.get<getInnovationInfoEndpointDTO>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );

  }

  getInnovatorInnovationActionInfo(innovationId: string, actionId: string): Observable<getInnovationActionInfoOutDTO> {

    const url = new UrlModel(this.API_URL).addPath('innovators/:userId/innovations/:innovationId/actions/:actionId').setPathParams({ userId: this.stores.authentication.getUserId(), innovationId, actionId });
    return this.http.get<getInnovationActionInfoInDTO>(url.buildUrl()).pipe(
      take(1),
      map(response => ({
        id: response.id,
        displayId: response.displayId,
        status: response.status,
        name: `Submit '${this.stores.innovation.getSectionTitle(response.section).toLowerCase()}'`,
        description: response.description,
        section: response.section,
        createdAt: response.createdAt,
        createdBy: response.createdBy.name
      }))
    );

  }


  // Threads and messages methods.
  getThreadsList(innovationId: string, queryParams: APIQueryParamsType<{}>): Observable<GetThreadsListDTO> {

    const { filters, ...qp } = queryParams;

    const url = new UrlModel(this.API_URL).addPath('innovations/:innovationId/threads').setPathParams({ innovationId }).setQueryParams(qp);
    return this.http.get<GetThreadsListDTO>(url.buildUrl()).pipe(take(1),
      map(response => ({
        count: response.count,
        threads: response.threads
      }))
    );

  }

  getThreadInfo(innovationId: string, threadId: string): Observable<GetThreadInfoDTO> {

    const url = new UrlModel(this.API_URL).addPath('innovations/:innovationId/threads/:threadId').setPathParams({ innovationId, threadId });
    return this.http.get<GetThreadInfoDTO>(url.buildUrl()).pipe(take(1),
      map(response => response)
    );

  }

  getThreadMessageInfo(innovationId: string, threadId: string, messageId: string): Observable<GetThreadMessageInfoDTO> {

    const url = new UrlModel(this.API_URL).addPath('innovations/:innovationId/threads/:threadId/messages/:messageId').setPathParams({ innovationId, threadId, messageId });

    return this.http.get<GetThreadMessageInfoDTO>(url.buildUrl()).pipe(take(1),
      map(response => response)
    );

  }

  getThreadMessagesList(innovationId: string, threadId: string, queryParams: APIQueryParamsType<{}>): Observable<GetThreadMessagesListOutDTO> {

    const { filters, ...qp } = queryParams;

    const url = new UrlModel(this.API_URL).addPath('innovations/:innovationId/threads/:threadId/messages').setPathParams({ innovationId, threadId }).setQueryParams(qp);
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

  createThread(innovationId: string, body: { subject: string, message: string }): Observable<{ id: string }> {

    const url = new UrlModel(this.API_URL).addPath('innovations/:innovationId/threads').setPathParams({ innovationId });
    return this.http.post<{ id: string }>(url.buildUrl(), body).pipe(take(1), map(response => response));

  }

  createThreadMessage(innovationId: string, threadId: string, body: { message: string }): Observable<{ id: string }> {

    const url = new UrlModel(this.API_URL).addPath('innovations/:innovationId/threads/:threadId/messages').setPathParams({ innovationId, threadId });
    return this.http.post<{ id: string }>(url.buildUrl(), body).pipe(take(1), map(response => response));

  }

  editThreadMessage(innovationId: string, threadId: string, messageId: string, body: { message: string }): Observable<{ id: string }> {

    const url = new UrlModel(this.API_URL).addPath('innovations/:innovationId/threads/:threadId/messages/:messageId').setPathParams({ innovationId, threadId, messageId });
    return this.http.put<{ id: string }>(url.buildUrl(), body).pipe(take(1), map(response => response));

  }

}
