import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { SharedModule } from '@modules/shared/shared.module';

import { EmailNotificationsTypeEnum, EmailNotificationsPreferencesEnum, NotificationsService } from '@modules/shared/services/notifications.service';

import { PageAccountEmailNotificationsListComponent } from './email-notifications-list.component';


const EmailNotificationsListMock = [
  { notificationType: EmailNotificationsTypeEnum.ACTION, preference: EmailNotificationsPreferencesEnum.INSTANTLY },
  { notificationType: EmailNotificationsTypeEnum.COMMENT, preference: EmailNotificationsPreferencesEnum.NEVER },
  { notificationType: EmailNotificationsTypeEnum.SUPPORT, preference: EmailNotificationsPreferencesEnum.DAILY }
];


describe('Shared/Pages/Account/EmailNotifications/PageAccountEmailNotificationsListComponent', () => {

  let activatedRoute: ActivatedRoute;
  let router: Router;
  let routerSpy: jasmine.Spy;

  let notificationsService: NotificationsService;

  let component: PageAccountEmailNotificationsListComponent;
  let fixture: ComponentFixture<PageAccountEmailNotificationsListComponent>;

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

    activatedRoute = TestBed.inject(ActivatedRoute);
    router = TestBed.inject(Router);
    routerSpy = spyOn(router, 'navigate');

    notificationsService = TestBed.inject(NotificationsService);

  });

  it('should create the component', () => {
    fixture = TestBed.createComponent(PageAccountEmailNotificationsListComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });


  it('should show "editSuccess" alert', () => {

    activatedRoute.snapshot.queryParams = { alert: 'editSuccess' };

    fixture = TestBed.createComponent(PageAccountEmailNotificationsListComponent);
    component = fixture.componentInstance;
    expect(component.alert.type).toEqual('SUCCESS');

  });

  it('should show "editError" alert', () => {

    activatedRoute.snapshot.queryParams = { alert: 'editError' };

    fixture = TestBed.createComponent(PageAccountEmailNotificationsListComponent);
    component = fixture.componentInstance;
    expect(component.alert.type).toEqual('ERROR');

  });

  it('should have initial information loaded', () => {

    notificationsService.getEmailNotificationsPreferences = () => of(EmailNotificationsListMock);

    const expected = EmailNotificationsListMock.map(item => ({ type: item.notificationType, preference: item.preference }));

    fixture = TestBed.createComponent(PageAccountEmailNotificationsListComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.notificationTypeList).toEqual(expected);

  });

  it('should NOT have initial information loaded', () => {

    notificationsService.getEmailNotificationsPreferences = () => throwError('error');

    fixture = TestBed.createComponent(PageAccountEmailNotificationsListComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.pageStatus).toEqual('ERROR');

  });

  it('should run unsubscribeAllPreferences and call API with success', () => {

    notificationsService.updateEmailNotificationsPreferences = () => of(true);
    notificationsService.getEmailNotificationsPreferences = () => of(EmailNotificationsListMock);

    fixture = TestBed.createComponent(PageAccountEmailNotificationsListComponent);
    component = fixture.componentInstance;

    component.unsubscribeAllNotifications();
    fixture.detectChanges();
    expect(component.alert.type).toEqual('SUCCESS');

  });

  it('should run unsubscribeAllPreferences and call API with error', () => {

    notificationsService.updateEmailNotificationsPreferences = () => throwError('error');

    fixture = TestBed.createComponent(PageAccountEmailNotificationsListComponent);
    component = fixture.componentInstance;

    component.unsubscribeAllNotifications();
    fixture.detectChanges();
    expect(component.alert.type).toEqual('ERROR');

  });

});
