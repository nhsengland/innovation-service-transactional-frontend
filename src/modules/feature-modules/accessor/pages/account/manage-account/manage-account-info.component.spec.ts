import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { of, throwError } from 'rxjs';

import { USER_INFO_ACCESSOR } from '@tests/data.mocks';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule, AuthenticationStore } from '@modules/stores';
import { InnovatorModule } from '@modules/feature-modules/innovator/innovator.module';

import { PageAccountAccessorManageAccountInfoComponent } from './manage-account-info.component';




describe('FeatureModules/Accessor/Pages/Account/Manageaccount/PageAccountAccessorManageAccountInfoComponent', () => {

  let authenticationStore: AuthenticationStore;


  let component: PageAccountAccessorManageAccountInfoComponent;
  let fixture: ComponentFixture<PageAccountAccessorManageAccountInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        CoreModule,
        StoresModule,
        InnovatorModule
      ]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    authenticationStore = TestBed.inject(AuthenticationStore);
    authenticationStore.getUserInfo = () => USER_INFO_ACCESSOR;

  });
  it('should create the component', () => {
    fixture = TestBed.createComponent(PageAccountAccessorManageAccountInfoComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
