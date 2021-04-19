import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ENV } from '@tests/app.mocks';

import { Injector } from '@angular/core';

import { AppInjector, CoreModule, EnvironmentStore } from '@modules/core';
import { StoresModule } from '@modules/stores';

import { InnovationsService } from './innovations.service';

describe('FeatureModules/Innovator/InnovationsService', () => {

  let httpMock: HttpTestingController;
  let environmentStore: EnvironmentStore;
  let service: InnovationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        CoreModule,
        StoresModule
      ],
      providers: [
        InnovationsService,
        { provide: 'APP_SERVER_ENVIRONMENT_VARIABLES', useValue: ENV }
      ]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    httpMock = TestBed.inject(HttpTestingController);
    environmentStore = TestBed.inject(EnvironmentStore);
    service = TestBed.inject(InnovationsService);

  });

  afterEach(() => {
    httpMock.verify();
  });


  it('should run getInnovationInfo() and return success with response 01', () => {

    const responseMock = {
      id: '123abc',
      name: 'Innovation name',
      company: '',
      description: 'Some description',
      countryName: 'England',
      postcode: 'EN60',
      actions: [],
      comments: []
    };
    const expected = {
      id: '123abc',
      name: 'Innovation name',
      company: '',
      location: 'England, EN60',
      description: 'Some description',
      openActionsNumber: 0,
      openCommentsNumber: 0
    };
    let response: any = null;

    service.getInnovationInfo('123abc').subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/innovators//innovations/123abc`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('GET');
    expect(response).toEqual(expected);

  });

  it('should run getInnovationInfo() and return success  with response 02', () => {

    const responseMock = {
      id: '123abc',
      name: 'Innovation name',
      company: '',
      description: 'Some description',
      countryName: 'England',
      // postcode: '',
      actions: [],
      comments: []
    };
    const expected = {
      id: '123abc',
      name: 'Innovation name',
      company: '',
      location: 'England',
      description: 'Some description',
      openActionsNumber: 0,
      openCommentsNumber: 0
    };
    let response: any = null;

    service.getInnovationInfo('123abc').subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/innovators//innovations/123abc`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('GET');
    expect(response).toEqual(expected);

  });

});
