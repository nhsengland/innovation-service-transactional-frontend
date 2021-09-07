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

import { AccessorService, SupportLogType } from '@modules/feature-modules/accessor/services/accessor.service';

import { NEEDS_ASSESSMENT_QUESTIONS } from '@modules/stores/innovation/config/needs-assessment-constants.config';


describe('FeatureModules/Accessor/Innovation/NeedsAssessmentOverviewComponent', () => {

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
    expect(component).toBeTruthy();
  });


  it('should run getInnovationNeedsAssessment() with a response with all RELEVANT information', () => {

    const responseMock = {
      innovation: { id: '01', name: 'Innovation 01' },
      assessment: {
        description: 'description',
        maturityLevel: 'DISCOVERY',
        hasRegulatoryApprovals: 'YES',
        hasRegulatoryApprovalsComment: null,
        hasEvidence: 'YES',
        hasEvidenceComment: null,
        hasValidation: 'YES',
        hasValidationComment: null,
        hasProposition: 'YES',
        hasPropositionComment: null,
        hasCompetitionKnowledge: 'DISCOVERY',
        hasCompetitionKnowledgeComment: null,
        hasImplementationPlan: 'YES',
        hasImplementationPlanComment: null,
        hasScaleResource: 'YES',
        hasScaleResourceComment: null,
        summary: null,
        organisations: [],
        assignToName: '',
        finishedAt: null
      },
      support: { id: null }
    };
    accessorService.getInnovationNeedsAssessment = () => of(responseMock);
    const expected = responseMock.assessment;

    fixture = TestBed.createComponent(InnovationNeedsAssessmentOverviewComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.assessment).toEqual(expected);

  });

  it('should run getInnovationNeedsAssessment() with a response with EMPTY information', () => {

    NEEDS_ASSESSMENT_QUESTIONS.innovation[1].label = '';

    const responseMock = {
      innovation: { id: '01', name: 'Innovation 01' },
      assessment: {
        description: 'description',
        maturityLevel: null,
        hasRegulatoryApprovals: null,
        hasRegulatoryApprovalsComment: null,
        hasEvidence: null,
        hasEvidenceComment: null,
        hasValidation: null,
        hasValidationComment: null,
        hasProposition: null,
        hasPropositionComment: null,
        hasCompetitionKnowledge: null,
        hasCompetitionKnowledgeComment: null,
        hasImplementationPlan: null,
        hasImplementationPlanComment: null,
        hasScaleResource: null,
        hasScaleResourceComment: null,
        summary: null,
        organisations: [],
        assignToName: '',
        finishedAt: null
      },
      support: { id: null }
    };
    accessorService.getInnovationNeedsAssessment = () => of(responseMock);
    const expected = responseMock.assessment;

    fixture = TestBed.createComponent(InnovationNeedsAssessmentOverviewComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.assessment).toEqual(expected);

  });

  it('should run getInnovationNeedsAssessment() with error', () => {

    accessorService.getInnovationNeedsAssessment = () => throwError(false);

    const expected = undefined;

    fixture = TestBed.createComponent(InnovationNeedsAssessmentOverviewComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.assessment).toBe(expected);

  });


  it('should run getSupportLog() with success', () => {

    accessorService.getSupportLog = () => of([{
      id: 'support01',
      type: SupportLogType.STATUS_UPDATE,
      description: 'description',
      createdBy: 'A user',
      createdAt: '2020-01-01T00:00:00.000Z',
      innovationSupportStatus: 'ENGAGING',
      organisationUnit: {
        id: 'unit01', name: 'Unit 01', acronym: 'UN',
        organisation: { id: 'org01', name: 'Org 01', acronym: 'ORG' }
      },
      logTitle: 'Updated support status',
      suggestedOrganisationUnitsNames: ['Unit 01']
    }]);

    fixture = TestBed.createComponent(InnovationNeedsAssessmentOverviewComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.logHistory[0].id).toBe('support01');

  });

  it('should run getSupportLog() with error', () => {

    accessorService.getSupportLog = () => throwError(false);

    fixture = TestBed.createComponent(InnovationNeedsAssessmentOverviewComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.logHistory).toEqual([]);

  });

});
