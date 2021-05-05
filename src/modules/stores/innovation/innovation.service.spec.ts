import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ENV } from '@tests/app.mocks';

import { CoreModule, EnvironmentStore } from '@modules/core';
import { AuthenticationStore, AuthenticationService } from '@modules/stores';

import { InnovationService } from './innovation.service';

import { InnovationSectionsIds } from './innovation.models';

describe('Stores/Innovation/InnovationService', () => {

  let httpMock: HttpTestingController;
  let environmentStore: EnvironmentStore;
  let service: InnovationService;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        CoreModule
      ],
      providers: [
        AuthenticationStore,
        AuthenticationService,
        InnovationService,
        { provide: 'APP_SERVER_ENVIRONMENT_VARIABLES', useValue: ENV }
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    environmentStore = TestBed.inject(EnvironmentStore);
    service = TestBed.inject(InnovationService);

  });

  afterEach(() => {
    httpMock.verify();
  });


  it('should run getInnovationSections() and return success', () => {

    const responseMock = [
      { code: InnovationSectionsIds.INNOVATION_DESCRIPTION, status: 'DRAFT', actionStatus: 'REQUESTED' },
      { code: InnovationSectionsIds.VALUE_PROPOSITION, status: 'NOT_STARTED', actionStatus: 'IN_REVIEW' }
    ];
    const expected = [
      { code: InnovationSectionsIds.INNOVATION_DESCRIPTION, status: 'DRAFT', actionStatus: 'REQUESTED' },
      { code: InnovationSectionsIds.VALUE_PROPOSITION, status: 'NOT_STARTED', actionStatus: 'IN_REVIEW' }
    ];
    let response: any = null;

    service.getInnovationSections('Inno01').subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/innovators//innovations/Inno01/section-summary`);
    httpRequest.flush(responseMock);

    expect(httpRequest.request.method).toBe('GET');
    expect(response).toEqual(expected);

  });

  it('should run getInnovationSections() and return error', () => {

    const responseMock = '';
    const expected = false;
    let response: any = {};

    service.getInnovationSections('Inno01').subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/innovators//innovations/Inno01/section-summary`);
    httpRequest.flush(responseMock, { status: 400, statusText: 'Bad Request' });

    expect(httpRequest.request.method).toBe('GET');
    expect(response.status).toEqual(400);
    expect(response.statusText).toEqual('Bad Request');

  });


});
