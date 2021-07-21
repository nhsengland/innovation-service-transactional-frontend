import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AppInjector, CoreModule } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { AssessmentModule } from '@modules/feature-modules/assessment/assessment.module';

import { InnovationNeedsAssessmentOverviewComponent } from './needs-assessment-overview.component';

import { AssessmentService } from '@modules/feature-modules/assessment/services/assessment.service';


describe('FeatureModules/Assessment/Innovation/InnovationNeedsAssessmentOverviewComponent', () => {

  let activatedRoute: ActivatedRoute;

  let assessmentService: AssessmentService;

  let component: InnovationNeedsAssessmentOverviewComponent;
  let fixture: ComponentFixture<InnovationNeedsAssessmentOverviewComponent>;

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

    activatedRoute = TestBed.inject(ActivatedRoute);

    assessmentService = TestBed.inject(AssessmentService);

    activatedRoute.snapshot.params = { innovationId: 'Inno01' };
    activatedRoute.snapshot.data = { innovationData: { id: 'Inno01', name: 'Innovation 01', support: { id: 'Inno01Support01', status: 'ENGAGING' }, assessment: {} } };

  });


  it('should create the component', () => {

    fixture = TestBed.createComponent(InnovationNeedsAssessmentOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();

  });


  it('should run getInnovationNeedsAssessment() with success', () => {

    const responseMock = {
      innovation: { id: '01', name: 'Innovation 01' },
      assessment: { description: 'description', organisations: [] }
    };
    assessmentService.getInnovationNeedsAssessment = () => of(responseMock as any);
    const expected = { ...responseMock.assessment, organisationsNames: [] };

    fixture = TestBed.createComponent(InnovationNeedsAssessmentOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.assessment).toEqual(expected);

  });

  it('should run getInnovationNeedsAssessment() with error', () => {

    assessmentService.getInnovationNeedsAssessment = () => throwError(false);

    const expected = undefined;

    fixture = TestBed.createComponent(InnovationNeedsAssessmentOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.assessment).toBe(expected);

  });

});
