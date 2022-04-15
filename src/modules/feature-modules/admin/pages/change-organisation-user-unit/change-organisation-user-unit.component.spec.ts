import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { AdminModule } from '@modules/feature-modules/admin/admin.module';

import { PageServiceChangeOrganisationUserUnitComponent } from './change-organisation-user-unit.component';

import { changeUserTypeDTO, getOrganisationUnitRulesOutDTO, orgnisationRole, ServiceUsersService } from '@modules/feature-modules/admin/services/service-users.service';
import { OrganisationsService } from '@modules/shared/services/organisations.service';
import { FormEngineComponent } from '@modules/shared/forms';


describe('FeatureModules/Admin/Pages/ServiceUsers/PageServiceChangeOrganisationUserUnitComponent', () => {

  let activatedRoute: ActivatedRoute;
  let router: Router;
  let routerSpy: jasmine.Spy;

  let serviceUsersService: ServiceUsersService;
  let organisationsService: OrganisationsService;
  let component: PageServiceChangeOrganisationUserUnitComponent;
  let fixture: ComponentFixture<PageServiceChangeOrganisationUserUnitComponent>;

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

    activatedRoute = TestBed.inject(ActivatedRoute);
    router = TestBed.inject(Router);
    routerSpy = spyOn(router, 'navigate');

    serviceUsersService = TestBed.inject(ServiceUsersService);
    organisationsService = TestBed.inject(OrganisationsService);

    activatedRoute.snapshot.params = { userId: 'User01' };
    activatedRoute.snapshot.data = { user: { userId: 'User01', displayName: 'User Name' } };

    serviceUsersService.getUserFullInfo = () => of({
      id: 'User01',
      email: 'user@email.com',
      displayName: 'User name',
      phone: '12345',
      type: 'ACCESSOR',
      lockedAt: '2020-01-01T00:00:00.000Z',
      innovations: [{id: 'inn1', name: 'innovation'}],
      userOrganisations: [
        { id: 'Org01', name: 'Org Name', size: '10 to 20', isShadow: true, role: orgnisationRole.QUALIFYING_ACCESSOR, units: [{ id: 'orgUnitId01', name: 'Org Unit name 01', acronym: 'ORGu01', supportCount: '2' }] }
      ]
    });
    organisationsService.getOrganisationUnits = () => of([
      {
        id: 'Org01', name: 'Org name 01', acronym: 'ORG01',
        organisationUnits: [
          { id: 'orgUnitId01', name: 'Org Unit name 01', acronym: 'ORGu01' },
          { id: 'orgUnitId02', name: 'Org Unit name 02', acronym: 'ORGu02' },
          { id: 'orgUnitId03', name: 'Org Unit name 03', acronym: 'ORGu03' }
        ]
      },
      {
        id: 'Org02', name: 'Org name 02', acronym: 'ORG02',
        organisationUnits: [
          { id: 'orgUnitId02', name: 'Org Unit name 02', acronym: 'ORGu02' },
          { id: 'orgUnitId03', name: 'Org Unit name 03', acronym: 'ORGu03' }
        ]
      }
    ]);

    const responseMock: getOrganisationUnitRulesOutDTO[] = [
      {
        key: 'lastAccessorUserOnOrganisation', valid: true,
        meta: {}
      },
      {
        key: 'lastAccessorUserOnOrganisationUnit', valid: true,
        meta: {}
      },
      {
        key: 'lastAccessorFromUnitProvidingSupport', valid: true,
        meta: {}
      }
    ];

    serviceUsersService.getOrgnisationUnitRules = () => of(responseMock);


    
  });


  it('should create the component', () => {
    fixture = TestBed.createComponent(PageServiceChangeOrganisationUserUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
  

  it('should have initial information loaded with role accessor', () => {

    fixture = TestBed.createComponent(PageServiceChangeOrganisationUserUnitComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.user.role).toBe('qualifying accessor');

  });

  it('should NOT have initial information loaded', () => {

    serviceUsersService.getUserFullInfo = () => throwError('error');
    organisationsService.getOrganisationUnits = () => throwError('error');
    serviceUsersService.getOrgnisationUnitRules = () => throwError('error');

    fixture = TestBed.createComponent(PageServiceChangeOrganisationUserUnitComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.alert.type).toBe('ERROR');

  });

  it('should run onSubmit and call api with success', () => {


    const responseMock: changeUserTypeDTO = { id: 'orgId01', status: 'OK' };
    serviceUsersService.changeOrganisationUserUnit = () => of(responseMock);

    fixture = TestBed.createComponent(PageServiceChangeOrganisationUserUnitComponent);
    component = fixture.componentInstance;
    component.form.get('code')?.setValue('12345');

    component.onSubmit();
    expect(routerSpy).toHaveBeenCalledWith([`admin/service-users/${component.user.id}`], { queryParams: { alert: 'unitChangeSuccess' } });

  });


  it('should run onSubmit and call api with error, returning 2LS object ID', () => {

    serviceUsersService.changeOrganisationUserUnit = () => throwError({ id: '123456ABCDFG' });

    fixture = TestBed.createComponent(PageServiceChangeOrganisationUserUnitComponent);
    component = fixture.componentInstance;
    component.form.get('code')?.setValue('12345');
    component.onSubmit();
    expect(component.pageStep).toBe('CODE_REQUEST');

  });


  it('should run onSubmit and call api with error, having already a security confirmation id ', () => {

    serviceUsersService.changeOrganisationUserUnit = () => throwError({ id: '123456ABCDFG' });

    fixture = TestBed.createComponent(PageServiceChangeOrganisationUserUnitComponent);
    component = fixture.componentInstance;
    component.form.get('code')?.setValue('invalidCode');
    component.securityConfirmation.id = '2lsId';

    component.onSubmit();
    expect(component.form.valid).toBe(false);

  });

  it('should run onSubmitStep() with UNDEFINED formEngineComponent field', () => {

    fixture = TestBed.createComponent(PageServiceChangeOrganisationUserUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.formEngineComponent = undefined;

    component.onSubmitStep('next');
    expect(component.wizard.currentStepId).toBe(1);
  });

  it('should run onSubmitStep() and DO NOTHING with form NOT valid', () => {

    fixture = TestBed.createComponent(PageServiceChangeOrganisationUserUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.formEngineComponent = TestBed.createComponent(FormEngineComponent).componentInstance;
    component.formEngineComponent.getFormValues = () => ({ valid: false, data: { value: 'SA' } });

    component.onSubmitStep('next');

    expect(component.wizard.currentStepId).toBe(1);
  });


  it('should run onSubmitStep() and go to previous step', () => {

    fixture = TestBed.createComponent(PageServiceChangeOrganisationUserUnitComponent);
    component = fixture.componentInstance;
    component.formEngineComponent = TestBed.createComponent(FormEngineComponent).componentInstance;
    component.formEngineComponent.getFormValues = () => ({ valid: true, data: { value: 'some value' } });
    fixture.detectChanges();

    component.onSubmitStep('previous');
    expect(component.pageStep).toBe('RULES_LIST');

  });

  it('should run onSubmitStep() and go to next step', () => {

    fixture = TestBed.createComponent(PageServiceChangeOrganisationUserUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.formEngineComponent = TestBed.createComponent(FormEngineComponent).componentInstance;
    component.formEngineComponent.getFormValues = () => ({ valid: true, data: { value: 'some value' } });
    component.wizard.gotoStep(1);

    component.onSubmitStep('next');
    expect(component.wizard.currentStepId).toBe('summary');

  });

  it('should run onSubmitStep() and do NOTHING with invalid action', () => {

    fixture = TestBed.createComponent(PageServiceChangeOrganisationUserUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.formEngineComponent = TestBed.createComponent(FormEngineComponent).componentInstance;
    component.formEngineComponent.getFormValues = () => ({ valid: true, data: { value: 'some value' } });
    component.wizard.gotoStep(1);

    component.onSubmitStep('invalid' as any);
    expect(component.wizard.currentStepId).toBe(1);

  });

});
