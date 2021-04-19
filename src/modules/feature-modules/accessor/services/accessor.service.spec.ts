import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { Injector } from '@angular/core';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule, EnvironmentStore } from '@modules/stores';

import { InnovatorService } from './innovator.service';

describe('FeatureModule/Innovator/InnovatorService tests Suite', () => {

  let httpMock: HttpTestingController;
  let environmentStore: EnvironmentStore;
  let service: InnovatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        CoreModule,
        StoresModule
      ],
      providers: [
        InnovatorService
      ]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    httpMock = TestBed.inject(HttpTestingController);
    environmentStore = TestBed.inject(EnvironmentStore);
    service = TestBed.inject(InnovatorService);

  });

  afterEach(() => {
    httpMock.verify();
  });


  it('should run submitFirstTimeSigninInfo(PayloadTest01) and return success', () => {

    const bodyPayload = {
      innovatorName: 'User display name',
      innovationName: 'Innovation name',
      innovationDescription: 'Some description',
      locationCountryName: 'Some location',
      // location: 'Other location',
      // englandPostCode: 'EN05',
      isCompanyOrOrganisation: 'yes',
      // organisationName: 'Organisation name',
      // organisationSize: '1 to 5 workers'
    };

    const expected = {
      success: '',
      error: { status: 0, statusText: '' }
    };

    service.submitFirstTimeSigninInfo(bodyPayload).subscribe(
      response => expected.success = response,
      error => expected.error = error
    );

    const req = httpMock.expectOne(`${environmentStore.ENV.API_URL}/transactional/api/innovators`);
    req.flush(expected.success);
    expect(req.request.method).toBe('POST');
    expect(expected.success).toBe(expected.success);

  });

  it('should run submitFirstTimeSigninInfo(PayloadTest02) and return success', () => {

    const bodyPayload = {
      innovatorName: 'User display name',
      innovationName: 'Innovation name',
      innovationDescription: 'Some description',
      // locationCountryName: 'Some location',
      location: 'Other location',
      // englandPostCode: 'EN05',
      isCompanyOrOrganisation: 'no',
      organisationName: 'Organisation name',
      organisationSize: '1 to 5 workers'
    };

    const expected = {
      success: '',
      error: { status: 0, statusText: '' }
    };

    service.submitFirstTimeSigninInfo(bodyPayload).subscribe(
      response => expected.success = response,
      error => expected.error = error
    );

    const req = httpMock.expectOne(`${environmentStore.ENV.API_URL}/transactional/api/innovators`);
    req.flush(expected.success);
    expect(req.request.method).toBe('POST');
    expect(expected.success).toBe(expected.success);

  });

});
