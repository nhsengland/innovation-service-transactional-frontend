import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { Router } from '@angular/router';

import { USER_INFO_ACCESSOR } from '@tests/data.mocks';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule, AuthenticationStore } from '@modules/stores';
import { SharedModule } from '@modules/shared/shared.module';

import { EmailNotificationService } from '@modules/shared/services/email-notifications.service';

import { PageAccountEmailNotificationsComponent } from './manage-email-notifications.component';
import { of, throwError } from 'rxjs';

describe('PageAccountManageNotificationsComponent', () => {

  let router: Router;
  let routerSpy: jasmine.Spy;

  let authenticationStore: AuthenticationStore;

  let emailNotificationService: EmailNotificationService;

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

    authenticationStore = TestBed.inject(AuthenticationStore);

    emailNotificationService = TestBed.inject(EmailNotificationService);

    authenticationStore.getUserInfo = () => USER_INFO_ACCESSOR;
  });

  it('should create the component', () => {
    fixture = TestBed.createComponent(PageAccountEmailNotificationsComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should have initial information loaded', () => {

    authenticationStore.isAccessorType = () => true;

    const responseMock = [{ id: 'SUPPORT_STATUS_CHANGE', isSubscribed: false }];

    emailNotificationService.getUserNotificationPreferences = () => of(responseMock);

    const expected = [{ id: 'ACTION', value: 'Actions', isSubscribed: true },
    { id: 'SUPPORT_STATUS_CHANGE', value: 'Support status changes', isSubscribed: false }];

    fixture = TestBed.createComponent(PageAccountEmailNotificationsComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.notificationTypeList).toEqual(expected);

  });

  it('should NOT have initial information loaded', () => {

    emailNotificationService.getUserNotificationPreferences = () => throwError('error');

    const expected = {
      type: 'ERROR',
      title: 'Unable to fetch user notification preferences',
      message: 'Please, try again or contact us for further help'
    };

    fixture = TestBed.createComponent(PageAccountEmailNotificationsComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.alert).toEqual(expected);

  });

  it('should run onUpdatePreference and call API with success', () => {

    emailNotificationService.updateUserNotificationPreference = () => of({ id: 'prefId', isSubscribed: true });

    const expected = {
      type: 'SUCCESS',
      title: 'Your notification preference has been saved'
    };

    fixture = TestBed.createComponent(PageAccountEmailNotificationsComponent);
    component = fixture.componentInstance;

    component.updatePreference('prefId', true);
    fixture.detectChanges();
    expect(component.alert).toEqual(expected);

  });

  it('should run onUpdatePreference and call API with error', () => {

    emailNotificationService.updateUserNotificationPreference = () => throwError('error');

    const expected = {
      type: 'ERROR',
      title: 'An error occurred when updating notification preference',
      message: 'Please try again or contact us for further help'
    };

    fixture = TestBed.createComponent(PageAccountEmailNotificationsComponent);
    component = fixture.componentInstance;

    component.updatePreference('prefId', true);
    fixture.detectChanges();
    expect(component.alert).toEqual(expected);

  });

  it('should run unsubscribeAllPreferences and call API with success', () => {

    emailNotificationService.updateUserNotificationPreference = () => of({ id: 'prefId', isSubscribed: true });

    const expected = {
      type: 'SUCCESS',
      title: 'Your notification preference has been saved'
    };

    fixture = TestBed.createComponent(PageAccountEmailNotificationsComponent);
    component = fixture.componentInstance;
    component.notificationTypeList = [
      { id: 'Notification01', value: 'Notification type', isSubscribed: true },
      { id: 'Notification01', value: 'Notification type', isSubscribed: true }
    ];

    component.unsubscribeAllPreferences();
    fixture.detectChanges();
    expect(component.alert).toEqual(expected);

  });

});
