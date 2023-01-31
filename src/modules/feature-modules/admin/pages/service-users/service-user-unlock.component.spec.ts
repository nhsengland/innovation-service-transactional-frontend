import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { InnovatorOrganisationRoleEnum, UserTypeEnum } from '@app/base/enums';
import { AppInjector, CoreModule } from '@modules/core';
import { AdminModule } from '@modules/feature-modules/admin/admin.module';
import { StoresModule } from '@modules/stores';

import { PageServiceUserUnlockComponent } from './service-user-unlock.component';

import { AdminUserUpdateEndpointDTO, getUserFullInfoDTO, ServiceUsersService } from '@modules/feature-modules/admin/services/service-users.service';


describe('FeatureModules/Admin/Pages/ServiceUsers/PageServiceUserUnlockComponent', () => {

  let activatedRoute: ActivatedRoute;
  let router: Router;
  let routerSpy: jest.SpyInstance;

  let serviceUsersService: ServiceUsersService;

  let component: PageServiceUserUnlockComponent;
  let fixture: ComponentFixture<PageServiceUserUnlockComponent>;

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
    routerSpy = jest.spyOn(router, 'navigate');

    serviceUsersService = TestBed.inject(ServiceUsersService);

    activatedRoute.snapshot.params = { userId: 'User01' };
    activatedRoute.snapshot.data = { user: { userId: 'User01', displayName: 'User Name' } };

  });


  it('should create the component', () => {
    fixture = TestBed.createComponent(PageServiceUserUnlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });


  it('should have initial information loaded', () => {

    const responseMock: getUserFullInfoDTO = {
      id: 'User01',
      email: 'user@email.com',
      displayName: 'User name',
      type: UserTypeEnum.INNOVATOR,
      innovations: [{ id: 'inn1', name: 'innovation' }],
      phone: '12345678',
      lockedAt: '2020-01-01T00:00:00.000Z',
      userOrganisations: [
        { id: 'Org01', name: 'Org Name', size: '10 to 15', isShadow: true, role: InnovatorOrganisationRoleEnum.INNOVATOR_OWNER, units: [] }
      ]
    };
    serviceUsersService.getUserFullInfo = () => of(responseMock);

    fixture = TestBed.createComponent(PageServiceUserUnlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.pageStatus).toBe('READY');

  });

  it('should REDIRECT because user is UNLOCKED', () => {

    const responseMock: getUserFullInfoDTO = {
      id: 'User01',
      email: 'user@email.com',
      displayName: 'User name',
      type: UserTypeEnum.INNOVATOR,
      phone: '124',
      lockedAt: null,
      innovations: [{ id: 'inn1', name: 'innovation' }],
      userOrganisations: [
        { id: 'Org01', name: 'Org Name', size: '10 to 20', isShadow: false, role: InnovatorOrganisationRoleEnum.INNOVATOR_OWNER, units: [] }
      ]
    };
    serviceUsersService.getUserFullInfo = () => of(responseMock);

    fixture = TestBed.createComponent(PageServiceUserUnlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(routerSpy).toHaveBeenCalledWith(['admin/service-users/User01'], {});

  });

  it('should NOT have initial information loaded', () => {

    serviceUsersService.getUserFullInfo = () => throwError('error');

    fixture = TestBed.createComponent(PageServiceUserUnlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.pageStatus).toBe('ERROR');

  });

  it('should run onSubmit and call api with success', () => {

    const responseMock: AdminUserUpdateEndpointDTO = { id: 'User01' };
    serviceUsersService.unlockUser = () => of(responseMock);

    fixture = TestBed.createComponent(PageServiceUserUnlockComponent);
    component = fixture.componentInstance;
    component.form.get('code')?.setValue('Invalid status');

    component.onSubmit();
    expect(routerSpy).toHaveBeenCalledWith(['admin/service-users/User01'], { queryParams: { alert: 'unlockSuccess' } });

  });

  it('should run onSubmit and call api with error, returning 2LS ID', () => {

    serviceUsersService.unlockUser = () => throwError({ id: '123456ABCDFG' });

    fixture = TestBed.createComponent(PageServiceUserUnlockComponent);
    component = fixture.componentInstance;
    component.form.get('code')?.setValue('12345');

    component.onSubmit();
    expect(component.pageStep).toBe('CODE_REQUEST');

  });

  it('should run onSubmit and call api with error, having already a security confirmation id ', () => {

    serviceUsersService.unlockUser = () => throwError({ id: '123456ABCDFG' });

    fixture = TestBed.createComponent(PageServiceUserUnlockComponent);
    component = fixture.componentInstance;
    component.form.get('code')?.setValue('invalidCode');
    component.securityConfirmation.id = '2lsId';

    component.onSubmit();
    expect(component.form.valid).toBe(false);

  });

});
