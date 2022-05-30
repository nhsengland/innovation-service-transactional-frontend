import { TestBed } from '@angular/core/testing';
import { LoggerTestingModule } from 'ngx-logger/testing';

import { PLATFORM_ID } from '@angular/core';

import { ENV } from '@tests/app.mocks';

import { EnvironmentStore } from './environment.store';


describe('Core/Stores/EnvironmentStore running SERVER side', () => {

  let store: EnvironmentStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        LoggerTestingModule
      ],
      providers: [
        { provide: PLATFORM_ID, useValue: 'server' },
        { provide: 'APP_SERVER_ENVIRONMENT_VARIABLES', useValue: ENV },
        EnvironmentStore
      ]
    });

    store = TestBed.inject(EnvironmentStore);

  });

  it('should set environment variables', () => {
    expect(store.ENV).toEqual({ BASE_URL: 'http://demo.com', BASE_PATH: '', LOG_LEVEL: 0, ENABLE_ANALYTICS: true });
    expect(store.APP_URL).toBe('http://demo.com');
    expect(store.APP_ASSETS_URL).toBe('http://demo.com/static/assets');
    expect(store.API_URL).toBe('http://demo.com/api');
    expect(store.API_ADMIN).toBe('http://demo.com/api/configuration');
    expect(store.API_INNOVATIONS).toBe('http://demo.com/api/innovations');
    expect(store.API_USERS).toBe('http://demo.com/api/management/users');
    expect(store.BASE_URL).toBe('http://demo.com');
    expect(store.BASE_PATH).toBe('');
  });

  it('should run parseBasePath() with /', () => {
    expect(store.parseBasePath('/')).toBe('');
  });

  it('should run parseBasePath() with /some-path', () => {
    expect(store.parseBasePath('/some-path')).toBe('/some-path');
  });

  it('should run parseBasePath() with some-path', () => {
    expect(store.parseBasePath('some-path')).toBe('/some-path');
  });

});





describe('Core/Stores/EnvironmentStore running CLIENT side', () => {

  let windowSpy: jest.SpyInstance;
  let store: EnvironmentStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        LoggerTestingModule
      ],
      providers: [
        { provide: PLATFORM_ID, useValue: 'browser' },
        EnvironmentStore
      ]
    });

    windowSpy = jest.spyOn(window, 'window', 'get');
    windowSpy.mockImplementation(() => ({ __env: ENV }));

    store = TestBed.inject(EnvironmentStore);

  });

  it('should set environment variables', () => {
    expect(store.ENV).toEqual({ BASE_URL: 'http://demo.com', BASE_PATH: '', LOG_LEVEL: 0, ENABLE_ANALYTICS: true });
    expect(store.APP_URL).toBe('http://demo.com');
    expect(store.APP_ASSETS_URL).toBe('http://demo.com/static/assets');
    expect(store.API_URL).toBe('http://demo.com/api');
    expect(store.API_ADMIN).toBe('http://demo.com/api/configuration');
    expect(store.API_INNOVATIONS).toBe('http://demo.com/api/innovations');
    expect(store.API_USERS).toBe('http://demo.com/api/management/users');
    expect(store.BASE_URL).toBe('http://demo.com');
    expect(store.BASE_PATH).toBe('');
  });

});
