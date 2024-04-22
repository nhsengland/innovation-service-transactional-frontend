import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ENV } from '@tests/app.mocks';

import { CoreModule, EnvironmentVariablesStore } from '@modules/core';
import { AuthenticationService, AuthenticationStore, ContextService, ContextStore } from '@modules/stores';

import { InnovationService } from './innovation.service';

import { UserRoleEnum } from '../authentication/authentication.enums';

describe('Stores/Innovation/InnovationService', () => {
  let httpMock: HttpTestingController;
  let envVariablesStore: EnvironmentVariablesStore;
  let authenticationStore: AuthenticationStore;
  let contextStore: ContextStore;

  let service: InnovationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CoreModule],
      providers: [
        AuthenticationStore,
        AuthenticationService,
        ContextStore,
        ContextService,
        InnovationService,
        { provide: 'APP_SERVER_ENVIRONMENT_VARIABLES', useValue: ENV }
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    envVariablesStore = TestBed.inject(EnvironmentVariablesStore);
    authenticationStore = TestBed.inject(AuthenticationStore);
    contextStore = TestBed.inject(ContextStore);

    service = TestBed.inject(InnovationService);

    authenticationStore.getUserType = () => UserRoleEnum.INNOVATOR;
    authenticationStore.getUserId = () => 'user001';
    contextStore.clearInnovation = () => {};
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should run submitInnovation() and return success', () => {
    const responseMock = { id: 'Inno01', status: 'WAITING_NEEDS_ASSESSMENT' };
    const expected = responseMock;
    let response: any = null;

    service
      .submitInnovation('Inno01')
      .subscribe({ next: success => (response = success), error: error => (response = error) });

    const httpRequest = httpMock.expectOne(`${envVariablesStore.API_INNOVATIONS_URL}/v1/Inno01/submit`);
    httpRequest.flush(responseMock);

    expect(httpRequest.request.method).toBe('PATCH');
    expect(response).toEqual(expected);
  });
});
