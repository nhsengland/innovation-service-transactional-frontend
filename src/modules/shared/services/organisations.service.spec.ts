import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ENV } from '@tests/app.mocks';

import { Injector } from '@angular/core';

import { AppInjector, CoreModule, EnvironmentStore } from '@modules/core';
import { StoresModule } from '@modules/stores';

import { OrganisationsService } from './organisations.service';

describe('Shared/Services/OrganisationsService', () => {

  let httpMock: HttpTestingController;
  let environmentStore: EnvironmentStore;
  let service: OrganisationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        CoreModule,
        StoresModule
      ],
      providers: [
        OrganisationsService,
        { provide: 'APP_SERVER_ENVIRONMENT_VARIABLES', useValue: ENV }
      ]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    httpMock = TestBed.inject(HttpTestingController);
    environmentStore = TestBed.inject(EnvironmentStore);
    service = TestBed.inject(OrganisationsService);

  });

  afterEach(() => {
    httpMock.verify();
  });


  it('should run getAccessorsOrganisations() and return success', () => {

    const responseMock = [{ id: 'id1', name: 'Organisation 01' }];
    const expected = [{ id: 'id1', name: 'Organisation 01' }];
    let response: any = null;

    service.getAccessorsOrganisations().subscribe(success => response = success, error => response = error);

    const req = httpMock.expectOne(`${environmentStore.API_URL}/organisations?type=accessor`);
    req.flush(responseMock);
    expect(req.request.method).toBe('GET');
    expect(response).toEqual(expected);

  });

});
