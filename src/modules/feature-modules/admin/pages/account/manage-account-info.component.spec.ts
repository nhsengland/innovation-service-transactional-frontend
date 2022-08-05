import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule, AuthenticationStore } from '@modules/stores';
import { AdminModule } from '@modules/feature-modules/admin/admin.module';

import { USER_INFO_ADMIN } from '@tests/data.mocks';

import { PageAccountManageAccountInfoComponent } from './manage-account-info.component';


describe('FeatureModules/Admin/Pages/Account/PageAccountManageAccountInfoComponent', () => {

  let authenticationStore: AuthenticationStore;

  let component: PageAccountManageAccountInfoComponent;
  let fixture: ComponentFixture<PageAccountManageAccountInfoComponent>;

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
    fixture = TestBed.createComponent(PageAccountManageAccountInfoComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

});
