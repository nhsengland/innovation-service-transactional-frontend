import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Injector } from '@angular/core';
import { of, throwError } from 'rxjs';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { AccessorModule } from '@modules/feature-modules/accessor/accessor.module';

import { ReviewInnovationsComponent } from './review-innovations.component';

import { AccessorService } from '../../services/accessor.service';


describe('FeatureModules/Accessor/Innovations/ReviewInnovationsComponent', () => {

  let component: ReviewInnovationsComponent;
  let fixture: ComponentFixture<ReviewInnovationsComponent>;

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

    accessorService = TestBed.inject(AccessorService);

  });

  it('should create the component', () => {

    fixture = TestBed.createComponent(ReviewInnovationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();

  });

  it('should run getInnovations() with success', () => {

    const dataMock = {
      count: 100,
      data: [
        { id: 'id01', status: 'CREATED', name: 'Innovation 01', supportStatus: 'UNASSIGNED', createdAt: '2020-01-01T00:00:00.000Z', updatedAt: '2020-01-01T00:00:00.000Z' }
      ]
    };
    accessorService.getInnovationsList = () => of(dataMock as any);

    const expected = dataMock.data;

    fixture = TestBed.createComponent(ReviewInnovationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.innovationsList.getRecords()).toEqual(expected);

  });

  it('should run getInnovations() with error', () => {

    accessorService.getInnovationsList = () => throwError(false);

    const expected = [] as any;

    fixture = TestBed.createComponent(ReviewInnovationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.innovationsList.getRecords()).toEqual(expected);

  });

  it('should run onTableOrder()', () => {

    fixture = TestBed.createComponent(ReviewInnovationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.onTableOrder('name');
    expect(component.innovationsList.orderBy).toEqual('name');

  });

});
