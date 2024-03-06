import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';

import { USER_INFO_INNOVATOR } from '@tests/data.mocks';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule, AuthenticationStore } from '@modules/stores';
import { InnovatorModule } from '@modules/feature-modules/innovator/innovator.module';

import { PageSharedAccountManageAccountInfoComponent } from './manage-account-info.component';

describe('FeatureModules/Innovator/Pages/Account/PageAccountInfoComponent', () => {
  let authenticationStore: AuthenticationStore;

  let component: PageSharedAccountManageAccountInfoComponent;
  let fixture: ComponentFixture<PageSharedAccountManageAccountInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, CoreModule, StoresModule, InnovatorModule]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    authenticationStore = TestBed.inject(AuthenticationStore);
    authenticationStore.getUserInfo = () => USER_INFO_INNOVATOR;
  });

  it('should create the component', () => {
    fixture = TestBed.createComponent(PageSharedAccountManageAccountInfoComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
