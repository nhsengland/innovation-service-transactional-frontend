import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AppInjector, CoreModule } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { AccessorModule } from '@modules/feature-modules/accessor/accessor.module';

import { InnovationActionTrackerNewComponent } from './action-tracker-new.component';

import { AccessorService } from '@modules/feature-modules/accessor/services/accessor.service';


describe('FeatureModules/Accessor/Innovation/InnovationActionTrackerNewComponent', () => {

  let activatedRoute: ActivatedRoute;

  let accessorService: AccessorService;

  let component: InnovationActionTrackerNewComponent;
  let fixture: ComponentFixture<InnovationActionTrackerNewComponent>;

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

    fixture = TestBed.createComponent(InnovationActionTrackerNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();

  });


  it('should run onSubmit() with invalid form', () => {

    fixture = TestBed.createComponent(InnovationActionTrackerNewComponent);
    component = fixture.componentInstance;

    component.onSubmit();
    fixture.detectChanges();
    expect(component.form.valid).toEqual(false);

  });

  it('should run onSubmit and call api with success', () => {

    activatedRoute.snapshot.params = { innovationId: 'Inno01' };
    const routerSpy = spyOn(TestBed.inject(Router), 'navigate');

    const responseMock = { id: 'actionId' };
    accessorService.createAction = () => of(responseMock as any);

    fixture = TestBed.createComponent(InnovationActionTrackerNewComponent);
    component = fixture.componentInstance;

    component.form.get('section')?.setValue('A required value');
    component.form.get('description')?.setValue('A required value');
    component.onSubmit();
    fixture.detectChanges();

    expect(routerSpy).toHaveBeenCalledWith(['/accessor/innovations/Inno01/action-tracker/actionId'], { queryParams: { alert: 'actionCreationSuccess' } });

  });

  it('should run onSubmit and call api with error', () => {

    activatedRoute.snapshot.params = { innovationId: 'Inno01' };

    accessorService.createAction = () => throwError('error');

    const expected = {
      type: 'ERROR',
      title: 'An error occured when creating an action',
      message: 'Please, try again or contact us for further help',
      setFocus: true
    };

    fixture = TestBed.createComponent(InnovationActionTrackerNewComponent);
    component = fixture.componentInstance;

    component.form.get('section')?.setValue('A required value');
    component.form.get('description')?.setValue('A required value');
    component.onSubmit();
    fixture.detectChanges();

    expect(component.alert).toEqual(expected);

  });

});
