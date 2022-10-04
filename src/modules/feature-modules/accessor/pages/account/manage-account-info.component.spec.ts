import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { USER_INFO_ACCESSOR } from '@tests/data.mocks';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule, AuthenticationStore } from '@modules/stores';

import { PageAccessorAccountManageAccountInfoComponent } from './manage-account-info.component';
import { AccessorModule } from '@modules/feature-modules/accessor/accessor.module';

describe('FeatureModules/Accessor/Pages/Account?ManageAccount/PageAccessorAccountManageAccountInfoComponent', () => {
  let authenticationStore: AuthenticationStore;

  let component: PageAccessorAccountManageAccountInfoComponent;
  let fixture: ComponentFixture<PageAccessorAccountManageAccountInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        CoreModule,
        StoresModule,
        AccessorModule,
      ],
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    authenticationStore = TestBed.inject(AuthenticationStore);
    authenticationStore.getUserInfo = () => USER_INFO_ACCESSOR;
  });

  it('should create the component', () => {
    fixture = TestBed.createComponent(
      PageAccessorAccountManageAccountInfoComponent
    );
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

});
