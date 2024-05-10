import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { AppInjector, CoreModule } from '@modules/core';
import { AdminModule } from '@modules/feature-modules/admin/admin.module';
import { AuthenticationStore, StoresModule } from '@modules/stores';
import { USER_INFO_INNOVATOR } from '@tests/data.mocks';

import { PageDashboardComponent } from './dashboard.component';

describe('FeatureModules/Admin/Pages/Dashboard/PageDashboardComponent', () => {
  let activatedRoute: ActivatedRoute;

  let authenticationStore: AuthenticationStore;

  let component: PageDashboardComponent;
  let fixture: ComponentFixture<PageDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterModule.forRoot([]), CoreModule, StoresModule, AdminModule]
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

  // it('should have alert when password changed', () => {

  //   authenticationStore.getUserInfo = () => ({
  //     ...USER_INFO_INNOVATOR,
  //     type: UserRoleEnum.ADMIN,
  //     passwordResetAt: new Date(new Date().getTime() - 1 * 60000).toString()
  //   });

  //   const expected = { type: 'SUCCESS', title: 'You have successfully changed your password.', setFocus: true };

  //   fixture = TestBed.createComponent(PageDashboardComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();
  //   expect(component.alert).toEqual(expected);

  // });
});
