import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { of } from 'rxjs';

import { CoreModule, AppInjector } from '@modules/core';
import { AuthenticationStore, StoresModule, InnovationStatusEnum } from '@modules/stores';
import { SharedModule } from '@modules/shared/shared.module';
import {
  NotificationContextDetailEnum,
  NotificationCategoryTypeEnum
} from '@modules/stores/ctx/notifications/notifications.types';

import { NotificationsService } from '@modules/shared/services/notifications.service';

import { PageNotificationsListComponent } from './notifications-list.component';
import { RouterModule } from '@angular/router';

describe('Shared/Pages/Notifications/PageNotificationsListComponent', () => {
  let authenticationStore: AuthenticationStore;

  let notificationsService: NotificationsService;

  let component: PageNotificationsListComponent;
  let fixture: ComponentFixture<PageNotificationsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterModule, CoreModule, StoresModule, SharedModule]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    authenticationStore = TestBed.inject(AuthenticationStore);

    notificationsService = TestBed.inject(NotificationsService);

    notificationsService.getNotificationsList = () =>
      of({
        count: 20,
        data: [
          {
            id: 'Notification001',
            innovation: { id: 'Innovation001', name: 'Innovation name', status: InnovationStatusEnum.IN_PROGRESS },
            contextType: NotificationCategoryTypeEnum.DOCUMENTS,
            contextDetail: NotificationContextDetailEnum.DC01_UPLOADED_DOCUMENT_TO_INNOVATOR,
            contextId: 'Innovation001',
            createdAt: '2020-01-01T00:00:00.000Z',
            createdBy: 'User001',
            readAt: null,
            params: null,
            link: null
          }
        ]
      });
  });

  it('should create the component', () => {
    fixture = TestBed.createComponent(PageNotificationsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  // it('should start successfully with list of innovations for an NEEDS ASSESSMENT user type', () => {

  //   authenticationStore.isAssessmentType = () => true;

  //   fixture = TestBed.createComponent(PageNotificationsListComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();

  //   expect(component.datasets.contextTypes.length).toBe(4);
  //   expect(component.notificationsList.getTotalRowsNumber()).toBe(20);

  // });

  // it('should start successfully with list of innovations for an INNOVATOR user type', () => {

  //   fixture = TestBed.createComponent(PageNotificationsListComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();

  //   expect(component.datasets.contextTypes.length).toBe(5);
  //   expect(component.notificationsList.getTotalRowsNumber()).toBe(20);

  // });

  // it('should start successfully with list of innovations for an NEEDS ASSESSMENT user type', () => {

  //   fixture = TestBed.createComponent(PageNotificationsListComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();

  //   expect(component.notificationsList.getTotalRowsNumber()).toBe(20);

  // });

  // it('should start with error alert', () => {

  //   notificationsService.getNotificationsList = () => throwError(false);

  //   fixture = TestBed.createComponent(PageNotificationsListComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();

  //   expect(component.alert.type).toBe('ERROR');

  // });

  // it('should run onDeleteNotification() and return SUCCESS', () => {

  //   notificationsService.deleteNotification = () => of({ id: 'Notification001' });

  //   fixture = TestBed.createComponent(PageNotificationsListComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();

  //   component.onDeleteNotification('Notification001');
  //   expect(component.pageStatus).toBe('READY');

  // });

  // it('should run onDeleteNotification() and return ERROR', () => {

  //   notificationsService.deleteNotification = () => throwError(false);

  //   fixture = TestBed.createComponent(PageNotificationsListComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();

  //   component.onDeleteNotification('Notification001');
  //   expect(component.alert.type).toBe('ERROR');

  // });

  // it('should run onMarkAsReadNotifications() and return SUCCESS with 0 records affected', () => {

  //   notificationsService.dismissAllUserNotifications = () => of({ affected: 0 });

  //   fixture = TestBed.createComponent(PageNotificationsListComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();

  //   component.onMarkAsReadAllNotifications();
  //   expect(component.alert.title).toBe('All notifications have been marked as read.');

  // });

  // it('should run onMarkAsReadNotifications() and return SUCCESS with < 0 records affected', () => {

  //   notificationsService.dismissAllUserNotifications = () => of({ affected: 10 });

  //   fixture = TestBed.createComponent(PageNotificationsListComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();

  //   component.onMarkAsReadAllNotifications();
  //   expect(component.alert.title).toBe('10 notifications have been marked as read.');

  // });

  // it('should run onMarkAsReadNotifications() and return ERROR', () => {

  //   notificationsService.dismissAllUserNotifications = () => throwError(false);

  //   fixture = TestBed.createComponent(PageNotificationsListComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();

  //   component.onMarkAsReadAllNotifications();
  //   expect(component.alert.type).toBe('ERROR');

  // });

  // it('should return notifications when changing filters', fakeAsync(() => {

  //   fixture = TestBed.createComponent(PageNotificationsListComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();

  //   (component.form.get('contextTypes') as FormArray).push(new FormControl(NotificationCategoryTypeEnum.INNOVATION_MANAGEMENT));
  //   tick(500); // Needed because of the debounce on the form.

  //   expect(component.notificationsList.getTotalRowsNumber()).toBe(20);
  //   expect(component.selectedFilters).toEqual([{
  //     key: 'contextTypes',
  //     title: 'Types',
  //     showHideStatus: 'opened',
  //     selected: [{ label: 'shared.catalog.innovation.notification_context_types.INNOVATION_MANAGEMENT.title.plural', value: 'INNOVATION' }]
  //   }]);

  // }));

  // it('should run onOpenCloseFilter() and do nothing with an invalid key', () => {

  //   fixture = TestBed.createComponent(PageNotificationsListComponent);
  //   component = fixture.componentInstance;
  //   component.filters[0].showHideStatus = 'closed' as any;

  //   component.onOpenCloseFilter('invalidKey' as any);
  //   expect(component.filters[0].showHideStatus).toBe('closed');

  // });
  // it('should run onOpenCloseFilter() and do nothing with an invalid status', () => {

  //   fixture = TestBed.createComponent(PageNotificationsListComponent);
  //   component = fixture.componentInstance;
  //   component.filters[0].showHideStatus = 'invalid status' as any;

  //   component.onOpenCloseFilter('contextTypes');
  //   expect(component.filters[0].showHideStatus).toBe('invalid status');

  // });

  // it('should run onOpenCloseFilter() and close the filter', () => {

  //   fixture = TestBed.createComponent(PageNotificationsListComponent);
  //   component = fixture.componentInstance;
  //   component.filters[0].showHideStatus = 'opened';

  //   component.onOpenCloseFilter('contextTypes');
  //   expect(component.filters[0].showHideStatus).toBe('closed');

  // });

  // it('should run onOpenCloseFilter() and open the filter', () => {

  //   fixture = TestBed.createComponent(PageNotificationsListComponent);
  //   component = fixture.componentInstance;
  //   component.filters[0].showHideStatus = 'closed';

  //   component.onOpenCloseFilter('contextTypes');
  //   expect(component.filters[0].showHideStatus).toBe('opened');

  // });

  // it('should run onRemoveFilter() with a invalid value', () => {

  //   fixture = TestBed.createComponent(PageNotificationsListComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();

  //   (component.form.get('contextTypes') as FormArray).push(new FormControl(NotificationCategoryTypeEnum.INNOVATION_MANAGEMENT));

  //   component.onRemoveFilter('contextTypes', 'INVALID VALUE');
  //   expect((component.form.get('contextTypes') as FormArray).length).toBe(1);

  // });

  // it('should run onRemoveFilter()', () => {

  //   fixture = TestBed.createComponent(PageNotificationsListComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();

  //   (component.form.get('contextTypes') as FormArray).push(new FormControl(NotificationContextTypeEnum.INNOVATION));

  //   component.onRemoveFilter('contextTypes', 'INNOVATION');
  //   expect((component.form.get('contextTypes') as FormArray).length).toBe(0);

  // });

  // it('should run onTableOrder()', () => {

  //   fixture = TestBed.createComponent(PageNotificationsListComponent);
  //   component = fixture.componentInstance;

  //   fixture.detectChanges();
  //   component.onTableOrder('createdAt');
  //   expect(component.notificationsList.orderBy).toBe('createdAt');
  //   expect(component.notificationsList.orderDir).toBe('ascending');

  // });

  // it('should run onPageChange()', () => {

  //   fixture = TestBed.createComponent(PageNotificationsListComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();

  //   component.onPageChange({ pageNumber: 2 });
  //   expect(component.notificationsList.page).toBe(2);

  // });
});
