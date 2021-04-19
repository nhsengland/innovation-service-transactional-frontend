import { TestBed } from '@angular/core/testing';
import { LoggerTestingModule } from 'ngx-logger/testing';

import { ENV } from '@tests/app.mocks';

import { EnvironmentStore } from './environment.store';


describe('Core/Stores/EnvironmentStore running server side', () => {

  let environmentStore: EnvironmentStore;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [
        LoggerTestingModule
      ],
      providers: [
        EnvironmentStore,
        { provide: 'APP_SERVER_ENVIRONMENT_VARIABLES', useValue: ENV }
      ]
    });

    environmentStore = TestBed.inject(EnvironmentStore);

  });

  it('should set environment variables', () => {

    const expected = { BASE_URL: 'http://demo.com', BASE_PATH: '', API_URL: 'http://demo.com/api', LOG_LEVEL: 0 };

    expect(environmentStore.ENV).toEqual(expected);
    expect(environmentStore.APP_URL).toBe('http://demo.com');
    expect(environmentStore.API_URL).toBe('http://demo.com/api');

  });

});


describe('Core/Stores/EnvironmentStore runnign client side', () => {

  let environmentStore: EnvironmentStore;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [
        LoggerTestingModule
      ],
      providers: [
        EnvironmentStore
      ]
    });

    environmentStore = TestBed.inject(EnvironmentStore);

  });

  it('should set environment variables', () => {

    window = { __env: ENV } as any;

    const expected = { BASE_URL: 'http://demo.com', BASE_PATH: '', API_URL: 'http://demo.com/api', LOG_LEVEL: 0 };

    expect(environmentStore.ENV).toEqual(expected);
    expect(environmentStore.APP_URL).toBe('http://demo.com');
    expect(environmentStore.API_URL).toBe('http://demo.com/api');

  });

});
