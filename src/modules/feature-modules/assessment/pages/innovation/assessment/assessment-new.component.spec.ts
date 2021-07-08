import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AppInjector, CoreModule } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { FormEngineComponent } from '@modules/shared/forms';
import { AssessmentModule } from '@modules/feature-modules/assessment/assessment.module';

import { InnovationAssessmentNewComponent } from './assessment-new.component';

import { AssessmentService } from '@modules/feature-modules/assessment/services/assessment.service';


describe('FeatureModules/Assessment/Innovation/Assessment/InnovationAssessmentNewComponent', () => {

  let activatedRoute: ActivatedRoute;

  let component: InnovationAssessmentNewComponent;
  let fixture: ComponentFixture<InnovationAssessmentNewComponent>;

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

    fixture = TestBed.createComponent(InnovationAssessmentNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();

  });


  it('should run getInnovationInfo() with success', () => {

    const responseMock = {
      summary: { id: '01', name: 'Innovation 01', status: 'CREATED', description: 'A description', company: 'User company', countryName: 'England', postCode: 'SW01', categories: ['Medical'], otherCategoryDescription: '' },
      contact: { name: 'A name', email: 'email', phone: '' },
      assessment: { id: '01', assignToName: 'Name' }
    };
    assessmentService.getInnovationInfo = () => of(responseMock as any);
    const expected = responseMock.summary.name;

    fixture = TestBed.createComponent(InnovationAssessmentNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.innovationName).toBe(expected);

  });

  it('should run getInnovationInfo() with error', () => {

    assessmentService.getInnovationInfo = () => throwError(false);

    const expected = '';

    fixture = TestBed.createComponent(InnovationAssessmentNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.innovationName).toBe(expected);

  });


  it('should submit survey with invalid form data', () => {

    activatedRoute.snapshot.params = { innovationId: 'Inno01' };
    const routerSpy = spyOn(TestBed.inject(Router), 'navigate');

    assessmentService.createInnovationNeedsAssessment = () => of({ id: 'Assess01' });

    fixture = TestBed.createComponent(InnovationAssessmentNewComponent);
    component = fixture.componentInstance;

    component.formEngineComponent = TestBed.createComponent(FormEngineComponent).componentInstance;
    spyOn(component.formEngineComponent, 'getFormValues').and.returnValue({ valid: false, data: { value1: 'some value' } });

    component.onSubmit();
    fixture.detectChanges();

    expect(routerSpy).not.toHaveBeenCalledWith(['/assessment/innovations/Inno01/assessments/Assess01/edit'], {});

  });

  it('should submit survey with valid form data', () => {

    activatedRoute.snapshot.params = { innovationId: 'Inno01' };
    const routerSpy = spyOn(TestBed.inject(Router), 'navigate');

    assessmentService.createInnovationNeedsAssessment = () => of({ id: 'Assess01' });

    fixture = TestBed.createComponent(InnovationAssessmentNewComponent);
    component = fixture.componentInstance;

    component.formEngineComponent = TestBed.createComponent(FormEngineComponent).componentInstance;
    spyOn(component.formEngineComponent, 'getFormValues').and.returnValue({ valid: true, data: { value1: 'some value' } });

    component.onSubmit();
    fixture.detectChanges();

    expect(routerSpy).toHaveBeenCalledWith(['/assessment/innovations/Inno01/assessments/Assess01/edit'], {});

  });

  it('should submit survey with valid form data and api failed', () => {

    activatedRoute.snapshot.params = { innovationId: 'Inno01' };

    assessmentService.createInnovationNeedsAssessment = () => throwError('error');

    const expected = {
      type: 'error',
      title: 'An error occured when starting needs assessment',
      message: 'Please, try again or contact us for further help'
    };

    fixture = TestBed.createComponent(InnovationAssessmentNewComponent);
    component = fixture.componentInstance;

    component.formEngineComponent = TestBed.createComponent(FormEngineComponent).componentInstance;
    spyOn(component.formEngineComponent, 'getFormValues').and.returnValue({ valid: true, data: { value1: 'some value' } });

    component.onSubmit();
    fixture.detectChanges();

    expect(component.summaryAlert).toEqual(expected);

  });

});
