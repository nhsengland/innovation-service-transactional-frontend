import { Component, OnInit } from '@angular/core';
import { debounceTime } from 'rxjs/operators';

import { CoreComponent } from '@app/base';
import { FormGroup } from '@app/base/forms';
import { TableModel } from '@app/base/models';

import {
  ANotificationCategories,
  InnovatorNotificationCategories,
  NANotificationCategories,
  NotificationCategoryTypeEnum,
  QANotificationCategories
} from '@modules/stores/ctx/notifications/notifications.types';

import { NotificationsListOutDTO, NotificationsService } from '@modules/shared/services/notifications.service';
import { UserRoleEnum } from '@modules/stores/authentication/authentication.enums';
import { FiltersModel } from '@modules/core/models/filters/filters.model';
import { getConfig } from './notifications-list.config';

@Component({
  selector: 'shared-pages-notifications-list',
  templateUrl: './notifications-list.component.html'
})
export class PageNotificationsListComponent extends CoreComponent implements OnInit {
  emailNotificationPreferencesLink = '';
  customNotificationPreferencesLink = '';

  notificationsList = new TableModel<NotificationsListOutDTO['data'][0], Record<string, any>>();

  filtersModel!: FiltersModel;
  form!: FormGroup;

  isAccessorType = false;

  constructor(private notificationsService: NotificationsService) {
    super();
    this.setPageTitle('Notifications');

    this.isAccessorType = this.stores.authentication.isAccessorType();

    if (
      ['QUALIFYING_ACCESSOR', 'ACCESSOR', 'INNOVATOR', 'ASSESSMENT'].includes(
        this.stores.authentication.getUserType() ?? ''
      )
    ) {
      this.emailNotificationPreferencesLink = `/${this.stores.authentication.userUrlBasePath()}/account/email-notifications`;
    }

    if (this.isAccessorType) {
      this.customNotificationPreferencesLink = `/${this.stores.authentication.userUrlBasePath()}/account/manage-custom-notifications`;
    }

    this.notificationsList
      .setVisibleColumns({
        notification: { label: 'Notification', orderable: false },
        createdAt: { label: 'Date', orderable: true },
        action: { label: 'Action', align: 'right', orderable: false }
      })
      .setOrderBy('createdAt', 'descending');
  }

  ngOnInit(): void {
    const role = this.stores.authentication.getUserType();

    let categories: NotificationCategoryTypeEnum[] = [];
    switch (role) {
      case UserRoleEnum.INNOVATOR:
        categories = InnovatorNotificationCategories;
        break;
      case UserRoleEnum.ASSESSMENT:
        categories = NANotificationCategories;
        break;
      case UserRoleEnum.QUALIFYING_ACCESSOR:
        categories = QANotificationCategories;
        break;
      case UserRoleEnum.ACCESSOR:
        categories = ANotificationCategories;
        break;
    }

    const datasets = {
      contextTypes: categories.map(cur => ({
        label: this.translate(`shared.catalog.innovation.notification_context_types.${cur}.${role}.title`),
        value: cur
      }))
    };
    const { filters } = getConfig();

    this.filtersModel = new FiltersModel({ filters, datasets });
    this.form = this.filtersModel.form;

    this.subscriptions.push(this.form.valueChanges.pipe(debounceTime(500)).subscribe(() => this.onFormChange()));

    this.onFormChange();
  }

  // API methods.
  getNotificationsList(column?: string): void {
    this.setPageStatus('LOADING');

    this.notificationsService.getNotificationsList(this.notificationsList.getAPIQueryParams()).subscribe(response => {
      this.notificationsList.setData(response.data, response.count);
      if (this.isRunningOnBrowser() && column) this.notificationsList.setFocusOnSortedColumnHeader(column);
      this.setPageStatus('READY');
    });
  }

  onNotificationClick(
    event: MouseEvent,
    notificationId: string,
    url: null | string,
    queryParams?: Record<string, string>
  ): void {
    // Do nothing if user using shortcut to open in new window (this is handled by the browser)
    if (event.ctrlKey && url) {
      return;
    }

    this.ctx.notifications.dismiss({ notificationIds: [notificationId] });

    if (url) {
      // Stop event propagation to avoid triggering the href link
      event.preventDefault();
      this.redirectTo(url, queryParams);
    } else {
      const notification = this.notificationsList.getRecords().find(i => i.id === notificationId);
      if (notification) {
        notification.readAt = new Date().toISOString();
      }
    }
  }

  onDeleteNotification(notificationId: string, readAt: null | string): void {
    this.resetAlert();
    this.setPageStatus('LOADING');

    this.ctx.notifications.delete$(notificationId, !!readAt).subscribe({
      next: () => {
        this.setAlertSuccess('Notification successfully cleared');
        this.getNotificationsList();
      },
      error: error => {
        this.setAlertUnknownError();
        this.logger.error(error);
      }
    });
  }

  onMarkAsReadAllNotifications(): void {
    this.resetAlert();
    this.setPageStatus('LOADING');

    this.ctx.notifications.dismissAll$().subscribe({
      next: response => {
        this.setAlertSuccess(`${response.affected || 'All'} notifications have been marked as read`);
        this.getNotificationsList();
      },
      error: () => {
        this.setAlertUnknownError();
      }
    });
  }

  // Interaction methods.
  onFormChange(): void {
    this.resetAlert();
    this.setPageStatus('LOADING');

    this.filtersModel.handleStateChanges();
    this.notificationsList.setFilters(this.filtersModel.getAPIQueryParams());

    this.notificationsList.setPage(1);
    this.getNotificationsList();
  }

  onTableOrder(column: string): void {
    this.resetAlert();

    this.notificationsList.setOrderBy(column);
    this.getNotificationsList(column);
  }

  onPageChange(event: { pageNumber: number }): void {
    this.resetAlert();

    this.notificationsList.setPage(event.pageNumber);
    this.getNotificationsList();
  }
}
