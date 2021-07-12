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
    expect(environmentStore.APP_ASSETS_URL).toBe('http://demo.com/static/assets');
    expect(environmentStore.API_URL).toBe('http://demo.com/api');
    expect(environmentStore.BASE_URL).toBe('http://demo.com');
    expect(environmentStore.BASE_PATH).toBe('');

  });

});


describe('Core/Stores/EnvironmentStore running client side', () => {

  let environmentStore: EnvironmentStore;
  let windowSpy: jest.SpyInstance;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [
        LoggerTestingModule
      ],
      providers: [
        EnvironmentStore
      ]
    });

    windowSpy = jest.spyOn(window, 'window', 'get');
    windowSpy.mockImplementation(() => ({ __env: ENV }));

    environmentStore = TestBed.inject(EnvironmentStore);

  });

  it('should set environment variables', () => {

    const expected = { BASE_URL: 'http://demo.com', BASE_PATH: '', API_URL: 'http://demo.com/api', LOG_LEVEL: 0 };

    expect(environmentStore.ENV).toEqual(expected);
    expect(environmentStore.APP_URL).toBe('http://demo.com');
    expect(environmentStore.APP_ASSETS_URL).toBe('http://demo.com/static/assets');
    expect(environmentStore.API_URL).toBe('http://demo.com/api');
    expect(environmentStore.BASE_URL).toBe('http://demo.com');
    expect(environmentStore.BASE_PATH).toBe('');

  });

});
