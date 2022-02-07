import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

import { Injector } from '@angular/core';
import { Router } from '@angular/router';
import { FormEngineComponent } from '@modules/shared/forms';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule, AuthenticationStore } from '@modules/stores';
import { AdminModule } from '@modules/feature-modules/admin/admin.module';

import { PageServiceUsersNewComponent } from './service-users-new.component';
import { OrganisationsService } from '@shared-module/services/organisations.service';
import { ServiceUsersService } from '@modules/feature-modules/admin/services/service-users.service';

describe('FeatureModules/Admin/Pages/ServiceUsers/PageServiceUsersNewComponent', () => {

  let component: PageServiceUsersNewComponent;
  let fixture: ComponentFixture<PageServiceUsersNewComponent>;
  let router: Router;
  let routerSpy: jasmine.Spy;

  let authenticationStore: AuthenticationStore;
  let serviceUserService: ServiceUsersService;
  let organisationsService: OrganisationsService;

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
    routerSpy = spyOn(router, 'navigate');

    authenticationStore = TestBed.inject(AuthenticationStore);
    serviceUserService = TestBed.inject(ServiceUsersService);
    organisationsService = TestBed.inject(OrganisationsService);

  });

  it('should create the component', () => {
    fixture = TestBed.createComponent(PageServiceUsersNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should NOT have default information loaded', () => {

    organisationsService.getOrganisationUnits = () => throwError('error');

    fixture = TestBed.createComponent(PageServiceUsersNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.pageStatus).toBe('READY');

  });

  it('should run onSubmitStep() with UNDEFINED formEngineComponent field', () => {

    fixture = TestBed.createComponent(PageServiceUsersNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.formEngineComponent = undefined;

    component.onSubmitStep('next');
    expect(component.wizard.currentStepId).toBe(1);
  });

  it('should run onSubmitStep() and DO NOTHING with form NOT valid', () => {

    fixture = TestBed.createComponent(PageServiceUsersNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.formEngineComponent = TestBed.createComponent(FormEngineComponent).componentInstance;
    component.formEngineComponent.getFormValues = () => ({ valid: false, data: { value :'SA'} });

    component.onSubmitStep('next');
    
    expect(component.wizard.currentStepId).toBe(1);
  });

  it('should run onSubmitStep() and redirect because is the first step', () => {

    fixture = TestBed.createComponent(PageServiceUsersNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.formEngineComponent = TestBed.createComponent(FormEngineComponent).componentInstance;
    component.formEngineComponent.getFormValues = () => ({ valid: true, data: { value: 'some value' } });

    component.onSubmitStep('previous');
    expect(routerSpy).toHaveBeenCalledWith(['innovator'], {});// TBD
  });

  it('should run onSubmitStep() and go to previous step', () => {

    fixture = TestBed.createComponent(PageServiceUsersNewComponent);
    component = fixture.componentInstance;
    component.formEngineComponent = TestBed.createComponent(FormEngineComponent).componentInstance;
    component.formEngineComponent.getFormValues = () => ({ valid: true, data: { value: 'some value' } });
    fixture.detectChanges();

    component.wizard.gotoStep(3);

    component.onSubmitStep('previous');
    expect(component.wizard.currentStepId).toBe(2);

  });

  it('should run onSubmitStep() and go to next step', () => {

    fixture = TestBed.createComponent(PageServiceUsersNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.formEngineComponent = TestBed.createComponent(FormEngineComponent).componentInstance;
    component.formEngineComponent.getFormValues = () => ({ valid: true, data: { value: 'some value' } });
    component.wizard.gotoStep(1);

    component.onSubmitStep('next');
    expect(component.wizard.currentStepId).toBe(2);

  });

  it('should run onSubmitStep() and do NOTHING with invalid action', () => {

    fixture = TestBed.createComponent(PageServiceUsersNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.formEngineComponent = TestBed.createComponent(FormEngineComponent).componentInstance;
    component.formEngineComponent.getFormValues = () => ({ valid: true, data: { value: 'some value' } });
    component.wizard.gotoStep(1);

    component.onSubmitStep('invalid' as any);
    expect(component.wizard.currentStepId).toBe(1);

  });

  it('should run onSubmitWizard() with API success', () => {

    authenticationStore.initializeAuthentication$ = () => of(true);
    serviceUserService.createUser = () => of('');

    fixture = TestBed.createComponent(PageServiceUsersNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.onSubmitWizard();
    expect(routerSpy).toHaveBeenCalledWith(['admin/service-users'], { queryParams: { alert: 'alertDisabled' } });
  });

  it('should run onSubmitWizard() with API error', () => {

    serviceUserService.createUser = () => throwError('error');

    fixture = TestBed.createComponent(PageServiceUsersNewComponent);
    component = fixture.componentInstance;

    component.onSubmitWizard();
    fixture.detectChanges();
    expect(component.alert).toEqual({
      type: 'ERROR',
      title: 'An unknown error occurred',
      message: 'You may try to go back and try again.',
      setFocus: true
    });

  });
});
