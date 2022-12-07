import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { Injector } from '@angular/core';

import { AppInjector, CoreModule, EnvironmentVariablesStore } from '@modules/core';
import { StoresModule } from '@modules/stores';

import { InnovationsService } from './innovations.service';
import { InnovationSupportsLog, InnovationSupportsLogDTO } from './innovations.dtos';


describe('Shared/Services/Innovations', () => {

  let httpMock: HttpTestingController;
  let envVariablesStore: EnvironmentVariablesStore;
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
      ]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    httpMock = TestBed.inject(HttpTestingController);
    envVariablesStore = TestBed.inject(EnvironmentVariablesStore);
    service = TestBed.inject(InnovationsService);

  });

  afterEach(() => {
    httpMock.verify();
  });


it('should run getInnovationSupportLog() and return success', () => {

    const responseMock: InnovationSupportsLog[] = [
      {
        id: 'support01',
        type: '' as any,
        description: 'description',
        createdBy: 'A user',
        createdAt: '2020-01-01T00:00:00.000Z',
        innovationSupportStatus: 'ENGAGING',
        organisationUnit: {
          id: 'unit01', name: 'Unit 01', acronym: 'UN',
          organisation: { id: 'org01', name: 'Org 01', acronym: 'ORG' }
        },
        suggestedOrganisationUnits: []
      }
    ];
    const expected: InnovationSupportsLogDTO[] = responseMock.map(item => ({
      ...item,
      logTitle: '',
      suggestedOrganisationUnitsNames: (item.suggestedOrganisationUnits || []).map(o => o.name)
    }));


    let response: any = null;
    service.getInnovationSupportLog('Inno01').subscribe({ next: success => response = success, error: error => response = error });

    const httpRequest = httpMock.expectOne(`${envVariablesStore.API_INNOVATIONS_URL}/v1/Inno01/support-logs`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('GET');
    expect(response).toEqual(expected);

  });

  // it('should run getSupportLog() with type = SupportLogType.ACCESSOR_SUGGESTION and return success', () => {

  //   const responseMock: getSupportLogInDTO[] = [
  //     {
  //       id: 'support01',
  //       type: SupportLogType.ACCESSOR_SUGGESTION,
  //       description: 'description',
  //       createdBy: 'A user',
  //       createdAt: '2020-01-01T00:00:00.000Z',
  //       innovationSupportStatus: 'ENGAGING',
  //       organisationUnit: {
  //         id: 'unit01', name: 'Unit 01', acronym: 'UN',
  //         organisation: { id: 'org01', name: 'Org 01', acronym: 'ORG' }
  //       },
  //       suggestedOrganisationUnits: [
  //         {
  //           id: 'unit01', name: 'Unit 01', acronym: 'UN',
  //           organisation: { id: 'org01', name: 'Org 01', acronym: 'ORG' }
  //         }
  //       ]
  //     }
  //   ];
  //   const expected: getSupportLogOutDTO[] = responseMock.map(item => ({
  //     ...item,
  //     logTitle: 'Suggested organisation units',
  //     suggestedOrganisationUnitsNames: (item.suggestedOrganisationUnits || []).map(o => o.name)
  //   }));


  //   let response: any = null;
  //   service.getSupportLog('Inno01').subscribe({ next: success => response = success, error: error => response = error });

  //   const httpRequest = httpMock.expectOne(`${envVariablesStore.API_URL}/accessors/UserId01/innovations/Inno01/support-logs`);
  //   httpRequest.flush(responseMock);
  //   expect(httpRequest.request.method).toBe('GET');
  //   expect(response).toEqual(expected);

  // });

  // it('should run getSupportLog() with type = SupportLogType.STATUS_UPDATE and return success', () => {

  //   const responseMock: getSupportLogInDTO[] = [
  //     {
  //       id: 'support01',
  //       type: SupportLogType.STATUS_UPDATE,
  //       description: 'description',
  //       createdBy: 'A user',
  //       createdAt: '2020-01-01T00:00:00.000Z',
  //       innovationSupportStatus: 'ENGAGING',
  //       organisationUnit: {
  //         id: 'unit01', name: 'Unit 01', acronym: 'UN',
  //         organisation: { id: 'org01', name: 'Org 01', acronym: 'ORG' }
  //       }
  //     }
  //   ];
  //   const expected: getSupportLogOutDTO[] = responseMock.map(item => ({
  //     ...item,
  //     logTitle: 'Updated support status',
  //     suggestedOrganisationUnitsNames: []
  //   }));


  //   let response: any = null;
  //   service.getSupportLog('Inno01').subscribe({ next: success => response = success, error: error => response = error });

  //   const httpRequest = httpMock.expectOne(`${envVariablesStore.API_URL}/accessors/UserId01/innovations/Inno01/support-logs`);
  //   httpRequest.flush(responseMock);
  //   expect(httpRequest.request.method).toBe('GET');
  //   expect(response).toEqual(expected);

  // });
});


  