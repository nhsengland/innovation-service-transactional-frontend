import { Inject, Injectable, PLATFORM_ID, computed, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, filter, interval, map, Observable, Subject, switchMap, tap } from 'rxjs';
import { NotificationsContextType } from './notifications.types';
import { NotificationDismissConditions, NotificationsContextService } from './notifications.service';
import { isPlatformBrowser } from '@angular/common';
import { DeepPartial } from '@app/base/types';
import { isNil, omitBy } from 'lodash';
import { NGXLogger } from 'ngx-logger';

const NOTIFICATIONS_POLLING_FREQUENCY = 60000;

@Injectable()
export class NotificationsContextStore {
  // State
  private state = signal<Omit<NotificationsContextType, 'isStateLoaded'>>({
    unread: 0,
    expiresAt: 0
  });

  // Selectors
  unread = computed(() => this.state().unread);

  // Actions
  fetchUnread$ = new Subject<void>();

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private notificationCtxService: NotificationsContextService,
    private logger: NGXLogger
  ) {
    // NOTE: when the user/auth store is migrated this will be removed and will react to the isStateLoaded from user store.
    this.fetchUnread$
      .pipe(
        debounceTime(1000),
        switchMap(() => this.notificationCtxService.getUnread())
      )
      .subscribe(unread => {
        this.state.update(state => ({
          ...state,
          unread,
          expiresAt: Date.now() + NOTIFICATIONS_POLLING_FREQUENCY
        }));
      });

    if (isPlatformBrowser(this.platformId)) {
      interval(NOTIFICATIONS_POLLING_FREQUENCY)
        .pipe(
          takeUntilDestroyed(),
          filter(() => Date.now() >= this.state().expiresAt),
          switchMap(() => this.notificationCtxService.getUnread())
        )
        .subscribe(unread => {
          this.state.update(state => ({
            ...state,
            unread,
            expiresAt: Date.now() + NOTIFICATIONS_POLLING_FREQUENCY
          }));
        });
    }
  }

  update(info: DeepPartial<NotificationsContextType>): void {
    const dataToUpdate = omitBy<DeepPartial<NotificationsContextType>>(info, isNil);
    this.state.update(state => ({ ...state, ...dataToUpdate }));
  }

  dismiss(conditions: NotificationDismissConditions): void {
    this.notificationCtxService.dismissNotification(conditions).subscribe({
      next: ({ affected }) => this.decrementUnread(affected),
      error: error => this.logger.error('Error dismissing notifications', error)
    });
  }

  dismissAll$(): Observable<{ affected: number }> {
    return this.notificationCtxService.dismissAllNotifications().pipe(tap(() => this.update({ unread: 0 })));
  }

  delete$(notificationId: string, isRead: boolean): Observable<void> {
    return this.notificationCtxService.deleteNotification(notificationId).pipe(
      tap(() => {
        if (!isRead) {
          this.decrementUnread();
        }
      })
    );
  }

  private decrementUnread(decrement = 1): void {
    this.state.update(state => ({ ...state, unread: state.unread - decrement > 0 ? state.unread - decrement : 0 }));
  }
}
