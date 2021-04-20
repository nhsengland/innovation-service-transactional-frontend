import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ENV } from '@tests/app.mocks';

import { Injector } from '@angular/core';

import { AppInjector, CoreModule, EnvironmentStore } from '@modules/core';
import { StoresModule } from '@modules/stores';

import { AccessorService } from './accessor.service';

describe('FeatureModules/Accessor/AccessorService', () => {

  let httpMock: HttpTestingController;
  // let environmentStore: EnvironmentStore;
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
    // environmentStore = TestBed.inject(EnvironmentStore);
    service = TestBed.inject(AccessorService);

  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should run toDo() and return success', () => {

    const responseMock = true;
    const expected = true;
    let response: any = null;

    service.toDo().subscribe(success => response = success, error => response = error);

    // const req = httpMock.expectOne(`${environmentStore.API_URL}/organisations?type=accessor`);
    // req.flush(responseMock);
    // expect(req.request.method).toBe('GET');
    expect(response).toEqual(expected);

  });

});
