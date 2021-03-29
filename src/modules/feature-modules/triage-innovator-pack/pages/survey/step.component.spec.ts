import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import * as common from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { LoggerConfig, NGXLogger, NGXLoggerHttpService } from 'ngx-logger';
import { TranslateModule } from '@ngx-translate/core';

import { CoreModule } from '@modules/core/core.module';
import { ThemeModule } from '@modules/theme/theme.module';
import { SharedModule } from '@modules/shared/shared.module';

import { SurveyService } from '@triage-innovator-pack-feature-module/services/survey.service';

import { AppInjector } from '@modules/core';

import { FormEngineComponent } from '@shared-module/forms';
import { PageNotFoundComponent } from '@shared-module/pages/not-found.component';

import { SurveyStepComponent } from './step.component';

import { InjectorMock } from '@tests/mocks/injector.mock';

describe('SurveyStepComponent tests Suite', () => {

  let logger: NGXLogger;
  let router: Router;
  let activatedRoute: ActivatedRoute;
  let surveyService: SurveyService;

  let component: SurveyStepComponent;
  let fixture: ComponentFixture<SurveyStepComponent>;

  let injectorSpy: jasmine.Spy;
  let routerSpy: jasmine.Spy;
  let serverRedirectSpy: { status: jasmine.Spy, setHeader: jasmine.Spy };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        RouterTestingModule.withRoutes([
          { path: 'survey/:id', component: SurveyStepComponent },
          { path: 'not-found', component: PageNotFoundComponent }
        ]),
        TranslateModule.forRoot(),
        CoreModule,
        ThemeModule,
        SharedModule
      ],
      declarations: [
        SurveyStepComponent,
      ],
      providers: [
        { provide: NGXLoggerHttpService, useClass: class { } },
        { provide: LoggerConfig, useClass: class { } },
        { provide: ActivatedRoute, useValue: { snapshot: { params: {}, queryParams: {} } } },
        { provide: SurveyService, useValue: { snapshot: { params: {}, queryParams: {} } } },
        InjectorMock
      ]
    }).compileComponents();

    logger = TestBed.inject(NGXLogger);
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);
    surveyService = TestBed.inject(SurveyService);

    spyOn(AppInjector, 'getInjector').and.returnValue(TestBed.inject(InjectorMock));
    injectorSpy = spyOn(TestBed.inject(InjectorMock), 'get');

    injectorSpy.and.returnValue(logger);
    injectorSpy.and.returnValue(router);

    routerSpy = spyOn(router, 'navigate');
    serverRedirectSpy = { status: jasmine.createSpy('status'), setHeader: jasmine.createSpy('setHeader') };

  });

  it('should create the component', () => {
    fixture = TestBed.createComponent(SurveyStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should be on step 1', () => {
    // Simulates step 1. (Must be before component initialization).
    activatedRoute.snapshot.params = { id: 1 };

    fixture = TestBed.createComponent(SurveyStepComponent);
    component = fixture.componentInstance;

    expect(component.isFirstStep()).toBe(true);
  });

  it('should be on the last step', () => {
    // Simulates last step. (Must be before component initialization).
    activatedRoute.snapshot.params = { id: 5 };

    fixture = TestBed.createComponent(SurveyStepComponent);
    component = fixture.componentInstance;
    component.totalNumberOfSteps = 5;

    expect(component.isLastStep()).toBe(true);
  });

  it('should be a valid step', () => {
    // Simulates last step. (Must be before component initialization).
    activatedRoute.snapshot.params = { id: 1 };

    fixture = TestBed.createComponent(SurveyStepComponent);
    component = fixture.componentInstance;
    component.totalNumberOfSteps = 5;

    expect(component.isValidStepId()).toBe(true);
  });

  it('should be redirected because is not a valid step (running in browser)', fakeAsync(() => {

    spyOn(common, 'isPlatformBrowser').and.returnValue(true);
    activatedRoute.params = of({ id: 1 }); // Simulate activatedRoute.params subscription.

    fixture = TestBed.createComponent(SurveyStepComponent);
    component = fixture.componentInstance;
    component.totalNumberOfSteps = 5;
    fixture.detectChanges();

    expect(routerSpy).toHaveBeenCalledWith(['not-found'], {});

  }));

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

    TestBed.inject(ActivatedRoute).snapshot.params = { id: 0 };
    spyOn(common, 'isPlatformServer').and.returnValue(true);
    injectorSpy.and.returnValue({ status: serverRedirectSpy.status, setHeader: serverRedirectSpy.setHeader });

    fixture = TestBed.createComponent(SurveyStepComponent);
    component = fixture.componentInstance;
    component.totalNumberOfSteps = 5;
    fixture.detectChanges();

    expect(serverRedirectSpy.status).toHaveBeenCalledWith(303);
    expect(serverRedirectSpy.setHeader).toHaveBeenCalledWith('Location', 'not-found');

  }));

  it('should be a question step (running in server)', fakeAsync(() => {

    spyOn(common, 'isPlatformServer').and.returnValue(true);
    injectorSpy.and.returnValue({ status: serverRedirectSpy.status, setHeader: serverRedirectSpy.setHeader });

    activatedRoute.snapshot.params = { id: 1 };
    activatedRoute.snapshot.params.queryParams = { f: 'sdfsd' };

    fixture = TestBed.createComponent(SurveyStepComponent);
    component = fixture.componentInstance;

    spyOn(component, 'isDataRequest').and.returnValue(true);

    fixture.detectChanges();

    expect(component.isValidStepId()).toBe(true);
    expect(component.isQuestionStep()).toBe(true);

  }));

  it('should be summary step (running in server)', fakeAsync(() => {

    spyOn(common, 'isPlatformServer').and.returnValue(true);
    activatedRoute.snapshot.params = { id: 'summary' };
    activatedRoute.params = of({ id: 'summary' }); // Simulate activatedRoute.params subscription.

    fixture = TestBed.createComponent(SurveyStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.isSummaryStep()).toBe(true);

  }));

  it('should stay on the same page when submitted information is NOT valid (running in server)', fakeAsync(() => {

    spyOn(common, 'isPlatformServer').and.returnValue(true);
    injectorSpy.and.returnValue({ status: serverRedirectSpy.status, setHeader: serverRedirectSpy.setHeader });

    activatedRoute.snapshot.params = { id: 1 };

    fixture = TestBed.createComponent(SurveyStepComponent);
    component = fixture.componentInstance;

    spyOn(component, 'isDataRequest').and.returnValue(true);
    spyOn(component, 'decodeQueryParams').and.returnValue({ a: 'next', f: { organisationSize: '' } });

    fixture.detectChanges();

    expect(component.isDataRequest()).toBe(true);
    expect(serverRedirectSpy.status).not.toHaveBeenCalledWith(303);

  }));

  it('should redirect to next step when submitted information is valid (running in server)', fakeAsync(() => {

    spyOn(common, 'isPlatformServer').and.returnValue(true);
    injectorSpy.and.returnValue({ status: serverRedirectSpy.status, setHeader: serverRedirectSpy.setHeader });

    activatedRoute.snapshot.params = { id: 1 };

    fixture = TestBed.createComponent(SurveyStepComponent);
    component = fixture.componentInstance;

    spyOn(component, 'isDataRequest').and.returnValue(true);
    spyOn(component, 'decodeQueryParams').and.returnValue({ a: 'next', f: { organisationSize: 'some answer' } });

    fixture.detectChanges();

    expect(component.isDataRequest()).toBe(true);
    expect(serverRedirectSpy.status).toHaveBeenCalledWith(303);
    expect(serverRedirectSpy.setHeader).toHaveBeenCalledWith('Location', '/transactional/triage-innovator-pack/survey/2?f=eyJvcmdhbmlzYXRpb25TaXplIjoic29tZSBhbnN3ZXIifQ%3D%3D');

  }));

  it('should submit information to server and redirect to end page (running in server)', fakeAsync(() => {

    spyOn(common, 'isPlatformServer').and.returnValue(true);
    injectorSpy.and.returnValue({ status: serverRedirectSpy.status, setHeader: serverRedirectSpy.setHeader });

    activatedRoute.snapshot.params = { id: 1 };

    fixture = TestBed.createComponent(SurveyStepComponent);
    component = fixture.componentInstance;

    spyOn(component, 'isDataRequest').and.returnValue(true);
    spyOn(component, 'decodeQueryParams').and.returnValue({ a: 'submit', f: { organisationSize: 'some answer' } });
    const surveyId = 'c29tZUlk';
    component.summaryList.valid = true;
    surveyService.submitSurvey = (survey: { [key: string]: any; }) => {
      return of({ id: surveyId });
    };
    fixture.detectChanges();

    expect(component.isDataRequest()).toBe(true);
    expect(serverRedirectSpy.status).toHaveBeenCalledWith(303);
    expect(serverRedirectSpy.setHeader).toHaveBeenCalledWith('Location', `/transactional/triage-innovator-pack/survey/end?surveyId=${encodeURIComponent(component.encodeInfo(surveyId))}`);
  }));

  it('should redirect if a unknown action was provided (running in server)', fakeAsync(() => {

    spyOn(common, 'isPlatformServer').and.returnValue(true);
    injectorSpy.and.returnValue({ status: serverRedirectSpy.status, setHeader: serverRedirectSpy.setHeader });

    activatedRoute.snapshot.params = { id: 1 };

    fixture = TestBed.createComponent(SurveyStepComponent);
    component = fixture.componentInstance;

    spyOn(component, 'isDataRequest').and.returnValue(true);
    spyOn(component, 'decodeQueryParams').and.returnValue({ a: 'SOME INVALID ACTION', f: { organisationSize: 'some answer' } });

    fixture.detectChanges();

    expect(component.isDataRequest()).toBe(true);
    expect(serverRedirectSpy.status).toHaveBeenCalledWith(303);
    expect(serverRedirectSpy.setHeader).toHaveBeenCalledWith('Location', 'not-found');

  }));

  it('should do nothing when submitting a step and form not is valid (running in browser)', fakeAsync(() => {

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
  }));

  it('should redirect when submitting a step (running in browser)', fakeAsync(() => {

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

  }));

  it('should submit survey', fakeAsync(() => {
    spyOn(common, 'isPlatformBrowser').and.returnValue(true);
    activatedRoute.snapshot.params = { id: 1 };
    activatedRoute.params = of({ id: 1 }); // Simulate activatedRoute.params subscription.

    fixture = TestBed.createComponent(SurveyStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.summaryList.valid = true;
    const surveyId = 'c29tZUlk';
    surveyService.submitSurvey = (survey: { [key: string]: any; }) => {
      return of({ id: surveyId });
    };
    component.onSubmitSurvey();
    fixture.detectChanges();

    expect(routerSpy).toHaveBeenCalledWith(['/triage-innovator-pack/survey/end'], { queryParams: { surveyId } });

  }));

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

    expect(component.getNavigationUrl('previous')).toBe('/triage-innovator-pack/survey/6');
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
