import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { CoreService } from '@app/base';

import { UrlModel } from '@modules/core';


export enum NotificationContextType {
  INNOVATION = 'INNOVATION',
  ACTION = 'ACTION',
  COMMENT = 'COMMENT',
}

export type NotificationDismissResultDTO = {
  affected: number;
  updated: any[];
  error?: any;
};

@Injectable()
export class NotificationService extends CoreService {

  constructor() { super(); }

  dismissNotification(contextId: string, contextType: string): Observable<NotificationDismissResultDTO> {

    const url = new UrlModel(this.API_URL).addPath('notifications');
    return this.http.patch<NotificationDismissResultDTO>(url.buildUrl(), {contextId, contextType}).pipe(
      take(1),
      map(response => response)
    );

  }

}
