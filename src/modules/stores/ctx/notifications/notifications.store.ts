import { Inject, Injectable, PLATFORM_ID, computed, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  filter,
  fromEvent,
  interval,
  map,
  Observable,
  shareReplay,
  startWith,
  switchMap,
  tap,
  withLatestFrom
} from 'rxjs';
import { NotificationsContextType } from './notifications.types';
import { NotificationDismissConditions, NotificationsContextService } from './notifications.service';
import { isPlatformBrowser } from '@angular/common';
import { DeepPartial } from '@app/base/types';
import { isNil, omitBy } from 'lodash';
import { NGXLogger } from 'ngx-logger';
import { UserContextStore } from '../user/user.store';

const NOTIFICATIONS_POLLING_FREQUENCY = 60000;
const NOTIFICATIONS_EXPIRES_AT = 50000;

@Injectable()
export class NotificationsContextStore {
  // State
  private state = signal<Omit<NotificationsContextType, 'isStateLoaded'>>({
    unread: 0,
    expiresAt: 0
  });

  // Selectors
  unread = computed(() => this.state().unread);

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private notificationCtxService: NotificationsContextService,
    private logger: NGXLogger,
    private userCtx: UserContextStore
  ) {
    this.userCtx.isStateLoaded$
      .pipe(
        filter(isLoaded => isLoaded),
        switchMap(() => this.notificationCtxService.getUnread())
      )
      .subscribe(unread => this.loadState(unread));

    if (isPlatformBrowser(this.platformId)) {
      // NOTE: if this is useful elsewhere in the future we can move it to layout store.
      const isTabVisible$ = fromEvent(document, 'visibilitychange').pipe(
        map(() => document.visibilityState === 'visible'),
        startWith(true),
        shareReplay(1)
      );

      interval(NOTIFICATIONS_POLLING_FREQUENCY)
        .pipe(
          takeUntilDestroyed(),
          withLatestFrom(isTabVisible$),
          filter(([_, isTabVisible]) => isTabVisible && Date.now() >= this.state().expiresAt),
          switchMap(() => this.notificationCtxService.getUnread())
        )
        .subscribe(unread => this.loadState(unread));
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

  private loadState(unread: number): void {
    this.state.update(state => ({
      ...state,
      unread,
      expiresAt: Date.now() + NOTIFICATIONS_EXPIRES_AT
    }));
  }
}
