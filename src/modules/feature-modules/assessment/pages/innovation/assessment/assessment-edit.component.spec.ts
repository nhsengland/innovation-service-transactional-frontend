import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AppInjector, CoreModule } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { AssessmentModule } from '@modules/feature-modules/assessment/assessment.module';

import { InnovationAssessmentEditComponent } from './assessment-edit.component';

import { AssessmentService } from '@modules/feature-modules/assessment/services/assessment.service';


describe('FeatureModules/Assessment/Innovation/Assessment/InnovationAssessmentEditComponent', () => {

  let activatedRoute: ActivatedRoute;

  let component: InnovationAssessmentEditComponent;
  let fixture: ComponentFixture<InnovationAssessmentEditComponent>;

  let assessmentService: AssessmentService;

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

    activatedRoute = TestBed.inject(ActivatedRoute);

    assessmentService = TestBed.inject(AssessmentService);

  });

  it('should create the component', () => {

    fixture = TestBed.createComponent(InnovationAssessmentEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();

  });


  it('should be a valid step 1', () => {

    activatedRoute.snapshot.params = { stepId: 1 };
    activatedRoute.params = of({ stepId: 1 });

    fixture = TestBed.createComponent(InnovationAssessmentEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.isValidStepId()).toBe(true);
    expect(component.form.sections.length).toBe(2);

  });

  it('should be a valid step 2', () => {

    activatedRoute.snapshot.params = { stepId: 2 };
    activatedRoute.params = of({ stepId: 2 });

    fixture = TestBed.createComponent(InnovationAssessmentEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.isValidStepId()).toBe(true);
    expect(component.form.sections.length).toBe(2);

  });


  it('should run getInnovationNeedsAssessment() with success', () => {

    const responseMock = {
      innovation: { id: '01', name: 'Innovation 01' },
      assessment: { some: 'data' }
    };
    assessmentService.getInnovationNeedsAssessment = () => of(responseMock as any);
    const expected = responseMock.innovation.name;

    fixture = TestBed.createComponent(InnovationAssessmentEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.innovationName).toBe(expected);

  });

  it('should run getInnovationNeedsAssessment() with error', () => {

    assessmentService.getInnovationNeedsAssessment = () => throwError(false);

    const expected = '';

    fixture = TestBed.createComponent(InnovationAssessmentEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.innovationName).toBe(expected);

  });



  it('should submit and continue to step 2', () => {

    activatedRoute.snapshot.params = { innovationId: 'Inno01', assessmentId: 'Assess01', stepId: 1 };
    const routerSpy = spyOn(TestBed.inject(Router), 'navigate');

    assessmentService.updateInnovationNeedsAssessment = () => of({ id: 'Assess01' });

    fixture = TestBed.createComponent(InnovationAssessmentEditComponent);
    component = fixture.componentInstance;

    component.onSubmit('submit');
    fixture.detectChanges();

    expect(routerSpy).toHaveBeenCalledWith(['/assessment/innovations/Inno01/assessments/Assess01/edit/2'], {});

  });

  it('should submit and call api with success', () => {

    activatedRoute.snapshot.params = { innovationId: 'Inno01', assessmentId: 'Assess01', stepId: 2 };
    const routerSpy = spyOn(TestBed.inject(Router), 'navigate');

    assessmentService.updateInnovationNeedsAssessment = () => of({ id: 'Assess01' });

    fixture = TestBed.createComponent(InnovationAssessmentEditComponent);
    component = fixture.componentInstance;

    component.onSubmit('submit');
    fixture.detectChanges();

    expect(routerSpy).toHaveBeenCalledWith(['/assessment/innovations/Inno01/assessments/Assess01'], {queryParams: { alert: 'needsAssessmentSubmited' }});

  });

  it('should submit and call api with error', () => {

    activatedRoute.snapshot.params = { innovationId: 'Inno01', assessmentId: 'Assess01', stepId: 1 };

    assessmentService.updateInnovationNeedsAssessment = () => throwError('error');

    const expected = {
      type: 'error',
      title: 'An error occured when starting needs assessment',
      message: 'Please, try again or contact us for further help'
    };

    fixture = TestBed.createComponent(InnovationAssessmentEditComponent);
    component = fixture.componentInstance;


    component.onSubmit('saveAsDraft');
    fixture.detectChanges();

    expect(component.summaryAlert).toEqual(expected);

  });

});
