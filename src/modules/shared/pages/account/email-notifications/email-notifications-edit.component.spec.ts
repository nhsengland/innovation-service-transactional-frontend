import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Injector, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { AppInjector, CoreModule } from '@modules/core';
import { SharedModule } from '@modules/shared/shared.module';
import { CtxStore, StoresModule } from '@modules/stores';

import { NotificationCategoryTypeEnum } from '@modules/shared/services/notifications.service';

import { PageAccountEmailNotificationsEditComponent } from './email-notifications-edit.component';

describe('Shared/Pages/Account/EmailNotifications/PageAccountEmailNotificationsEditComponent', () => {
  let activatedRoute: ActivatedRoute;
  let router: Router;
  let routerSpy: jest.SpyInstance;

  let ctx: CtxStore;

  let component: PageAccountEmailNotificationsEditComponent;
  let fixture: ComponentFixture<PageAccountEmailNotificationsEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterModule.forRoot([]), CoreModule, StoresModule, SharedModule]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    activatedRoute = TestBed.inject(ActivatedRoute);
    router = TestBed.inject(Router);
    routerSpy = jest.spyOn(router, 'navigate');

    ctx = TestBed.inject(CtxStore);

    ctx.user.userUrlBasePath = signal('innovator');
    activatedRoute.snapshot.params = { notificationType: NotificationCategoryTypeEnum.SUPPORT };
  });

  it('should create the component', () => {
    fixture = TestBed.createComponent(PageAccountEmailNotificationsEditComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  // it('should redirected because is NOT a valid email notification param', () => {

  //   activatedRoute.snapshot.params = { notificationType: 'invalid value' };
  //   // activatedRoute.params = of({ notificationType: 'invalid value' }); // Simulate activatedRoute.params subscription.

  //   fixture = TestBed.createComponent(PageAccountEmailNotificationsEditComponent);
  //   component = fixture.componentInstance;

  //   fixture.detectChanges();
  //   expect(routerSpy).toHaveBeenCalledWith(['not-found'], {});

  // });

  // it('should have initial information loaded', () => {

  //   notificationsService.getEmailNotificationsPreferences = () => of(EmailNotificationsListMock);

  //   fixture = TestBed.createComponent(PageAccountEmailNotificationsEditComponent);
  //   component = fixture.componentInstance;

  //   fixture.detectChanges();
  //   expect(component.form.value).toEqual({ notificationPreference: 'DAILY' });

  // });

  // it('should NOT have initial information loaded', () => {

  //   notificationsService.getEmailNotificationsPreferences = () => throwError('error');

  //   fixture = TestBed.createComponent(PageAccountEmailNotificationsEditComponent);
  //   component = fixture.componentInstance;

  //   fixture.detectChanges();
  //   expect(component.pageStatus).toEqual('ERROR');

  // });

  // it('should run onSubmit and DO NOTHING because form is invalid', () => {

  //   notificationsService.getEmailNotificationsPreferences = () => of(EmailNotificationsListMock);

  //   fixture = TestBed.createComponent(PageAccountEmailNotificationsEditComponent);
  //   component = fixture.componentInstance;
  //   // fixture.detectChanges();

  //   component.onSubmit();
  //   expect(routerSpy).not.toHaveBeenCalled();

  // });

  // it('should run onSubmit and call API with success', () => {

  //   notificationsService.getEmailNotificationsPreferences = () => of(EmailNotificationsListMock);
  //   notificationsService.updateEmailNotificationsPreferences = () => of(true);

  //   fixture = TestBed.createComponent(PageAccountEmailNotificationsEditComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();

  //   component.onSubmit();
  //   expect(routerSpy).toHaveBeenCalledWith(['/innovator/account/email-notifications'], { queryParams: { alert: 'editSuccess' } });

  // });

  // it('should run onSubmit and call API with error', () => {

  //   notificationsService.getEmailNotificationsPreferences = () => of(EmailNotificationsListMock);
  //   notificationsService.updateEmailNotificationsPreferences = () => throwError('error');

  //   fixture = TestBed.createComponent(PageAccountEmailNotificationsEditComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();

  //   component.onSubmit();
  //   expect(routerSpy).toHaveBeenCalledWith(['/innovator/account/email-notifications'], { queryParams: { alert: 'editError' } });

  // });
});
