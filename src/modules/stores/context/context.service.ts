import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { UrlModel } from '@modules/core/models/url.model';
import { EnvironmentVariablesStore } from '@modules/core/stores/environment-variables.store';

import { NotificationCategoryTypeEnum, NotificationContextDetailEnum } from './context.enums';
import { ContextAssessmentType } from './context.types';

@Injectable()
export class ContextService {
  private API_INNOVATIONS_URL = this.envVariablesStore.API_INNOVATIONS_URL;
  private API_USERS_URL = this.envVariablesStore.API_USERS_URL;

  constructor(
    private http: HttpClient,
    private envVariablesStore: EnvironmentVariablesStore
  ) {}

  getUserUnreadNotifications(): Observable<{ total: number }> {
    const url = new UrlModel(this.API_USERS_URL).addPath('v1/notifications/counters');
    return this.http.get<{ total: number }>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );
  }

  dismissNotification(
    innovationId: string,
    conditions: {
      notificationIds?: string[];
      contextTypes?: NotificationCategoryTypeEnum[];
      contextDetails?: NotificationContextDetailEnum[];
      contextIds?: string[];
    }
  ): Observable<void> {
    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId/notifications/dismiss')
      .setPathParams({ innovationId });
    return this.http.patch<void>(url.buildUrl(), conditions).pipe(take(1));
  }

  dismissUserNotification(conditions: {
    notificationIds?: string[];
    contextTypes?: NotificationCategoryTypeEnum[];
    contextDetails?: NotificationContextDetailEnum[];
    contextIds?: string[];
  }): Observable<{ affected: number }> {
    const url = new UrlModel(this.API_USERS_URL).addPath('v1/notifications/dismiss');
    return this.http.patch<{ affected: number }>(url.buildUrl(), conditions).pipe(
      take(1),
      map(response => response)
    );
  }

  getAssessmentContextInfo(innovationId: string, assessmentId: string): Observable<ContextAssessmentType> {
    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId/assessments/:assessmentId')
      .setPathParams({ innovationId, assessmentId });
    return this.http
      .get<Omit<ContextAssessmentType, 'expiriyAt'>>(url.buildUrl())
      .pipe(map(r => ({ ...r, expiryAt: Date.now() + 5000 })));
  }
}
