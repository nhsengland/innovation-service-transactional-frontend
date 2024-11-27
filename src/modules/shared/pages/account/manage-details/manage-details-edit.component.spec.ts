import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Injector, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { of } from 'rxjs';

import { USER_INFO_ACCESSOR } from '@tests/data.mocks';

import { AppInjector, CoreModule } from '@modules/core';
import { FormEngineComponent } from '@modules/shared/forms';
import { SharedModule } from '@modules/shared/shared.module';
import {
  CtxStore,
  InnovationContextService,
  InnovationContextStore,
  AssessmentContextStore,
  AssessmentContextService,
  SchemaContextStore,
  SchemaContextService,
  LayoutContextStore,
  NotificationsContextStore,
  NotificationsContextService
} from '@modules/stores';

import { PageAccountManageDetailsEditComponent } from './manage-details-edit.component';

import { ACCOUNT_DETAILS_ACCESSOR } from './manage-details-edit-accessor.config';
import { ACCOUNT_DETAILS_INNOVATOR } from './manage-details-edit-innovator.config';
import { ENV } from '@tests/app.mocks';
import { UserContextService } from '@modules/stores/ctx/user/user.service';
import { UserContextStore } from '@modules/stores/ctx/user/user.store';

describe('Shared/Pages/Account/ManageDetails/PageAccountManageDetailsEditComponent', () => {
  let activatedRoute: ActivatedRoute;
  let ctx: CtxStore;

  let component: PageAccountManageDetailsEditComponent;
  let fixture: ComponentFixture<PageAccountManageDetailsEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterModule.forRoot([]), CoreModule, SharedModule],
      providers: [
        CtxStore,
        InnovationContextStore,
        InnovationContextService,
        AssessmentContextStore,
        AssessmentContextService,
        SchemaContextStore,
        SchemaContextService,
        LayoutContextStore,
        NotificationsContextStore,
        NotificationsContextService,
        UserContextStore,
        UserContextService,
        { provide: 'APP_SERVER_ENVIRONMENT_VARIABLES', useValue: ENV }
      ]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    ctx = TestBed.inject(CtxStore);
    activatedRoute = TestBed.inject(ActivatedRoute);

    ctx.user.getUserInfo = signal(USER_INFO_ACCESSOR);
  });

  it('should create the component', () => {
    fixture = TestBed.createComponent(PageAccountManageDetailsEditComponent);
    component = fixture.componentInstance;

    expect(component).toBeTruthy();
  });

  it('should be a question step', () => {
    activatedRoute.snapshot.params = { stepId: 1 };
    ctx.user.isInnovator = signal(true);

    fixture = TestBed.createComponent(PageAccountManageDetailsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.isQuestionStep()).toBe(true);
  });

  it('should be summary step', () => {
    activatedRoute.snapshot.params = { stepId: 'summary' };
    activatedRoute.params = of({ stepId: 'summary' }); // Simulate activatedRoute.params subscription.
    ctx.user.isInnovator = signal(true);

    fixture = TestBed.createComponent(PageAccountManageDetailsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.isSummaryStep()).toBe(true);
  });

  it('should load innovator information', () => {
    activatedRoute.snapshot.params = { stepId: 1 };
    activatedRoute.params = of({ stepId: 1 }); // Simulate activatedRoute.params subscription.
    ctx.user.isInnovator = signal(true);

    fixture = TestBed.createComponent(PageAccountManageDetailsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.wizard).toBe(ACCOUNT_DETAILS_INNOVATOR);
  });

  it('should load accessor information', () => {
    activatedRoute.snapshot.params = { stepId: 1 };
    activatedRoute.params = of({ stepId: 1 }); // Simulate activatedRoute.params subscription.
    ctx.user.isAccessorOrAssessment = signal(true);

    fixture = TestBed.createComponent(PageAccountManageDetailsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.wizard).toBe(ACCOUNT_DETAILS_ACCESSOR);
  });

  it('should load assessment information', () => {
    activatedRoute.snapshot.params = { stepId: 1 };
    activatedRoute.params = of({ stepId: 1 }); // Simulate activatedRoute.params subscription.
    ctx.user.isAccessorOrAssessment = signal(true);

    fixture = TestBed.createComponent(PageAccountManageDetailsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.wizard).toBe(ACCOUNT_DETAILS_ACCESSOR);
  });

  it('should do nothing when submitting a step and form not is valid', () => {
    activatedRoute.snapshot.params = { stepId: 1 };
    activatedRoute.params = of({ stepId: 1 }); // Simulate activatedRoute.params subscription.
    ctx.user.isInnovator = signal(true);

    const expected = {
      displayName: 'Test qualifying Accessor',
      mobilePhone: '212000000',
      isCompanyOrOrganisation: 'YES',
      organisationName: 'organisation_1',
      organisationSize: '',
      organisationAdditionalInformation: { id: 'org_id' },
      contactByPhoneTimeframe: null,
      contactDetails: null,
      hasRegistrationNumber: 'NO',
      organisationDescription: 'Sole trader',
      organisationRegistrationNumber: null,
      contactPreferences: []
    };

    fixture = TestBed.createComponent(PageAccountManageDetailsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.formEngineComponent = TestBed.createComponent(FormEngineComponent).componentInstance;
    jest
      .spyOn(component.formEngineComponent, 'getFormValues')
      .mockReturnValue({ valid: false, data: { value1: 'some value' } });
    component.onSubmitStep('next', new Event(''));
    fixture.detectChanges();

    expect(component.wizard.getAnswers()).toEqual(expected);
  });

  // it('should redirect when submitting a step', () => {

  //   const routerSpy = jest.spyOn(TestBed.inject(Router), 'navigate');

  //   activatedRoute.snapshot.data = { module: 'innovator' };
  //   activatedRoute.snapshot.params = { stepId: 1 };
  //   activatedRoute.params = of({ stepId: 1 }); // Simulate activatedRoute.params subscription.
  //   authenticationStore.isInnovatorType = () => true;

  //   fixture = TestBed.createComponent(PageAccountManageDetailsEditComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();

  //   component.formEngineComponent = TestBed.createComponent(FormEngineComponent).componentInstance;
  //   jest.spyOn(component.formEngineComponent, 'getFormValues').and.returnValue({ valid: true });
  //   component.onSubmitStep('next', new Event(''));
  //   fixture.detectChanges();

  //   expect(routerSpy).toHaveBeenCalledWith(['/innovator/account/manage-details/edit/2']);

  // });
});
