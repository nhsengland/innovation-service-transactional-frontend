import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AppInjector, CoreModule } from '@modules/core';
import { StoresModule } from '@modules/stores';

import { PageInnovationActionTrackerNewComponent } from './action-tracker-new.component';

import { SharedModule } from '@modules/shared/shared.module';
import { InnovationsService } from '@modules/shared/services/innovations.service';


describe('Shared/Pages/Innovation/PageInnovationActionTrackerNewComponent', () => {

  let activatedRoute: ActivatedRoute;
  let router: Router;
  let routerSpy: jest.SpyInstance;

  let innovationsService: InnovationsService;

  let component: PageInnovationActionTrackerNewComponent;
  let fixture: ComponentFixture<PageInnovationActionTrackerNewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        CoreModule,
        StoresModule,
        SharedModule
      ]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    activatedRoute = TestBed.inject(ActivatedRoute);
    router = TestBed.inject(Router);
    routerSpy = jest.spyOn(router, 'navigate');

    innovationsService = TestBed.inject(InnovationsService);

  });


  it('should create the component', () => {
    fixture = TestBed.createComponent(PageInnovationActionTrackerNewComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  // it('should populate section form field', () => {

  //   activatedRoute.snapshot.params = { innovationId: 'Inno01' };
  //   activatedRoute.snapshot.queryParams = { section: 'INNOVATION_DESCRIPTION' };

  //   fixture = TestBed.createComponent(PageInnovationActionTrackerNewComponent);
  //   component = fixture.componentInstance;

  //   expect(component.form.get('section')?.value).toBe('INNOVATION_DESCRIPTION');

  // });


  // it('should run onSubmit() with invalid form', () => {

  //   fixture = TestBed.createComponent(PageInnovationActionTrackerNewComponent);
  //   component = fixture.componentInstance;

  //   component.onSubmit();
  //   expect(component.form.valid).toEqual(false);

  // });

  // it('should run onSubmit and call api with success', () => {

  //   activatedRoute.snapshot.params = { innovationId: 'Inno01' };

  //   const responseMock = { id: 'actionId' };
  //   accessorService.createAction = () => of(responseMock);

  //   fixture = TestBed.createComponent(PageInnovationActionTrackerNewComponent);
  //   component = fixture.componentInstance;
  //   component.form.get('section')?.setValue('A required value');
  //   component.form.get('description')?.setValue('A required value');

  //   component.onSubmit();
  //   expect(routerSpy).toHaveBeenCalledWith(['/accessor/innovations/Inno01/action-tracker/actionId'], { queryParams: { alert: 'actionCreationSuccess' } });

  // });

  // it('should run onSubmit and call api with error', () => {

  //   activatedRoute.snapshot.params = { innovationId: 'Inno01' };

  //   accessorService.createAction = () => throwError('error');

  //   const expected = {
  //     type: 'ERROR',
  //     title: 'An error occurred when creating an action',
  //     message: 'Please try again or contact us for further help',
  //     setFocus: true
  //   };

  //   fixture = TestBed.createComponent(PageInnovationActionTrackerNewComponent);
  //   component = fixture.componentInstance;
  //   component.form.get('section')?.setValue('A required value');
  //   component.form.get('description')?.setValue('A required value');

  //   component.onSubmit();
  //   expect(component.alert).toEqual(expected);

  // });

});
