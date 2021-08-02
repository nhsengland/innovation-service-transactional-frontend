import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { CoreService } from '@app/base';

import { UrlModel } from '@modules/core';


export enum NotificationContextType {
  INNOVATION = 'INNOVATION',
  ACTION = 'ACTION',
  COMMENT = 'COMMENT',
  SUPPORT = 'SUPPORT',
  DATA_SHARING = 'DATA_SHARING',
}

export type NotificationDismissResultDTO = {
  affected: number;
  updated: any[];
  error?: any;
};


export type getUnreadNotificationsEndpointDTO =  {
  [key: string]: number;
};


@Injectable()
export class NotificationService extends CoreService {

  notifications: {[key: string]: number} =  {};

  constructor() { super(); }

  dismissNotification(contextId: string, contextType: string): Observable<NotificationDismissResultDTO> {

    const url = new UrlModel(this.API_URL).addPath('notifications');
    return this.http.patch<NotificationDismissResultDTO>(url.buildUrl(), {contextId, contextType}).pipe(
      take(1),
      map(response => response)
    );

  }

  getAllUnreadNotifications(innovationId?: string): Observable<getUnreadNotificationsEndpointDTO> {

    let url = new UrlModel(this.API_URL).addPath('notifications');

    if (innovationId) {
      url = url.setQueryParams({innovationId});
    }

    return this.http.get<getUnreadNotificationsEndpointDTO>(url.buildUrl()).pipe(
      take(1),
      map(response =>  {
        this.notifications = response;
        return response;
      })
    );

  }

}
