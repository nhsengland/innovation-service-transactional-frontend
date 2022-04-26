import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { of, throwError } from 'rxjs';

import { USER_INFO_ASSESSMENT } from '@tests/data.mocks';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule, AuthenticationStore } from '@modules/stores';
import { AssessmentModule } from '@modules/feature-modules/assessment/assessment.module';

import { PageAccountAssessmentManageAccountInfoComponent } from './manage-account-info.component';




describe('FeatureModules/Assessment/Pages/Account/Manageaccount/PageAccountAssessmentManageAccountInfoComponent', () => {

  let authenticationStore: AuthenticationStore;


  let component: PageAccountAssessmentManageAccountInfoComponent;
  let fixture: ComponentFixture<PageAccountAssessmentManageAccountInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        CoreModule,
        StoresModule,
        AssessmentModule
      ]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    authenticationStore = TestBed.inject(AuthenticationStore);
    authenticationStore.getUserInfo = () => USER_INFO_ASSESSMENT;

  });
  it('should create the component', () => {
    fixture = TestBed.createComponent(PageAccountAssessmentManageAccountInfoComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
