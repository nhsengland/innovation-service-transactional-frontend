import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { PLATFORM_ID } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

import { ENV } from '@tests/app.mocks';

import { CoreModule } from '@modules/core';

import { CookiesService } from './cookies.service';

declare let updateGTAGConsent: any;


describe('Core/Services/CookiesService running SERVER side', () => {
  let cookieService: CookieService;
  let service: CookiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CoreModule],
      providers: [
        { provide: PLATFORM_ID, useValue: 'server' },
        { provide: 'APP_SERVER_ENVIRONMENT_VARIABLES', useValue: ENV }
      ]
    });

    cookieService = TestBed.inject(CookieService);
    service = TestBed.inject(CookiesService);
  });

  it('should run removeAnalyticsScripts() and do nothing', () => {
    cookieService.get = () => '{ "consented": true, "necessary": true, "analytics": true }';
    service.removeAnalyticsScripts();
    expect(document.getElementById('hj-analytics')).toBeFalsy();
  });
});

describe('Core/Services/CookiesService running CLIENT side', () => {
  let cookieService: CookieService;
  let service: CookiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CoreModule],
      providers: [
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: 'APP_SERVER_ENVIRONMENT_VARIABLES', useValue: ENV }
      ]
    });

    cookieService = TestBed.inject(CookieService);
    service = TestBed.inject(CookiesService);
  });

  it('should run shouldAskForCookies() and return true', () => {
    service.getConsentCookie = () => ({});
    expect(service.shouldAskForCookies()).toBeTruthy();
  });

  it('should run getConsentCookie() and return an empty object when no cookie exists', () => {
    cookieService.get = () => '';
    expect(service.getConsentCookie()).toEqual({});
  });
  it('should run getConsentCookie() and return an object when the cookie exists', () => {
    cookieService.get = () => '{ "consented": true, "necessary": true, "analytics": true }';
    expect(service.getConsentCookie()).toEqual({ consented: true, necessary: true, analytics: true });
  });

  it('should run getConsentCookie() and return an empty object when cookie is not JSON format', () => {
    cookieService.get = () => 'Not a JSON text';
    expect(service.getConsentCookie()).toEqual({});
  });

  it('should run setConsentCookie(false) and remove analytics scripts', () => {
    cookieService.get = () => '{ "consented": true, "necessary": true, "analytics": false }';
    cookieService.getAll = () => ({ _hjCookie: '', _gaCookie: '', otherCookie: '' });
    updateGTAGConsent = () => null;

    service.setConsentCookie(false);
    expect(document.getElementById('hj-analytics')).toBeFalsy();
    expect(document.getElementById('ga-analytics')).toBeFalsy();
  });
});
