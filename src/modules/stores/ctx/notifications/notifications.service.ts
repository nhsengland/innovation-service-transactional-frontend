import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take, map } from 'rxjs';

import { EnvironmentVariablesStore } from '@modules/core';

import { UrlModel } from '@app/base/models';
import { NotificationCategoryTypeEnum, NotificationContextDetailEnum } from './notifications.types';

export type NotificationDismissConditions = {
  notificationIds?: string[];
  contextTypes?: NotificationCategoryTypeEnum[];
  contextDetails?: NotificationContextDetailEnum[];
  contextIds?: string[];
};

@Injectable()
export class NotificationsContextService {
  private API_USERS_URL = this.envVariablesStore.API_USERS_URL;

  constructor(
    private http: HttpClient,
    private envVariablesStore: EnvironmentVariablesStore
  ) {}

  getUnread(): Observable<number> {
    const url = new UrlModel(this.API_USERS_URL).addPath('v1/notifications/counters');
    return this.http.get<{ total: number }>(url.buildUrl()).pipe(
      take(1),
      map(response => response.total)
    );
  }

  dismissNotification(conditions: NotificationDismissConditions): Observable<{ affected: number }> {
    const url = new UrlModel(this.API_USERS_URL).addPath('v1/notifications/dismiss');
    return this.http.patch<{ affected: number }>(url.buildUrl(), conditions).pipe(take(1));
  }

  dismissAllNotifications(): Observable<{ affected: number }> {
    const url = new UrlModel(this.API_USERS_URL).addPath('v1/notifications/dismiss');
    return this.http.patch<{ affected: number }>(url.buildUrl(), { dismissAll: true }).pipe(take(1));
  }

  deleteNotification(notificationId: string): Observable<void> {
    const url = new UrlModel(this.API_USERS_URL)
      .addPath('v1/notifications/:notificationId')
      .setPathParams({ notificationId });
    return this.http.delete<void>(url.buildUrl()).pipe(take(1));
  }
}
