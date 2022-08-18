import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { of, throwError } from 'rxjs';

import { AppInjector, CoreModule } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { InnovatorModule } from '@modules/feature-modules/innovator/innovator.module';

import { InnovationActionTrackerComponent } from './action-tracker.component';
import { InnovatorService } from '@modules/feature-modules/innovator/services/innovator.service';
import { InnovationActionStatusEnum } from '@modules/stores/innovation';

describe('FeatureModules/Innovator/Innovation/ActionTrackerComponent', () => {

  let innovatorService: InnovatorService;

  let component: InnovationActionTrackerComponent;
  let fixture: ComponentFixture<InnovationActionTrackerComponent>;

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

    innovatorService = TestBed.inject(InnovatorService);

  });

  it('should create the component', () => {
    fixture = TestBed.createComponent(InnovationActionTrackerComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should have initial information loaded with OpenActions', () => {

    const getInnovationActionsListDataMock = {
      openedActions: [{ id: 'ID01', status: InnovationActionStatusEnum.REQUESTED, name: 'Submit section X', createdAt: '2021-04-16T09:23:49.396Z', notifications: { count: 1 } }],
      closedActions: [{ id: 'ID01', status: InnovationActionStatusEnum.COMPLETED, name: 'Submit section X', createdAt: '2021-04-16T09:23:49.396Z', notifications: { count: 1 } }]
    };
    innovatorService.getInnovationActionsList = () => of(getInnovationActionsListDataMock as any);
    const expected = getInnovationActionsListDataMock.openedActions;

    fixture = TestBed.createComponent(InnovationActionTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.openedActionsList.getRecords()).toEqual(expected);
    expect(component.openedActionsList.getRecords().length).toEqual(1);
  });

  it('should have initial information loaded with ClosedActions', () => {

    const getInnovationActionsListDataMock = {
      openedActions: [{ id: 'ID01', status: InnovationActionStatusEnum.REQUESTED, name: 'Submit section X', createdAt: '2021-04-16T09:23:49.396Z', notifications: { count: 1 } }],
      closedActions: [{ id: 'ID01', status: InnovationActionStatusEnum.DECLINED, name: 'Submit section X', createdAt: '2021-04-16T09:23:49.396Z', notifications: { count: 0 } }]
    };
    innovatorService.getInnovationActionsList = () => of(getInnovationActionsListDataMock as any);
    const expected = getInnovationActionsListDataMock.closedActions;

    fixture = TestBed.createComponent(InnovationActionTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.closedActionsList.getRecords()).toEqual(expected);
    expect(component.closedActionsList.getRecords().length).toEqual(1);
  });

  it('should NOT have initial information loaded', () => {

    innovatorService.getInnovationActionsList = () => throwError('error');

    fixture = TestBed.createComponent(InnovationActionTrackerComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.pageStatus).toBe('ERROR');

  });

});
