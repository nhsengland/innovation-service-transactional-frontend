import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoggerTestingModule } from 'ngx-logger/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule, EnvironmentStore } from '@modules/stores';
import { SharedModule } from '@modules/shared/shared.module';
import { ThemeModule } from '@modules/theme/theme.module';

import { FormEngineComponent, FormEngineModel } from '@modules/shared/forms';
import { FirstTimeSigninComponent } from './first-time-signin.component';

import { InnovatorService } from '../../services/innovator.service';


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


describe('FeatureModule/Innovator/FirstTimeSigninComponent tests Suite', () => {

  let activatedRoute: ActivatedRoute;

  let component: FirstTimeSigninComponent;
  let fixture: ComponentFixture<FirstTimeSigninComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        LoggerTestingModule,
        CoreModule,
        StoresModule,
        ThemeModule,
        SharedModule
      ],
      declarations: [
        FirstTimeSigninComponent,
      ],
      providers: [
        InnovatorService,
      ]
    }).compileComponents();

    AppInjector.setInjector(TestBed.inject(Injector));

    activatedRoute = TestBed.inject(ActivatedRoute);

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

  it('should do nothing when submitting a step and form not is valid', () => {

    activatedRoute.params = of({ id: 1 }); // Simulate activatedRoute.params subscription.

    fixture = TestBed.createComponent(FirstTimeSigninComponent);
    component = fixture.componentInstance;

    component.formEngineComponent = TestBed.createComponent(FormEngineComponent).componentInstance;
    spyOn(component.formEngineComponent, 'getFormValues').and.returnValue({ valid: false, data: { value1: 'some value' } });
    component.onSubmitStep('next');
    fixture.detectChanges();

    expect(component.currentAnswers).toEqual({});
  });

  it('should redirect when submitting a step', () => {

    const routerSpy = spyOn(TestBed.inject(Router), 'navigate');

    activatedRoute.snapshot.params = { id: 1 };
    activatedRoute.params = of({ id: 1 }); // Simulate activatedRoute.params subscription.

    fixture = TestBed.createComponent(FirstTimeSigninComponent);
    component = fixture.componentInstance;

    component.formEngineComponent = TestBed.createComponent(FormEngineComponent).componentInstance;
    spyOn(component.formEngineComponent, 'getFormValues').and.returnValue({ valid: true });
    component.onSubmitStep('next');
    fixture.detectChanges();

    expect(routerSpy).toHaveBeenCalledWith(['innovator/first-time-signin/2'], { queryParams: { a: 'next' } });

  });

  it('should submit survey and redirect', () => {

    const environmentStore = TestBed.inject(EnvironmentStore);
    const service = TestBed.inject(InnovatorService);
    const routerSpy = spyOn(TestBed.inject(Router), 'navigate');

    environmentStore.initializeAuthentication$ = () => of(true);
    service.submitFirstTimeSigninInfo = () => of('');

    fixture = TestBed.createComponent(FirstTimeSigninComponent);
    component = fixture.componentInstance;

    component.stepsData = FORM_WITH_CONDITIONALS_MOCK;
    component.currentAnswers = { location: 'yes' };

    component.onSubmitSurvey();
    fixture.detectChanges();

    expect(routerSpy).toHaveBeenCalledWith(['innovator/dashboard'], {});

  });

  it('should submit survey give an error and redirect', () => {

    const service = TestBed.inject(InnovatorService);
    const routerSpy = spyOn(TestBed.inject(Router), 'navigate');

    service.submitFirstTimeSigninInfo = () => throwError('error');

    fixture = TestBed.createComponent(FirstTimeSigninComponent);
    component = fixture.componentInstance;

    component.stepsData = FORM_WITH_CONDITIONALS_MOCK;
    component.currentAnswers = { location: 'yes' };

    component.onSubmitSurvey();
    fixture.detectChanges();

    expect(routerSpy).toHaveBeenCalledWith(['innovator/first-time-signin/summary'], {});

  });

  it('should generate url for first step', () => {

    activatedRoute.snapshot.params = { id: 1 };
    activatedRoute.params = of({ id: 1 }); // Simulate activatedRoute.params subscription.

    fixture = TestBed.createComponent(FirstTimeSigninComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.getNavigationUrl('previous')).toBe('innovator');

  });

  it('should generate url for last step', () => {

    activatedRoute.snapshot.params = { id: 5 };
    activatedRoute.params = of({ id: 5 }); // Simulate activatedRoute.params subscription.

    fixture = TestBed.createComponent(FirstTimeSigninComponent);
    component = fixture.componentInstance;

    component.totalNumberOfSteps = 5;
    fixture.detectChanges();

    expect(component.getNavigationUrl('next')).toBe('innovator/first-time-signin/summary');

  });

  it('should generate url for summary step when pressing previous', () => {

    activatedRoute.snapshot.params = { id: 'summary' };
    activatedRoute.params = of({ id: 'summary' }); // Simulate activatedRoute.params subscription.

    fixture = TestBed.createComponent(FirstTimeSigninComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.getNavigationUrl('previous')).toBe('innovator/first-time-signin/6');

  });

  it('should generate url for a question step', () => {

    activatedRoute.snapshot.params = { id: 5 };
    activatedRoute.params = of({ id: 5 });

    fixture = TestBed.createComponent(FirstTimeSigninComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.getNavigationUrl('previous')).toBe('innovator/first-time-signin/4');

  });

});
