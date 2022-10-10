import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AppInjector, CoreModule } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { InnovationSupportStatusEnum } from '@modules/stores/innovation';

import { InnovatorNeedsAssessmentOverviewComponent } from './needs-assessment-overview.component';

import { InnovatorModule } from '@modules/feature-modules/innovator/innovator.module';
import { InnovatorService } from '@modules/feature-modules/innovator/services/innovator.service';

import { NEEDS_ASSESSMENT_QUESTIONS } from '@modules/stores/innovation/config/needs-assessment-constants.config';


describe('FeatureModules/Innovator/Innovation/InnovatorNeedsAssessmentOverviewComponent', () => {

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

    innovatorService.getSupportLogList = () => of([{
      id: 'support01',
      type: 'STATUS_UPDATE',
      description: 'description',
      createdBy: 'A user',
      createdAt: '2020-01-01T00:00:00.000Z',
      innovationSupportStatus: InnovationSupportStatusEnum.ENGAGING,
      organisationUnit: {
        id: 'unit01', name: 'Unit 01', acronym: 'UN',
        organisation: { id: 'org01', name: 'Org 01', acronym: 'ORG' }
      },
      logTitle: 'Updated  support status',
      suggestedOrganisationUnitsNames: ['Unit 01']
    }]);

  });


  it('should create the component', () => {
    fixture = TestBed.createComponent(InnovatorNeedsAssessmentOverviewComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  // it('should run getInnovationNeedsAssessment() with a response with all RELEVANT information', () => {

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
  //       organisations: [],
  //       orgNames: [],
  //       orgUnits: [],
  //       assignToName: '',
  //       finishedAt: null,
  //       updatedBy: null,
  //       updatedAt: null,
  //       createdAt: null,
  //       createdBy: null
  //     }
  //   };
  //   innovatorService.getInnovationNeedsAssessment = () => of(responseMock);
  //   const expected = responseMock.assessment;

  //   fixture = TestBed.createComponent(InnovatorNeedsAssessmentOverviewComponent);
  //   component = fixture.componentInstance;

  //   fixture.detectChanges();
  //   expect(component.assessment).toEqual(expected);

  // });

  // it('should run getInnovationNeedsAssessment() with a response with EMPTY information', () => {

  //   NEEDS_ASSESSMENT_QUESTIONS.innovation[1].label = '';

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
  //       orgNames: [],
  //       orgUnits: [],
  //       assignToName: '',
  //       finishedAt: null,
  //       updatedBy: null,
  //       updatedAt: null,
  //       createdAt: null,
  //       createdBy: null
  //     }
  //   };
  //   innovatorService.getInnovationNeedsAssessment = () => of(responseMock);
  //   const expected = responseMock.assessment;

  //   fixture = TestBed.createComponent(InnovatorNeedsAssessmentOverviewComponent);
  //   component = fixture.componentInstance;

  //   fixture.detectChanges();
  //   expect(component.assessment).toEqual(expected);

  // });

  // it('should run getInnovationNeedsAssessment() with error', () => {

  //   innovatorService.getInnovationNeedsAssessment = () => throwError(false);

  //   const expected = undefined;

  //   fixture = TestBed.createComponent(InnovatorNeedsAssessmentOverviewComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();
  //   expect(component.assessment).toBe(expected);

  // });

});
