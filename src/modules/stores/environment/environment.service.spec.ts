import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { environment } from '@app/config/environment.config';

import { EnvironmentService } from './environment.service';


describe('SurveyService tests Suite', () => {

  let httpMock: HttpTestingController;
  let service: EnvironmentService;
//   let environmentStore: EnvironmentStore;

  beforeEach(() => {
    // environmentStore = new EnvironmentStore();

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        EnvironmentService,
        // { provide: EnvironmentStore, useValue: environmentStore }
      ]
    });

    service = TestBed.inject(EnvironmentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should submit the survey and return survey id', () => {

    service.getUserInfo().subscribe(response => {
      expect(response).toBe('mySurveyId');
    });

    const req = httpMock.expectOne(`${environment.API_URL}/auth/user`);
    req.flush('mySurveyId');
    httpMock.verify();
  });
});
