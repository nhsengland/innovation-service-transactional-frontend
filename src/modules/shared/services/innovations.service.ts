import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { CoreService } from '@app/base';

import { UrlModel } from '@app/base/models';
import { APIQueryParamsType, DateISOType } from '@app/base/types';

import { UserTypeEnum } from '@modules/stores/authentication/authentication.enums';


export type GetThreadsListDTO = {
  count: number;
  threads: {
    id: string;
    subject: string;
    repliesNumber: number;
    createdAt: DateISOType;
    createdBy: { id: string, name: string, type: UserTypeEnum }
    isNew: boolean;
    lastMessage: {
      id: string;
      createdAt: DateISOType;
      createdBy: {
        id: string;
        name: string;
        type: UserTypeEnum;
        organisation?: { id: string, name: string, acronym: string };
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

  getInnovationsList(): Observable<{ id: string, name: string }[]> {

    const url = new UrlModel(this.API_URL).addPath('innovators/:userId/innovations').setPathParams({ userId: this.stores.authentication.getUserId() });
    return this.http.get<{ id: string, name: string }[]>(url.buildUrl()).pipe(take(1), map(response => response));

  }


  // Threads and messages methods.
  getThreadsList(innovationId: string, queryParams: APIQueryParamsType<{}>): Observable<GetThreadsListDTO> {

    // return of({
    //   count: 50,
    //   threads: [
    //     {
    //       id: 'T01', subject: 'Some title 01', repliesNumber: 5,
    //       createdAt: '2020-01-01T00:00:00.000Z', createdBy: { id: 'U01', name: 'User 01', type: UserTypeEnum.INNOVATOR },
    //       isNew: true,
    //       lastMessage: {
    //         id: 'LastMessageId',
    //         createdAt: '2020-01-01T00:00:00.000Z',
    //         createdBy: {
    //           id: '',
    //           name: 'LM01',
    //           type: UserTypeEnum.ASSESSMENT
    //         }
    //       }
    //     },
    //     {
    //       id: 'T02', subject: 'Some title 02', repliesNumber: 10,
    //       createdAt: '2020-01-01T00:00:00.000Z', createdBy: { id: 'U01', name: 'User 02', type: UserTypeEnum.INNOVATOR },
    //       isNew: false,
    //       lastMessage: {
    //         id: 'LastMessageId',
    //         createdAt: '2020-01-01T00:00:00.000Z',
    //         createdBy: {
    //           id: '',
    //           name: 'LM02',
    //           type: UserTypeEnum.ACCESSOR,
    //           organisation: { id: 'sadf', name: 'OrgName', acronym: 'aA' },
    //           organisationUnit: { id: 'sdf', name: 'Unit Name', acronym: 'dsa' }
    //         }
    //       }
    //     }
    //   ]
    // });

    const { filters, ...qp } = queryParams;

    const url = new UrlModel(this.API_URL).addPath(':module/:userId/innovations/:innovationId/threads')
      .setPathParams({
        module: this.apiUserBasePath(),
        userId: this.stores.authentication.getUserId(),
        innovationId
      }).setQueryParams(qp);

    return this.http.get<GetThreadsListDTO>(url.buildUrl()).pipe(take(1),
      map(response => ({
        count: response.count,
        threads: response.threads
      }))
    );

  }

  getThreadInfo(innovationId: string, threadId: string): Observable<GetThreadInfoDTO> {

    // return of({
    //   id: 'T01', subject: 'Some title 01',
    //   createdAt: '2020-01-01T00:00:00.000Z', createdBy: { id: '', name: 'LM01', type: UserTypeEnum.ASSESSMENT }
    // });

    const url = new UrlModel(this.API_URL).addPath(':module/:userId/innovations/:innovationId/threads/:threadId')
      .setPathParams({
        module: this.apiUserBasePath(),
        userId: this.stores.authentication.getUserId(),
        innovationId,
        threadId
      });

    return this.http.get<GetThreadInfoDTO>(url.buildUrl()).pipe(take(1),
      map(response => response)
    );

  }

  getThreadMessageInfo(innovationId: string, threadId: string, messageId: string): Observable<GetThreadMessageInfoDTO> {

    // return of({
    //   id: 'T01', message: 'Some message 01',
    //   createdAt: '2020-01-01T00:00:00.000Z'
    // });

    const url = new UrlModel(this.API_URL).addPath(':module/:userId/innovations/:innovationId/threads/:threadId/messages/:messageId')
      .setPathParams({
        module: this.apiUserBasePath(),
        userId: this.stores.authentication.getUserId(),
        innovationId,
        threadId,
        messageId
      });

    return this.http.get<GetThreadMessageInfoDTO>(url.buildUrl()).pipe(take(1),
      map(response => response)
    );

  }

  getThreadMessagesList(innovationId: string, threadId: string, queryParams: APIQueryParamsType<{}>): Observable<GetThreadMessagesListOutDTO> {

    // return of({
    //   count: 5,
    //   messages: [
    //     {
    //       id: 'M01', message: 'Some title 01',
    //       createdAt: '2020-01-01T00:00:00.000Z',
    //       createdBy: {
    //         id: '5FDE0B71-BD0D-4C88-98E6-51399BB7B4AD',
    //         name: 'LM01',
    //         type: UserTypeEnum.INNOVATOR,
    //         typeDescription: 'Needs assessment',
    //       },
    //       updatedAt: null,
    //       isNew: true,
    //       isEditable: true
    //     },
    //     {
    //       id: 'M02', message: 'Some title 02',
    //       createdAt: '2020-01-01T00:00:00.000Z',
    //       createdBy: {
    //         id: '',
    //         name: 'LM02',
    //         type: UserTypeEnum.ACCESSOR,
    //         typeDescription: 'Support assessment',
    //         organisation: { id: 'sadf', name: 'OrgName', acronym: 'aA' },
    //         organisationUnit: { id: 'sdf', name: 'Unit Name', acronym: 'dsa' }
    //       },
    //       updatedAt: '2020-01-02T00:00:00.000Z',
    //       isNew: false,
    //       isEditable: false,
    //     }
    //   ]
    // });

    const { filters, ...qp } = queryParams;

    const url = new UrlModel(this.API_URL).addPath(':module/:userId/innovations/:innovationId/threads/:threadId/messages')
      .setPathParams({
        module: this.apiUserBasePath(),
        userId: this.stores.authentication.getUserId(),
        innovationId,
        threadId
      }).setQueryParams(qp);

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

    // return of({ id: 'sfsdfa' });
    // return throwError('error');

    const url = new UrlModel(this.API_URL).addPath(':module/:userId/innovations/:innovationId/threads')
      .setPathParams({
        module: this.apiUserBasePath(),
        userId: this.stores.authentication.getUserId(),
        innovationId
      });

    return this.http.post<{ id: string }>(url.buildUrl(), body).pipe(take(1), map(response => response));

  }

  createThreadMessage(innovationId: string, threadId: string, body: { message: string }): Observable<{ id: string }> {

    // return of({ id: 'sfsdfa' });
    // return throwError('error');

    const url = new UrlModel(this.API_URL).addPath(':module/:userId/innovations/:innovationId/threads/:threadId')
      .setPathParams({
        module: this.apiUserBasePath(),
        userId: this.stores.authentication.getUserId(),
        innovationId,
        threadId
      });

    return this.http.post<{ id: string }>(url.buildUrl(), body).pipe(take(1), map(response => response));

  }

  editThreadMessage(innovationId: string, threadId: string, messageId: string, body: { message: string }): Observable<{ id: string }> {

    // return of({ id: 'sfsdfa' });
    // return throwError('error');

    const url = new UrlModel(this.API_URL).addPath(':module/:userId/innovations/:innovationId/threads/:threadId/messages/:messageId')
      .setPathParams({
        module: this.apiUserBasePath(),
        userId: this.stores.authentication.getUserId(),
        innovationId,
        threadId,
        messageId
      });

    return this.http.put<{ id: string }>(url.buildUrl(), body).pipe(take(1), map(response => response));

  }

}
