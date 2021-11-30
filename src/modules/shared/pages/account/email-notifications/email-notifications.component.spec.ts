import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { SharedModule } from '@modules/shared/shared.module';

import { NotificationsService } from '@modules/shared/services/notifications.service';

import { PageAccountEmailNotificationsComponent } from './email-notifications.component';


describe('Shared/Pages/Account/EmailNotifications/PageAccountManageNotificationsComponent', () => {

  let router: Router;
  let routerSpy: jasmine.Spy;

  let notificationsService: NotificationsService;

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

    notificationsService = TestBed.inject(NotificationsService);

  });

  it('should create the component', () => {
    fixture = TestBed.createComponent(PageAccountEmailNotificationsComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should have initial information loaded', () => {

    const responseMock = [{ id: 'ACTION', isSubscribed: true },
    { id: 'SUPPORT', isSubscribed: false }];

    notificationsService.getEmailNotificationTypes = () => of(responseMock);

    const expected = [{ id: 'ACTION', title: 'Actions', isSubscribed: true },
    { id: 'SUPPORT', title: 'Support status changes', isSubscribed: false }];

    fixture = TestBed.createComponent(PageAccountEmailNotificationsComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.notificationTypeList).toEqual(expected);

  });

  it('should NOT have initial information loaded', () => {

    notificationsService.getEmailNotificationTypes = () => throwError('error');

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

    notificationsService.updateUserNotificationPreferences = () => of({ id: 'prefId', isSubscribed: true });

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

    notificationsService.updateUserNotificationPreferences = () => throwError('error');

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

    notificationsService.updateUserNotificationPreferences = () => of({ id: 'prefId', isSubscribed: true });

    const expected = {
      type: 'SUCCESS',
      title: 'Your notification preference has been saved'
    };

    fixture = TestBed.createComponent(PageAccountEmailNotificationsComponent);
    component = fixture.componentInstance;
    component.notificationTypeList = [
      { id: 'Notification01', title: 'Notification type', isSubscribed: true },
      { id: 'Notification01', title: 'Notification type', isSubscribed: true }
    ];

    component.unsubscribeAllNotifications();
    fixture.detectChanges();
    expect(component.alert).toEqual(expected);

  });

});
