import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { InnovatorModule } from '@modules/feature-modules/innovator/innovator.module';
import { InnovationsService } from '@modules/shared/services/innovations.service';

import { InnovatorService } from '@modules/feature-modules/innovator/services/innovator.service';
import { PageInnovationManageTransferComponent } from './manage-transfer.component';

describe('FeatureModules/Innovator/Pages/Account/ManageInnovations/PageAccountInnovationsTransferComponent', () => {
  let router: Router;
  let routerSpy: jest.SpyInstance;

  let innovationsService: InnovationsService;
  let innovatorService: InnovatorService;

  let component: PageInnovationManageTransferComponent;
  let fixture: ComponentFixture<PageInnovationManageTransferComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterModule.forRoot([]), CoreModule, StoresModule, InnovatorModule]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    router = TestBed.inject(Router);
    routerSpy = jest.spyOn(router, 'navigate');

    innovationsService = TestBed.inject(InnovationsService);
    innovatorService = TestBed.inject(InnovatorService);
  });

  it('should create the component', () => {
    fixture = TestBed.createComponent(PageInnovationManageTransferComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  // it('should have initial information loaded', () => {

  //   innovationsService.getInnovationsList = () => of([
  //     { id: 'innovationId01', name: 'Innovation Name 01' }
  //   ]);

  //   const responseMock = [
  //     { id: 'TransferId01', email: 'some@email.com', innovation: { id: 'InnoNew01', name: 'Innovation name 01' } },
  //     { id: 'TransferId02', email: 'some@email.com', innovation: { id: 'InnoNew02', name: 'Innovation name 02' } }
  //   ];
  //   innovatorService.getInnovationTransfers = () => of(responseMock);

  //   const expected = [{ label: 'Innovation Name 01', value: 'innovationId01' }];

  //   fixture = TestBed.createComponent(PageAccountInnovationsTransferComponent);
  //   component = fixture.componentInstance;

  //   fixture.detectChanges();
  //   expect(component.formInnovationsItems).toEqual(expected);

  // });

  // it('should NOT have initial information loaded', () => {

  //   innovationsService.getInnovationsList = () => throwError('error');
  //   innovatorService.getInnovationTransfers = () => throwError('error');

  //   const expected = {
  //     type: 'ERROR',
  //     title: 'Unable to fetch innovations transfers',
  //     message: 'Please try again or contact us for further help'
  //   };

  //   fixture = TestBed.createComponent(PageAccountInnovationsTransferComponent);
  //   component = fixture.componentInstance;

  //   fixture.detectChanges();
  //   expect(component.alert).toEqual(expected);

  // });

  // it('should run onSubmitStep() with INVALID form', () => {

  //   fixture = TestBed.createComponent(PageAccountInnovationsTransferComponent);
  //   component = fixture.componentInstance;

  //   component.onSubmitStep();
  //   expect(component.form.valid).toEqual(false);

  // });

  // it('should run onSubmitStep() with VALID form and NO UNITS', () => {

  //   fixture = TestBed.createComponent(PageAccountInnovationsTransferComponent);
  //   component = fixture.componentInstance;
  //   component.form.get('innovation')?.setValue('Inno01');

  //   component.onSubmitStep();
  //   expect(component.stepNumber).toBe(2);

  // });

  // it('should run onSubmit() with invalid form', () => {

  //   fixture = TestBed.createComponent(PageAccountInnovationsTransferComponent);
  //   component = fixture.componentInstance;

  //   component.onSubmitForm();
  //   expect(component.form.valid).toEqual(false);

  // });

  // it('should run onSubmit and call API with success', () => {

  //   innovatorService.transferInnovation = () => of({ id: 'actionId' });

  //   fixture = TestBed.createComponent(PageAccountInnovationsTransferComponent);
  //   component = fixture.componentInstance;
  //   component.form.get('innovation')?.setValue('A required value');
  //   component.form.get('email')?.setValue('some@email.com');
  //   component.form.get('confirmation')?.setValue('transfer my innovation');

  //   component.onSubmitForm();
  //   fixture.detectChanges();
  //   expect(routerSpy).toHaveBeenCalledWith(['/innovator/account/manage-innovations'], {});

  // });

  // it('should run onSubmit and call API with error', () => {

  //   innovatorService.transferInnovation = () => throwError('error');

  //   const expected = {
  //     type: 'ERROR',
  //     title: 'An error occurred when transferring innovation ownership.',
  //     message: 'Please check the details and try again or contact us for further info.',
  //     setFocus: true
  //   };

  //   fixture = TestBed.createComponent(PageAccountInnovationsTransferComponent);
  //   component = fixture.componentInstance;
  //   component.form.get('innovation')?.setValue('A required value');
  //   component.form.get('email')?.setValue('some@email.com');
  //   component.form.get('confirmation')?.setValue('transfer my innovation');

  //   component.onSubmitForm();
  //   fixture.detectChanges();
  //   expect(component.alert).toEqual(expected);

  // });
});
