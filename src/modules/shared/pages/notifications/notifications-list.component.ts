import { Component, OnInit } from '@angular/core';
import { debounceTime } from 'rxjs/operators';

import { CoreComponent, FormArray, FormControl, FormGroup } from '@app/base';
import { TableModel } from '@app/base/models';

import { NotificationContextTypeEnum } from '@modules/stores/environment/environment.enums';

import { NotificationsListOutDTO, NotificationsService } from '@modules/shared/services/notifications.service';

type FilterKeysType = 'contextTypes';
type FiltersType = { key: FilterKeysType, title: string, showHideStatus: 'opened' | 'closed', selected: { label: string, value: string }[] };


@Component({
  selector: 'shared-pages-notifications-list',
  templateUrl: './notifications-list.component.html'
})
export class PageNotificationsListComponent extends CoreComponent implements OnInit {

  notificationsList = new TableModel<
    NotificationsListOutDTO['data'][0],
    { contextTypes: NotificationContextTypeEnum[], unreadOnly: boolean }
  >();

  form = new FormGroup({
    contextTypes: new FormArray([]),
    unreadOnly: new FormControl(false)
  }, { updateOn: 'change' });

  anyFilterSelected = false;
  filters: FiltersType[] = [{ key: 'contextTypes', title: 'Types', showHideStatus: 'opened', selected: [] }];

  datasets: { [key in FilterKeysType]: { label: string, value: string }[] } = {
    contextTypes: Object.values(NotificationContextTypeEnum).map(item => ({
      label: this.translate(`shared.catalog.innovation.notification_context_types.${item}.title`),
      value: item
    }))
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

    this.notificationsList.setVisibleColumns({
      notification: { label: 'Notification', orderable: false },
      createdAt: { label: 'Date', orderable: true },
      action: { label: 'Action', align: 'right', orderable: false }
    }).setOrderBy('createdAt', 'descending');

  }

  ngOnInit(): void {

    this.subscriptions.push(
      this.form.valueChanges.pipe(debounceTime(500)).subscribe(() => this.onFormChange())
    );

    this.onFormChange();

  }


  // API methods.

  getNotificationsList(): void {

    this.setPageStatus('LOADING');

    this.notificationsService.getNotificationsList(this.notificationsList.getAPIQueryParams()).subscribe(
      response => {
        this.notificationsList.setData(response.data, response.count);
        this.setPageStatus('READY');
      },
      error => {
        this.setAlertError();
        this.setPageStatus('READY');
        this.logger.error(error);
      }
    );

  }

  onDeleteNotification(notificationId: string): void {

    this.clearAlert();
    this.setPageStatus('LOADING');

    this.notificationsService.deleteNotification(notificationId).subscribe(
      () => {
        this.setAlertSuccess('Notification successfully cleared.');
        this.getNotificationsList();
      },
      error => {
        this.setAlertError();
        this.setPageStatus('READY');
        this.logger.error(error);
      }
    );

  }

  onMarkAsReadAllNotifications(): void {

    this.clearAlert();
    this.setPageStatus('LOADING');

    this.notificationsService.dismissAllUserNotifications().subscribe(
      response => {
        this.setAlertSuccess(`${response.affected || 'All'} notifications have been marked as read.`);
        this.getNotificationsList();
      },
      error => {
        this.setAlertError();
        this.setPageStatus('READY');
        this.logger.error(error);
      }
    );

  }


  // Interaction methods.

  onFormChange(): void {

    this.clearAlert();
    this.setPageStatus('LOADING');

    this.filters.forEach(filter => {
      const f = this.form.get(filter.key)!.value as string[];
      filter.selected = this.datasets[filter.key].filter(i => f.includes(i.value));
    });

    this.anyFilterSelected = this.filters.filter(i => i.selected.length > 0).length > 0;

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

    this.clearAlert();

    this.notificationsList.setOrderBy(column);
    this.getNotificationsList();
  }

  onPageChange(event: { pageNumber: number }): void {

    this.clearAlert();

    this.notificationsList.setPage(event.pageNumber);
    this.getNotificationsList();
  }

}
