import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { InnovatorService } from './innovator.service';
import { EnvironmentStore } from '@modules/stores/environment/environment.store';
import { EnvironmentService } from '@modules/stores/environment/environment.service';

const testVariables = {
  surveyUri: '/api/innovators'
};

describe('InnovatorService tests Suite', () => {

  let httpMock: HttpTestingController;
  let service: InnovatorService;
  let environmentStore: EnvironmentStore;
  let environmentService: EnvironmentService;

  beforeEach(() => {
    environmentStore = new EnvironmentStore(environmentService);

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        InnovatorService,
        { provide: EnvironmentService, useValue: EnvironmentService },
        { provide: EnvironmentStore, useValue: environmentStore }
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(InnovatorService);
    environmentService = TestBed.inject(EnvironmentService);

  });

  it('should submit first time signin information', () => {
    const survey = {
      myQuestion: 'my answer'
    };

    service.submitFirstTimeSigninInfo(survey).subscribe(surveyId => {
      expect(surveyId).toBe('mySurveyId');
    });

    const req = httpMock.expectOne(`${environmentStore.ENV.API_URL}${testVariables.surveyUri}`);
    req.flush('mySurveyId');
    httpMock.verify();
  });
});
