import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ENV } from '@tests/app.mocks';

import { Injector } from '@angular/core';

import { AppInjector, CoreModule, EnvironmentStore } from '@modules/core';
import { StoresModule } from '@modules/stores';

import { InnovatorService } from './innovator.service';

describe('FeatureModules/Innovator/InnovatorService', () => {

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
        InnovatorService,
        { provide: 'APP_SERVER_ENVIRONMENT_VARIABLES', useValue: ENV }
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

    const payload = {
      innovatorName: 'User display name',
      innovationName: 'Innovation name',
      innovationDescription: 'Some description',
      locationCountryName: 'Some location',
      // location: 'Other location',
      // englandPostCode: 'EN05',
      isCompanyOrOrganisation: 'yes',
      // organisationName: 'Organisation name',
      // organisationSize: '1 to 5 workers',
      // organisationShares: ['Organisation 01']
    };
    const responseMock = true;
    const expected = '';
    let response: any = null;


    service.submitFirstTimeSigninInfo(payload).subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/innovators`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('POST');
    expect(response).toBe(expected);

  });

  it('should run submitFirstTimeSigninInfo(PayloadTest02) and return success', () => {

    const payload = {
      innovatorName: 'User display name',
      innovationName: 'Innovation name',
      innovationDescription: 'Some description',
      // locationCountryName: 'Some location',
      location: 'Other location',
      // englandPostCode: 'EN05',
      isCompanyOrOrganisation: 'no',
      organisationName: 'Organisation name',
      organisationSize: '1 to 5 workers',
      organisationShares: ['Organisation 01']
    };
    const responseMock = true;
    const expected = '';
    let response: any = null;


    service.submitFirstTimeSigninInfo(payload).subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/innovators`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('POST');
    expect(response).toBe(expected);

  });

  it('should get innovation supports with associated accessors when status is engaging', () => {
    const innovationId = ':innovation_id';
    const responseMock = [
        {
            id: 'C2B7433E-F36B-1410-8103-0032FE5B194B',
            status: 'ENGAGING',
            organisation: {
                id: '43B7433E-F36B-1410-8103-0032FE5B194B',
                name: 'Reinger Inc',
                acronym: 'Group'
            },
            organisationUnit: {
                id: '4BB7433E-F36B-1410-8103-0032FE5B194B',
                name: 'Ratke Inc'
            },
            accessors: [
                {
                    id: '60CF433E-F36B-1410-8103-0032FE5B194B',
                    name: 'ASHN Q. Accessor'
                },
                {
                  id: '60CF433E-F36B-1410-8103-0032FE5B194C',
                  name: 'ASHN Q. Accessor 2'
                },
            ]
        },
        {
            id: '52CF433E-F36B-1410-8103-0032FE5B194B',
            status: 'NOT_YET',
            organisation: {
                id: 'D1B7433E-F36B-1410-8103-0032FE5B194B',
                name: 'Kunde and Sons',
                acronym: 'LLC'
            },
            organisationUnit: {
                id: '49CF433E-F36B-1410-8103-0032FE5B194B',
                name: 'Unit Test'
            },
            accessors: [
              {
                id: '60CF433E-F36B-1410-8103-0032FE5B194C',
                name: 'ASHN Q. Accessor 3'
              },
            ]
        },
        {
            id: '59CF433E-F36B-1410-8103-0032FE5B194B',
            status: 'ENGAGING',
            organisation: {
                id: '43B7433E-F36B-1410-8103-0032FE5B194B',
                name: 'Reinger Inc',
                acronym: 'Group'
            },
            organisationUnit: {
                id: '4BCF433E-F36B-1410-8103-0032FE5B194B',
                name: 'Second Unit'
            },
            accessors: []
        }
      ];

    let response: any = null;

    service.getInnovationSupports(innovationId).subscribe(success => response = success, error => response = error);
    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/innovators//innovations/:innovation_id/supports`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('GET');
    expect(response.length).toBeGreaterThan(0);

  });

});
