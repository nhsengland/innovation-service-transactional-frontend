import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { USER_INFO_ADMIN } from '@tests/data.mocks';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule, AuthenticationStore } from '@modules/stores';

import { PageAdminAccountManageAccountInfoComponent } from './manage-account-info.component';
import { AdminModule } from '@modules/feature-modules/admin/admin.module';




describe('FeatureModules/Admin/Pages/Account?ManageAccount/PageAdminAccountManageAccountInfoComponent', () => {

  let authenticationStore: AuthenticationStore;


  let component: PageAdminAccountManageAccountInfoComponent;
  let fixture: ComponentFixture<PageAdminAccountManageAccountInfoComponent>;

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

    authenticationStore = TestBed.inject(AuthenticationStore);
    authenticationStore.getUserInfo = () => USER_INFO_ADMIN;

  });
  it('should create the component', () => {
    fixture = TestBed.createComponent(PageAdminAccountManageAccountInfoComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
