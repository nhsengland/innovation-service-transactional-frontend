import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { of, throwError } from 'rxjs';

import { AppInjector, CoreModule } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { AssessmentModule } from '@modules/feature-modules/assessment/assessment.module';
import { InnovationStatusEnum } from '@modules/stores/innovation';

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
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    assessmentService = TestBed.inject(AssessmentService);

  });


  it('should create the component', () => {
    fixture = TestBed.createComponent(InnovationOverviewComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should have innovation information loaded with payload 01', () => {

    const responseMock = {
      summary: {
        id: '01', name: 'Innovation 01', status: InnovationStatusEnum.CREATED, description: 'A description', company: 'User company',
        companySize: '1 to 5 employees', countryName: 'England', postCode: '', categories: ['MEDICAL_DEVICE'], otherCategoryDescription: ''
      },
      contact: { name: 'A name', email: 'email', phone: '' },
      assessment: { id: '01', assignToName: 'Name' },
      lockedInnovatorValidation: { displayIsInnovatorLocked : true, innovatorName : 'test'}
    };
    assessmentService.getInnovationInfo = () => of(responseMock);

    const expected = responseMock;

    fixture = TestBed.createComponent(InnovationOverviewComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.innovation).toEqual(expected);

  });

  it('should have innovation information loaded with payload 02', () => {

    const responseMock = {
      summary: {
        id: '01', name: 'Innovation 01', status: InnovationStatusEnum.CREATED, description: 'A description', company: 'User company',
        companySize: '1 to 5 employees', countryName: 'England', postCode: 'SW01', categories: ['MEDICAL_DEVICE', 'OTHER', 'INVALID'], otherCategoryDescription: 'Other category'
      },
      contact: { name: 'A name', email: 'email', phone: '' },
      assessment: { id: '01', assignToName: 'Name' },
      lockedInnovatorValidation: { displayIsInnovatorLocked : false, innovatorName : 'test'}
    };
    assessmentService.getInnovationInfo = () => of(responseMock);

    const expected = responseMock;

    fixture = TestBed.createComponent(InnovationOverviewComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.innovation).toEqual(expected);

  });

  it('should NOT have innovation information loaded', () => {

    assessmentService.getInnovationInfo = () => throwError('error');

    fixture = TestBed.createComponent(InnovationOverviewComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.innovation).toBeUndefined();

  });

});
