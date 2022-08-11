import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { USER_INFO_ADMIN, USER_INFO_INNOVATOR } from '@tests/data.mocks';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule, AuthenticationStore } from '@modules/stores';

import { PageAssessmentAccountManageAccountInfoComponent } from './manage-account-info.component';
import { AssessmentModule } from '@modules/feature-modules/assessment/assessment.module';
import { ActivatedRoute, Router } from '@angular/router';
import { AssessmentService } from '../../services/assessment.service';

describe('FeatureModules/Assessment/Pages/Account?ManageAccount/PageAssessmentAccountManageAccountInfoComponent', () => {

  let activatedRoute: ActivatedRoute;
  let router: Router;
  let routerSpy: jasmine.Spy;
  let assessmentService: AssessmentService;
  let component: PageAssessmentAccountManageAccountInfoComponent;
  let fixture: ComponentFixture<PageAssessmentAccountManageAccountInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        CoreModule,
        StoresModule,
        AssessmentModule,
      ],
    });
    AppInjector.setInjector(TestBed.inject(Injector));

    activatedRoute = TestBed.inject(ActivatedRoute);
    router = TestBed.inject(Router);
    routerSpy = spyOn(router, 'navigate');

    assessmentService = TestBed.inject(AssessmentService);

  });
  it('should create the component', () => {
    fixture = TestBed.createComponent(
      PageAssessmentAccountManageAccountInfoComponent
    );
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
