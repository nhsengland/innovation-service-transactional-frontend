import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { of, throwError } from 'rxjs';

import { AppInjector, CoreModule } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { AccessorModule } from '@modules/feature-modules/accessor/accessor.module';

import { InnovationOverviewComponent } from './overview.component';

import { AccessorService, getInnovationInfoEndpointDTO } from '@modules/feature-modules/accessor/services/accessor.service';


describe('FeatureModules/Accessor/Innovation/InnovationOverviewComponent', () => {

  let accessorService: AccessorService;

  let component: InnovationOverviewComponent;
  let fixture: ComponentFixture<InnovationOverviewComponent>;

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
    fixture = TestBed.createComponent(InnovationOverviewComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should have innovation information loaded with payload 01', () => {

    const responseMock: getInnovationInfoEndpointDTO = {
      summary: { id: '01', name: 'Innovation 01', status: 'CREATED', description: 'A description', company: 'User company', countryName: 'England', postCode: '', categories: ['MEDICAL_DEVICE'], otherCategoryDescription: '' },
      contact: { name: 'A name' },
      assessment: { id: '01' },
      support: { id: '01', status: 'WAITING' },
      notifications: {}
    };
    accessorService.getInnovationInfo = () => of(responseMock);
    const expected = responseMock;

    fixture = TestBed.createComponent(InnovationOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.innovation).toEqual(expected);

  });

  it('should have innovation information loaded with payload 02', () => {

    const dataMock: getInnovationInfoEndpointDTO = {
      summary: { id: '01', name: 'Innovation 01', status: 'CREATED', description: 'A description', company: 'User company', countryName: 'England', postCode: 'SW01', categories: ['MEDICAL_DEVICE', 'OTHER', 'INVALID'], otherCategoryDescription: 'Other category' },
      contact: { name: 'A name' },
      assessment: { id: '01' },
      notifications: {}
    };
    accessorService.getInnovationInfo = () => of(dataMock);
    const expected = dataMock;

    fixture = TestBed.createComponent(InnovationOverviewComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.innovation).toEqual(expected);

  });

  it('should NOT have innovation information loaded', () => {

    accessorService.getInnovationInfo = () => throwError('error');
    const expected = [];

    fixture = TestBed.createComponent(InnovationOverviewComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.innovation).toEqual(undefined);

  });

});
