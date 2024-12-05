import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AppInjector, CoreModule } from '@modules/core';
import { AdminModule } from '@modules/feature-modules/admin/admin.module';
import { FormEngineComponent } from '@modules/shared/forms';
import { CtxStore, StoresModule } from '@modules/stores';

import { PageOrganisationEditComponent } from './organisation-edit.component';

import { AdminOrganisationsService } from '@modules/feature-modules/admin/services/admin-organisations.service';
import { AdminUsersService } from '@modules/feature-modules/admin/services/users.service';
import { OrganisationsService } from '@modules/shared/services/organisations.service';

describe('FeatureModules/Admin/Pages/Organisations/PageOrganisationEditComponent', () => {
  let component: PageOrganisationEditComponent;
  let fixture: ComponentFixture<PageOrganisationEditComponent>;
  let router: Router;
  let routerSpy: jest.SpyInstance;
  let activatedRoute: ActivatedRoute;
  let ctx: CtxStore;
  let usersService: AdminUsersService;
  let organisationsService: OrganisationsService;
  let adminOrganisationsService: AdminOrganisationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterModule.forRoot([]), CoreModule, StoresModule, AdminModule]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    router = TestBed.inject(Router);
    routerSpy = jest.spyOn(router, 'navigate');
    activatedRoute = TestBed.inject(ActivatedRoute);
    ctx = TestBed.inject(CtxStore);
    usersService = TestBed.inject(AdminUsersService);
    organisationsService = TestBed.inject(OrganisationsService);
    adminOrganisationsService = TestBed.inject(AdminOrganisationsService);
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

    expect(component.pageStatus()).toBe('ERROR');
  });

  it('should run getOrganisation()', () => {
    activatedRoute.snapshot.params = { organisationId: 'orgId' };
    organisationsService.getOrganisationInfo = () =>
      of({
        id: 'orgId',
        name: 'Org name',
        acronym: 'ORG',
        isActive: true,
        organisationUnits: [{ id: 'orgUnitId', name: 'Org Unit name', acronym: 'ORGu', isActive: true, userCount: 10 }]
      });

    fixture = TestBed.createComponent(PageOrganisationEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.pageStatus()).toEqual('READY');
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
    ctx.user.initializeAuthentication$ = () => of(true);
    adminOrganisationsService.updateOrganisation = () => of({ organisationId: 'Org01', status: 'OK' });

    fixture = TestBed.createComponent(PageOrganisationEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.onSubmitWizard();
    expect(routerSpy).toHaveBeenCalledWith(['admin/organisations/Org01'], {
      queryParams: { alert: 'updateOrganisationSuccess' }
    });
  });
  it('should run onSubmitWizard() with API success when updating unit', () => {
    activatedRoute.snapshot.params = { organisationId: 'Org01', organisationUnitId: 'Unit01' };
    activatedRoute.snapshot.data = { module: 'Unit' };
    ctx.user.initializeAuthentication$ = () => of(true);
    adminOrganisationsService.updateUnit = () => of({ unitId: 'Unit01' });

    fixture = TestBed.createComponent(PageOrganisationEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.onSubmitWizard();
    expect(routerSpy).toHaveBeenCalledWith(['admin/organisations/Org01/unit/Unit01'], { queryParams: {} });
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
    expect(routerSpy).toHaveBeenCalledWith([`organisations/${component.organisationId}`], { queryParams: {} });
  });
});
