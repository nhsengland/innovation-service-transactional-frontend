import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { InnovationActionStatusEnum, InnovationSectionEnum } from '@modules/stores/innovation';
import { AccessorModule } from '@modules/feature-modules/accessor/accessor.module';

import { ActionsListComponent } from './actions-list.component';

import { AccessorService, getActionsListEndpointInDTO } from '../../services/accessor.service';


describe('FeatureModules/Accessor/Actions/ActionsListComponent', () => {

  let activatedRoute: ActivatedRoute;
  let router: Router;
  let routerSpy: jest.SpyInstance;

  let component: ActionsListComponent;
  let fixture: ComponentFixture<ActionsListComponent>;

  let accessorService: AccessorService;

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

    accessorService = TestBed.inject(AccessorService);

  });

  it('should create the component', () => {
    fixture = TestBed.createComponent(ActionsListComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });


  // it('should redirect if no "openActions" query param exists', () => {

  //   fixture = TestBed.createComponent(ActionsListComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();

  //   expect(routerSpy).toHaveBeenCalledWith(['/accessor/actions'], { queryParams: { openActions: 'true' } });

  // });

  // it('should run getActionsList() with success', () => {

  //   activatedRoute.queryParams = of({ openActions: 'true' });
  //   accessorService.getActionsList = () => of(responseMock as any);

  //   const responseMock: getActionsListEndpointInDTO = {
  //     count: 2,
  //     data: [
  //       {
  //         id: '01', displayId: 'dId01', status: InnovationActionStatusEnum.REQUESTED, section: InnovationSectionEnum.INNOVATION_DESCRIPTION, createdAt: '2021-04-16T09:23:49.396Z', updatedAt: '2021-04-16T09:23:49.396',
  //         innovation: { id: 'Inno01', name: 'Innovation 01' }
  //       },
  //       {
  //         id: '02', displayId: 'dId02', status: InnovationActionStatusEnum.STARTED, section: InnovationSectionEnum.INNOVATION_DESCRIPTION, createdAt: '2021-04-16T09:23:49.396Z', updatedAt: '2021-04-16T09:23:49.396',
  //         innovation: { id: 'Inno02', name: 'Innovation 02' }
  //       }
  //     ]
  //   };

  //   const expected = responseMock.data;

  //   fixture = TestBed.createComponent(ActionsListComponent);
  //   component = fixture.componentInstance;

  //   fixture.detectChanges();
  //   expect(component.actionsList.getRecords()).toEqual(expected);

  // });

  // it('should run getActionsList() with error', () => {

  //   activatedRoute.queryParams = of({ openActions: 'true' });
  //   accessorService.getActionsList = () => throwError(false);

  //   const expected = [] as any;

  //   fixture = TestBed.createComponent(ActionsListComponent);
  //   component = fixture.componentInstance;

  //   fixture.detectChanges();
  //   expect(component.actionsList.getRecords()).toEqual(expected);

  // });

  // it('should run onTableOrder()', () => {

  //   accessorService.getActionsList = () => of({ count: 0, data: [] });

  //   fixture = TestBed.createComponent(ActionsListComponent);
  //   component = fixture.componentInstance;

  //   fixture.detectChanges();
  //   component.onTableOrder('name');
  //   expect(component.actionsList.orderBy).toEqual('name');

  // });

  // it('should run onPageChange()', () => {

  //   fixture = TestBed.createComponent(ActionsListComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();

  //   component.onPageChange({ pageNumber: 2 });
  //   expect(component.actionsList.page).toBe(2);

  // });

});
