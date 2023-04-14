import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

import { CoreComponent } from '@app/base';
import { FormArray, FormGroup } from '@app/base/forms';
import { TableModel } from '@app/base/models';

import { NotificationContextTypeEnum } from '@modules/stores/context/context.enums';

import { NotificationsListOutDTO, NotificationsService } from '@modules/shared/services/notifications.service';


type FilterKeysType = 'contextTypes';
type FiltersType = { key: FilterKeysType, title: string, showHideStatus: 'opened' | 'closed', selected: { label: string, value: string }[] };


@Component({
  selector: 'shared-pages-notifications-list',
  templateUrl: './notifications-list.component.html'
})
export class PageNotificationsListComponent extends CoreComponent implements OnInit {

  emailNotificationPreferencesLink = '';

  notificationsList = new TableModel<
    NotificationsListOutDTO['data'][0],
    { contextTypes: NotificationContextTypeEnum[], unreadOnly: boolean }
  >();

  form = new FormGroup({
    contextTypes: new FormArray([]),
    unreadOnly: new UntypedFormControl(false)
  }, { updateOn: 'change' });

  anyFilterSelected = false;
  filters: FiltersType[] = [{ key: 'contextTypes', title: 'Types', showHideStatus: 'opened', selected: [] }];

  datasets: { [key in FilterKeysType]: { label: string, value: string }[] } = {
    contextTypes: []
  };


  get selectedFilters(): FiltersType[] {
    if (!this.anyFilterSelected) { return []; }
    return this.filters.filter(i => i.selected.length > 0);
  }


  constructor(
    private notificationsService: NotificationsService
  ) {

    super();
    this.setPageTitle('Notifications');

    if (['QUALIFYING_ACCESSOR', 'ACCESSOR', 'INNOVATOR'].includes(this.stores.authentication.getUserType() ?? '')) {
      this.emailNotificationPreferencesLink = `/${this.stores.authentication.userUrlBasePath()}/account/email-notifications`;
    }

    this.notificationsList.setVisibleColumns({
      notification: { label: 'Notification', orderable: false },
      createdAt: { label: 'Date', orderable: true },
      action: { label: 'Action', align: 'right', orderable: false }
    }).setOrderBy('createdAt', 'descending');

    const contextTypesSubset = this.stores.authentication.isAssessmentType() ?
      [NotificationContextTypeEnum.NEEDS_ASSESSMENT, NotificationContextTypeEnum.INNOVATION, NotificationContextTypeEnum.SUPPORT, NotificationContextTypeEnum.THREAD] :
      Object.values(NotificationContextTypeEnum);

    this.datasets.contextTypes = contextTypesSubset.map(item => ({
      label: this.translate(`shared.catalog.innovation.notification_context_types.${item}.title.plural`),
      value: item
    }));

  }

  ngOnInit(): void {

    this.subscriptions.push(
      this.form.valueChanges.pipe(debounceTime(500)).subscribe(() => this.onFormChange())
    );

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

  onNotificationClick(notificationId: string, url: string): void {

    this.stores.context.dismissUserNotification(notificationId);
    this.redirectTo(url);

  }

  onDeleteNotification(notificationId: string): void {

    this.resetAlert();
    this.setPageStatus('LOADING');

    this.notificationsService.deleteNotification(notificationId).subscribe({
      next: () => {
        this.setAlertSuccess('Notification successfully cleared.');
        this.stores.context.updateUserUnreadNotifications();
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

    this.notificationsService.dismissAllUserNotifications().subscribe({
      next: response => {
        this.setAlertSuccess(`${response.affected || 'All'} notifications have been marked as read.`);
        this.stores.context.updateUserUnreadNotifications();
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

    this.filters.forEach(filter => {
      const f = this.form.get(filter.key)!.value as string[];
      filter.selected = this.datasets[filter.key].filter(i => f.includes(i.value));
    });

    this.anyFilterSelected = this.form.get('unreadOnly')!.value || this.filters.filter(i => i.selected.length > 0).length > 0;

    this.notificationsList.setFilters({
      contextTypes: this.form.get('contextTypes')!.value,
      unreadOnly: this.form.get('unreadOnly')!.value
    });

    this.getNotificationsList();

  }


  onOpenCloseFilter(filterKey: FilterKeysType): void {

    const filter = this.filters.find(i => i.key === filterKey);

    switch (filter?.showHideStatus) {
      case 'opened':
        filter.showHideStatus = 'closed';
        break;
      case 'closed':
        filter.showHideStatus = 'opened';
        break;
      default:
        break;
    }

  }

  onRemoveFilter(filterKey: FilterKeysType, value: string): void {

    const formFilter = this.form.get(filterKey) as FormArray;
    const formFilterIndex = formFilter.controls.findIndex(i => i.value === value);

    if (formFilterIndex > -1) {
      formFilter.removeAt(formFilterIndex);
    }

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
