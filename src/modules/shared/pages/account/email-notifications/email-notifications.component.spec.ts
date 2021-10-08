import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { Router } from '@angular/router';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { SharedModule } from '@modules/shared/shared.module';

import { NotificationService } from '@modules/shared/services/notification.service';

import { PageAccountEmailNotificationsComponent } from './email-notifications.component';
import { of, throwError } from 'rxjs';

describe('PageAccountManageNotificationsComponent', () => {

  let router: Router;
  let routerSpy: jasmine.Spy;

  let notificationService: NotificationService;

  let component: PageAccountEmailNotificationsComponent;
  let fixture: ComponentFixture<PageAccountEmailNotificationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        CoreModule,
        StoresModule,
        SharedModule
      ]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    router = TestBed.inject(Router);
    routerSpy = spyOn(router, 'navigate');

    notificationService = TestBed.inject(NotificationService);

  });

  it('should create the component', () => {
    fixture = TestBed.createComponent(PageAccountEmailNotificationsComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should have initial information loaded', () => {

    const responseMock = [{ id: 'ACTION', isSubscribed: true },
    { id: 'SUPPORT_STATUS_CHANGE', isSubscribed: false }];

    notificationService.getEmailNotificationTypes = () => of(responseMock);

    const expected = [{ id: 'ACTION', title: 'Actions', isSubscribed: true },
    { id: 'SUPPORT_STATUS_CHANGE', title: 'Support status changes', isSubscribed: false }];

    fixture = TestBed.createComponent(PageAccountEmailNotificationsComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.notificationTypeList).toEqual(expected);

  });

  it('should NOT have initial information loaded', () => {

    notificationService.getEmailNotificationTypes = () => throwError('error');

    const expected = {
      type: 'ERROR',
      title: 'Unable to fetch email notifications',
      message: 'Please, try again or contact us for further help'
    };

    fixture = TestBed.createComponent(PageAccountEmailNotificationsComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.alert).toEqual(expected);

  });

  it('should run onUpdatePreference and call API with success', () => {

    notificationService.updateUserNotificationPreferences = () => of({ id: 'prefId', isSubscribed: true });

    const expected = {
      type: 'SUCCESS',
      title: 'Your notification preference has been saved'
    };

    fixture = TestBed.createComponent(PageAccountEmailNotificationsComponent);
    component = fixture.componentInstance;

    component.updateNotificationPreference('prefId', true);
    fixture.detectChanges();
    expect(component.alert).toEqual(expected);

  });

  it('should run onUpdatePreference and call API with error', () => {

    notificationService.updateUserNotificationPreferences = () => throwError('error');

    const expected = {
      type: 'ERROR',
      title: 'An error occurred when updating notification preference',
      message: 'Please try again or contact us for further help'
    };

    fixture = TestBed.createComponent(PageAccountEmailNotificationsComponent);
    component = fixture.componentInstance;

    component.updateNotificationPreference('prefId', true);
    fixture.detectChanges();
    expect(component.alert).toEqual(expected);

  });

  it('should run unsubscribeAllPreferences and call API with success', () => {

    notificationService.updateUserNotificationPreferences = () => of({ id: 'prefId', isSubscribed: true });

    const expected = {
      type: 'SUCCESS',
      title: 'Your notification preference has been saved'
    };

    fixture = TestBed.createComponent(PageAccountEmailNotificationsComponent);
    component = fixture.componentInstance;
    component.notificationTypeList = [
      { id: 'Notification01', title: 'Notification type', description: '', isSubscribed: true },
      { id: 'Notification01', title: 'Notification type', description: '', isSubscribed: true }
    ];

    component.unsubscribeAllNotifications();
    fixture.detectChanges();
    expect(component.alert).toEqual(expected);

  });

});
