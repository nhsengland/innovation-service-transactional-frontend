import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule, AuthenticationStore } from '@modules/stores';
import { FormEngineComponent } from '@modules/shared/forms';
import { AdminModule } from '@modules/feature-modules/admin/admin.module';

import { PageOrganisationNewComponent } from './organisation-new.component';
import { OrganisationsService } from '../../services/organisations.service';
import { ServiceUsersService } from '../../services/service-users.service';

describe('FeatureModules/Admin/Pages/Organisations/PageOrganisationNewComponent', () => {
  let component: PageOrganisationNewComponent;
  let fixture: ComponentFixture<PageOrganisationNewComponent>;
  let router: Router;
  let routerSpy: jest.SpyInstance;

  let authenticationStore: AuthenticationStore;
  let organisationsService: OrganisationsService;
  let serviceUserService: ServiceUsersService;

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

    router = TestBed.inject(Router);
    routerSpy = jest.spyOn(router, 'navigate');

    authenticationStore = TestBed.inject(AuthenticationStore);
    serviceUserService = TestBed.inject(ServiceUsersService);
    organisationsService = TestBed.inject(OrganisationsService);

  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageOrganisationNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have default information loaded', () => {
    expect(component.pageStatus).toBe('READY');
  });

  it('should have as title "New Organisation"', () => {
    expect(component.pageTitle).toEqual('New Organisation');
  });

  it('should run onSubmitStep() with UNDEFINED formEngineComponent field', () => {
    component.formEngineComponent = undefined;

    component.onSubmitStep('next');
    expect(component.wizard.currentStepId).toBe(1);
  });

  it('should run onSubmitStep() and DO NOTHING with form NOT valid', () => {
    component.formEngineComponent = TestBed.createComponent(FormEngineComponent).componentInstance;
    component.formEngineComponent.getFormValues = () => ({ valid: false, data: { value: 'SA' } });

    component.onSubmitStep('next');

    expect(component.wizard.currentStepId).toBe(1);
  });

  it('should run onSubmitStep() and go to previous step', () => {
    component.formEngineComponent = TestBed.createComponent(FormEngineComponent).componentInstance;
    component.formEngineComponent.getFormValues = () => ({ valid: true, data: { value: 'some value' } });
    fixture.detectChanges();

    component.wizard.gotoStep(3);

    component.onSubmitStep('previous');
    expect(component.wizard.currentStepId).toBe(2);
  });

  it('should run onSubmitStep() and go to next step', () => {
    component.formEngineComponent = TestBed.createComponent(FormEngineComponent).componentInstance;
    component.formEngineComponent.getFormValues = () => ({ valid: true, data: { value: 'some value' } });
    component.wizard.gotoStep(1);

    component.onSubmitStep('next');
    expect(component.wizard.currentStepId).toBe(2);

  });

  it('should run onSubmitStep() and do NOTHING with invalid action', () => {
    component.formEngineComponent = TestBed.createComponent(FormEngineComponent).componentInstance;
    component.formEngineComponent.getFormValues = () => ({ valid: true, data: { value: 'some value' } });
    component.wizard.gotoStep(1);

    component.onSubmitStep('invalid' as any);
    expect(component.wizard.currentStepId).toBe(1);

  });

  it('should run onSubmitWizard() with API success', () => {

    authenticationStore.initializeAuthentication$ = () => of(true);
    organisationsService.createOrganisation = () => of({id: 'organisation01'});

    component.onSubmitWizard();
    expect(routerSpy).toHaveBeenCalledWith(['admin/organisations/organisation01'], { queryParams: { alert: 'organisationCreationSuccess' } });

  });

  it('should run onSubmitStep() and redirect because is the first step', () => {
    component.formEngineComponent = TestBed.createComponent(FormEngineComponent).componentInstance;
    component.formEngineComponent.getFormValues = () => ({ valid: true, data: { value: 'some value' } });

    component.onSubmitStep('previous');
    expect(routerSpy).toHaveBeenCalledWith(['organisations'], {});

  });

});
