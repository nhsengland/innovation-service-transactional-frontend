import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoggerTestingModule } from 'ngx-logger/testing';

import { Injector, PLATFORM_ID, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { REQUEST, RESPONSE } from '../../express.tokens';

import { EmptyMockComponent, SERVER_REQUEST, SERVER_RESPONSE } from '@tests/app.mocks';

import { AppInjector, CoreModule } from '@modules/core';
import { CtxStore, StoresModule } from '@modules/stores';

import { CoreComponent } from './core.component';

describe('App/Base/CoreComponent running SERVER side', () => {
  let component: CoreComponent;
  let fixture: ComponentFixture<CoreComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterModule, LoggerTestingModule, CoreModule, StoresModule],
      declarations: [CoreComponent],
      providers: [
        { provide: PLATFORM_ID, useValue: 'server' },
        { provide: REQUEST, useValue: SERVER_REQUEST },
        { provide: RESPONSE, useValue: SERVER_RESPONSE }
      ]
    });

    AppInjector.setInjector(TestBed.inject(Injector));
  });

  it('should create the component', () => {
    fixture = TestBed.createComponent(CoreComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it(`should run isRunningOnBrowser() and return FALSE`, () => {
    fixture = TestBed.createComponent(CoreComponent);
    component = fixture.componentInstance;
    expect(component.isRunningOnBrowser()).toBeFalsy();
  });

  it(`should run isRunningOnServer() and return TRUE`, () => {
    fixture = TestBed.createComponent(CoreComponent);
    component = fixture.componentInstance;
    expect(component.isRunningOnServer()).toBeTruthy();
  });

  it(`should run isDataRequest() and return FALSE when serverRequest.method is NOT defined`, () => {
    fixture = TestBed.createComponent(CoreComponent);
    component = fixture.componentInstance;
    (component as any).serverRequest = {};
    expect(component.isDataRequest()).toBeFalsy();
  });
  it(`should run isDataRequest() and return TRUE when serverRequest.method is NOT POST`, () => {
    fixture = TestBed.createComponent(CoreComponent);
    component = fixture.componentInstance;
    (component as any).serverRequest = { method: 'GET' };
    expect(component.isDataRequest()).toBeFalsy();
  });
  it(`should run isDataRequest() and return TRUE when serverRequest.method is POST`, () => {
    fixture = TestBed.createComponent(CoreComponent);
    component = fixture.componentInstance;
    (component as any).serverRequest = { method: 'POST' };
    expect(component.isDataRequest()).toBeTruthy();
  });

  it(`should run setPageStatus()`, () => {
    fixture = TestBed.createComponent(CoreComponent);
    component = fixture.componentInstance;
    component.setPageStatus('LOADING');
    expect(component.pageStatus()).toBe('LOADING');
  });

  // it(`should run focusBody()`, fakeAsync(() => {
  //   fixture = TestBed.createComponent(CoreComponent);
  //   component = fixture.componentInstance;
  //   component.focusBody();
  //   tick(1000);
  //   expect(component.pageStatus).toBe('LOADING'); // Do nothing really!
  // }));

  it(`should run redirectTo()`, () => {
    fixture = TestBed.createComponent(CoreComponent);
    component = fixture.componentInstance;
    component.redirectTo('/test', {});
    expect(component.sResponse?.status).toHaveBeenCalledWith(303);
    expect(component.sResponse?.setHeader).toHaveBeenCalledWith('Location', '/test');
  });

  it('should run encodeinfo()', () => {
    fixture = TestBed.createComponent(CoreComponent);
    component = fixture.componentInstance;
    expect(component.encodeInfo('test')).toBe('dGVzdA==');
  });

  it('should run decodeInfo()', () => {
    fixture = TestBed.createComponent(CoreComponent);
    component = fixture.componentInstance;
    expect(component.decodeInfo('dGVzdA==')).toBe('test');
  });
});

describe('App/Base/CoreComponent running CLIENT side', () => {
  let router: Router;
  let routerSpy: jest.SpyInstance;

  let ctx: CtxStore;

  let component: CoreComponent;
  let fixture: ComponentFixture<CoreComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterModule.forRoot([{ path: 'test', component: EmptyMockComponent }]),
        LoggerTestingModule,
        CoreModule,
        StoresModule
      ],
      declarations: [CoreComponent, EmptyMockComponent],
      providers: [{ provide: PLATFORM_ID, useValue: 'browser' }]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    router = TestBed.inject(Router);
    routerSpy = jest.spyOn(router, 'navigate');

    ctx = TestBed.inject(CtxStore);
  });

  it('should create the component', () => {
    fixture = TestBed.createComponent(CoreComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it(`should run isRunningOnBrowser() and return TRUE`, () => {
    fixture = TestBed.createComponent(CoreComponent);
    component = fixture.componentInstance;
    expect(component.isRunningOnBrowser()).toBeTruthy();
  });

  it(`should run isRunningOnServer() and return FALSE`, () => {
    fixture = TestBed.createComponent(CoreComponent);
    component = fixture.componentInstance;
    expect(component.isRunningOnServer()).toBeFalsy();
  });

  it(`should run isDataRequest() and return FALSE`, () => {
    fixture = TestBed.createComponent(CoreComponent);
    component = fixture.componentInstance;
    expect(component.isDataRequest()).toBeFalsy();
  });

  // it(`should run setPageTitle() with a EMPTY title`, () => {
  //   fixture = TestBed.createComponent(CoreComponent);
  //   component = fixture.componentInstance;
  //   component.setPageTitle(undefined);
  //   expect(component.pageTitle).toBe('');
  // });
  // it(`should run setPageTitle() with a title`, () => {
  //   fixture = TestBed.createComponent(CoreComponent);
  //   component = fixture.componentInstance;
  //   component.setPageTitle('New page title');
  //   expect(component.pageTitle).toBe('New page title');
  // });

  it(`should run setPageStatus()`, () => {
    fixture = TestBed.createComponent(CoreComponent);
    component = fixture.componentInstance;
    component.setPageStatus('LOADING');
    expect(component.pageStatus()).toBe('LOADING');
  });

  it(`should run clearAlert()`, () => {
    fixture = TestBed.createComponent(CoreComponent);
    component = fixture.componentInstance;
    component.setAlertSuccess('Something went OK');
    component.resetAlert();
    expect(component.alert).toEqual({ type: null });
  });
  // it(`should run setAlert()`, () => {
  //   fixture = TestBed.createComponent(CoreComponent);
  //   component = fixture.componentInstance;
  //   component.setAlert('SUCCESS', 'Something went OK');
  //   expect(component.alert.type).toBe('SUCCESS');
  // });
  it(`should run setAlertSuccess()`, () => {
    fixture = TestBed.createComponent(CoreComponent);
    component = fixture.componentInstance;
    component.setAlertSuccess('Something went OK');
    expect(component.alert.type).toBe('SUCCESS');
  });
  it(`should run setAlertError()`, () => {
    fixture = TestBed.createComponent(CoreComponent);
    component = fixture.componentInstance;
    component.setAlertError('Something went NOK');
    expect(component.alert.type).toBe('ERROR');
  });
  it(`should run setAlertUnknownError()`, () => {
    fixture = TestBed.createComponent(CoreComponent);
    component = fixture.componentInstance;
    component.setAlertUnknownError();
    expect(component.alert.type).toBe('ERROR');
  });
  it(`should run setAlertUnknownError()`, () => {
    fixture = TestBed.createComponent(CoreComponent);
    component = fixture.componentInstance;
    component.setAlertUnknownError();
    expect(component.alert.type).toBe('ERROR');
  });
  it(`should run setAlertUnknownError()`, () => {
    fixture = TestBed.createComponent(CoreComponent);
    component = fixture.componentInstance;
    component.setAlertUnknownError();
    expect(component.alert.type).toBe('ERROR');
  });

  // it(`should run focusBody()`, fakeAsync(() => {
  //   fixture = TestBed.createComponent(CoreComponent);
  //   component = fixture.componentInstance;
  //   component.focusBody();
  //   tick(1000);
  //   expect(document.activeElement?.nodeName).toBe('BODY');
  // }));

  it(`should run userUrlBasePath()`, () => {
    ctx.user.userUrlBasePath = signal('innovator');

    fixture = TestBed.createComponent(CoreComponent);
    component = fixture.componentInstance;
    expect(component.userUrlBasePath()).toBe('innovator');
  });

  it(`should run redirectTo() WITHOUT QueryParams`, () => {
    fixture = TestBed.createComponent(CoreComponent);
    component = fixture.componentInstance;
    component.redirectTo('/test');
    expect(routerSpy).toHaveBeenCalledWith(['/test'], { queryParams: {} });
  });

  it(`should run redirectTo() WITH QueryParams`, () => {
    fixture = TestBed.createComponent(CoreComponent);
    component = fixture.componentInstance;
    component.redirectTo('/test', { param: 'test' });
    expect(routerSpy).toHaveBeenCalledWith(['/test'], { queryParams: { param: 'test' } });
  });

  it('should run encodeinfo()', () => {
    fixture = TestBed.createComponent(CoreComponent);
    component = fixture.componentInstance;
    expect(component.encodeInfo('test')).toBe('dGVzdA==');
  });

  it('should run encodeinfo() with EMPTY string', () => {
    fixture = TestBed.createComponent(CoreComponent);
    component = fixture.componentInstance;
    expect(component.decodeInfo('')).toBe('');
  });

  it('should run decodeInfo()', () => {
    fixture = TestBed.createComponent(CoreComponent);
    component = fixture.componentInstance;
    expect(component.decodeInfo('dGVzdA==')).toBe('test');
  });

  it('should run encodeUrlQueryParams() WITHOUT QueryParams', () => {
    fixture = TestBed.createComponent(CoreComponent);
    component = fixture.componentInstance;
    const result = component.encodeUrlQueryParams('/test');
    expect(result).toBe('/test');
  });

  it('should run encodeUrlQueryParams() WITH QueryParams', () => {
    fixture = TestBed.createComponent(CoreComponent);
    component = fixture.componentInstance;
    const result = component.encodeUrlQueryParams('/test', {
      query_1: { teste_1: 6 },
      query_2: '',
      query_3: 'One value'
    });
    expect(result).toBe('/test?query_1=eyJ0ZXN0ZV8xIjo2fQ%3D%3D&query_3=T25lIHZhbHVl');
  });

  it('should run decodeUrlQueryParams()', () => {
    fixture = TestBed.createComponent(CoreComponent);
    component = fixture.componentInstance;
    const result = component.decodeQueryParams({ query_1: 'T25lIHZhbHVl' });
    expect(result).toEqual({ query_1: 'One value' });
  });

  it('should run translate()', () => {
    fixture = TestBed.createComponent(CoreComponent);
    component = fixture.componentInstance;
    expect(component.translate('app.title')).toBe('app.title');
  });

  it('should run translationExists()', () => {
    fixture = TestBed.createComponent(CoreComponent);
    component = fixture.componentInstance;
    expect(component.translationExists('app.title')).toBe(false);
  });
});
