import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LoggerTestingModule } from 'ngx-logger/testing';

import { InjectorMock, EmptyMockComponent } from '@tests/app.mocks';

import { Injector } from '@angular/core';
import * as common from '@angular/common';
import { Router } from '@angular/router';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule } from '@modules/stores';

import { CoreComponent } from './core.component';


describe('App/CoreComponent running server side tests', () => {

  let component: CoreComponent;
  let fixture: ComponentFixture<CoreComponent>;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        LoggerTestingModule,
        CoreModule,
        StoresModule
      ],
      declarations: [
        CoreComponent
      ],
      providers: []
    }).compileComponents();

    AppInjector.setInjector(TestBed.inject(Injector));
    spyOn(common, 'isPlatformServer').and.returnValue(true);
    spyOn(common, 'isPlatformBrowser').and.returnValue(false);

  });

  it('should create the component', () => {
    fixture = TestBed.createComponent(CoreComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it(`should run isRunningOnBrowser() and return false`, () => {
    expect(component.isRunningOnBrowser()).toBeFalsy();
  });

  it(`should run isRunningOnServer() and return true`, () => {
    expect(component.isRunningOnServer()).toBeTruthy();
  });

});



describe('App/CoreComponent running client side tests', () => {

  let component: CoreComponent;
  let fixture: ComponentFixture<CoreComponent>;
  let injectorSpy: jasmine.Spy;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'test', component: EmptyMockComponent }
        ]),

      ],
      declarations: [
        CoreComponent,
        EmptyMockComponent
      ],
      providers: [
        InjectorMock,
      ]
    }).compileComponents();

    spyOn(AppInjector, 'getInjector').and.returnValue(TestBed.inject(InjectorMock));
    injectorSpy = spyOn(TestBed.inject(InjectorMock), 'get');

  });


  it('should create the Core component', () => {
    fixture = TestBed.createComponent(CoreComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it(`should run isRunningOnBrowser() and return true`, () => {
    spyOn(common, 'isPlatformBrowser').and.returnValue(true);
    expect(component.isRunningOnBrowser()).toBeTruthy();
  });

  it(`should run isRunningOnServer() and return false`, () => {
    spyOn(common, 'isPlatformServer').and.returnValue(false);
    expect(component.isRunningOnServer()).toBeFalsy();
  });

  it(`should run isDataRequest() and return true when serverRequest.method not defined`, () => {
    fixture = TestBed.createComponent(CoreComponent);
    component = fixture.componentInstance;
    expect(component.isDataRequest()).toBe(false);
  });
  it(`should run isDataRequest() and return true when serverRequest.method is POST`, () => {
    injectorSpy.and.returnValue({ method: 'POST' });
    fixture = TestBed.createComponent(CoreComponent);
    component = fixture.componentInstance;
    expect(component.isDataRequest()).toBeTruthy();
  });
  it(`should run isDataRequest() and return true when serverRequest.method is post`, () => {
    injectorSpy.and.returnValue({ method: 'post' });
    fixture = TestBed.createComponent(CoreComponent);
    component = fixture.componentInstance;
    expect(component.isDataRequest()).toBe(true);
  });
  it(`should run isDataRequest() and return true when serverRequest.method is not POST`, () => {
    injectorSpy.and.returnValue({ method: 'GET' });
    fixture = TestBed.createComponent(CoreComponent);
    component = fixture.componentInstance;
    expect(component.isDataRequest()).toBe(false);
  });
  it(`should run isDataRequest() and return false when serverRequest.method is null`, () => {
    injectorSpy.and.returnValue({ method: null });
    fixture = TestBed.createComponent(CoreComponent);
    component = fixture.componentInstance;
    expect(component.isDataRequest()).toBe(false);
  });
  it(`should run isDataRequest() and return false when serverRequest.method is undefined`, () => {
    injectorSpy.and.returnValue({ method: undefined });
    fixture = TestBed.createComponent(CoreComponent);
    component = fixture.componentInstance;
    expect(component.isDataRequest()).toBe(false);
  });

  it(`should redirect to '/test' when 'redirecTo' is called and running on Browser`, () => {
    const router = TestBed.inject(Router);
    injectorSpy.and.returnValue(router);
    spyOn(common, 'isPlatformBrowser').and.returnValue(true);
    const routerSpy = spyOn(router, 'navigate');
    fixture = TestBed.createComponent(CoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.redirectTo('/test', {});

    expect(routerSpy).toHaveBeenCalledWith(['/test'], { queryParams: {} });
  });

  it(`should set response headers 'status' to '303' and 'Location' to '/test' when 'redirecTo' is called and running on Server`, () => {

    const status = jasmine.createSpy('status');
    const setHeader = jasmine.createSpy('setHeader');

    injectorSpy.and.returnValue({ status, setHeader });

    spyOn(common, 'isPlatformBrowser').and.returnValue(false);
    fixture = TestBed.createComponent(CoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.redirectTo('/test', {});

    expect(status).toHaveBeenCalledWith(303);
    expect(setHeader).toHaveBeenCalledWith('Location', '/test');

  });

  it(`should set response headers 'status' to '303' and 'Location' to '/test?query=1' when 'redirecTo' is called with querystrings and running on Server`, () => {

    const status = jasmine.createSpy('status');
    const setHeader = jasmine.createSpy('setHeader');

    injectorSpy.and.returnValue({ status, setHeader });

    spyOn(common, 'isPlatformBrowser').and.returnValue(false);
    fixture = TestBed.createComponent(CoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    spyOn(component, 'encodeUrlQueryParams').and.returnValue('/test?query=1');
    component.redirectTo('/test', { query: '1' });

    expect(status).toHaveBeenCalledWith(303);
    expect(setHeader).toHaveBeenCalledWith('Location', '/test?query=1');

  });

  it(`should set response headers 'status' to '303' and
  'Location' to '/test?' when 'redirecTo' is called with 'undefined' and running on Server`, () => {

    const status = jasmine.createSpy('status');
    const setHeader = jasmine.createSpy('setHeader');

    injectorSpy.and.returnValue({ status, setHeader });

    spyOn(common, 'isPlatformBrowser').and.returnValue(false);
    fixture = TestBed.createComponent(CoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.redirectTo('/test');

    expect(status).toHaveBeenCalledWith(303);
    expect(setHeader).toHaveBeenCalledWith('Location', '/test');

  });

  it('should encode info with btoa when running on the browser', () => {
    const expected = 'dGVzdA==';
    spyOn(common, 'isPlatformBrowser').and.returnValue(true);
    const bufferSpy = spyOn(Buffer, 'from').and.callThrough();
    const actual = component.encodeInfo('test');
    expect(actual).toBe(expected);
    expect(bufferSpy).not.toHaveBeenCalled();
  });

  it('should encode info with base64 when running on the server', () => {
    const expected = 'dGVzdA==';
    spyOn(common, 'isPlatformBrowser').and.returnValue(false);
    const bufferSpy = spyOn(Buffer, 'from').and.callThrough();
    const actual = component.encodeInfo('test');
    expect(actual).toBe(expected);
    expect(bufferSpy).toHaveBeenCalled();
  });

  it('should decode info with atob when running on the browser', () => {
    const expected = 'test';
    spyOn(common, 'isPlatformBrowser').and.returnValue(true);
    const bufferSpy = spyOn(Buffer, 'from').and.callThrough();
    const actual = component.decodeInfo('dGVzdA==');
    expect(actual).toBe(expected);
    expect(bufferSpy).not.toHaveBeenCalled();
  });

  it('should decode info with base64 when running on the server', () => {
    const expected = 'test';
    spyOn(common, 'isPlatformBrowser').and.returnValue(false);
    const bufferSpy = spyOn(Buffer, 'from').and.callThrough();
    const actual = component.decodeInfo('dGVzdA==');
    expect(actual).toBe(expected);
    expect(bufferSpy).toHaveBeenCalled();
  });

  it('should encode url query params when on server', () => {
    const expected = '/test?query_1=e3Rlc3RlXzE6IDZ9';
    spyOn(common, 'isPlatformBrowser').and.returnValue(false);
    const bufferSpy = spyOn(Buffer, 'from').and.callThrough();
    const actual = component
      .encodeUrlQueryParams('/test', { query_1: '{teste_1: 6}' });
    expect(actual).toBe(expected);
    expect(bufferSpy).toHaveBeenCalled();
  });

  it('should decode url query params when on browser', () => {
    const expected = { query_1: '{teste_1: 6}' };
    spyOn(common, 'isPlatformBrowser').and.returnValue(true);
    const bufferSpy = spyOn(Buffer, 'from').and.callThrough();
    const actual = component
      .decodeQueryParams({ query_1: 'e3Rlc3RlXzE6IDZ9' });
    expect(actual).toEqual(expected);
    expect(bufferSpy).not.toHaveBeenCalled();
  });

});
