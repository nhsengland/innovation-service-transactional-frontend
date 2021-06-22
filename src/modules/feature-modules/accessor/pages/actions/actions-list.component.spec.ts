import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { InnovationSectionsIds } from '@modules/stores/innovation/innovation.models';
import { AccessorModule } from '@modules/feature-modules/accessor/accessor.module';

import { ActionsListComponent } from './actions-list.component';

import { AccessorService, getActionsListEndpointInDTO } from '../../services/accessor.service';


describe('FeatureModules/Accessor/Actions/ActionsListComponent', () => {

  let activatedRoute: ActivatedRoute;

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

    accessorService = TestBed.inject(AccessorService);

  });

  it('should create the component', () => {

    fixture = TestBed.createComponent(ActionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();

  });


  it('should redirect if no "openActions" query param exists', () => {

    const routerSpy = spyOn(TestBed.inject(Router), 'navigate');

    fixture = TestBed.createComponent(ActionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(routerSpy).toHaveBeenCalledWith(['/accessor/actions'], { queryParams: { openActions: 'true' } });

  });

  it('should run getActionsList() with success', () => {

    activatedRoute.queryParams = of({ openActions: 'true' });
    accessorService.getActionsList = () => of(responseMock as any);

    const responseMock: getActionsListEndpointInDTO = {
      count: 2,
      data: [
        {
          id: '01', displayId: 'dId01', status: 'REQUESTED', section: InnovationSectionsIds.INNOVATION_DESCRIPTION, createdAt: '2021-04-16T09:23:49.396Z', updatedAt: '2021-04-16T09:23:49.396',
          innovation: { id: 'Inno01', name: 'Innovation 01' }
        },
        {
          id: '02', displayId: 'dId02', status: 'STARTED', section: InnovationSectionsIds.INNOVATION_DESCRIPTION, createdAt: '2021-04-16T09:23:49.396Z', updatedAt: '2021-04-16T09:23:49.396',
          innovation: { id: 'Inno02', name: 'Innovation 02' }
        }
      ]
    };

    const expected = responseMock.data;

    fixture = TestBed.createComponent(ActionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.actionsList.getRecords()).toEqual(expected);

  });

  it('should run getActionsList() with error', () => {

    activatedRoute.queryParams = of({ openActions: 'true' });
    accessorService.getActionsList = () => throwError(false);

    const expected = [] as any;

    fixture = TestBed.createComponent(ActionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.actionsList.getRecords()).toEqual(expected);

  });

  it('should run onTableOrder()', () => {

    fixture = TestBed.createComponent(ActionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.onTableOrder('name');
    expect(component.actionsList.orderBy).toEqual('name');

  });

});
