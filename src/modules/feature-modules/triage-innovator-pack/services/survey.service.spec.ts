import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LoggerTestingModule } from 'ngx-logger/testing';

import { Injector } from '@angular/core';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule, EnvironmentStore } from '@modules/stores';

import { SurveyService } from './survey.service';


describe('FeatureModule/TriageInnovatorPack/SurveyService tests Suite', () => {

  let httpMock: HttpTestingController;
  let environmentStore: EnvironmentStore;
  let service: SurveyService;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        LoggerTestingModule,
        CoreModule,
        StoresModule
      ],
      providers: [
        SurveyService
      ]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    httpMock = TestBed.inject(HttpTestingController);
    environmentStore = TestBed.inject(EnvironmentStore);
    service = TestBed.inject(SurveyService);


  });

  afterEach(() => {
    httpMock.verify();
  });


  it('should run submitSurvey() and return success', () => {

    const bodyPayload = { question: 'answer' };
    const expected = {
      success: { id: 'surveyId' },
      error: { status: 0, statusText: '' }
    };

    service.submitSurvey(bodyPayload).subscribe(
      response => expected.success = response,
      error => expected.error = error
    );

    const req = httpMock.expectOne(`${environmentStore.ENV.API_URL}/transactional/survey`);
    req.flush(expected.success);
    expect(req.request.method).toBe('POST');
    expect(expected.success).toBe(expected.success);

  });

  it('should run submitSurvey() and return error', () => {

    const bodyPayload = { question: 'answer' };
    const expected = {
      success: { id: '' },
      error: { status: 0, statusText: '' }
    };

    service.submitSurvey(bodyPayload).subscribe(
      response => expected.success = response,
      error => expected.error = error
    );

    const req = httpMock.expectOne(`${environmentStore.ENV.API_URL}/transactional/survey`);
    req.flush(expected.success, { status: 400, statusText: 'Bad Request' });
    expect(req.request.method).toBe('POST');
    expect(expected.error.statusText).toBe('Bad Request');

  });

});
