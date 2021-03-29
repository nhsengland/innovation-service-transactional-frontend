import * as common from '@angular/common';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { AppInjector } from '@modules/core';
import { TranslateModule } from '@ngx-translate/core';
import { CoreComponent } from './core.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { InjectorMock } from '@tests/mocks/injector.mock';

describe('CoreComponent', () => {

  let component: CoreComponent;
  let fixture: ComponentFixture<CoreComponent>;
  let injectorSpy: jasmine.Spy;

  beforeEach(async () => {

    @Component({
      template: `<div id='test-component'></div>`,
      selector: 'test-component',
    })
    class TestComponent { }

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'test', component: TestComponent }
        ]),
        TranslateModule.forRoot(),
      ],
      declarations: [
        CoreComponent,
        TestComponent,
      ],
      providers: [
        InjectorMock,
      ]
    }).compileComponents();

    spyOn(AppInjector, 'getInjector').and.returnValue(TestBed.inject(InjectorMock));
    injectorSpy = spyOn(TestBed.inject(InjectorMock), 'get');

    fixture = TestBed.createComponent(CoreComponent);
    component = fixture.componentInstance;
  });


  it('should create the Core component', fakeAsync(() => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  }));

  it(`should 'isRunningOnBrowser' be falsy when isPlatformBrowser is 'false'`, () => {
    spyOn(common, 'isPlatformBrowser').and.returnValue(false);
    expect(component.isRunningOnBrowser()).toBeFalsy();
  });

  it(`should 'isRunningOnServer' be truthy when isPlatformServer is 'true'`, () => {
    spyOn(common, 'isPlatformServer').and.returnValue(true);
    expect(component.isRunningOnServer()).toBeTruthy();
  });

  it(`should 'isRunningOnBrowser' be truthy when isPlatformBrowser is 'true'`, () => {
    spyOn(common, 'isPlatformBrowser').and.returnValue(true);
    expect(component.isRunningOnBrowser()).toBeTruthy();
  });

  it(`should 'isRunningOnBrowser' be falsy when isPlatformBrowser is ''`, () => {
    spyOn(common, 'isPlatformBrowser').and.returnValue('');
    expect(component.isRunningOnBrowser()).toBeFalsy();
  });
  it(`should 'isRunningOnServer' be falsy when isPlatformServer is ''`, () => {
    expect(component.isRunningOnServer()).toBeFalsy();
  });

  it(`should 'isDataRequest' be true when 'serverRequest.method' is POST`, () => {

    injectorSpy.and.returnValue({ method: 'POST' });
    fixture = TestBed.createComponent(CoreComponent);
    component = fixture.componentInstance;

    expect(component.isDataRequest()).toBeTruthy();
  });

  it(`should 'isDataRequest' be true when 'serverRequest.method' is post`, () => {

    injectorSpy.and.returnValue({ method: 'post' });
    fixture = TestBed.createComponent(CoreComponent);
    component = fixture.componentInstance;

    expect(component.isDataRequest()).toBe(true);
  });

  it(`should 'isDataRequest' be true when 'serverRequest.method' is not POST`, () => {

    injectorSpy.and.returnValue({ method: 'GET' });
    fixture = TestBed.createComponent(CoreComponent);
    component = fixture.componentInstance;

    expect(component.isDataRequest()).toBe(false);
  });


  it(`should 'isDataRequest' be false when 'serverRequest.method' is null`, () => {

    injectorSpy.and.returnValue({ method: null });
    fixture = TestBed.createComponent(CoreComponent);
    component = fixture.componentInstance;

    expect(component.isDataRequest()).toBe(false);
  });

  it(`should 'isDataRequest' be false when 'serverRequest.method' is undefined`, () => {

    injectorSpy.and.returnValue({ method: undefined });
    fixture = TestBed.createComponent(CoreComponent);
    component = fixture.componentInstance;

    expect(component.isDataRequest()).toBe(false);
  });

  it(`should redirect to '/test' when 'redirecTo' is called and running on Browser`, () => {
    // Arrange
    const router = TestBed.inject(Router);
    injectorSpy.and.returnValue(router);
    spyOn(common, 'isPlatformBrowser').and.returnValue(true);
    const routerSpy = spyOn(router, 'navigate');
    fixture = TestBed.createComponent(CoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    // Act
    component.redirectTo('/test', {});

    // Assert
    expect(routerSpy).toHaveBeenCalledWith(['/test'], { queryParams: {} });
  });

  it(`should set response headers 'status' to '303' and
    'Location' to '/test' when 'redirecTo' is called and running on Server`, () => {
    // Arrange

    const status = jasmine.createSpy('status');
    const setHeader = jasmine.createSpy('setHeader');

    injectorSpy.and.returnValue({
      status,
      setHeader,
    });

    spyOn(common, 'isPlatformBrowser').and.returnValue(false);
    fixture = TestBed.createComponent(CoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // Act
    component.redirectTo('/test', {});

    // Assert
    expect(status).toHaveBeenCalledWith(303);
    expect(setHeader).toHaveBeenCalledWith('Location', '/test');

  });

  it(`should set response headers 'status' to '303' and
  'Location' to '/test?query=1' when 'redirecTo' is called with querystrings and running on Server`, () => {
    // Arrange

    const status = jasmine.createSpy('status');
    const setHeader = jasmine.createSpy('setHeader');

    injectorSpy.and.returnValue({
      status,
      setHeader,
    });

    spyOn(common, 'isPlatformBrowser').and.returnValue(false);
    fixture = TestBed.createComponent(CoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    spyOn(component, 'encodeUrlQueryParams').and.returnValue('/test?query=1');
    // Act
    component.redirectTo('/test', { query: '1' });

    // Assert
    expect(status).toHaveBeenCalledWith(303);
    expect(setHeader).toHaveBeenCalledWith('Location', '/test?query=1');

  });

  it(`should set response headers 'status' to '303' and
  'Location' to '/test?' when 'redirecTo' is called with 'undefined' and running on Server`, () => {
    // Arrange

    const status = jasmine.createSpy('status');
    const setHeader = jasmine.createSpy('setHeader');

    injectorSpy.and.returnValue({
      status,
      setHeader,
    });

    spyOn(common, 'isPlatformBrowser').and.returnValue(false);
    fixture = TestBed.createComponent(CoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // Act
    component.redirectTo('/test');

    // Assert
    expect(status).toHaveBeenCalledWith(303);
    expect(setHeader).toHaveBeenCalledWith('Location', '/test');

  });

  it('should encode info with btoa when running on the browser', () => {
    // Arrange
    const expected = 'dGVzdA==';
    spyOn(common, 'isPlatformBrowser').and.returnValue(true);
    const bufferSpy = spyOn(Buffer, 'from').and.callThrough();
    // Act
    const actual = component.encodeInfo('test');
    // Assert
    expect(actual).toBe(expected);
    expect(bufferSpy).not.toHaveBeenCalled();
  });

  it('should encode info with base64 when running on the server', () => {
    // Arrange
    const expected = 'dGVzdA==';
    spyOn(common, 'isPlatformBrowser').and.returnValue(false);
    const bufferSpy = spyOn(Buffer, 'from').and.callThrough();
    // Act
    const actual = component.encodeInfo('test');
    // Assert
    expect(actual).toBe(expected);
    expect(bufferSpy).toHaveBeenCalled();
  });

  it('should decode info with atob when running on the browser', () => {
    // Arrange
    const expected = 'test';
    spyOn(common, 'isPlatformBrowser').and.returnValue(true);
    const bufferSpy = spyOn(Buffer, 'from').and.callThrough();
    // Act
    const actual = component.decodeInfo('dGVzdA==');
    // Assert
    expect(actual).toBe(expected);
    expect(bufferSpy).not.toHaveBeenCalled();
  });

  it('should decode info with base64 when running on the server', () => {
    // Arrange
    const expected = 'test';
    spyOn(common, 'isPlatformBrowser').and.returnValue(false);
    const bufferSpy = spyOn(Buffer, 'from').and.callThrough();
    // Act
    const actual = component.decodeInfo('dGVzdA==');
    // Assert
    expect(actual).toBe(expected);
    expect(bufferSpy).toHaveBeenCalled();
  });

  it('should encode url query params when on server', () => {
    // Arrange
    const expected = '/test?query_1=e3Rlc3RlXzE6IDZ9';
    spyOn(common, 'isPlatformBrowser').and.returnValue(false);
    const bufferSpy = spyOn(Buffer, 'from').and.callThrough();
    // Act
    const actual = component
      .encodeUrlQueryParams('/test', { query_1: '{teste_1: 6}' });
    // Assert
    expect(actual).toBe(expected);
    expect(bufferSpy).toHaveBeenCalled();
  });

  it('should decode url query params when on browser', () => {
    // Arrange
    const expected = { query_1: '{teste_1: 6}' };
    spyOn(common, 'isPlatformBrowser').and.returnValue(true);
    const bufferSpy = spyOn(Buffer, 'from').and.callThrough();
    // Act
    const actual = component
      .decodeQueryParams({ query_1: 'e3Rlc3RlXzE6IDZ9' });
    // Assert
    expect(actual).toEqual(expected);
    expect(bufferSpy).not.toHaveBeenCalled();
  });

});
