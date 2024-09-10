import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { Injector } from '@angular/core';

import { ENV } from '@tests/app.mocks';

import { AppInjector, CoreModule, EnvironmentVariablesStore } from '@modules/core';

import { InnovationService } from './innovation.service';
import { InnovationRecordSchemaService, StoresModule } from '@modules/stores';

describe('Core/Services/InnovationService', () => {
  let httpMock: HttpTestingController;
  let envVariablesStore: EnvironmentVariablesStore;
  let service: InnovationService;
  let schemaService: InnovationRecordSchemaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CoreModule, StoresModule],
      providers: [{ provide: 'APP_SERVER_ENVIRONMENT_VARIABLES', useValue: ENV }]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    httpMock = TestBed.inject(HttpTestingController);
    envVariablesStore = TestBed.inject(EnvironmentVariablesStore);
    service = TestBed.inject(InnovationService);
    schemaService = TestBed.inject(InnovationRecordSchemaService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should run getInnovationTransfer() and return success', () => {
    const responseMock = { userExists: true };
    const expected = responseMock;
    let response: any = null;

    service
      .getInnovationTransfer('id01')
      .subscribe({ next: success => (response = success), error: error => (response = error) });

    const httpRequest = httpMock.expectOne(`${envVariablesStore.APP_URL}/innovators/innovation-transfers/id01/check`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('GET');
    expect(response).toBe(expected);
  });
});
