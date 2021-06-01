import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { of, throwError } from 'rxjs';

import { AppInjector, CoreModule } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { AssessmentModule } from '@modules/feature-modules/assessment/assessment.module';

import { InnovationOverviewComponent } from './overview.component';

import { AssessmentService } from '@modules/feature-modules/assessment/services/assessment.service';


describe('FeatureModules/Assessment/Innovation/InnovationOverviewComponent', () => {

  let assessmentService: AssessmentService;

  let component: InnovationOverviewComponent;
  let fixture: ComponentFixture<InnovationOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        CoreModule,
        StoresModule,
        AssessmentModule
      ]
    }).compileComponents();

    AppInjector.setInjector(TestBed.inject(Injector));

    assessmentService = TestBed.inject(AssessmentService);

  });


  it('should create the component', () => {

    fixture = TestBed.createComponent(InnovationOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();

  });


  it('should have innovation information loaded with payload 01', () => {

    const dataMock = {
      summary: { id: '01', name: 'Innovation 01', status: 'CREATED', description: 'A description', company: 'User company', countryName: 'England', postCode: null, categories: ['Medical'], otherCategoryDescription: '' },
      contact: { name: 'A name', email: 'email', phone: '' },
      assessment: { id: '01', assignToName: 'Name' }
    };
    assessmentService.getInnovationInfo = () => of(dataMock as any);
    const expected = dataMock;

    fixture = TestBed.createComponent(InnovationOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.innovation).toEqual(expected);

  });

  it('should have innovation information loaded with payload 02', () => {

    const dataMock = {
      summary: { id: '01', name: 'Innovation 01', status: 'CREATED', description: 'A description', company: 'User company', countryName: 'England', postCode: 'SW01', categories: ['Medical', 'OTHER'], otherCategoryDescription: 'Other category' },
      contact: { name: 'A name', email: 'email', phone: '' },
      assessment: { id: '01', assignToName: 'Name' }
    };
    assessmentService.getInnovationInfo = () => of(dataMock as any);
    const expected = dataMock;

    fixture = TestBed.createComponent(InnovationOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.innovation).toEqual(expected);

  });

  it('should NOT have innovation information loaded', () => {

    assessmentService.getInnovationInfo = () => throwError('error');
    const expected = [];

    fixture = TestBed.createComponent(InnovationOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.innovation).toEqual(undefined);

  });

});
