import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { of, throwError } from 'rxjs';

import { USER_INFO_INNOVATOR } from '@tests/data.mocks';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule, AuthenticationStore } from '@modules/stores';
import { InnovatorModule } from '@modules/feature-modules/innovator/innovator.module';

import { PageAccountManageAccountInfoComponent } from './manage-account-info.component';




describe('FeatureModules/Innovator/Pages/Account/Manageaccount/PageAccountManageAccountInfoComponent', () => {

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
        InnovatorModule
      ]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    authenticationStore = TestBed.inject(AuthenticationStore);
    authenticationStore.getUserInfo = () => USER_INFO_INNOVATOR;

  });
  it('should create the component', () => {
    fixture = TestBed.createComponent(PageAccountManageAccountInfoComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
