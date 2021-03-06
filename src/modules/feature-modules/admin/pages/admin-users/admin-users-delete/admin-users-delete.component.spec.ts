import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';

import { Injector } from '@angular/core';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule, AuthenticationStore } from '@modules/stores';

import { PageAdminDeleteComponent } from './admin-users-delete.component';
import { AdminModule } from '@modules/feature-modules/admin/admin.module';
import { ServiceUsersService } from '@modules/feature-modules/admin/services/service-users.service';

describe('Shared/Pages/Account/Manageaccount/PageAccountManageUserAccountComponent', () => {

  let authenticationStore: AuthenticationStore;
  let router: Router;
  let routerSpy: jasmine.Spy;
  let component: PageAdminDeleteComponent;
  let fixture: ComponentFixture<PageAdminDeleteComponent>;
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
    serviceUserService = TestBed.inject(ServiceUsersService);
    authenticationStore = TestBed.inject(AuthenticationStore);
    router = TestBed.inject(Router);
    routerSpy = spyOn(router, 'navigate');

  });


  it('should create the component', () => {

    fixture = TestBed.createComponent(PageAdminDeleteComponent);
    component = fixture.componentInstance;
    component.form.get('id')?.setValue('12345');
    component.form.get('confirmation')?.setValue('delete the administrator');
    component.form.markAllAsTouched();
    fixture.detectChanges();
    expect(component).toBeTruthy();

  });

  it('should run onSubmitForm() with API success', () => {

    authenticationStore.initializeAuthentication$ = () => of(true);
    serviceUserService.deleteAdminAccount = () => of({id: 'User01'});

    fixture = TestBed.createComponent(PageAdminDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.form.get('code')?.setValue('12345');
    component.form.get('confirmation')?.setValue('delete the administrator');
    component.form.markAllAsTouched();

    component.onSubmitForm();
    expect(routerSpy).toHaveBeenCalledWith(['admin/administration-users'], { queryParams: { alert: 'adminDeletedSuccess' } });

  });

  it('should run onSubmitWizard() with invalid form values', () => {

    authenticationStore.initializeAuthentication$ = () => of(true);
    serviceUserService.deleteAdminAccount = () => of({id: 'User01'});

    fixture = TestBed.createComponent(PageAdminDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.onSubmitForm();
    expect(component.form.valid).toBe(false);

  });

  it('should run onSubmitForm() with API error, returning 2LS ID', () => {

    serviceUserService.deleteAdminAccount = () => throwError({id: '123456ABCDFG' });

    fixture = TestBed.createComponent(PageAdminDeleteComponent);
    component = fixture.componentInstance;
    component.form.get('code')?.setValue('12345');
    component.form.get('confirmation')?.setValue('delete the administrator');
    component.form.markAllAsTouched();

    component.onSubmitForm();

    expect(component.pageStep).toBe('CODE_REQUEST');

  });

  it('should run onSubmitForm()  and call api with error, having already a security confirmation id ', () => {

    serviceUserService.deleteAdminAccount = () => throwError({ id: '123456ABCDFG' });

    fixture = TestBed.createComponent(PageAdminDeleteComponent);
    component = fixture.componentInstance;
    component.form.get('code')?.setValue('invalidCode');
    component.form.get('confirmation')?.setValue('delete the administrator');
    component.securityConfirmation.id = '2lsId';

    component.onSubmitForm();
    expect(component.form.valid).toBe(false);

  });
});
