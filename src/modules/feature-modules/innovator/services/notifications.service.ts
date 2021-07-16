import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class InnovatorNotificationsService {
  private notificationReceived = new Subject<{[key: string]: number}>();

  notificationReceived$ = this.notificationReceived.asObservable();

  sendNotification(notification: {[key: string]: number}): void {
    this.notificationReceived.next(notification);
  }
}
