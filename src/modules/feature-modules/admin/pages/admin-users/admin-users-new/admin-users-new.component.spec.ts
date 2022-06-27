import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule, AuthenticationStore } from '@modules/stores';
import { FormEngineComponent } from '@modules/shared/forms';
import { AdminModule } from '@modules/feature-modules/admin/admin.module';

import { PageAdminUsersNewComponent } from './admin-users-new.component';

import { OrganisationsService } from '@modules/shared/services/organisations.service';
import { ServiceUsersService } from '@modules/feature-modules/admin/services/service-users.service';


describe('FeatureModules/Admin/Pages/AdminUsers/PageAdminUsersNewComponent', () => {

  let component: PageAdminUsersNewComponent;
  let fixture: ComponentFixture<PageAdminUsersNewComponent>;
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

    organisationsService.getOrganisationUnits = () => of([
      { id: 'orgId', acronym: 'orgId01', name: 'Org name 01', organisationUnits: [{ id: 'orgId', acronym: 'orgId01', name: 'Org name 01' }] },
      { id: 'orgId', acronym: 'orgId02', name: 'Org name 02', organisationUnits: [{ id: 'orgId', acronym: 'orgId01', name: 'Org name 01' }] }
    ]);

  });

  it('should create the component', () => {
    fixture = TestBed.createComponent(PageAdminUsersNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should NOT have default information loaded', () => {

    organisationsService.getOrganisationUnits = () => throwError('error');

    fixture = TestBed.createComponent(PageAdminUsersNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.pageStatus).toBe('READY');

  });

  it('should run onSubmitStep() with UNDEFINED formEngineComponent field', () => {

    fixture = TestBed.createComponent(PageAdminUsersNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.formEngineComponent = undefined;

    component.onSubmitStep('next');
    expect(component.wizard.currentStepId).toBe(1);
  });

  it('should run onSubmitStep() and DO NOTHING with form NOT valid', () => {

    fixture = TestBed.createComponent(PageAdminUsersNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.formEngineComponent = TestBed.createComponent(FormEngineComponent).componentInstance;
    component.formEngineComponent.getFormValues = () => ({ valid: false, data: { value: 'SA' } });

    component.onSubmitStep('next');

    expect(component.wizard.currentStepId).toBe(1);
  });


  it('should run onSubmitStep() and go to previous step', () => {

    fixture = TestBed.createComponent(PageAdminUsersNewComponent);
    component = fixture.componentInstance;
    component.formEngineComponent = TestBed.createComponent(FormEngineComponent).componentInstance;
    component.formEngineComponent.getFormValues = () => ({ valid: true, data: { value: 'some value' } });
    fixture.detectChanges();

    component.wizard.gotoStep(3);

    component.onSubmitStep('previous');
    expect(component.wizard.currentStepId).toBe(2);

  });

  it('should run onSubmitStep() and go to next step', () => {

    fixture = TestBed.createComponent(PageAdminUsersNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.formEngineComponent = TestBed.createComponent(FormEngineComponent).componentInstance;
    component.formEngineComponent.getFormValues = () => ({ valid: true, data: { value: 'some value' } });
    component.wizard.gotoStep(1);

    component.onSubmitStep('next');
    expect(component.wizard.currentStepId).toBe(2);

  });

  it('should run onSubmitStep() and do NOTHING with invalid action', () => {

    fixture = TestBed.createComponent(PageAdminUsersNewComponent);
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
    serviceUserService.createUser = () => of({id: 'User01'});

    fixture = TestBed.createComponent(PageAdminUsersNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.onSubmitWizard();
    expect(routerSpy).toHaveBeenCalledWith(['admin/administration-users/User01'], { queryParams: { alert: 'adminCreationSuccess' } });

  });

  it('should run onSubmitWizard() with API error, returning 2LS ID', () => {

    serviceUserService.createUser = () => throwError({id: '123456ABCDFG' });

    fixture = TestBed.createComponent(PageAdminUsersNewComponent);
    component = fixture.componentInstance;
    component.form.get('code')?.setValue('12345');
    component.onSubmitWizard();

    expect(component.pageStep).toBe('CODE_REQUEST');

  });

  it('should run onSubmitWizard()  and call api with error, having already a security confirmation id ', () => {

    serviceUserService.createUser = () => throwError({ id: '123456ABCDFG' });

    fixture = TestBed.createComponent(PageAdminUsersNewComponent);
    component = fixture.componentInstance;
    component.form.get('code')?.setValue('invalidCode');
    component.securityConfirmation.id = '2lsId';

    component.onSubmitWizard();
    expect(component.form.valid).toBe(false);

  });

  it('should return `null` when email is valid', (() => {
    fixture = TestBed.createComponent(PageAdminUsersNewComponent);
    component = fixture.componentInstance;
    const formData = component.formEngineComponent?.getFormValues();
    component.wizard.addAnswers({ ...formData, email: 'example@test.com' }).runRules();

    const result: any = serviceUserService.userEmailValidator();
    expect(result.customError).toBeUndefined();
  }));

  it('should run onSubmitStep() and redirect because is the first step', () => {

    fixture = TestBed.createComponent(PageAdminUsersNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.formEngineComponent = TestBed.createComponent(FormEngineComponent).componentInstance;
    component.formEngineComponent.getFormValues = () => ({ valid: true, data: { value: 'some value' } });

    component.onSubmitStep('previous');
    expect(routerSpy).toHaveBeenCalledWith(['innovator'], {});

  });

});
