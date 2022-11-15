import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { EnvironmentVariablesStore } from '@modules/core/stores/environment-variables.store';
import { UrlModel } from '@modules/core/models/url.model';

import { NotificationContextTypeEnum } from './context.enums';


type InnovationNotificationsDTO = {
  count: number;
  data: { [key in NotificationContextTypeEnum]: number };
};


@Injectable()
export class ContextService {

  private API_URL = this.envVariablesStore.API_URL;

  constructor(
    private http: HttpClient,
    private envVariablesStore: EnvironmentVariablesStore
  ) { }


  getUserUnreadNotifications(): Observable<{ total: number }> {

    const url = new UrlModel(this.API_URL).addPath('notifications/counters');
    return this.http.get<{ total: number }>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );

  }

  dismissNotification(type: NotificationContextTypeEnum, id: string): Observable<{ affected: number }> {

    const url = new UrlModel(this.API_URL).addPath('notifications/dismiss');
    return this.http.patch<{ affected: number }>(url.buildUrl(), { context: { type, id } }).pipe(take(1), map(response => response)
    );

  }


  getInnovationNotifications(innovationId: string): Observable<InnovationNotificationsDTO> {

    const url = new UrlModel(this.API_URL).addPath('innovations/:innovationId/notifications').setPathParams({ innovationId });
    return this.http.get<InnovationNotificationsDTO>(url.buildUrl()).pipe(take(1), map(response => response)
    );

  }

}
