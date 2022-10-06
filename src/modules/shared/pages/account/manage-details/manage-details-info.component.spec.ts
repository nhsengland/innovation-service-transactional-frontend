import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { USER_INFO_INNOVATOR } from '@tests/data.mocks';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule, AuthenticationStore } from '@modules/stores';
import { SharedModule } from '@modules/shared/shared.module';
import { InnovatorOrganisationRoleEnum } from '@modules/stores/authentication/authentication.enums';

import { PageAccountManageDetailsInfoComponent } from './manage-details-info.component';


describe('Shared/Pages/Account/ManageDetails/PageAccountManageDetailsInfoComponent', () => {

  let activatedRoute: ActivatedRoute;

  let authenticationStore: AuthenticationStore;

  let component: PageAccountManageDetailsInfoComponent;
  let fixture: ComponentFixture<PageAccountManageDetailsInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        CoreModule,
        StoresModule,
        SharedModule
      ]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    activatedRoute = TestBed.inject(ActivatedRoute);

    authenticationStore = TestBed.inject(AuthenticationStore);

    authenticationStore.getUserInfo = () => USER_INFO_INNOVATOR;

  });


  it('should create the component', () => {
    fixture = TestBed.createComponent(PageAccountManageDetailsInfoComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  // it('should show "accountDetailsUpdateSuccess" alert', () => {

  //   activatedRoute.snapshot.queryParams = { alert: 'accountDetailsUpdateSuccess' };

  //   const expected = { type: 'SUCCESS', title: 'Your information has been saved' };

  //   fixture = TestBed.createComponent(PageAccountManageDetailsInfoComponent);
  //   component = fixture.componentInstance;
  //   expect(component.alert).toEqual(expected);

  // });

  // it('should show "accountDetailsUpdateError" alert', () => {

  //   activatedRoute.snapshot.queryParams = { alert: 'accountDetailsUpdateError' };

  //   const expected = { type: 'ERROR', title: 'An error occurred when creating an action', message: 'Please try again or contact us for further help' };

  //   fixture = TestBed.createComponent(PageAccountManageDetailsInfoComponent);
  //   component = fixture.componentInstance;
  //   expect(component.alert).toEqual(expected);

  // });

  // it('should have default values when isInnovatorType when organisation is shadow', () => {

  //   authenticationStore.isInnovatorType = () => true;
  //   authenticationStore.isAccessorType = () => false;
  //   authenticationStore.isAssessmentType = () => false;

  //   fixture = TestBed.createComponent(PageAccountManageDetailsInfoComponent);
  //   component = fixture.componentInstance;

  //   fixture.detectChanges();
  //   expect(component.summaryList).toEqual([
  //     { label: 'Name', value: USER_INFO_INNOVATOR.displayName, editStepNumber: 1 },
  //     { label: 'Email address', value: USER_INFO_INNOVATOR.email },
  //     { label: 'Phone number', value: USER_INFO_INNOVATOR.phone, editStepNumber: 2 }
  //   ]);

  // });

  // it('should have default values when isInnovatorType when organisation is NOT shadow', () => {

  //   authenticationStore.getUserInfo = () => ({
  //     ...USER_INFO_INNOVATOR,
  //     organisations: [{ id: 'org_id', isShadow: false, name: '', size: '', role: InnovatorOrganisationRoleEnum.INNOVATOR_OWNER }]
  //   });

  //   authenticationStore.isInnovatorType = () => true;
  //   authenticationStore.isAccessorType = () => false;
  //   authenticationStore.isAssessmentType = () => false;

  //   fixture = TestBed.createComponent(PageAccountManageDetailsInfoComponent);
  //   component = fixture.componentInstance;

  //   fixture.detectChanges();
  //   expect(component.summaryList).toEqual([
  //     { label: 'Name', value: USER_INFO_INNOVATOR.displayName, editStepNumber: 1 },
  //     { label: 'Email address', value: USER_INFO_INNOVATOR.email },
  //     { label: 'Phone number', value: USER_INFO_INNOVATOR.phone, editStepNumber: 2 },
  //     { label: 'Company', value: USER_INFO_INNOVATOR.organisations[0].name, editStepNumber: 3 },
  //     { label: 'Company size', value: USER_INFO_INNOVATOR.organisations[0].size, editStepNumber: 4 }
  //   ]);

  // });

  // it('should have default values when isAccessorType', () => {

  //   authenticationStore.isInnovatorType = () => false;
  //   authenticationStore.isAccessorType = () => true;
  //   authenticationStore.isAssessmentType = () => false;

  //   fixture = TestBed.createComponent(PageAccountManageDetailsInfoComponent);
  //   component = fixture.componentInstance;

  //   fixture.detectChanges();
  //   expect(component.summaryList).toEqual([
  //     { label: 'Name', value: USER_INFO_INNOVATOR.displayName, editStepNumber: 1 },
  //     { label: 'Email address', value: USER_INFO_INNOVATOR.email },
  //     { label: 'Organisation', value: USER_INFO_INNOVATOR.organisations[0].name },
  //     { label: 'Service roles', value: 'Owner' }
  //   ]);

  // });

  // it('should have default values when isAssessmentType', () => {

  //   authenticationStore.isInnovatorType = () => false;
  //   authenticationStore.isAccessorType = () => false;
  //   authenticationStore.isAssessmentType = () => true;

  //   fixture = TestBed.createComponent(PageAccountManageDetailsInfoComponent);
  //   component = fixture.componentInstance;

  //   fixture.detectChanges();
  //   expect(component.summaryList).toEqual([
  //     { label: 'Name', value: USER_INFO_INNOVATOR.displayName, editStepNumber: 1 },
  //     { label: 'Email address', value: USER_INFO_INNOVATOR.email }
  //   ]);

  // });

});
