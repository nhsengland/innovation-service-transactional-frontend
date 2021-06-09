import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { of, throwError } from 'rxjs';

import { AppInjector, CoreModule } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { AccessorModule } from '@modules/feature-modules/accessor/accessor.module';

import { InnovationActionTrackerListComponent } from './action-tracker-list.component';

import { AccessorService } from '@modules/feature-modules/accessor/services/accessor.service';


describe('FeatureModules/Accessor/Innovation/InnovationActionTrackerListComponent', () => {

  let accessorService: AccessorService;

  let component: InnovationActionTrackerListComponent;
  let fixture: ComponentFixture<InnovationActionTrackerListComponent>;

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

    accessorService = TestBed.inject(AccessorService);

  });


  it('should create the component', () => {

    fixture = TestBed.createComponent(InnovationActionTrackerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();

  });


  it('should have initial information loaded', () => {

    const getInnovationInfoDataMock = {
      summary: { id: '01', name: 'Innovation 01', status: 'CREATED', description: 'A description', company: 'User company', countryName: 'England', postCode: null, categories: ['Medical'], otherCategoryDescription: '' },
      contact: { name: 'A name', email: 'email', phone: '' },
      assessment: { id: '01', assignToName: 'Name' },
      support: { id: '01', status: 'WAITING', accessors: [{ id: 'IdOne', name: 'Brigid Kosgei' }, { id: 'IdTwo', name: 'Brigid Kosgei the second' }] }
    };
    const getInnovationActionsListDataMock = {
      openedActions: [{ id: 'ID01', status: 'REQUESTED', name: 'Submit section X', createdAt: '2021-04-16T09:23:49.396Z' }],
      closedActions: [{ id: 'ID01', status: 'REQUESTED', name: 'Submit section X', createdAt: '2021-04-16T09:23:49.396Z' }]
    };
    accessorService.getInnovationInfo = () => of(getInnovationInfoDataMock as any);
    accessorService.getInnovationActionsList = () => of(getInnovationActionsListDataMock as any);

    fixture = TestBed.createComponent(InnovationActionTrackerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.innovation.name).toEqual('Innovation 01');

  });

  it('should NOT have initial information loaded', () => {

    accessorService.getInnovationInfo = () => throwError('error');
    accessorService.getInnovationActionsList = () => throwError('error');
    const expected = [];

    fixture = TestBed.createComponent(InnovationActionTrackerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.innovation).toEqual({ name: '', assessmentId: null });

  });

});
