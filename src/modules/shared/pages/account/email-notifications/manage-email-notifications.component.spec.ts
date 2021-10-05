import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { USER_INFO_INNOVATOR } from '@tests/data.mocks';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule, AuthenticationStore } from '@modules/stores';
import { SharedModule } from '@modules/shared/shared.module';

import { EmailNotificationService } from '@modules/shared/services/email-notifications.service';

import { PageAccountEmailNotificationsComponent } from './manage-email-notifications.component';

describe('PageAccountManageNotificationsComponent', () => {
  let activatedRoute: ActivatedRoute;

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

    activatedRoute = TestBed.inject(ActivatedRoute);

    authenticationStore = TestBed.inject(AuthenticationStore);

    emailNotificationService = TestBed.inject(EmailNotificationService);

    authenticationStore.getUserInfo = () => USER_INFO_INNOVATOR;
  });

  it('should create the component', () => {
    fixture = TestBed.createComponent(PageAccountEmailNotificationsComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
