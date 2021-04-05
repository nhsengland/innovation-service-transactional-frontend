import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NgxLoggerLevel } from 'ngx-logger';

import { SurveyService } from './survey.service';
import { EnvironmentStore } from '@modules/stores/environment/environment.store';
import { EnvironmentService } from '@modules/stores/environment/environment.service';

const testVariables = {
  surveyUri: '/survey'
};

describe('SurveyService tests Suite', () => {

  let httpMock: HttpTestingController;
  let service: SurveyService;
  let environmentStore: EnvironmentStore;
  let environmentService: EnvironmentService;

  beforeEach(() => {
    // environmentStore = new EnvironmentStore(environmentService);

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        SurveyService,
        // { provide: EnvironmentService, useValue: EnvironmentService },
        // { provide: EnvironmentStore, useValue: environmentStore }
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(SurveyService);
    // environmentService = TestBed.inject(EnvironmentService);

  });

  it('should submit the survey and return survey id', () => {
    const survey = {
      myQuestion: 'my answer'
    };

    service.submitSurvey(survey).subscribe(surveyId => {
      expect(surveyId).toBe('mySurveyId');
    });

    const req = httpMock.expectOne(`${environmentStore.ENV.API_URL}${testVariables.surveyUri}`);
    req.flush('mySurveyId');
    httpMock.verify();
  });
});
