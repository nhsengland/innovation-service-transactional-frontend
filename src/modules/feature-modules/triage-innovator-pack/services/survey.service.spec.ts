import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ENV } from '@tests/app.mocks';

import { Injector } from '@angular/core';

import { AppInjector, CoreModule, EnvironmentVariablesStore } from '@modules/core';
import { StoresModule } from '@modules/stores';

import { SurveyService } from './survey.service';


describe('FeatureModules/TriageInnovatorPack/SurveyService', () => {

  let httpMock: HttpTestingController;
  let envVariablesStore: EnvironmentVariablesStore;
  let service: SurveyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        CoreModule,
        StoresModule
      ],
      providers: [
        SurveyService,
        { provide: 'APP_SERVER_ENVIRONMENT_VARIABLES', useValue: ENV }
      ]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    httpMock = TestBed.inject(HttpTestingController);
    envVariablesStore = TestBed.inject(EnvironmentVariablesStore);
    service = TestBed.inject(SurveyService);

  });

  afterEach(() => {
    httpMock.verify();
  });


  it('should run submitSurvey() and return success', () => {

    const payload = { question: 'answer' };
    const responseMock = { id: 'surveyId' };
    const expected = { id: 'surveyId' };
    let response: any = null;

    service.submitSurvey(payload).subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${envVariablesStore.APP_URL}/survey`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('POST');
    expect(response).toEqual(expected);

  });

  it('should run submitSurvey() and return error', () => {

    const payload = { question: 'answer' };
    const responseMock = '';
    let response: any = null;

    service.submitSurvey(payload).subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${envVariablesStore.APP_URL}/survey`);
    httpRequest.flush(responseMock, { status: 400, statusText: 'Bad Request' });
    expect(httpRequest.request.method).toBe('POST');
    expect(response.status).toEqual(400);
    expect(response.statusText).toEqual('Bad Request');

  });

});
