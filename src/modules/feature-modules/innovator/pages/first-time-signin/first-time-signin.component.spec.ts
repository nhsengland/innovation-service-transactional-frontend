import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule, AuthenticationStore } from '@modules/stores';
import { InnovatorModule } from '@modules/feature-modules/innovator/innovator.module';

import { FormEngineComponent, FormEngineModel } from '@modules/shared/forms';
import { FirstTimeSigninComponent } from './first-time-signin.component';

import { InnovatorService } from '../../services/innovator.service';

import { OrganisationsService } from '@shared-module/services/organisations.service';


const FORM_WITH_CONDITIONALS_MOCK = [
  new FormEngineModel({
    label: 'Live on this country?',
    parameters: [
      { id: 'parameter01', dataType: 'text' }
    ],
    visibility: {
      parameter: 'location',
      values: ['yes']
    }
  })
];


describe('FeatureModules/Innovator/Pages/FirstTimeSigninComponent', () => {

  let activatedRoute: ActivatedRoute;
  let router: Router;
  let routerSpy: jasmine.Spy;

  let authenticationStore: AuthenticationStore;
  let innovatorService: InnovatorService;
  let organisationsService: OrganisationsService;

  let component: FirstTimeSigninComponent;
  let fixture: ComponentFixture<FirstTimeSigninComponent>;

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
    router = TestBed.inject(Router);
    routerSpy = spyOn(router, 'navigate');

    authenticationStore = TestBed.inject(AuthenticationStore);
    innovatorService = TestBed.inject(InnovatorService);
    organisationsService = TestBed.inject(OrganisationsService);

  });

  it('should create the component', () => {
    fixture = TestBed.createComponent(FirstTimeSigninComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should be on step 1', () => {

    activatedRoute.snapshot.params = { id: 1 }; // Simulates step 1. (Must be before component initialization).

    fixture = TestBed.createComponent(FirstTimeSigninComponent);
    component = fixture.componentInstance;

    expect(component.isFirstStep()).toBe(true);

  });

  it('should be on the last step', () => {

    activatedRoute.snapshot.params = { id: 5 }; // Simulates last step. (Must be before component initialization).

    fixture = TestBed.createComponent(FirstTimeSigninComponent);
    component = fixture.componentInstance;
    component.totalNumberOfSteps = 5;

    expect(component.isLastStep()).toBe(true);

  });

  it('should be a valid step', () => {

    activatedRoute.snapshot.params = { id: 1 }; // Simulates last step. (Must be before component initialization).

    fixture = TestBed.createComponent(FirstTimeSigninComponent);
    component = fixture.componentInstance;
    component.totalNumberOfSteps = 5;

    expect(component.isValidStepId()).toBe(true);

  });

  it('should be a question step', () => {

    activatedRoute.snapshot.params = { id: 1 };
    organisationsService.getAccessorsOrganisations = () => of([{ id: 'orgId', name: 'Org name' }]);

    fixture = TestBed.createComponent(FirstTimeSigninComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.isQuestionStep()).toBe(true);

  });

  it('should be summary step', () => {

    activatedRoute.snapshot.params = { id: 'summary' };
    activatedRoute.params = of({ id: 'summary' }); // Simulate activatedRoute.params subscription.

    fixture = TestBed.createComponent(FirstTimeSigninComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.isSummaryStep()).toBe(true);

  });

  it('should be a question steps visible', () => {

    activatedRoute.snapshot.params = { id: 1 };
    activatedRoute.params = of({ id: 1 }); // Simulate activatedRoute.params subscription.

    fixture = TestBed.createComponent(FirstTimeSigninComponent);
    component = fixture.componentInstance;
    component.stepsData = FORM_WITH_CONDITIONALS_MOCK;
    component.currentAnswers = { location: 'yes' };

    fixture.detectChanges();
    expect(component.isVisibleStep(1)).toBe(true);

  });

  it('should be a question step NOT visible', () => {

    activatedRoute.snapshot.params = { id: 1 };
    activatedRoute.params = of({ id: 1 }); // Simulate activatedRoute.params subscription.

    fixture = TestBed.createComponent(FirstTimeSigninComponent);
    component = fixture.componentInstance;
    component.stepsData = FORM_WITH_CONDITIONALS_MOCK;
    component.currentAnswers = { location: 'no', parameter01: 'value' };

    fixture.detectChanges();
    expect(component.isQuestionStep()).toBe(true);
    expect(component.isVisibleStep(1)).toBe(false);

  });

  it('should run onSubmitStep() with UNDEFINED formEngineComponent field', () => {

    fixture = TestBed.createComponent(FirstTimeSigninComponent);
    component = fixture.componentInstance;
    component.formEngineComponent = undefined;

    component.onSubmitStep('next');
    expect(component.currentAnswers).toEqual({});

  });

  it('should run onSubmitStep() and DO NOTHING with form NOT valid', () => {

    activatedRoute.params = of({ id: 1 }); // Simulate activatedRoute.params subscription.

    fixture = TestBed.createComponent(FirstTimeSigninComponent);
    component = fixture.componentInstance;
    component.formEngineComponent = TestBed.createComponent(FormEngineComponent).componentInstance;
    component.formEngineComponent.getFormValues = () => ({ valid: false, data: { value1: 'some value' } });

    component.onSubmitStep('next');
    fixture.detectChanges();
    expect(component.currentAnswers).toEqual({});

  });

  it('should redirect when submitting a step', () => {

    activatedRoute.snapshot.params = { id: 1 };
    activatedRoute.params = of({ id: 1 }); // Simulate activatedRoute.params subscription.

    fixture = TestBed.createComponent(FirstTimeSigninComponent);
    component = fixture.componentInstance;
    component.formEngineComponent = TestBed.createComponent(FormEngineComponent).componentInstance;
    component.formEngineComponent.getFormValues = () => ({ valid: true, data: {} });

    component.onSubmitStep('next');
    fixture.detectChanges();
    expect(routerSpy).toHaveBeenCalledWith(['innovator/first-time-signin/2'], { queryParams: { a: 'next' } });

  });

  it('should run onsubmitStep() and call onSubmitSurvey()', () => {

    fixture = TestBed.createComponent(FirstTimeSigninComponent);
    component = fixture.componentInstance;
    component.isLastStep = () => true;
    component.formEngineComponent = TestBed.createComponent(FormEngineComponent).componentInstance;

    component.onSubmitStep('next');
    fixture.detectChanges();
    expect(component.summaryList.valid).toBeFalsy();

  });

  it('should submit survey and redirect', () => {

    authenticationStore.initializeAuthentication$ = () => of(true);
    innovatorService.submitFirstTimeSigninInfo = () => of({ id: 'id' });

    fixture = TestBed.createComponent(FirstTimeSigninComponent);
    component = fixture.componentInstance;

    component.stepsData = FORM_WITH_CONDITIONALS_MOCK;
    component.currentAnswers = { location: 'yes' };

    component.onSubmitSurvey();
    fixture.detectChanges();
    expect(routerSpy).toHaveBeenCalledWith(['innovator/dashboard'], {});

  });

  it('should submit survey give an error and redirect', () => {

    innovatorService.submitFirstTimeSigninInfo = () => throwError('error');

    fixture = TestBed.createComponent(FirstTimeSigninComponent);
    component = fixture.componentInstance;

    component.stepsData = FORM_WITH_CONDITIONALS_MOCK;
    component.currentAnswers = { location: 'yes' };

    component.onSubmitSurvey();
    fixture.detectChanges();
    expect(routerSpy).toHaveBeenCalledWith(['innovator/first-time-signin/summary'], {});

  });

  it('should run getNavigationUrl() for first step', () => {

    activatedRoute.snapshot.params = { id: 1 };
    activatedRoute.params = of({ id: 1 }); // Simulate activatedRoute.params subscription.

    fixture = TestBed.createComponent(FirstTimeSigninComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.getNavigationUrl('previous')).toBe('innovator');

  });

  it('should run getNavigationUrl() for last step', () => {

    activatedRoute.snapshot.params = { id: 5 };
    activatedRoute.params = of({ id: 5 }); // Simulate activatedRoute.params subscription.

    fixture = TestBed.createComponent(FirstTimeSigninComponent);
    component = fixture.componentInstance;

    component.totalNumberOfSteps = 5;

    fixture.detectChanges();
    expect(component.getNavigationUrl('next')).toBe('innovator/first-time-signin/summary');

  });

  it('should run getNavigationUrl() for summary step when pressing previous', () => {

    activatedRoute.snapshot.params = { id: 'summary' };
    activatedRoute.params = of({ id: 'summary' }); // Simulate activatedRoute.params subscription.

    fixture = TestBed.createComponent(FirstTimeSigninComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.getNavigationUrl('previous')).toBe('innovator/first-time-signin/7');

  });

  it('should run getNavigationUrl() for a question step', () => {

    activatedRoute.snapshot.params = { id: 5 };
    activatedRoute.params = of({ id: 5 });

    fixture = TestBed.createComponent(FirstTimeSigninComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.getNavigationUrl('previous')).toBe('innovator/first-time-signin/4');

  });

});
