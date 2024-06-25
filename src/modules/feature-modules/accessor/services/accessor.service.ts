import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize, map, take } from 'rxjs/operators';

import { CoreService } from '@app/base';
import { UrlModel } from '@app/base/models';

import { SupportLogType } from '@modules/shared/services/innovations.dtos';
import { InnovationSupportStatusEnum } from '@modules/stores/innovation';

export type NotifyMeSupportUpdateCreatedDTO = {
  eventType: 'SUPPORT_UPDATED';
  subscriptionType: 'INSTANTLY';
  preConditions: {
    units: string[];
    status: InnovationSupportStatusEnum[];
  };
};

export type NotifyMeConfig = NotifyMeSupportUpdateCreatedDTO;

export type NotifyMeSupportUpdateDTO = {
  id: string;
  updatedAt: Date;
  eventType: 'SUPPORT_UPDATED';
  subscriptionType: 'INSTANTLY';
  organisations: {
    id: string;
    name: string;
    acronym: string;
    units: {
      id: string;
      name: string;
      acronym: string;
    }[];
  }[];
  status: InnovationSupportStatusEnum[];
};

export type NotifyMeSupportUpdateTypes = {
  SUPPORT_UPDATED: NotifyMeSupportUpdateDTO;
};

export type GetNotifyMeInnovationSubscription = NotifyMeSupportUpdateTypes[keyof NotifyMeSupportUpdateTypes];

export type GetNotifyMeSubscriptionsList = {
  innovationId: string;
  name: string;
  count: number;
}[];

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
    // If NOT enganging, the endpoint won't accept an accessors key.
    if (body.status !== InnovationSupportStatusEnum.ENGAGING) {
      delete body.accessors;
    }

    if (!supportId) {
      const url = new UrlModel(this.API_INNOVATIONS_URL)
        .addPath('v1/:innovationId/supports')
        .setPathParams({ innovationId });
      return this.http.post<{ id: string }>(url.buildUrl(), body).pipe(
        take(1),
        finalize(() => this.stores.context.clearInnovation())
      );
    } else {
      const url = new UrlModel(this.API_INNOVATIONS_URL)
        .addPath('v1/:innovationId/supports/:supportId')
        .setPathParams({ innovationId, supportId });
      return this.http.put<{ id: string }>(url.buildUrl(), body).pipe(
        take(1),
        finalize(() => this.stores.context.clearInnovation())
      );
    }
  }

  suggestNewOrganisations(
    innovationId: string,
    body: { organisationUnits: string[]; type: SupportLogType; description: string }
  ): Observable<{ id: string }> {
    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId/support-logs')
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

  getNotifyMeInnovationSubscriptionsList(innovationId: string): Observable<GetNotifyMeInnovationSubscription[]> {
    const url = new UrlModel(this.API_USERS_URL)
      .addPath('v1/notify-me/innovation/:innovationId')
      .setPathParams({ innovationId });
    return this.http.get<GetNotifyMeInnovationSubscription[]>(url.buildUrl()).pipe(take(1));
  }

  getNotifyMeSubscriptionsList(): Observable<GetNotifyMeSubscriptionsList> {
    const url = new UrlModel(this.API_USERS_URL).addPath('v1/notify-me');
    return this.http.get<GetNotifyMeSubscriptionsList>(url.buildUrl()).pipe(take(1));
  }
}
