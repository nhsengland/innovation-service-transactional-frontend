import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormControl } from '@angular/forms';
import { of, throwError } from 'rxjs';

import { USER_INFO_ACCESSOR } from '@tests/data.mocks';

import { AppInjector, CoreModule } from '@modules/core';
import { AuthenticationStore, StoresModule } from '@modules/stores';
import { AccessorModule } from '@modules/feature-modules/accessor/accessor.module';

import { InnovationSupportUpdateComponent } from './support-update.component';

import { AccessorService } from '@modules/feature-modules/accessor/services/accessor.service';


describe('FeatureModules/Accessor/Innovation/InnovationSupportUpdateComponent', () => {

  let activatedRoute: ActivatedRoute;
  let router: Router;
  let routerSpy: jest.SpyInstance;

  let authenticationStore: AuthenticationStore;
  let accessorService: AccessorService;

  let component: InnovationSupportUpdateComponent;
  let fixture: ComponentFixture<InnovationSupportUpdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        CoreModule,
        StoresModule,
        AccessorModule
      ]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    activatedRoute = TestBed.inject(ActivatedRoute);
    router = TestBed.inject(Router);
    routerSpy = jest.spyOn(router, 'navigate');

    authenticationStore = TestBed.inject(AuthenticationStore);
    accessorService = TestBed.inject(AccessorService);

    activatedRoute.snapshot.params = { innovationId: 'Inno01' };

    authenticationStore.getUserInfo = () => USER_INFO_ACCESSOR;

  });

  it('should create the component', () => {
    fixture = TestBed.createComponent(InnovationSupportUpdateComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  // it('should have support information loaded', () => {

  //   activatedRoute.snapshot.params = { supportId: 'SupportId01' };

  //   accessorService.getInnovationSupportInfo = () => of({
  //     id: 'SupportId01', status: 'ENGAGING',
  //     accessors: [{ id: 'accessor_1', name: 'accessor 1' }]
  //   });
  //   accessorService.getAccessorsList = () => of([{ id: 'accessor01', name: 'Accessor Name 01' }]);

  //   fixture = TestBed.createComponent(InnovationSupportUpdateComponent);
  //   component = fixture.componentInstance;

  //   fixture.detectChanges();
  //   expect((component.form.get('accessors')?.value as string[])[0]).toEqual('accessor_1');
  //   expect(component.form.get('status')?.value).toEqual('ENGAGING');
  //   expect(component.accessorsList[0]).toEqual({ value: 'accessor01', label: 'Accessor Name 01' });

  // });

  // it('should NOT have support information loaded due to API error', () => {

  //   activatedRoute.snapshot.params = { supportId: 'SupportId01' };

  //   accessorService.getInnovationSupportInfo = () => throwError('error');

  //   fixture = TestBed.createComponent(InnovationSupportUpdateComponent);
  //   component = fixture.componentInstance;

  //   fixture.detectChanges();
  //   expect((component.form.get('accessors')?.value as string[]).length).toBe(0);
  //   expect(component.form.get('status')?.value).toBe('');

  // });

  // it('should run onSubmitStep() with INVALID form', () => {

  //   fixture = TestBed.createComponent(InnovationSupportUpdateComponent);
  //   component = fixture.componentInstance;
  //   component.stepNumber = 1;

  //   component.onSubmitStep();
  //   expect(component.stepNumber).toEqual(1);
  //   expect(component.currentStatus.label).toBe('');

  // });

  // it('should run onSubmitStep() being on STEP 1, and move to step 2 when status is ENGAGING', () => {

  //   fixture = TestBed.createComponent(InnovationSupportUpdateComponent);
  //   component = fixture.componentInstance;
  //   component.stepNumber = 1;
  //   component.form.get('status')?.setValue('ENGAGING');

  //   fixture.detectChanges();
  //   component.onSubmitStep();
  //   expect(component.stepNumber).toEqual(2);
  //   expect(component.currentStatus.label).toBe('Engaging');

  // });

  // it('should run onSubmitStep() being on STEP 1, and move to step 3 when status is NOT ENGAGING', () => {

  //   fixture = TestBed.createComponent(InnovationSupportUpdateComponent);
  //   component = fixture.componentInstance;
  //   component.stepNumber = 1;
  //   component.form.get('status')?.setValue('WAITING');

  //   fixture.detectChanges();
  //   component.onSubmitStep();
  //   expect(component.stepNumber).toEqual(3);
  //   expect(component.currentStatus.label).toBe('Waiting');

  // });

  // it('should run onSubmitStep() being on STEP 2, and move to step 3 showing ACCESSORS ALERT', () => {

  //   fixture = TestBed.createComponent(InnovationSupportUpdateComponent);
  //   component = fixture.componentInstance;
  //   component.stepNumber = 2;
  //   component.form.get('status')?.setValue('ENGAGING');
  //   component.currentStatus = component.supportStatusObj.ENGAGING;
  //   component.selectedAccessors = [];

  //   fixture.detectChanges();
  //   component.onSubmitStep();
  //   expect(component.stepNumber).toEqual(2);
  //   expect(component.alert).toEqual({
  //     type: 'ERROR',
  //     title: 'An error has occurred when updating Status',
  //     message: 'You must select at least one Accessor.',
  //     setFocus: true
  //   });

  // });

  // it('should run onSubmitStep() being on STEP 2, and move to step 3 showing NO ALERT', () => {

  //   fixture = TestBed.createComponent(InnovationSupportUpdateComponent);
  //   component = fixture.componentInstance;
  //   component.stepNumber = 2;
  //   component.accessorsList = [{ value: 'AccessorId01', label: 'Accessor Name 01' }];
  //   component.form.get('status')?.setValue('ENGAGING');
  //   (component.form.get('accessors') as FormArray)?.push(new FormControl('AccessorId01'));
  //   component.currentStatus = component.supportStatusObj.ENGAGING;

  //   fixture.detectChanges();
  //   component.onSubmitStep();
  //   expect(component.stepNumber).toEqual(3);
  //   expect(component.alert).toEqual({ type: null });

  // });


  // it('should run onSubmit() with INVALID form', () => {

  //   fixture = TestBed.createComponent(InnovationSupportUpdateComponent);
  //   component = fixture.componentInstance;
  //   component.stepNumber = 1;

  //   component.onSubmit();
  //   expect(routerSpy).not.toHaveBeenCalledWith(['/accessor/innovations//support'], { queryParams: { alert: 'supportUpdateSuccess' } });

  // });

  // it('should run submit() when form is VALID and call API with success', () => {

  //   accessorService.saveSupportStatus = () => of({ id: 'id' });

  //   fixture = TestBed.createComponent(InnovationSupportUpdateComponent);
  //   component = fixture.componentInstance;
  //   component.stepNumber = 1;
  //   component.form.get('status')?.setValue('ENGAGING');

  //   fixture.detectChanges();
  //   component.onSubmit();
  //   expect(routerSpy).toHaveBeenCalledWith(['/accessor/innovations/Inno01/support'], { queryParams: { alert: 'supportUpdateSuccess' } });

  // });

  // it('should run submit() when form is VALID and call API with error', () => {

  //   accessorService.saveSupportStatus = () => throwError('error');

  //   fixture = TestBed.createComponent(InnovationSupportUpdateComponent);
  //   component = fixture.componentInstance;
  //   component.stepNumber = 1;
  //   component.form.get('status')?.setValue('ENGAGING');

  //   fixture.detectChanges();
  //   component.onSubmit();
  //   expect(routerSpy).not.toHaveBeenCalledWith(['/accessor/innovations/Inno01/support'], { queryParams: { alert: 'supportUpdateSuccess' } });

  // });

  // it('should run submit() when form is VALID and call API with success', () => {

  //   accessorService.saveSupportStatus = () => of({ id: 'id' });

  //   fixture = TestBed.createComponent(InnovationSupportUpdateComponent);
  //   component = fixture.componentInstance;
  //   component.stepNumber = 1;
  //   component.form.get('status')?.setValue('ENGAGING');

  //   fixture.detectChanges();
  //   component.onSubmit();
  //   expect(routerSpy).toHaveBeenCalledWith(['/accessor/innovations/Inno01/support'], { queryParams: { alert: 'supportUpdateSuccess' } });

  // });

  // it('should run validateForm() with INVALID step 1', () => {
  //   fixture = TestBed.createComponent(InnovationSupportUpdateComponent);
  //   component = fixture.componentInstance;
  //   expect((component as any).validateForm(1)).toBeFalsy();
  // });
  // it('should run validateForm() with VALID step 1', () => {
  //   fixture = TestBed.createComponent(InnovationSupportUpdateComponent);
  //   component = fixture.componentInstance;
  //   component.form.get('status')?.setValue('ENGAGING');
  //   expect((component as any).validateForm(1)).toBeTruthy();
  // });
  // it('should run validateForm() with INVALID step 3', () => {
  //   fixture = TestBed.createComponent(InnovationSupportUpdateComponent);
  //   component = fixture.componentInstance;
  //   // component.form.get('status')?.setValue('ENGAGING');
  //   expect((component as any).validateForm(3)).toBeFalsy();
  // });
  // it('should run validateForm() with VALID step 3', () => {
  //   fixture = TestBed.createComponent(InnovationSupportUpdateComponent);
  //   component = fixture.componentInstance;
  //   component.form.get('status')?.setValue('ENGAGING');
  //   component.form.get('comment')?.setValue('Some value');
  //   expect((component as any).validateForm(3)).toBeTruthy();
  // });

  // it('should run setStepTitle() with step 1', () => {
  //   fixture = TestBed.createComponent(InnovationSupportUpdateComponent);
  //   component = fixture.componentInstance;
  //   component.stepNumber = 1;
  //   (component as any).setStepTitle();
  //   expect(component.pageTitle).toBe('Update support status - status');
  // });
  // it('should run setStepTitle() with step 2', () => {
  //   fixture = TestBed.createComponent(InnovationSupportUpdateComponent);
  //   component = fixture.componentInstance;
  //   component.stepNumber = 2;
  //   (component as any).setStepTitle();
  //   expect(component.pageTitle).toBe('Update support status - accessors');
  // });
  // it('should run setStepTitle() with step 3', () => {
  //   fixture = TestBed.createComponent(InnovationSupportUpdateComponent);
  //   component = fixture.componentInstance;
  //   component.stepNumber = 3;
  //   (component as any).setStepTitle();
  //   expect(component.pageTitle).toBe('Update support status');
  // });

});
