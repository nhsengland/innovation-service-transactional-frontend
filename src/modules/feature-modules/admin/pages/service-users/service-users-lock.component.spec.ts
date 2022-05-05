import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { AdminModule } from '@modules/feature-modules/admin/admin.module';

import { PageServiceUsersLockComponent } from './service-users-lock.component';

import { getLockUserRulesOutDTO, lockUserEndpointDTO, ServiceUsersService, orgnisationRole } from '@modules/feature-modules/admin/services/service-users.service';


describe('FeatureModules/Admin/Pages/ServiceUsers/PageServiceUsersLockComponent', () => {

  let activatedRoute: ActivatedRoute;
  let router: Router;
  let routerSpy: jasmine.Spy;

  let serviceUsersService: ServiceUsersService;

  let component: PageServiceUsersLockComponent;
  let fixture: ComponentFixture<PageServiceUsersLockComponent>;

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

    activatedRoute.snapshot.params = { userId: 'User01' };
    activatedRoute.snapshot.data = { user: { userId: 'User01', displayName: 'User Name' } };

  });


  it('should create the component', () => {
    fixture = TestBed.createComponent(PageServiceUsersLockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should have initial information loaded', () => {

    const responseMock: getLockUserRulesOutDTO[] = [
      {
        key: 'lastAssessmentUserOnPlatform', valid: true,
        meta: {}
      },
      {
        key: 'lastAccessorUserOnOrganisation', valid: false,
        meta: { organisation: { id: 'sdfsdafsdf', name: 'Org name' } }
      },
      {
        key: 'lastAccessorUserOnOrganisationUnit', valid: false,
        meta: { unit: { id: 'sdfas', name: 'Unit name' } }
      },
      {
        key: 'lastAccessorFromUnitProvidingSupport', valid: false,
        meta: { innovations: [{ id: 'sfasdads' }, { id: 'sdfsa' }] }
      }
    ];
    serviceUsersService.getUserFullInfo = () => of({
      id: 'User01',
      email: 'user@email.com',
      displayName: 'User name',
      phone: '12345',
      type: 'ACCESSOR',
      lockedAt: '2020-01-01T00:00:00.000Z',
      innovations: [{id: 'inn1', name: 'innovation'}],
      userOrganisations: [
        { id: 'Org01', name: 'Org Name', size: '10 to 20', isShadow: true, role: orgnisationRole.QUALIFYING_ACCESSOR, units: [] }
      ]
    });

    serviceUsersService.getLockUserRules = () => of(responseMock);
    const expected = responseMock;

    fixture = TestBed.createComponent(PageServiceUsersLockComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.rulesList).toEqual(expected);

  });

  it('should have initial information loaded 2', () => {

    const responseMock: getLockUserRulesOutDTO[] = [
      {
        key: 'lastAssessmentUserOnPlatform', valid: true,
        meta: {}
      },
      {
        key: 'lastAccessorUserOnOrganisation', valid: false,
        meta: { organisation: { id: 'sdfsdafsdf', name: 'Org name' } }
      },
      {
        key: 'lastAccessorUserOnOrganisationUnit', valid: false,
        meta: { unit: { id: 'sdfas', name: 'Unit name' } }
      },
      {
        key: 'lastAccessorFromUnitProvidingSupport', valid: false,
        meta: { innovations: [{ id: 'sfasdads' }, { id: 'sdfsa' }] }
      }
    ];
    serviceUsersService.getUserFullInfo = () => of({
      id: 'User01',
      email: 'user@email.com',
      displayName: 'User name',
      phone: '12345',
      type: 'INNOVATOR',
      lockedAt: '2020-01-01T00:00:00.000Z',
      innovations: [{id: 'inn1', name: 'innovation'}],
      userOrganisations: [
        { id: 'Org01', name: 'Org Name', size: '10 to 20', isShadow: true, role: orgnisationRole.QUALIFYING_ACCESSOR, units: [] }
      ]
    });

    serviceUsersService.getLockUserRules = () => of(responseMock);
    const expected = responseMock;

    fixture = TestBed.createComponent(PageServiceUsersLockComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.userType).toEqual('Innovator');

  });


  it('should have initial information loaded 03', () => {

    const responseMock: getLockUserRulesOutDTO[] = [
      {
        key: 'lastAssessmentUserOnPlatform', valid: true,
        meta: {}
      },
      {
        key: 'lastAccessorUserOnOrganisation', valid: false,
        meta: { organisation: { id: 'sdfsdafsdf', name: 'Org name' } }
      },
      {
        key: 'lastAccessorUserOnOrganisationUnit', valid: false,
        meta: { unit: { id: 'sdfas', name: 'Unit name' } }
      },
      {
        key: 'lastAccessorFromUnitProvidingSupport', valid: false,
        meta: { innovations: [{ id: 'sfasdads' }, { id: 'sdfsa' }] }
      }
    ];
    serviceUsersService.getUserFullInfo = () => of({
      id: 'User01',
      email: 'user@email.com',
      displayName: 'User name',
      phone: '12345',
      type: 'ACCESSOR',
      lockedAt: '2020-01-01T00:00:00.000Z',
      innovations: [{id: 'inn1', name: 'innovation'}],
      userOrganisations: [

      ]
    });

    serviceUsersService.getLockUserRules = () => of(responseMock);
    const expected = responseMock;

    fixture = TestBed.createComponent(PageServiceUsersLockComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.rulesList).toEqual(expected);

  });
  it('should NOT have initial information loaded', () => {

    serviceUsersService.getLockUserRules = () => throwError('error');
    serviceUsersService.getUserRoleRules = () => throwError('error');
    fixture = TestBed.createComponent(PageServiceUsersLockComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.alert.type).toBe('ERROR');

  });

  it('should run onNextStep', () => {

    const responseMock = 'LOCK_USER';

    fixture = TestBed.createComponent(PageServiceUsersLockComponent);
    component = fixture.componentInstance;

    component.nextStep();
    expect(component.pageType).toBe(responseMock);

  });
  it('should run onSubmit and call api with success', () => {

    const responseMock: lockUserEndpointDTO = { id: 'User01', status: 'OK' };
    serviceUsersService.lockUser = () => of(responseMock);

    fixture = TestBed.createComponent(PageServiceUsersLockComponent);
    component = fixture.componentInstance;
    component.form.get('code')?.setValue('Invalid status');

    component.onSubmit();
    expect(routerSpy).toHaveBeenCalledWith(['admin/service-users/User01'], { queryParams: { alert: 'lockSuccess' } });

  });

  it('should run onSubmit and call api with error, returning 2LS object ID', () => {

    serviceUsersService.lockUser = () => throwError({ id: '123456ABCDFG' });

    fixture = TestBed.createComponent(PageServiceUsersLockComponent);
    component = fixture.componentInstance;
    component.form.get('code')?.setValue('12345');

    component.onSubmit();
    expect(component.pageStep).toBe('CODE_REQUEST');

  });

  it('should run onSubmit and call api with error, having already a security confirmation id ', () => {

    serviceUsersService.lockUser = () => throwError({ id: '123456ABCDFG' });

    fixture = TestBed.createComponent(PageServiceUsersLockComponent);
    component = fixture.componentInstance;
    component.form.get('code')?.setValue('invalidCode');
    component.securityConfirmation.id = '2lsId';

    component.onSubmit();
    expect(component.form.valid).toBe(false);

  });

});
