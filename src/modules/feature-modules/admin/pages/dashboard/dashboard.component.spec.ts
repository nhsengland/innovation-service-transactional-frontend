import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreModule, AppInjector } from '@modules/core';
import { AuthenticationStore, StoresModule } from '@modules/stores';
import { AdminModule } from '@modules/feature-modules/admin/admin.module';
import { USER_INFO_INNOVATOR } from '@tests/data.mocks';

import { PageDashboardComponent } from './dashboard.component';

import { UserRoleEnum } from '@modules/stores/authentication/authentication.enums';


describe('FeatureModules/Admin/Pages/Dashboard/PageDashboardComponent', () => {

  let activatedRoute: ActivatedRoute;

  let authenticationStore: AuthenticationStore;

  let component: PageDashboardComponent;
  let fixture: ComponentFixture<PageDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        CoreModule,
        StoresModule,
        AdminModule
      ]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    activatedRoute = TestBed.inject(ActivatedRoute);

    authenticationStore = TestBed.inject(AuthenticationStore);

    authenticationStore.getUserInfo = () => USER_INFO_INNOVATOR;

  });


  it('should create the component', () => {
    fixture = TestBed.createComponent(PageDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should have alert when password changed', () => {

    authenticationStore.getUserInfo = () => ({
      ...USER_INFO_INNOVATOR,
      type: UserRoleEnum.ADMIN,
      passwordResetAt: new Date(new Date().getTime() - 1 * 60000).toString()
    });

    const expected = { type: 'SUCCESS', title: 'You have successfully changed your password.', setFocus: true };

    fixture = TestBed.createComponent(PageDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.alert).toEqual(expected);

  });

});
