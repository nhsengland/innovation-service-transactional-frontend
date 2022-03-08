import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { AdminModule } from '@modules/feature-modules/admin/admin.module';

import { PageServiceUsersUnlockComponent } from './service-users-unlock.component';

import { getUserFullInfoDTO, lockUserEndpointDTO, ServiceUsersService } from '@modules/feature-modules/admin/services/service-users.service';


describe('FeatureModules/Admin/Pages/ServiceUsers/PageServiceUsersUnlockComponent', () => {

  let activatedRoute: ActivatedRoute;
  let router: Router;
  let routerSpy: jasmine.Spy;

  let serviceUsersService: ServiceUsersService;

  let component: PageServiceUsersUnlockComponent;
  let fixture: ComponentFixture<PageServiceUsersUnlockComponent>;

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
    fixture = TestBed.createComponent(PageServiceUsersUnlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });


  it('should have initial information loaded', () => {

    const responseMock: getUserFullInfoDTO = {
      id: 'User01',
      email: 'user@email.com',
      displayName: 'User name',
      type: 'INNOVATOR',
      innovations: [{id: 'inn1', name: 'innovation'}],
      phone: '12345678',
      lockedAt: '2020-01-01T00:00:00.000Z',
      userOrganisations: [
        { id: 'Org01', name: 'Org Name', size: '10 to 15', role: 'INNOVATOR_OWNER', units: [] }
      ]
    };
    serviceUsersService.getUserFullInfo = () => of(responseMock);

    fixture = TestBed.createComponent(PageServiceUsersUnlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.pageStatus).toBe('READY');

  });

  it('should REDIRECT because user is UNLOCKED', () => {

    const responseMock: getUserFullInfoDTO = {
      id: 'User01',
      email: 'user@email.com',
      displayName: 'User name',
      type: 'INNOVATOR',
      phone: '124',
      lockedAt: null,
      innovations: [{id: 'inn1', name: 'innovation'}],
      userOrganisations: [
        { id: 'Org01', name: 'Org Name', size: '10 to 20', role: 'INNOVATOR_OWNER', units: [] }
      ]
    };
    serviceUsersService.getUserFullInfo = () => of(responseMock);

    fixture = TestBed.createComponent(PageServiceUsersUnlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(routerSpy).toHaveBeenCalledWith(['admin/service-users/User01'], {});

  });

  it('should NOT have initial information loaded', () => {

    serviceUsersService.getUserFullInfo = () => throwError('error');

    fixture = TestBed.createComponent(PageServiceUsersUnlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.pageStatus).toBe('ERROR');

  });

  it('should run onSubmit and call api with success', () => {

    const responseMock: lockUserEndpointDTO = { id: 'User01', status: 'OK' };
    serviceUsersService.unlockUser = () => of(responseMock);

    fixture = TestBed.createComponent(PageServiceUsersUnlockComponent);
    component = fixture.componentInstance;
    component.form.get('code')?.setValue('Invalid status');

    component.onSubmit();
    expect(routerSpy).toHaveBeenCalledWith(['admin/service-users/User01'], { queryParams: { alert: 'unlockSuccess' } });

  });

  it('should run onSubmit and call api with error, returning 2LS ID', () => {

    serviceUsersService.unlockUser = () => throwError({ id: '123456ABCDFG' });

    fixture = TestBed.createComponent(PageServiceUsersUnlockComponent);
    component = fixture.componentInstance;
    component.form.get('code')?.setValue('12345');

    component.onSubmit();
    expect(component.pageStep).toBe('CODE_REQUEST');

  });

  it('should run onSubmit and call api with error, having already a security confirmation id ', () => {

    serviceUsersService.unlockUser = () => throwError({ id: '123456ABCDFG' });

    fixture = TestBed.createComponent(PageServiceUsersUnlockComponent);
    component = fixture.componentInstance;
    component.form.get('code')?.setValue('invalidCode');
    component.securityConfirmation.id = '2lsId';

    component.onSubmit();
    expect(component.form.valid).toBe(false);

  });

});
