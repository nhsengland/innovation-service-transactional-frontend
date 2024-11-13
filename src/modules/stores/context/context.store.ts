import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Store } from '../store.class';
import { ContextModel } from './context.models';
import { ContextService } from './context.service';

import { NotificationCategoryTypeEnum, NotificationContextDetailEnum } from './context.enums';

@Injectable()
export class ContextStore extends Store<ContextModel> {
  constructor(
    private logger: NGXLogger,
    private contextService: ContextService
  ) {
    super('STORE::Context', new ContextModel());
  }

  notifications$(): Observable<ContextModel['notifications']> {
    return this.state$.pipe(map(item => item.notifications));
  }

  // Notifications methods.
  updateUserUnreadNotifications(): void {
    this.contextService.getUserUnreadNotifications().subscribe({
      next: response => {
        this.state.notifications.UNREAD = response.total;
        this.setState();
      },
      error: error => this.logger.error('Error obtaining user unread notifications', error)
    });
  }

  dismissNotification(
    innovationId: string,
    conditions: {
      notificationIds?: string[];
      contextTypes?: NotificationCategoryTypeEnum[];
      contextDetails?: NotificationContextDetailEnum[];
      contextIds?: string[];
    }
  ): void {
    this.contextService.dismissNotification(innovationId, conditions).subscribe({
      next: () => this.updateUserUnreadNotifications(),
      error: error => this.logger.error('Error dismissing all user notifications', error)
    });
  }

  dismissUserNotification(conditions: {
    notificationIds?: string[];
    contextTypes?: NotificationCategoryTypeEnum[];
    contextDetails?: NotificationContextDetailEnum[];
    contextIds?: string[];
  }): void {
    this.contextService.dismissUserNotification(conditions).subscribe({
      next: () => this.updateUserUnreadNotifications(),
      error: error => this.logger.error('Error dismissing user notification', error)
    });
  }
}
