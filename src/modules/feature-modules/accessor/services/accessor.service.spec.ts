import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ENV } from '@tests/app.mocks';

import { Injector } from '@angular/core';

import { AppInjector, CoreModule, EnvironmentStore } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { TableModel } from '@app/base/models';

import { AccessorService } from './accessor.service';

describe('FeatureModules/Accessor/AccessorService', () => {

  let httpMock: HttpTestingController;
  let environmentStore: EnvironmentStore;
  let service: AccessorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        CoreModule,
        StoresModule
      ],
      providers: [
        AccessorService,
        { provide: 'APP_SERVER_ENVIRONMENT_VARIABLES', useValue: ENV }
      ]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    httpMock = TestBed.inject(HttpTestingController);
    environmentStore = TestBed.inject(EnvironmentStore);
    service = TestBed.inject(AccessorService);

  });

  afterEach(() => {
    httpMock.verify();
  });


  it('should run getInnovationsList() and return success', () => {

    const responseMock = {
      count: 2,
      data: [
        { id: '01', status: 'WAITING_NEEDS_ASSESSMENT', name: 'Innovation 01', supportStatus: 'WAITING', createdAt: '2021-04-16T09:23:49.396Z', updatedAt: '2021-04-16T09:23:49.396' },
        { id: '02', status: 'WAITING_NEEDS_ASSESSMENT', name: 'Innovation 02', supportStatus: 'WAITING', createdAt: '2021-04-16T09:23:49.396Z', updatedAt: '2021-04-16T09:23:49.396' }
      ]
    };
    const tableList = new TableModel({ visibleColumns: { name: 'Name' } });

    const expected = responseMock;
    let response: any = null;

    service.getInnovationsList(tableList.getAPIQueryParams()).subscribe(success => response = success, error => response = error);

    const httpRequest = httpMock.expectOne(`${environmentStore.API_URL}/accessors//innovations?take=10&skip=0`);
    httpRequest.flush(responseMock);
    expect(httpRequest.request.method).toBe('GET');
    expect(response).toEqual(expected);

  });

});
