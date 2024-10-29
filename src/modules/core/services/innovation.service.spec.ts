import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { Injector } from '@angular/core';

import { ENV } from '@tests/app.mocks';

import { AppInjector, CoreModule, EnvironmentVariablesStore } from '@modules/core';

import { InnovationService } from './innovation.service';

describe('Core/Services/InnovationService', () => {
  let httpMock: HttpTestingController;
  let envVariablesStore: EnvironmentVariablesStore;
  let service: InnovationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CoreModule],
      providers: [{ provide: 'APP_SERVER_ENVIRONMENT_VARIABLES', useValue: ENV }]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    httpMock = TestBed.inject(HttpTestingController);
    envVariablesStore = TestBed.inject(EnvironmentVariablesStore);
    service = TestBed.inject(InnovationService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should run getInnovationTransfer() and return success', () => {
    const responseMock = { userExists: true };
    const expected = responseMock;
    let response: any = null;

    service.getInnovationTransfer('id01').subscribe({
      next: response => {
        const httpRequest = httpMock.expectOne(
          `${envVariablesStore.APP_URL}/innovators/innovation-transfers/id01/check`
        );
        httpRequest.flush(responseMock);
        expect(httpRequest.request.method).toBe('GET');
        expect(response).toBe(expected);
      },
      error: error => (response = error)
    });
  });
});
