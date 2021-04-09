import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { Injector } from '@angular/core';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule, EnvironmentStore } from '@modules/stores';

import { InnovationsService } from './innovations.service';

describe('FeatureModule/Innovator/InnovationsService tests Suite', () => {

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
        InnovationsService
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


  it('should run getInnovationInfo() and return success', () => {

    const endpointResponse = {
      id: '123abc',
      name: 'Innovation name',
      company: '',
      description: 'Some description',
      countryName: 'England',
      postcode: '',
      actions: [],
      comments: []
    };
    const expected = {
      success: {
        id: '123abc',
        name: 'Innovation name',
        company: '',
        location: 'England',
        description: 'Some description',
        openActionsNumber: 0,
        openCommentsNumber: 0
      },
      error: { status: 0, statusText: '' }
    };

    service.getInnovationInfo('123abc').subscribe(
      response => expected.success = response,
      error => expected.error = error
    );

    const req = httpMock.expectOne(`${environmentStore.ENV.API_URL}/transactional/api/innovators//innovations/123abc`);
    req.flush(endpointResponse);
    expect(req.request.method).toBe('GET');
    expect(expected.success).toBe(expected.success);

  });

});
