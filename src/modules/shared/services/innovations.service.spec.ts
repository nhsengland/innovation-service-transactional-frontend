import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { Injector } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { AppInjector, CoreModule, EnvironmentVariablesStore } from "@modules/core";
import { StoresModule } from "@modules/stores";
import { ENV } from "@tests/app.mocks";
import { GetInnovationNeedsAssessmentEndpointInDTO, GetInnovationNeedsAssessmentEndpointOutDTO, InnovationsService } from "./innovations.service";

describe('Shared/Services/InnovationsService', () => {

  let httpMock: HttpTestingController;

  let envVariablesStore: EnvironmentVariablesStore;
  let service: InnovationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        CoreModule,
        StoresModule
      ],
      providers: [
        InnovationsService,
        { provide: 'APP_SERVER_ENVIRONMENT_VARIABLES', useValue: ENV }
      ]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    httpMock = TestBed.inject(HttpTestingController);

    envVariablesStore = TestBed.inject(EnvironmentVariablesStore);
    service = TestBed.inject(InnovationsService);

  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should run getInnovationNeedsAssessment() and return success', () => {

    const responseMock: GetInnovationNeedsAssessmentEndpointInDTO = {
      id: 'Assess01',
      description: 'A description',
      maturityLevel: 'One value',
      maturityLevelComment: 'One value',
      hasRegulatoryApprovals: 'One value',
      hasRegulatoryApprovalsComment: 'One value',
      hasEvidence: 'One value',
      hasEvidenceComment: 'One value',
      hasValidation: 'One value',
      hasValidationComment: 'One value',
      hasProposition: 'One value',
      hasPropositionComment: 'One value',
      hasCompetitionKnowledge: 'One value',
      hasCompetitionKnowledgeComment: 'One value',
      hasImplementationPlan: 'One value',
      hasImplementationPlanComment: 'One value',
      hasScaleResource: 'One value',
      hasScaleResourceComment: 'One value',
      summary: 'One value',
      suggestedOrganisations: [
        { id: 'org1', name: 'orgName', acronym: 'orgAcronym', units: [{ id: 'unit1', name: 'orgUnitName', acronym: 'orgUnitAcronym' }] }
      ],
      assignTo: { id: 'na01', name: 'One value' },
      finishedAt: 'One value',
      updatedAt: null,
      updatedBy: { id: 'na01', name: 'One value' }
    };

    const expected: GetInnovationNeedsAssessmentEndpointOutDTO = {
      assessment: {
        description: responseMock.description,
        maturityLevel: responseMock.maturityLevel,
        maturityLevelComment: responseMock.maturityLevelComment,
        hasRegulatoryApprovals: responseMock.hasRegulatoryApprovals,
        hasRegulatoryApprovalsComment: responseMock.hasRegulatoryApprovalsComment,
        hasEvidence: responseMock.hasEvidence,
        hasEvidenceComment: responseMock.hasEvidenceComment,
        hasValidation: responseMock.hasValidation,
        hasValidationComment: responseMock.hasValidationComment,
        hasProposition: responseMock.hasProposition,
        hasPropositionComment: responseMock.hasPropositionComment,
        hasCompetitionKnowledge: responseMock.hasCompetitionKnowledge,
        hasCompetitionKnowledgeComment: responseMock.hasCompetitionKnowledgeComment,
        hasImplementationPlan: responseMock.hasImplementationPlan,
        hasImplementationPlanComment: responseMock.hasImplementationPlanComment,
        hasScaleResource: responseMock.hasScaleResource,
        hasScaleResourceComment: responseMock.hasScaleResourceComment,
        summary: responseMock.summary,
        suggestedOrganisations: responseMock.suggestedOrganisations,
        assignTo: responseMock.assignTo,
        finishedAt: responseMock.finishedAt,
        updatedAt: responseMock.updatedAt,
        updatedBy: responseMock.updatedBy,
        hasBeenSubmitted: !!responseMock.finishedAt
      }
    };

    let response: any = null;
    service.getInnovationNeedsAssessment('inno01', 'assess01').subscribe({ next: success => response = success, error: error => response = error });

    const httpRequest = httpMock.expectOne(`${envVariablesStore.API_INNOVATIONS_URL}/v1/inno01/assessments/assess01`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('GET');
    expect(response).toEqual(expected);

  });
});
