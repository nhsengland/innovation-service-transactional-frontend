import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AppInjector, CoreModule } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { AssessmentModule } from '@modules/feature-modules/assessment/assessment.module';

import { InnovationAssessmentOverviewComponent } from './assessment-overview.component';

import { InnovationsService } from '@modules/shared/services/innovations.service';
import { SupportLogType } from '@modules/shared/services/innovations.dtos';


describe('FeatureModules/Assessment/Innovation/InnovationAssessmentOverviewComponent', () => {

  let activatedRoute: ActivatedRoute;

  let innovationsService: InnovationsService;

  let component: InnovationAssessmentOverviewComponent;
  let fixture: ComponentFixture<InnovationAssessmentOverviewComponent>;

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

    innovationsService = TestBed.inject(InnovationsService);

    activatedRoute.snapshot.params = { innovationId: 'Inno01' };
    activatedRoute.snapshot.data = { innovationData: { id: 'Inno01', name: 'Innovation 01', support: { id: 'Inno01Support01', status: 'ENGAGING' }, assessment: {} } };

    innovationsService.getInnovationSupportLog = () => of([{
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

  });


  it('should create the component', () => {

    fixture = TestBed.createComponent(InnovationAssessmentOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();

  });

  // it('should show "needsAssessmentSubmited" success', () => {

  //   activatedRoute.snapshot.queryParams = { alert: 'needsAssessmentSubmited' };

  //   const expected = { type: 'SUCCESS', title: 'Needs assessment successfully completed' };

  //   fixture = TestBed.createComponent(InnovationAssessmentOverviewComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();
  //   expect(component.alert).toEqual(expected);

  // });

  // it('should run getInnovationNeedsAssessment() with a response with all RELEVANT information', () => {

  //   NEEDS_ASSESSMENT_QUESTIONS.innovation[1].label = '';

  //   const responseMock = {
  //     innovation: { id: '01', name: 'Innovation 01' },
  //     assessment: {
  //       description: 'description',
  //       maturityLevel: 'DISCOVERY',
  //       maturityLevelComment: null,
  //       hasRegulatoryApprovals: 'YES',
  //       hasRegulatoryApprovalsComment: null,
  //       hasEvidence: 'YES',
  //       hasEvidenceComment: null,
  //       hasValidation: 'YES',
  //       hasValidationComment: null,
  //       hasProposition: 'YES',
  //       hasPropositionComment: null,
  //       hasCompetitionKnowledge: 'YES',
  //       hasCompetitionKnowledgeComment: null,
  //       hasImplementationPlan: 'YES',
  //       hasImplementationPlanComment: null,
  //       hasScaleResource: 'YES',
  //       hasScaleResourceComment: null,
  //       summary: null,
  //       organisations: [{ id: 'OrgId', name: 'Org name', acronym: 'ORG', organisationUnits: [{ id: 'OrgUnitId', name: 'Org Unit name', acronym: 'ORGu' }] }],
  //       assignToName: '',
  //       finishedAt: null,
  //       createdAt: '2020-01-01T00:00:00.000Z',
  //       createdBy: '2020-01-01T00:00:00.000Z',
  //       updatedAt: null,
  //       updatedBy: null,
  //       hasBeenSubmitted: true
  //     },
  //     support: { id: null }
  //   };
  //   assessmentService.getInnovationNeedsAssessment = () => of(responseMock);
  //   const expected = { ...responseMock.assessment, organisations: [{ id: 'OrgId', name: 'Org name', acronym: 'ORG', organisationUnits: [{ id: 'OrgUnitId', name: 'Org Unit name', acronym: 'ORGu' }] }] };

  //   fixture = TestBed.createComponent(InnovationAssessmentOverviewComponent);
  //   component = fixture.componentInstance;

  //   fixture.detectChanges();
  //   expect(component.assessment).toEqual(expected);

  // });

  // it('should run getInnovationNeedsAssessment() with a response with EMPTY information', () => {

  //   const responseMock = {
  //     innovation: { id: '01', name: 'Innovation 01' },
  //     assessment: {
  //       description: 'description',
  //       maturityLevel: null,
  //       maturityLevelComment: null,
  //       hasRegulatoryApprovals: null,
  //       hasRegulatoryApprovalsComment: null,
  //       hasEvidence: null,
  //       hasEvidenceComment: null,
  //       hasValidation: null,
  //       hasValidationComment: null,
  //       hasProposition: null,
  //       hasPropositionComment: null,
  //       hasCompetitionKnowledge: null,
  //       hasCompetitionKnowledgeComment: null,
  //       hasImplementationPlan: null,
  //       hasImplementationPlanComment: null,
  //       hasScaleResource: null,
  //       hasScaleResourceComment: null,
  //       summary: null,
  //       organisations: [],
  //       assignToName: '',
  //       finishedAt: null,
  //       createdAt: '2020-01-01T00:00:00.000Z',
  //       createdBy: '2020-01-01T00:00:00.000Z',
  //       updatedAt: null,
  //       updatedBy: null,
  //       hasBeenSubmitted: false
  //     },
  //     support: { id: null }
  //   };
  //   assessmentService.getInnovationNeedsAssessment = () => of(responseMock);
  //   const expected = { ...responseMock.assessment, organisations: [] };

  //   fixture = TestBed.createComponent(InnovationAssessmentOverviewComponent);
  //   component = fixture.componentInstance;

  //   fixture.detectChanges();
  //   expect(component.assessment).toEqual(expected);

  // });

  // it('should run getInnovationNeedsAssessment() with error', () => {

  //   assessmentService.getInnovationNeedsAssessment = () => throwError(false);

  //   const expected = undefined;

  //   fixture = TestBed.createComponent(InnovationAssessmentOverviewComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();
  //   expect(component.assessment).toBe(expected);

  // });

});
