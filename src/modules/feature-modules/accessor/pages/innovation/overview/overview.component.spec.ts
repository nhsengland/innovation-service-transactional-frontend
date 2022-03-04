import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AppInjector, CoreModule } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { AccessorModule } from '@modules/feature-modules/accessor/accessor.module';

import { InnovationOverviewComponent } from './overview.component';

import { AccessorService } from '@modules/feature-modules/accessor/services/accessor.service';


describe('FeatureModules/Accessor/Innovation/InnovationOverviewComponent', () => {

  let activatedRoute: ActivatedRoute;

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

    activatedRoute = TestBed.inject(ActivatedRoute);

    accessorService = TestBed.inject(AccessorService);

    activatedRoute.snapshot.data = { innovationData: { id: 'Inno01', name: 'Innovation 01', support: { id: 'Inno01Support01', status: 'ENGAGING' }, assessment: {} } };

  });

  it('should create the component', () => {
    fixture = TestBed.createComponent(InnovationOverviewComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should have innovation information loaded with payload 01', () => {

    accessorService.getInnovationInfo = () => of({
      summary: { id: '01', name: 'Innovation 01', status: 'CREATED', description: 'A description', company: 'User company', companySize: '1 to 5 employees', countryName: 'England', postCode: '', categories: ['MEDICAL_DEVICE'], otherCategoryDescription: '' },
      contact: { name: 'A name' },
      assessment: { id: '01' },
      support: { id: '01', status: 'WAITING' },
      notifications: {}
    });

    fixture = TestBed.createComponent(InnovationOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.innovationSummary[0].value).toEqual('A name');

  });

  it('should have innovation information loaded with payload 02', () => {

    accessorService.getInnovationInfo = () => of({
      summary: { id: '01', name: 'Innovation 01', status: 'CREATED', description: 'A description', company: 'User company', companySize: '1 to 5 employees', countryName: 'England', postCode: 'SW01', categories: ['MEDICAL_DEVICE', 'OTHER', 'INVALID'], otherCategoryDescription: 'Other category' },
      contact: { name: 'A name' },
      assessment: { id: '01' },
      notifications: {}
    });

    fixture = TestBed.createComponent(InnovationOverviewComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.innovationSummary.find(i => i.label === 'Categories')?.value).toEqual('Medical device\nOther category\n');

  });

  it('should NOT have innovation information loaded', () => {

    accessorService.getInnovationInfo = () => throwError('error');
    const expected = [];

    fixture = TestBed.createComponent(InnovationOverviewComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.innovationSummary.length).toBe(0);

  });

});
