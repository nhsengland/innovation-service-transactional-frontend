import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AppInjector, CoreModule } from '@modules/core';
import { StoresModule } from '@modules/stores';

import { PageInnovationActionTrackerEditComponent } from './action-tracker-edit.component';

import { AccessorService } from '@modules/feature-modules/accessor/services/accessor.service';
import { InnovationsService } from '@modules/shared/services/innovations.service';
import { SharedModule } from '@modules/shared/shared.module';


describe('Shared/Pages/Innovation/PageInnovationActionTrackerEditComponent', () => {

  let activatedRoute: ActivatedRoute;
  let innovationsService: InnovationsService;
  let router: Router;
  let routerSpy: jest.SpyInstance;

  let accessorService: AccessorService;

  let component: PageInnovationActionTrackerEditComponent;
  let fixture: ComponentFixture<PageInnovationActionTrackerEditComponent>;

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
    fixture = TestBed.createComponent(PageInnovationActionTrackerEditComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  // it('should have component initial values', () => {

  //   activatedRoute.snapshot.params = { innovationId: 'Inno01' };

  //   const responseMock: GetInnovationActionInfoOutDTO = {
  //     id: 'ID01',
  //     displayId: '',
  //     status: InnovationActionStatusEnum.REQUESTED,
  //     name: 'Submit section 01',
  //     description: 'some description',
  //     section: InnovationSectionEnum.COST_OF_INNOVATION,
  //     createdAt: '2020-01-01T00:00:00.000Z',
  //     createdBy: 'Innovation user'
  //   };
  //   accessorService.getInnovationActionInfo = () => of(responseMock);

  //   fixture = TestBed.createComponent(PageInnovationActionTrackerEditComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();

  //   expect(component.actionDisplayId).toBe(responseMock.displayId);

  // });

  // it('should NOT have component initial values', () => {

  //   activatedRoute.snapshot.params = { innovationId: 'Inno01' };

  //   accessorService.getInnovationActionInfo = () => throwError('error');

  //   fixture = TestBed.createComponent(PageInnovationActionTrackerEditComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();

  //   expect(component.actionDisplayId).toBe('');

  // });

  // it('should run onSubmit() with invalid form', () => {

  //   fixture = TestBed.createComponent(PageInnovationActionTrackerEditComponent);
  //   component = fixture.componentInstance;

  //   component.onSubmit();
  //   expect(component.form.valid).toEqual(false);

  // });

  // it('should run onSubmit and call api with success with INVALID "status" form field', () => {

  //   activatedRoute.snapshot.params = { innovationId: 'Inno01' };

  //   const responseMock = { id: 'actionId' };
  //   accessorService.updateAction = () => of(responseMock);

  //   fixture = TestBed.createComponent(PageInnovationActionTrackerEditComponent);
  //   component = fixture.componentInstance;
  //   component.form.get('status')?.setValue('Invalid status');

  //   component.onSubmit();
  //   expect(routerSpy).toHaveBeenCalledWith(['/accessor/innovations/Inno01/action-tracker/actionId'], { queryParams: { alert: 'actionUpdateSuccess', status: undefined } });

  // });

  // it('should run onSubmit and call api with success', () => {

  //   activatedRoute.snapshot.params = { innovationId: 'Inno01' };

  //   const responseMock = { id: 'actionId' };
  //   accessorService.updateAction = () => of(responseMock);

  //   fixture = TestBed.createComponent(PageInnovationActionTrackerEditComponent);
  //   component = fixture.componentInstance;
  //   component.form.get('status')?.setValue('REQUESTED');

  //   component.onSubmit();
  //   expect(routerSpy).toHaveBeenCalledWith(['/accessor/innovations/Inno01/action-tracker/actionId'], { queryParams: { alert: 'actionUpdateSuccess', status: 'Requested' } });

  // });

  // it('should run onSubmit and call api with error', () => {

  //   activatedRoute.snapshot.params = { innovationId: 'Inno01' };

  //   accessorService.updateAction = () => throwError('error');

  //   fixture = TestBed.createComponent(PageInnovationActionTrackerEditComponent);
  //   component = fixture.componentInstance;
  //   component.form.get('status')?.setValue('REQUESTED');

  //   component.onSubmit();
  //   expect(component.alert.type).toEqual('ERROR');

  // });

});
