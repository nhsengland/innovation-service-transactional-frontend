import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AppInjector, CoreModule } from '@modules/core';
import { StoresModule } from '@modules/stores';

import { InnovatorNeedsAssessmentOverviewComponent } from './needs-assessment-overview.component';

import { InnovatorModule } from '@modules/feature-modules/innovator/innovator.module';
import { InnovatorService } from '@modules/feature-modules/innovator/services/innovator.service';


describe('FeatureModules/Innovator/Innovation/InnovationNeedsAssessmentOverviewComponent', () => {

  let activatedRoute: ActivatedRoute;

  let innovatorService: InnovatorService;

  let component: InnovatorNeedsAssessmentOverviewComponent;
  let fixture: ComponentFixture<InnovatorNeedsAssessmentOverviewComponent>;

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

    activatedRoute = TestBed.inject(ActivatedRoute);

    innovatorService = TestBed.inject(InnovatorService);

    activatedRoute.snapshot.params = { innovationId: 'Inno01' };
    activatedRoute.snapshot.data = { innovationData: { id: 'Inno01', name: 'Innovation 01', support: { id: 'Inno01Support01', status: 'ENGAGING' }, assessment: {} } };

  });


  it('should create the component', () => {

    fixture = TestBed.createComponent(InnovatorNeedsAssessmentOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();

  });


  it('should run getInnovationNeedsAssessment() with success', () => {

    const responseMock = {
      innovation: { id: '01', name: 'Innovation 01' },
      assessment: { description: 'description' }
    };
    innovatorService.getInnovationNeedsAssessment = () => of(responseMock as any);
    const expected = responseMock.assessment;

    fixture = TestBed.createComponent(InnovatorNeedsAssessmentOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.assessment).toBe(expected);

  });

  it('should run getInnovationNeedsAssessment() with error', () => {

    innovatorService.getInnovationNeedsAssessment = () => throwError(false);

    const expected = undefined;

    fixture = TestBed.createComponent(InnovatorNeedsAssessmentOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.assessment).toBe(expected);

  });

});
