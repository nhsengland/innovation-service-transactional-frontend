import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { CoreModule, AppInjector } from '@modules/core';
import { AuthenticationStore, StoresModule } from '@modules/stores';
import { SharedModule } from '@modules/shared/shared.module';

import { EmailNotificationsPreferencesEnum, EmailNotificationsTypeEnum, NotificationsService } from '@modules/shared/services/notifications.service';

import { PageAccountEmailNotificationsEditComponent } from './email-notifications-edit.component';


const EmailNotificationsListMock = [
  { notificationType: EmailNotificationsTypeEnum.ACTION, preference: EmailNotificationsPreferencesEnum.INSTANTLY },
  { notificationType: EmailNotificationsTypeEnum.COMMENT, preference: EmailNotificationsPreferencesEnum.NEVER },
  { notificationType: EmailNotificationsTypeEnum.SUPPORT, preference: EmailNotificationsPreferencesEnum.DAILY }
];


describe('Shared/Pages/Account/EmailNotifications/PageAccountEmailNotificationsEditComponent', () => {

  let activatedRoute: ActivatedRoute;
  let router: Router;
  let routerSpy: jest.SpyInstance;

  let authenticationStore: AuthenticationStore;
  let notificationsService: NotificationsService;

  let component: PageAccountEmailNotificationsEditComponent;
  let fixture: ComponentFixture<PageAccountEmailNotificationsEditComponent>;

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
    routerSpy = jest.spyOn(router, 'navigate');

    authenticationStore = TestBed.inject(AuthenticationStore);
    notificationsService = TestBed.inject(NotificationsService);

    authenticationStore.userUrlBasePath = () => 'innovator';
    activatedRoute.snapshot.params = { notificationType: EmailNotificationsTypeEnum.SUPPORT };

  });

  it('should create the component', () => {
    fixture = TestBed.createComponent(PageAccountEmailNotificationsEditComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should redirected because is NOT a valid email notification param', () => {

    activatedRoute.snapshot.params = { notificationType: 'invalid value' };
    // activatedRoute.params = of({ notificationType: 'invalid value' }); // Simulate activatedRoute.params subscription.

    fixture = TestBed.createComponent(PageAccountEmailNotificationsEditComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(routerSpy).toHaveBeenCalledWith(['not-found'], {});

  });

  it('should have initial information loaded', () => {

    notificationsService.getEmailNotificationsPreferences = () => of(EmailNotificationsListMock);

    fixture = TestBed.createComponent(PageAccountEmailNotificationsEditComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.form.value).toEqual({ notificationPreference: 'DAILY' });

  });

  it('should NOT have initial information loaded', () => {

    notificationsService.getEmailNotificationsPreferences = () => throwError('error');

    fixture = TestBed.createComponent(PageAccountEmailNotificationsEditComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.pageStatus).toEqual('ERROR');

  });

  it('should run onSubmit and DO NOTHING because form is invalid', () => {

    notificationsService.getEmailNotificationsPreferences = () => of(EmailNotificationsListMock);

    fixture = TestBed.createComponent(PageAccountEmailNotificationsEditComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();

    component.onSubmit();
    expect(routerSpy).not.toHaveBeenCalled();

  });

  it('should run onSubmit and call API with success', () => {

    notificationsService.getEmailNotificationsPreferences = () => of(EmailNotificationsListMock);
    notificationsService.updateEmailNotificationsPreferences = () => of(true);

    fixture = TestBed.createComponent(PageAccountEmailNotificationsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.onSubmit();
    expect(routerSpy).toHaveBeenCalledWith(['/innovator/account/email-notifications'], { queryParams: { alert: 'editSuccess' } });

  });

  it('should run onSubmit and call API with error', () => {

    notificationsService.getEmailNotificationsPreferences = () => of(EmailNotificationsListMock);
    notificationsService.updateEmailNotificationsPreferences = () => throwError('error');

    fixture = TestBed.createComponent(PageAccountEmailNotificationsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.onSubmit();
    expect(routerSpy).toHaveBeenCalledWith(['/innovator/account/email-notifications'], { queryParams: { alert: 'editError' } });

  });

});
