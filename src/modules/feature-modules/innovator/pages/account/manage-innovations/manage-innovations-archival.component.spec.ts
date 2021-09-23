import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { USER_INFO_INNOVATOR } from '@tests/data.mocks';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule, AuthenticationStore } from '@modules/stores';
import { InnovatorModule } from '@modules/feature-modules/innovator/innovator.module';

import { PageAccountManageInnovationsArchivalComponent } from './manage-innovations-archival.component';
import { InnovatorService } from '@modules/feature-modules/innovator/services/innovator.service';

describe('Shared/Pages/Account/ManageInnovations/PageAccountManageInnovationsArchivalComponent', () => {

  let router: Router;
  let routerSpy: jasmine.Spy;

  let authenticationStore: AuthenticationStore;
  let innovatorService: InnovatorService;

  let component: PageAccountManageInnovationsArchivalComponent;
  let fixture: ComponentFixture<PageAccountManageInnovationsArchivalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        CoreModule,
        StoresModule,
        InnovatorModule
      ]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    router = TestBed.inject(Router);
    routerSpy = spyOn(router, 'navigate');

    authenticationStore = TestBed.inject(AuthenticationStore);
    innovatorService = TestBed.inject(InnovatorService);

    authenticationStore.getUserInfo = () => USER_INFO_INNOVATOR;

  });

  it('should create the component', () => {

    fixture = TestBed.createComponent(PageAccountManageInnovationsArchivalComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();

  });

  it('should have initial information loaded', () => {

    const responseMock = [
      { id: 'TransferId01', email: 'some@email.com', innovation: { id: 'InnoNew01', name: 'Innovation name 01' } },
      { id: 'TransferId02', email: 'some@email.com', innovation: { id: 'InnoNew02', name: 'Innovation name 02' } }
    ];
    innovatorService.getInnovationTransfers = () => of(responseMock);

    const expected = [{ label: 'Test innovation', value: 'Inno01' }];

    fixture = TestBed.createComponent(PageAccountManageInnovationsArchivalComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.formInnovationsItems).toEqual(expected);

  });

  it('should run onSubmitStep() with INVALID form', () => {

    fixture = TestBed.createComponent(PageAccountManageInnovationsArchivalComponent);
    component = fixture.componentInstance;

    component.onSubmitStep();
    expect(component.form.valid).toEqual(false);

  });

  it('should run onSubmitStep() with VALID form', () => {

    fixture = TestBed.createComponent(PageAccountManageInnovationsArchivalComponent);
    component = fixture.componentInstance;
    component.form.get('innovation')?.setValue('Inno01');
    component.formInnovationsItems = [{ value: 'Inno01', label: 'Innovation' }];

    component.onSubmitStep();
    expect(component.stepNumber).toBe(2);

  });

  it('should run onSubmit() with invalid form', () => {

    fixture = TestBed.createComponent(PageAccountManageInnovationsArchivalComponent);
    component = fixture.componentInstance;

    component.onSubmitForm();
    expect(component.form.valid).toEqual(false);

  });

  it('should run onSubmit and call API with success', () => {

    innovatorService.archiveInnovation = () => of({ id: 'id' });
    authenticationStore.getUserInfo = () => ({
      ...USER_INFO_INNOVATOR, email: 'some@email.com'
    });
    authenticationStore.initializeAuthentication$ = () => of(true);

    fixture = TestBed.createComponent(PageAccountManageInnovationsArchivalComponent);
    component = fixture.componentInstance;
    component.form.get('innovation')?.setValue('A required value');
    component.form.get('reason')?.setValue('An optional value');
    component.form.get('email')?.setValue('some@email.com');
    component.form.get('confirmation')?.setValue('archive my innovation');

    component.innovationName = 'test';

    component.onSubmitForm();
    fixture.detectChanges();
    expect(routerSpy).toHaveBeenCalledWith(['/innovator/account/manage-innovations'], { queryParams: { alert: 'archivalSuccess', innovation: 'test' } });

  });

  it('should run onSubmit and call API with error', () => {

    innovatorService.archiveInnovation = () => throwError('error');

    fixture = TestBed.createComponent(PageAccountManageInnovationsArchivalComponent);
    component = fixture.componentInstance;
    component.form.get('innovation')?.setValue('A required value');
    component.form.get('reason')?.setValue('An optional value');
    component.form.get('email')?.setValue('some@email.com');
    component.form.get('confirmation')?.setValue('archive my innovation');

    fixture.detectChanges();
    component.onSubmitForm();
    expect(routerSpy).not.toHaveBeenCalledWith(['/innovator/account/manage-innovations'], { queryParams: { alert: 'archivalSuccess' } });

  });

  it('should run setStepTitle() with step 1', () => {

    fixture = TestBed.createComponent(PageAccountManageInnovationsArchivalComponent);
    component = fixture.componentInstance;
    component.stepNumber = 1;
    (component as any).setStepTitle();
    expect(component.pageTitle).toBe('Archive an innovation');

  });

  it('should run setStepTitle() with step 2', () => {

    fixture = TestBed.createComponent(PageAccountManageInnovationsArchivalComponent);
    component = fixture.componentInstance;
    component.innovationName = 'Innovation';
    component.stepNumber = 2;
    (component as any).setStepTitle();
    expect(component.pageTitle).toBe('Archive \'Innovation\'');

  });

  it('should run setStepTitle() with step 3', () => {

    fixture = TestBed.createComponent(PageAccountManageInnovationsArchivalComponent);
    component = fixture.componentInstance;
    component.innovationName = 'Innovation';
    component.stepNumber = 3;
    (component as any).setStepTitle();
    expect(component.pageTitle).toBe('Archive \'Innovation\'');

  });

});
