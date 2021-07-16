import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ENV, InjectorMock } from '@tests/app.mocks';

import { Injector } from '@angular/core';
import * as common from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AppInjector, CoreModule, EnvironmentStore } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { TriageInnovatorPackModule } from '@modules/feature-modules/triage-innovator-pack/triage-innovator-pack.module';

import { FormEngineComponent } from '@shared-module/forms';

import { SurveyStepComponent } from './step.component';

import { SurveyService } from '../../services/survey.service';


describe('FeatureModules/StarterInnovatorPack/Pages/Survey/StepComponent', () => {

  let activatedRoute: ActivatedRoute;
  let environmentStore: EnvironmentStore;
  let surveyService: SurveyService;

  let component: SurveyStepComponent;
  let fixture: ComponentFixture<SurveyStepComponent>;

  let injectorSpy: jasmine.Spy;
  let serverRedirectSpy: { status: jasmine.Spy, setHeader: jasmine.Spy };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        CoreModule,
        StoresModule,
        TriageInnovatorPackModule
      ],
      providers: [
        InjectorMock,
        { provide: 'APP_SERVER_ENVIRONMENT_VARIABLES', useValue: ENV }
      ]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    activatedRoute = TestBed.inject(ActivatedRoute);
    environmentStore = TestBed.inject(EnvironmentStore);
    surveyService = TestBed.inject(SurveyService);

    spyOn(AppInjector, 'getInjector').and.returnValue(TestBed.inject(InjectorMock));
    injectorSpy = spyOn(TestBed.inject(InjectorMock), 'get');
    serverRedirectSpy = { status: jasmine.createSpy('status'), setHeader: jasmine.createSpy('setHeader') };

  });

  it('should create the component', () => {

    fixture = TestBed.createComponent(SurveyStepComponent);
    component = fixture.componentInstance;

    expect(component).toBeTruthy();

  });

  it('should be on step 1', () => {

    activatedRoute.snapshot.params = { id: 1 }; // Simulates step 1. (Must be before component initialization).

    fixture = TestBed.createComponent(SurveyStepComponent);
    component = fixture.componentInstance;

    expect(component.isFirstStep()).toBe(true);

  });

  it('should be on the last step', () => {

    activatedRoute.snapshot.params = { id: 5 }; // Simulates last step. (Must be before component initialization).

    fixture = TestBed.createComponent(SurveyStepComponent);
    component = fixture.componentInstance;
    component.totalNumberOfSteps = 5;
    fixture.detectChanges();

    expect(component.isLastStep()).toBe(true);

  });

  it('should be a valid step', () => {

    activatedRoute.snapshot.params = { id: 1 }; // Simulates last step. (Must be before component initialization).

    fixture = TestBed.createComponent(SurveyStepComponent);
    component = fixture.componentInstance;
    component.totalNumberOfSteps = 5;
    fixture.detectChanges();

    expect(component.isValidStepId()).toBe(true);

  });

  it('should be redirected because is not a valid step (running in browser)', () => {

    const router = TestBed.inject(Router);
    const routerSpy = spyOn(router, 'navigate');
    injectorSpy.and.returnValue(router);

    spyOn(common, 'isPlatformBrowser').and.returnValue(true);
    activatedRoute.params = of({ id: 1 }); // Simulate activatedRoute.params subscription.

    fixture = TestBed.createComponent(SurveyStepComponent);
    component = fixture.componentInstance;
    component.totalNumberOfSteps = 5;
    fixture.detectChanges();

    expect(routerSpy).toHaveBeenCalledWith(['not-found'], {});

  });

  it('should be a question step (running in browser)', fakeAsync(() => {

    spyOn(common, 'isPlatformBrowser').and.returnValue(true);
    activatedRoute.snapshot.params = { id: 1 };
    activatedRoute.params = of({ id: 1 }); // Simulate activatedRoute.params subscription.

    fixture = TestBed.createComponent(SurveyStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.isValidStepId()).toBe(true);
    expect(component.isQuestionStep()).toBe(true);

  }));

  it('should be summary step (running in browser)', fakeAsync(() => {

    spyOn(common, 'isPlatformBrowser').and.returnValue(true);
    activatedRoute.snapshot.params = { id: 'summary' };
    activatedRoute.params = of({ id: 'summary' }); // Simulate activatedRoute.params subscription.

    fixture = TestBed.createComponent(SurveyStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.isSummaryStep()).toBe(true);

  }));

  it('should be redirected because is not a valid step (running in server)', fakeAsync(() => {

    injectorSpy.and.returnValue({ status: serverRedirectSpy.status, setHeader: serverRedirectSpy.setHeader, ENV: environmentStore.ENV });
    spyOn(common, 'isPlatformServer').and.returnValue(true);
    activatedRoute.snapshot.params = { id: 0 };

    fixture = TestBed.createComponent(SurveyStepComponent);
    component = fixture.componentInstance;
    component.totalNumberOfSteps = 5;
    fixture.detectChanges();

    expect(serverRedirectSpy.status).toHaveBeenCalledWith(303);
    expect(serverRedirectSpy.setHeader).toHaveBeenCalledWith('Location', 'not-found');

  }));

  it('should be a question step (running in server)', fakeAsync(() => {

    injectorSpy.and.returnValue({ status: serverRedirectSpy.status, setHeader: serverRedirectSpy.setHeader, ENV: environmentStore.ENV });
    spyOn(common, 'isPlatformServer').and.returnValue(true);
    activatedRoute.snapshot.params = { id: 1 };
    activatedRoute.snapshot.params.queryParams = { f: 'sdfsd' };

    fixture = TestBed.createComponent(SurveyStepComponent);
    component = fixture.componentInstance;

    spyOn(component, 'isDataRequest').and.returnValue(true);

    fixture.detectChanges();

    expect(component.isValidStepId()).toBe(true);
    expect(component.isQuestionStep()).toBe(true);

  }));

  it('should be summary step (running in server)', () => {

    injectorSpy.and.returnValue(environmentStore);
    spyOn(common, 'isPlatformServer').and.returnValue(true);
    activatedRoute.snapshot.params = { id: 'summary' };
    activatedRoute.params = of({ id: 'summary' }); // Simulate activatedRoute.params subscription.

    fixture = TestBed.createComponent(SurveyStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.isSummaryStep()).toBe(true);

  });

  it('should stay on the same page when submitted information is NOT valid (running in server)', () => {

    injectorSpy.and.returnValue({ status: serverRedirectSpy.status, setHeader: serverRedirectSpy.setHeader, ENV: environmentStore.ENV });
    spyOn(common, 'isPlatformServer').and.returnValue(true);
    activatedRoute.snapshot.params = { id: 1 };

    fixture = TestBed.createComponent(SurveyStepComponent);
    component = fixture.componentInstance;

    spyOn(component, 'isDataRequest').and.returnValue(true);
    spyOn(component, 'decodeQueryParams').and.returnValue({ a: 'next', f: { organisationSize: '' } });

    fixture.detectChanges();

    expect(component.isDataRequest()).toBe(true);
    expect(serverRedirectSpy.status).not.toHaveBeenCalledWith(303);

  });

  it('should redirect to next step when submitted information is valid (running in server)', () => {

    injectorSpy.and.returnValue({ status: serverRedirectSpy.status, setHeader: serverRedirectSpy.setHeader, ENV: environmentStore.ENV });
    spyOn(common, 'isPlatformServer').and.returnValue(true);
    activatedRoute.snapshot.params = { id: 1 };

    fixture = TestBed.createComponent(SurveyStepComponent);
    component = fixture.componentInstance;

    spyOn(component, 'isDataRequest').and.returnValue(true);
    spyOn(component, 'decodeQueryParams').and.returnValue({ a: 'next', f: {categories: ['PHARMACEUTICAL', 'MEDICAL_DEVICE', 'AI']} });

    fixture.detectChanges();

    expect(component.isDataRequest()).toBe(true);
    expect(serverRedirectSpy.status).toHaveBeenCalledWith(303);
    expect(serverRedirectSpy.setHeader).toHaveBeenCalledWith('Location', '/triage-innovator-pack/survey/2?f=eyJjYXRlZ29yaWVzIjpbIlBIQVJNQUNFVVRJQ0FMIiwiTUVESUNBTF9ERVZJQ0UiLCJBSSJdfQ%3D%3D');

  });

  it('should submit information to server and redirect to end page (running in server)', fakeAsync(() => {

    injectorSpy.and.returnValue({ status: serverRedirectSpy.status, setHeader: serverRedirectSpy.setHeader, ENV: environmentStore.ENV });
    spyOn(common, 'isPlatformServer').and.returnValue(true);
    activatedRoute.snapshot.params = { id: 1 };

    fixture = TestBed.createComponent(SurveyStepComponent);
    component = fixture.componentInstance;

    spyOn(component, 'isDataRequest').and.returnValue(true);
    spyOn(component, 'decodeQueryParams').and.returnValue({ a: 'submit', f: { organisationSize: 'some answer' } });
    const surveyId = 'c29tZUlk';
    component.summaryList.valid = true;
    surveyService.submitSurvey = (survey: { [key: string]: any; }) => of({ id: surveyId });
    fixture.detectChanges();

    expect(component.isDataRequest()).toBe(true);
    expect(serverRedirectSpy.status).toHaveBeenCalledWith(303);
    expect(serverRedirectSpy.setHeader).toHaveBeenCalledWith('Location', `/triage-innovator-pack/survey/end?surveyId=${encodeURIComponent(component.encodeInfo(surveyId))}`);

  }));

  it('should redirect if a unknown action was provided (running in server)', () => {

    injectorSpy.and.returnValue({ status: serverRedirectSpy.status, setHeader: serverRedirectSpy.setHeader, ENV: environmentStore.ENV });
    spyOn(common, 'isPlatformServer').and.returnValue(true);
    activatedRoute.snapshot.params = { id: 1 };

    fixture = TestBed.createComponent(SurveyStepComponent);
    component = fixture.componentInstance;

    spyOn(component, 'isDataRequest').and.returnValue(true);
    spyOn(component, 'decodeQueryParams').and.returnValue({ a: 'SOME INVALID ACTION', f: { organisationSize: 'some answer' } });

    fixture.detectChanges();

    expect(component.isDataRequest()).toBe(true);
    expect(serverRedirectSpy.status).toHaveBeenCalledWith(303);
    expect(serverRedirectSpy.setHeader).toHaveBeenCalledWith('Location', 'not-found');

  });

  it('should do nothing when submitting a step and form is not valid (running in browser)', () => {

    spyOn(common, 'isPlatformBrowser').and.returnValue(true);
    activatedRoute.params = of({ id: 1 }); // Simulate activatedRoute.params subscription.

    fixture = TestBed.createComponent(SurveyStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.formEngineComponent = TestBed.createComponent(FormEngineComponent).componentInstance;
    spyOn(component.formEngineComponent, 'getFormValues').and.returnValue({ valid: false, data: { value1: 'some value' } });
    component.onSubmitStep('next');
    fixture.detectChanges();

    expect(component.currentAnswers).toEqual({});

  });

  it('should redirect when submitting a step (running in browser)', () => {

    const router = TestBed.inject(Router);
    const routerSpy = spyOn(router, 'navigate');
    injectorSpy.and.returnValue(router);
    spyOn(common, 'isPlatformBrowser').and.returnValue(true);
    activatedRoute.snapshot.params = { id: 1 };
    activatedRoute.params = of({ id: 1 }); // Simulate activatedRoute.params subscription.

    fixture = TestBed.createComponent(SurveyStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.formEngineComponent = TestBed.createComponent(FormEngineComponent).componentInstance;
    spyOn(component.formEngineComponent, 'getFormValues').and.returnValue({ valid: true });
    component.onSubmitStep('next');
    fixture.detectChanges();

    expect(routerSpy).toHaveBeenCalledWith(['/triage-innovator-pack/survey/2'], {});

  });

  it('should submit survey and redirect', () => {

    const router = TestBed.inject(Router);
    const routerSpy = spyOn(router, 'navigate');
    injectorSpy.and.returnValue(router);
    spyOn(common, 'isPlatformBrowser').and.returnValue(true);
    activatedRoute.snapshot.params = { id: 1 };
    activatedRoute.params = of({ id: 1 }); // Simulate activatedRoute.params subscription.

    fixture = TestBed.createComponent(SurveyStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.summaryList.valid = true;
    const surveyId = 'c29tZUlk';
    surveyService.submitSurvey = () => of({ id: surveyId });
    component.onSubmitSurvey();
    fixture.detectChanges();

    expect(routerSpy).toHaveBeenCalledWith(['/triage-innovator-pack/survey/end'], { queryParams: { surveyId } });

  });

  it('should submit survey, give an error and redirect', () => {

    const router = TestBed.inject(Router);
    const routerSpy = spyOn(router, 'navigate');
    injectorSpy.and.returnValue(router);
    spyOn(common, 'isPlatformBrowser').and.returnValue(true);
    activatedRoute.snapshot.params = { id: 1 };
    activatedRoute.params = of({ id: 1 }); // Simulate activatedRoute.params subscription.

    fixture = TestBed.createComponent(SurveyStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.summaryList.valid = true;
    surveyService.submitSurvey = () => throwError('error');
    component.onSubmitSurvey();
    fixture.detectChanges();

    expect(routerSpy).toHaveBeenCalledWith(['/triage-innovator-pack/survey/summary'], {});

  });

  it('should generate url for first step', () => {

    spyOn(common, 'isPlatformBrowser').and.returnValue(true);
    activatedRoute.snapshot.params = { id: 1 };
    activatedRoute.params = of({ id: 1 }); // Simulate activatedRoute.params subscription.

    fixture = TestBed.createComponent(SurveyStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.getNavigationUrl('previous')).toBe('/triage-innovator-pack');

  });

  it('should generate url for summary step', () => {

    spyOn(common, 'isPlatformBrowser').and.returnValue(true);
    activatedRoute.snapshot.params = { id: 'summary' };
    activatedRoute.params = of({ id: 'summary' }); // Simulate activatedRoute.params subscription.

    fixture = TestBed.createComponent(SurveyStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.getNavigationUrl('previous')).toBe('/triage-innovator-pack/survey/11');

  });

  it('should generate url for a question step', () => {

    spyOn(common, 'isPlatformBrowser').and.returnValue(true);
    activatedRoute.snapshot.params = { id: 5 };
    activatedRoute.params = of({ id: 5 });

    fixture = TestBed.createComponent(SurveyStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.getNavigationUrl('previous')).toBe('/triage-innovator-pack/survey/4');

  });

  it('should generate default url with a invalid action', () => {

    fixture = TestBed.createComponent(SurveyStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.getNavigationUrl('invalid action' as any)).toBe('/triage-innovator-pack');

  });

});
