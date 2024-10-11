import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ENV } from '@tests/app.mocks';

import { Injector } from '@angular/core';

import { AppInjector, CoreModule, EnvironmentVariablesStore } from '@modules/core';
import { StoresModule, AuthenticationStore, InnovationStore } from '@modules/stores';
import { AccessorModule } from '@modules/feature-modules/accessor/accessor.module';

import { AccessorService } from './accessor.service';
import { SupportLogType } from '@modules/shared/services/innovations.dtos';

describe('FeatureModules/Accessor/Services/AccessorService', () => {
  let httpMock: HttpTestingController;

  let envVariablesStore: EnvironmentVariablesStore;
  let authenticationStore: AuthenticationStore;
  let innovationStore: InnovationStore;

  let service: AccessorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CoreModule, StoresModule, AccessorModule],
      providers: [{ provide: 'APP_SERVER_ENVIRONMENT_VARIABLES', useValue: ENV }]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    httpMock = TestBed.inject(HttpTestingController);

    envVariablesStore = TestBed.inject(EnvironmentVariablesStore);
    authenticationStore = TestBed.inject(AuthenticationStore);
    innovationStore = TestBed.inject(InnovationStore);

    service = TestBed.inject(AccessorService);

    authenticationStore.getUserId = () => 'UserId01';
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should run suggestNewOrganisations() and return success', () => {
    const responseMock = { id: 'id01' };
    const expected = responseMock;
    let response: any = null;

    service
      .suggestNewOrganisations('Inno01', { organisationUnits: [], description: '' })
      .subscribe({ next: success => (response = success), error: error => (response = error) });

    const httpRequest = httpMock.expectOne(`${envVariablesStore.API_INNOVATIONS_URL}/v1/Inno01/suggestions`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('POST');
    expect(response).toEqual(expected);
  });
});
