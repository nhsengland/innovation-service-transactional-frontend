import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { AdminModule } from '@modules/feature-modules/admin/admin.module';

import { PageServiceChangeUserRoleComponent } from './change-user-role.component';

import { changeUserTypeDTO, getOrganisationRoleRulesOutDTO, orgnisationRole, ServiceUsersService } from '@modules/feature-modules/admin/services/service-users.service';


describe('FeatureModules/Admin/Pages/ServiceUsers/PageServiceChangeUserRoleComponent', () => {

  let activatedRoute: ActivatedRoute;
  let router: Router;
  let routerSpy: jasmine.Spy;

  let serviceUsersService: ServiceUsersService;

  let component: PageServiceChangeUserRoleComponent;
  let fixture: ComponentFixture<PageServiceChangeUserRoleComponent>;

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

    serviceUsersService.getUserFullInfo = () => of({
      id: 'User01',
      email: 'user@email.com',
      displayName: 'User name',
      phone: '12345',
      type: 'ACCESSOR',
      lockedAt: '2020-01-01T00:00:00.000Z',
      innovations: [{id: 'inn1', name: 'innovation'}],
      userOrganisations: [
        { id: 'Org01', name: 'Org Name', size: '10 to 20', isShadow: true, role: 'ACCESSOR', units: [] }
      ]
    });
  });


  it('should create the component', () => {
    fixture = TestBed.createComponent(PageServiceChangeUserRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should have initial information loaded', () => {

    const responseMock: getOrganisationRoleRulesOutDTO[] = [
      {
        key: 'lastAccessorUserOnOrganisationUnit', valid: true,
        meta: {}
      }
    ];
    serviceUsersService.getUserRoleRules = () => of(responseMock);
    const expected = responseMock;

    fixture = TestBed.createComponent(PageServiceChangeUserRoleComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.rulesList).toEqual(expected);
    // expect(component.role).toBe(orgnisationRole.QUALIFYING_ACCESSOR);

  });

  it('should have initial information loaded with role accessor', () => {

    const responseMock: getOrganisationRoleRulesOutDTO[] = [
      {
        key: 'lastAccessorUserOnOrganisationUnit', valid: true,
        meta: {}
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
    serviceUsersService.getUserRoleRules = () => of(responseMock);
    const expected = responseMock;

    fixture = TestBed.createComponent(PageServiceChangeUserRoleComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.role).toBe(orgnisationRole.ACCESSOR);

  });

  it('should NOT have initial information loaded', () => {

    serviceUsersService.getUserRoleRules = () => throwError('error');

    fixture = TestBed.createComponent(PageServiceChangeUserRoleComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.alert.type).toBe('ERROR');

  });

  it('should run onSubmit and call api with success', () => {


    const responseMock: changeUserTypeDTO = { id: 'User01', status: 'OK' };
    serviceUsersService.changeUserRole = () => of(responseMock);

    fixture = TestBed.createComponent(PageServiceChangeUserRoleComponent);
    component = fixture.componentInstance;
    component.form.get('code')?.setValue('12345');

    component.onSubmit();
    expect(routerSpy).toHaveBeenCalledWith(['admin/service-users/User01'], { queryParams: { alert: 'roleChangeSuccess' } });

  });


  it('should run onSubmit and call api with error, returning 2LS object ID', () => {

    serviceUsersService.changeUserRole = () => throwError({ id: '123456ABCDFG' });

    fixture = TestBed.createComponent(PageServiceChangeUserRoleComponent);
    component = fixture.componentInstance;
    component.form.get('code')?.setValue('12345');
    component.onSubmit();
    expect(component.pageStep).toBe('CODE_REQUEST');

  });


  it('should run onSubmit and call api with error, having already a security confirmation id ', () => {

    serviceUsersService.changeUserRole = () => throwError({ id: '123456ABCDFG' });

    fixture = TestBed.createComponent(PageServiceChangeUserRoleComponent);
    component = fixture.componentInstance;
    component.form.get('code')?.setValue('invalidCode');
    component.securityConfirmation.id = '2lsId';

    component.onSubmit();
    expect(component.form.valid).toBe(false);

  });

});
