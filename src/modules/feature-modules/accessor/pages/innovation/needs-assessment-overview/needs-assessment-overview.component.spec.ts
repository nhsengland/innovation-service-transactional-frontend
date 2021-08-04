import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AppInjector, CoreModule } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { AccessorModule } from '@modules/feature-modules/accessor/accessor.module';

import { InnovationNeedsAssessmentOverviewComponent } from './needs-assessment-overview.component';

import { AccessorService } from '@modules/feature-modules/accessor/services/accessor.service';


describe('FeatureModules/Accessor/Innovation/InnovationNeedsAssessmentOverviewComponent', () => {

  let activatedRoute: ActivatedRoute;

  let accessorService: AccessorService;

  let component: InnovationNeedsAssessmentOverviewComponent;
  let fixture: ComponentFixture<InnovationNeedsAssessmentOverviewComponent>;

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
      assessment: {
        description: 'description',
        maturityLevel: 'DISCOVERY',
        organisations: []
      }
    };
    accessorService.getInnovationNeedsAssessment = () => of(responseMock as any);
    const expected = responseMock.assessment;

    fixture = TestBed.createComponent(InnovationNeedsAssessmentOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.assessment).toBe(expected);

  });

  it('should run getInnovationNeedsAssessment() with error', () => {

    accessorService.getInnovationNeedsAssessment = () => throwError(false);

    const expected = undefined;

    fixture = TestBed.createComponent(InnovationNeedsAssessmentOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.assessment).toBe(expected);

  });

});
