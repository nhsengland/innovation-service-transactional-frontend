import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { finalize, map, take } from 'rxjs/operators';

import { CoreService } from '@app/base';
import { UrlModel } from '@app/base/models';

import { InnovationSupportStatusEnum } from '@modules/stores';
import { DateISOType } from '@app/base/types';
import { UserRoleEnum } from '@app/base/enums';

// Notify me
export enum NotificationEnum {
  SUPPORT_UPDATED = 'SUPPORT_UPDATED',
  PROGRESS_UPDATE_CREATED = 'PROGRESS_UPDATE_CREATED',
  INNOVATION_RECORD_UPDATED = 'INNOVATION_RECORD_UPDATED',
  DOCUMENT_UPLOADED = 'DOCUMENT_UPLOADED',
  REMINDER = 'REMINDER',
  SUGGESTED_SUPPORT_UPDATED = 'SUGGESTED_SUPPORT_UPDATED'
}

export type EventType = keyof typeof NotificationEnum;

export type SupportUpdated = {
  eventType: NotificationEnum.SUPPORT_UPDATED;
  subscriptionType: 'INSTANTLY' | 'ONCE';
  preConditions: {
    units: string[];
    status: InnovationSupportStatusEnum[];
  };
  notificationType?: NotificationEnum.SUPPORT_UPDATED | NotificationEnum.SUGGESTED_SUPPORT_UPDATED;
};

export type ProgressUpdateCreated = {
  eventType: NotificationEnum.PROGRESS_UPDATE_CREATED;
  subscriptionType: 'INSTANTLY';
  preConditions: {
    units: string[];
  };
};

export type InnovationRecordUpdated = {
  eventType: NotificationEnum.INNOVATION_RECORD_UPDATED;
  subscriptionType: 'INSTANTLY';
  preConditions: {
    sections?: string[];
  };
};

export type DocumentUploaded = {
  eventType: NotificationEnum.DOCUMENT_UPLOADED;
  subscriptionType: 'INSTANTLY';
};

export type Reminder = {
  eventType: NotificationEnum.REMINDER;
  subscriptionType: 'SCHEDULED';
  date: DateISOType;
  customMessage: string;
};

export type NotifyMeConfig =
  | SupportUpdated
  | ProgressUpdateCreated
  | InnovationRecordUpdated
  | DocumentUploaded
  | Reminder;

export type SubscriptionConfigType<T extends EventType> = NotifyMeConfig & { eventType: T };
type PreconditionsOptions<T extends EventType> = 'preConditions' extends keyof (NotifyMeConfig & {
  eventType: T;
})
  ? keyof SubscriptionConfigType<T>['preConditions']
  : never;
export type DefaultOptions<T extends EventType> =
  | PreconditionsOptions<T>
  | keyof Omit<SubscriptionConfigType<T>, 'id' | 'eventType' | 'subscriptionType' | 'preConditions'>;

export type SubscriptionType = SubscriptionTypes['subscriptionType'];
export type SubscriptionTypes = InstantSubscriptionType | ScheduledSubscriptionType; // | PeriodicSubscriptionType;
export type InstantSubscriptionType = { subscriptionType: 'INSTANTLY' };
export type ScheduledSubscriptionType = {
  subscriptionType: 'SCHEDULED';
  date: DateISOType;
  customMessages?: { inApp?: string; email?: string };
};

export type OrganisationWithUnits = {
  id: string;
  name: string;
  acronym: string;
  units: {
    id: string;
    name: string;
    acronym: string;
    isShadow: boolean;
  }[];
};

export type SupportUpdatedResponseDTO = {
  id: string;
  updatedAt: DateISOType;
  eventType: NotificationEnum.SUPPORT_UPDATED;
  subscriptionType: 'INSTANTLY' | 'ONCE';
  organisations: OrganisationWithUnits[];
  status: InnovationSupportStatusEnum[];
  notificationType?: NotificationEnum.SUPPORT_UPDATED | NotificationEnum.SUGGESTED_SUPPORT_UPDATED;
};

export type ProgressUpdateCreatedResponseDTO = {
  id: string;
  updatedAt: DateISOType;
  eventType: NotificationEnum.PROGRESS_UPDATE_CREATED;
  subscriptionType: 'INSTANTLY';
  organisations: OrganisationWithUnits[];
};

export type InnovationRecordUpdatedDTO = {
  id: string;
  updatedAt: DateISOType;
  eventType: NotificationEnum.INNOVATION_RECORD_UPDATED;
  subscriptionType: 'INSTANTLY';
  sections?: string[];
};

export type DefaultResponseDTO<T extends EventType, K extends DefaultOptions<T>> = {
  id: string;
  updatedAt: DateISOType;
  eventType: T;
  subscriptionType: SubscriptionType;
} & {
  [k in K]: 'preConditions' extends keyof (NotifyMeConfig & { eventType: T })
    ? k extends keyof SubscriptionConfigType<T>['preConditions']
      ? SubscriptionConfigType<T>['preConditions'][k]
      : k extends keyof SubscriptionConfigType<T>
        ? SubscriptionConfigType<T>[k]
        : never
    : k extends keyof SubscriptionConfigType<T>
      ? SubscriptionConfigType<T>[k]
      : never;
};

export type NotifyMeResponseTypes = {
  SUPPORT_UPDATED: SupportUpdatedResponseDTO;
  PROGRESS_UPDATE_CREATED: ProgressUpdateCreatedResponseDTO;
  INNOVATION_RECORD_UPDATED: DefaultResponseDTO<NotificationEnum.INNOVATION_RECORD_UPDATED, 'sections'>;
  DOCUMENT_UPLOADED: DefaultResponseDTO<NotificationEnum.DOCUMENT_UPLOADED, never>;
  REMINDER: DefaultResponseDTO<NotificationEnum.REMINDER, 'customMessage' | 'date'>;
};

export type GetNotifyMeInnovationSubscription = NotifyMeResponseTypes[keyof NotifyMeResponseTypes];

export type GetNotifyMeInnovationsWithSubscriptions = {
  innovationId: string;
  name: string;
  count: number;
  subscriptions?: GetNotifyMeInnovationSubscription[];
};

export type GetUnitAccessorList = {
  count: number;
  data: {
    accessor: { name: string; role: UserRoleEnum };
    innovations: { id: string; name: string }[];
  }[];
};

@Injectable()
export class AccessorService extends CoreService {
  constructor() {
    super();
  }

  saveSupportStatus(
    innovationId: string,
    body: { status: InnovationSupportStatusEnum; message: string; accessors?: { id: string; userRoleId: string }[] },
    supportId?: string
  ): Observable<{ id: string }> {
    // If NOT enganging or waiting, the endpoint won't accept an accessors key.
    if (![InnovationSupportStatusEnum.ENGAGING, InnovationSupportStatusEnum.WAITING].includes(body.status)) {
      delete body.accessors;
    }

    if (!supportId) {
      const url = new UrlModel(this.API_INNOVATIONS_URL)
        .addPath('v1/:innovationId/supports')
        .setPathParams({ innovationId });
      return this.http.post<{ id: string }>(url.buildUrl(), body).pipe(
        take(1),
        finalize(() => this.ctx.innovation.clear())
      );
    } else {
      const url = new UrlModel(this.API_INNOVATIONS_URL)
        .addPath('v1/:innovationId/supports/:supportId')
        .setPathParams({ innovationId, supportId });
      return this.http.put<{ id: string }>(url.buildUrl(), body).pipe(
        take(1),
        finalize(() => this.ctx.innovation.clear())
      );
    }
  }

  suggestNewOrganisations(
    innovationId: string,
    body: { organisationUnits: string[]; description: string }
  ): Observable<{ id: string }> {
    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId/suggestions')
      .setPathParams({ innovationId });
    return this.http.post<{ id: string }>(url.buildUrl(), body).pipe(
      take(1),
      map(response => response)
    );
  }

  requestSupportStatusChange(
    innovationId: string,
    supportId: string,
    body: { status: InnovationSupportStatusEnum; message: string }
  ): Observable<{ success: boolean }> {
    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId/supports/:supportId/change-request')
      .setPathParams({ innovationId, supportId });
    return this.http.post<{ success: boolean }>(url.buildUrl(), body).pipe(
      take(1),
      map(response => response)
    );
  }

  changeAccessors(
    innovationId: string,
    supportId: string,
    body: { message?: string; accessors: { id: string; userRoleId: string }[] }
  ): Observable<{ id: string }> {
    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId/supports/:supportId/accessors')
      .setPathParams({ innovationId, supportId });
    return this.http.put<{ id: string }>(url.buildUrl(), body).pipe(
      take(1),
      map(response => response)
    );
  }

  createNotifyMeSubscription(innovationId: string, config: NotifyMeConfig): Observable<{ id: string }> {
    const url = new UrlModel(this.API_USERS_URL).addPath('v1/notify-me');
    return this.http.post<{ id: string }>(url.buildUrl(), { innovationId, config }).pipe(take(1));
  }

  getNotifyMeSubscription(subscriptionId: string): Observable<GetNotifyMeInnovationSubscription> {
    const url = new UrlModel(this.API_USERS_URL)
      .addPath('v1/notify-me/:subscriptionId')
      .setPathParams({ subscriptionId });
    return this.http.get<GetNotifyMeInnovationSubscription>(url.buildUrl()).pipe(take(1));
  }

  updateNotifyMeSubscription(subscriptionId: string, body: NotifyMeConfig): Observable<{ id: string }> {
    const url = new UrlModel(this.API_USERS_URL)
      .addPath('v1/notify-me/:subscriptionId')
      .setPathParams({ subscriptionId });
    return this.http.put<{ id: string }>(url.buildUrl(), body).pipe(take(1));
  }

  deleteNotifyMeSubscription(queryParams?: { ids?: string[] }): Observable<void> {
    const qp = {
      ...(queryParams?.ids ? { ids: queryParams.ids } : {})
    };
    const url = new UrlModel(this.API_USERS_URL).addPath('v1/notify-me').setQueryParams(qp);
    return this.http.delete<void>(url.buildUrl()).pipe(take(1));
  }

  getNotifyMeInnovationSubscriptionsList(innovationId: string): Observable<GetNotifyMeInnovationSubscription[]> {
    const url = new UrlModel(this.API_USERS_URL)
      .addPath('v1/notify-me/innovation/:innovationId')
      .setPathParams({ innovationId });
    return this.http.get<GetNotifyMeInnovationSubscription[]>(url.buildUrl()).pipe(take(1));
  }

  getNotifyMeInnovationsWithSubscriptionsList(queryParams?: {
    withDetails?: boolean;
  }): Observable<GetNotifyMeInnovationsWithSubscriptions[]> {
    const qp = {
      ...(queryParams?.withDetails ? { withDetails: queryParams.withDetails } : {})
    };
    const url = new UrlModel(this.API_USERS_URL).addPath('v1/notify-me').setQueryParams(qp);
    return this.http.get<GetNotifyMeInnovationsWithSubscriptions[]>(url.buildUrl()).pipe(take(1));
  }

  getUnitAccessorAndInnovationsList(orgId: string, unitId: string): Observable<GetUnitAccessorList> {
    const url = new UrlModel(this.API_USERS_URL)
      .addPath('v1/organisations/:orgId/units/:unitId/accessors')
      .setPathParams({ orgId, unitId });
    return this.http.get<GetUnitAccessorList>(url.buildUrl()).pipe(take(1));
  }
}
