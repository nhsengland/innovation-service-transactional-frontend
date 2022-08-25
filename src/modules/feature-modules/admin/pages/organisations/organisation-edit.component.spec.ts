import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule, AuthenticationStore } from '@modules/stores';
import { FormEngineComponent } from '@modules/shared/forms';
import { AdminModule } from '@modules/feature-modules/admin/admin.module';

import { PageOrganisationEditComponent } from './organisation-edit.component';

import { OrganisationsService } from '@modules/feature-modules/admin/services/organisations.service';
import { ServiceUsersService } from '@modules/feature-modules/admin/services/service-users.service';


describe('FeatureModules/Admin/Pages/Organisations/PageOrganisationEditComponent', () => {

  let component: PageOrganisationEditComponent;
  let fixture: ComponentFixture<PageOrganisationEditComponent>;
  let router: Router;
  let routerSpy: jasmine.Spy;
  let activatedRoute: ActivatedRoute;
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
    activatedRoute = TestBed.inject(ActivatedRoute);
    authenticationStore = TestBed.inject(AuthenticationStore);
    serviceUserService = TestBed.inject(ServiceUsersService);
    organisationsService = TestBed.inject(OrganisationsService);
  });

  it('should create the component', () => {
    fixture = TestBed.createComponent(PageOrganisationEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should NOT have default information loaded', () => {
    activatedRoute.snapshot.params = { organisationId: 'orgId' };

    organisationsService.getOrganisationInfo = () => throwError('error');

    fixture = TestBed.createComponent(PageOrganisationEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.pageStatus).toBe('ERROR');

  });

  it('should run getOrganisation()', () => {
    activatedRoute.snapshot.params = { organisationId: 'orgId' };
    organisationsService.getOrganisationInfo = () => of({
      id: 'orgId', name: 'Org name', acronym: 'ORG', isActive: true,
      organisationUnits: [{ id: 'orgUnitId', name: 'Org Unit name', acronym: 'ORGu', isActive: true, userCount: 10 }]
    });

    fixture = TestBed.createComponent(PageOrganisationEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.pageStatus).toEqual('READY');
  });


  it('should run onSubmitStep() with UNDEFINED formEngineComponent field', () => {

    fixture = TestBed.createComponent(PageOrganisationEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.formEngineComponent = undefined;

    component.onSubmitStep('next');
    expect(component.wizard.currentStepId).toBe(1);
  });

  it('should run onSubmitStep() and DO NOTHING with form NOT valid', () => {

    fixture = TestBed.createComponent(PageOrganisationEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.formEngineComponent = TestBed.createComponent(FormEngineComponent).componentInstance;
    component.formEngineComponent.getFormValues = () => ({ valid: false, data: { value: 'SA' } });

    component.onSubmitStep('next');

    expect(component.wizard.currentStepId).toBe(1);
  });


  it('should run onSubmitStep() and go to previous step', () => {

    fixture = TestBed.createComponent(PageOrganisationEditComponent);
    component = fixture.componentInstance;
    component.formEngineComponent = TestBed.createComponent(FormEngineComponent).componentInstance;
    component.formEngineComponent.getFormValues = () => ({ valid: true, data: { value: 'some value' } });
    fixture.detectChanges();

    component.wizard.gotoStep(3);

    component.onSubmitStep('previous');
    expect(component.wizard.currentStepId).toBe(2);

  });

  it('should run onSubmitStep() and go to next step', () => {

    fixture = TestBed.createComponent(PageOrganisationEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.formEngineComponent = TestBed.createComponent(FormEngineComponent).componentInstance;
    component.formEngineComponent.getFormValues = () => ({ valid: true, data: { value: 'some value' } });
    component.wizard.gotoStep(1);

    component.onSubmitStep('next');
    expect(component.wizard.currentStepId).toBe(2);

  });

  it('should run onSubmitStep() and do NOTHING with invalid action', () => {

    fixture = TestBed.createComponent(PageOrganisationEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.formEngineComponent = TestBed.createComponent(FormEngineComponent).componentInstance;
    component.formEngineComponent.getFormValues = () => ({ valid: true, data: { value: 'some value' } });
    component.wizard.gotoStep(1);

    component.onSubmitStep('invalid' as any);
    expect(component.wizard.currentStepId).toBe(1);

  });

  it('should run onSubmitWizard() with API success when updating organisation', () => {
    activatedRoute.snapshot.data = { module: 'Organisation' };
    authenticationStore.initializeAuthentication$ = () => of(true);
    organisationsService.updateOrganisation = () => of({ id: 'Org01', status: 'OK' });

    fixture = TestBed.createComponent(PageOrganisationEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.onSubmitWizard();
    expect(routerSpy).toHaveBeenCalledWith(['admin/organisations/Org01'], { queryParams: { alert: 'updateOrganisationSuccess' } });

  });
  it('should run onSubmitWizard() with API success when updating unit', () => {
    activatedRoute.snapshot.params = { organisationId: 'Org01', organisationUnitId: 'Unit01' };
    activatedRoute.snapshot.data = { module: 'Unit' };
    authenticationStore.initializeAuthentication$ = () => of(true);
    organisationsService.updateUnit = () => of({ id: 'Unit01', status: 'OK' });

    fixture = TestBed.createComponent(PageOrganisationEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.onSubmitWizard();
    expect(routerSpy).toHaveBeenCalledWith(['admin/organisations/Org01'], { queryParams: { alert: 'updateUnitSuccess' } });

  });

  it('should run onSubmitWizard() with API error, returning SLS ID when updating organisation', () => {
    activatedRoute.snapshot.params = { organisationId: 'Org01' };
    activatedRoute.snapshot.data = { module: 'Organisation' };
    authenticationStore.initializeAuthentication$ = () => of(true);

    organisationsService.updateOrganisation = () => throwError({ id: '123456ABCDFG' });

    fixture = TestBed.createComponent(PageOrganisationEditComponent);
    component = fixture.componentInstance;
    component.form.get('code')?.setValue('12345');
    component.onSubmitWizard();

    expect(component.pageStep).toBe('CODE_REQUEST');

  });

  it('should run onSubmitWizard() with API error, returning SLS ID when updating unt', () => {
    activatedRoute.snapshot.params = { organisationId: 'Org01', organisationUnitId: 'Unit01' };
    activatedRoute.snapshot.data = { module: 'Unit' };
    authenticationStore.initializeAuthentication$ = () => of(true);

    organisationsService.updateUnit = () => throwError({ id: '123456ABCDFG' });

    fixture = TestBed.createComponent(PageOrganisationEditComponent);
    component = fixture.componentInstance;
    component.form.get('code')?.setValue('12345');
    component.onSubmitWizard();

    expect(component.pageStep).toBe('CODE_REQUEST');

  });
  it('should run onSubmitWizard() with API error when updating organisation', () => {
    activatedRoute.snapshot.params = { organisationId: 'Org01' };
    activatedRoute.snapshot.data = { module: 'Organisation' };
    organisationsService.updateOrganisation = () => throwError('error');

    fixture = TestBed.createComponent(PageOrganisationEditComponent);
    component = fixture.componentInstance;
    component.form.get('code')?.setValue('12345');
    component.onSubmitWizard();

    expect(component.form.invalid).toBe(true);

  });
  it('should run onSubmitWizard() with API error when updating unit', () => {
    activatedRoute.snapshot.params = { organisationId: 'Org01', organisationUnitId: 'Unit01' };
    activatedRoute.snapshot.data = { module: 'Unit' };
    organisationsService.updateUnit = () => throwError('error');

    fixture = TestBed.createComponent(PageOrganisationEditComponent);
    component = fixture.componentInstance;
    component.form.get('code')?.setValue('12345');
    component.onSubmitWizard();

    expect(component.form.invalid).toBe(true);

  });
  it('should run onSubmitStep() and redirect because is the first step', () => {
    activatedRoute.snapshot.params = { organisationId: 'Org01' };
    activatedRoute.snapshot.data = { module: 'Unit' };

    fixture = TestBed.createComponent(PageOrganisationEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.formEngineComponent = TestBed.createComponent(FormEngineComponent).componentInstance;
    component.formEngineComponent.getFormValues = () => ({ valid: true, data: { value: 'some value' } });

    component.onSubmitStep('previous');
    expect(routerSpy).toHaveBeenCalledWith([`organisations/${component.organisationId}`], {});

  });

});
