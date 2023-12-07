import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AppInjector, CoreModule } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { AssessmentModule } from '@modules/feature-modules/assessment/assessment.module';

import { InnovationAssessmentEditComponent } from './assessment-edit.component';

import { AssessmentService } from '@modules/feature-modules/assessment/services/assessment.service';
import { OrganisationsService } from '@modules/shared/services/organisations.service';

describe('FeatureModules/Assessment/Innovation/Assessment/InnovationAssessmentEditComponent', () => {
  let activatedRoute: ActivatedRoute;
  let router: Router;
  let routerSpy: jest.SpyInstance;

  let component: InnovationAssessmentEditComponent;
  let fixture: ComponentFixture<InnovationAssessmentEditComponent>;

  let assessmentService: AssessmentService;
  let organisationsService: OrganisationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, CoreModule, StoresModule, AssessmentModule]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    activatedRoute = TestBed.inject(ActivatedRoute);
    router = TestBed.inject(Router);
    routerSpy = jest.spyOn(router, 'navigate');

    assessmentService = TestBed.inject(AssessmentService);
    organisationsService = TestBed.inject(OrganisationsService);
  });

  it('should create the component', () => {
    fixture = TestBed.createComponent(InnovationAssessmentEditComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  // it('should run getInnovationNeedsAssessment() with success', () => {

  //   organisationsService.getOrganisationsListWithUnits = () => of([{ id: 'orgId', name: 'Org name', acronym: 'ORG', organisationUnits: [] }]);
  //   assessmentService.getInnovationNeedsAssessment = () => of({
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
  //       organisations: [{ id: 'OrgId', name: 'Org name', acronym: 'ORG', organisationUnits: [{ id: 'OrgUnitId', name: 'Org Unit name', acronym: 'ORGu' }] }],
  //       assignToName: '',
  //       finishedAt: null,
  //       createdAt: '2020-01-01T00:00:00.000Z',
  //       createdBy: '2020-01-01T00:00:00.000Z',
  //       updatedAt: null,
  //       updatedBy: null,
  //       hasBeenSubmitted: true
  //     }
  //   });

  //   fixture = TestBed.createComponent(InnovationAssessmentEditComponent);
  //   component = fixture.componentInstance;

  //   fixture.detectChanges();
  //   expect(component.innovationName).toBe('Innovation 01');

  // });

  // it('should run getInnovationNeedsAssessment() with error', () => {

  //   assessmentService.getInnovationNeedsAssessment = () => throwError(false);

  //   fixture = TestBed.createComponent(InnovationAssessmentEditComponent);
  //   component = fixture.componentInstance;

  //   fixture.detectChanges();
  //   expect(component.innovationName).toBe('');

  // });

  // it('should redirected because is not a valid step', () => {

  //   activatedRoute.params = of({ stepId: 10 }); // Invalid stepId.

  //   fixture = TestBed.createComponent(InnovationAssessmentEditComponent);
  //   component = fixture.componentInstance;

  //   fixture.detectChanges();
  //   expect(routerSpy).toHaveBeenCalledWith(['/not-found'], {});

  // });

  // it('should have step 1 form information', () => {

  //   activatedRoute.params = of({ stepId: 1 });

  //   fixture = TestBed.createComponent(InnovationAssessmentEditComponent);
  //   component = fixture.componentInstance;

  //   fixture.detectChanges();
  //   expect(component.form.sections[0].title).toBe('The innovation');
  //   expect(component.form.sections[1].title).toBe('The innovator');

  // });

  // it('should have step 2 form information', () => {

  //   activatedRoute.params = of({ stepId: 2 });

  //   fixture = TestBed.createComponent(InnovationAssessmentEditComponent);
  //   component = fixture.componentInstance;

  //   fixture.detectChanges();
  //   expect(component.form.sections[0].title).toBe('Support need summary');
  //   expect(component.form.sections[1].title).toBe('');

  // });

  // it('should run onSubmit(update) and continue to step 2', () => {

  //   activatedRoute.snapshot.params = { innovationId: 'Inno01', assessmentId: 'Assessment01', stepId: 1 };

  //   assessmentService.updateInnovationNeedsAssessment = () => of({ id: 'Assessment01' });

  //   fixture = TestBed.createComponent(InnovationAssessmentEditComponent);
  //   component = fixture.componentInstance;

  //   component.onSubmit('update');
  //   fixture.detectChanges();
  //   expect(routerSpy).toHaveBeenCalledWith(['/assessment/innovations/Inno01/assessments/Assessment01/edit/2'], {});

  // });

  // it('should run onSubmit(saveAsDraft) and stay on the same page', () => {

  //   activatedRoute.snapshot.params = { innovationId: 'Inno01', assessmentId: 'Assessment01', stepId: 1 };

  //   assessmentService.updateInnovationNeedsAssessment = () => of({ id: 'Assessment01' });

  //   fixture = TestBed.createComponent(InnovationAssessmentEditComponent);
  //   component = fixture.componentInstance;

  //   component.onSubmit('saveAsDraft');
  //   fixture.detectChanges();
  //   expect(routerSpy).not.toHaveBeenCalledWith(['/assessment/innovations/Inno01/assessments/Assessment01/edit/2'], {});

  // });

  // it('should run onSubmit(submit) and call api with success', () => {

  //   activatedRoute.snapshot.params = { innovationId: 'Inno01', assessmentId: 'Assessment01', stepId: 2 };

  //   assessmentService.updateInnovationNeedsAssessment = () => of({ id: 'Assessment01' });

  //   fixture = TestBed.createComponent(InnovationAssessmentEditComponent);
  //   component = fixture.componentInstance;

  //   component.onSubmit('submit');
  //   fixture.detectChanges();
  //   expect(routerSpy).toHaveBeenCalledWith(['/assessment/innovations/Inno01/assessments/Assessment01'], { queryParams: { alert: 'needsAssessmentSubmited' } });

  // });

  // it('should run onSubmit(saveAsDraft) and call api with error', () => {

  //   activatedRoute.snapshot.params = { innovationId: 'Inno01', assessmentId: 'Assessment01', stepId: 1 };

  //   assessmentService.updateInnovationNeedsAssessment = () => throwError('error');

  //   const expected = {
  //     type: 'ERROR',
  //     title: 'An error occurred when starting needs assessment',
  //     message: 'Please try again or contact us for further help',
  //     setFocus: true
  //   };

  //   fixture = TestBed.createComponent(InnovationAssessmentEditComponent);
  //   component = fixture.componentInstance;

  //   component.onSubmit('saveAsDraft');
  //   fixture.detectChanges();
  //   expect(component.alert).toEqual(expected);

  // });
});
