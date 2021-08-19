import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AppInjector, CoreModule } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { AccessorModule } from '@modules/feature-modules/accessor/accessor.module';

import { InnovationActionTrackerEditComponent } from './action-tracker-edit.component';

import { AccessorService } from '@modules/feature-modules/accessor/services/accessor.service';


describe('FeatureModules/Accessor/Innovation/InnovationActionTrackerEditComponent', () => {

  let activatedRoute: ActivatedRoute;

  let accessorService: AccessorService;

  let component: InnovationActionTrackerEditComponent;
  let fixture: ComponentFixture<InnovationActionTrackerEditComponent>;

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

    accessorService = TestBed.inject(AccessorService);

  });


  it('should create the component', () => {

    fixture = TestBed.createComponent(InnovationActionTrackerEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();

  });

  it('should run onSubmitStep() with invalid form', () => {

    fixture = TestBed.createComponent(InnovationActionTrackerEditComponent);
    component = fixture.componentInstance;

    component.onSubmitStep();
    fixture.detectChanges();
    expect(component.form.valid).toEqual(false);

  });

  it('should run onSubmitStep() with valid form', () => {

    fixture = TestBed.createComponent(InnovationActionTrackerEditComponent);
    component = fixture.componentInstance;

    component.form.get('status')?.setValue('A required value');
    component.onSubmitStep();
    fixture.detectChanges();
    expect(component.stepNumber).toBe(2);

  });


  it('should run onSubmit() with invalid form', () => {

    fixture = TestBed.createComponent(InnovationActionTrackerEditComponent);
    component = fixture.componentInstance;

    component.onSubmit();
    fixture.detectChanges();
    expect(component.form.valid).toEqual(false);

  });

  it('should run onSubmit and call api with success', () => {

    activatedRoute.snapshot.params = { innovationId: 'Inno01' };
    const routerSpy = spyOn(TestBed.inject(Router), 'navigate');

    const responseMock = { id: 'actionId' };
    accessorService.updateAction = () => of(responseMock as any);

    fixture = TestBed.createComponent(InnovationActionTrackerEditComponent);
    component = fixture.componentInstance;

    component.form.get('status')?.setValue('REQUESTED');
    component.form.get('comment')?.setValue('A required value');
    component.onSubmit();
    fixture.detectChanges();

    expect(routerSpy).toHaveBeenCalledWith(['/accessor/innovations/Inno01/action-tracker/actionId'], { queryParams: { alert: 'actionUpdateSuccess', status: 'Requested'  } });

  });

  it('should run onSubmit and call api with error', () => {

    activatedRoute.snapshot.params = { innovationId: 'Inno01' };

    accessorService.updateAction = () => throwError('error');

    const expected = {
      type: 'ERROR',
      title: 'An error occured when creating an action',
      message: 'Please, try again or contact us for further help',
      setFocus: true
    };

    fixture = TestBed.createComponent(InnovationActionTrackerEditComponent);
    component = fixture.componentInstance;

    component.form.get('status')?.setValue('REQUESTED');
    component.form.get('comment')?.setValue('A required value');
    component.onSubmit();
    fixture.detectChanges();

    expect(component.alert).toEqual(expected);

  });


});
