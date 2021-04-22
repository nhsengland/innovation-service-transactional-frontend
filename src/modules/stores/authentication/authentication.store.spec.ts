import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { of, throwError } from 'rxjs';

import { CoreModule } from '@modules/core';

import { AuthenticationStore } from './authentication.store';
import { AuthenticationService } from './authentication.service';


describe('Stores/AuthenticationStore/AuthenticationStore', () => {

  let authenticationStore: AuthenticationStore;
  let authenticationService: AuthenticationService;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        CoreModule
      ],
      providers: [
        AuthenticationStore,
        AuthenticationService
      ]
    });

    authenticationStore = TestBed.inject(AuthenticationStore);
    authenticationService = TestBed.inject(AuthenticationService);

  });

  it('should run initializeAuthentication$() and return success', () => {

    spyOn(authenticationService, 'verifyUserSession').and.returnValue(of(true));
    spyOn(authenticationService, 'getUserInfo').and.returnValue(of({ id: 'id', displayName: 'John Doe', type: 'INNOVATOR', organisations: [] }));
    spyOn(authenticationService, 'verifyInnovator').and.returnValue(of(true));
    spyOn(authenticationService, 'getInnovations').and.returnValue(of([{ id: 'abc123zxc', name: 'HealthyApp' }]));

    const expectedResponse = true;
    const expectedState = {
      isSignIn: true,
      user: { id: 'id', displayName: 'John Doe', type: 'INNOVATOR', organisations: [], innovations: [{ id: 'abc123zxc', name: 'HealthyApp' }] },
      didFirstTimeSignIn: true
    };
    let response: any = null;

    authenticationStore.initializeAuthentication$().subscribe(success => response = success, error => response = error);

    expect(response).toBe(expectedResponse);
    expect(authenticationStore.state.isSignIn).toEqual(expectedState.isSignIn);
    expect(authenticationStore.state.user).toEqual(expectedState.user);
    expect(authenticationStore.state.didFirstTimeSignIn).toEqual(expectedState.didFirstTimeSignIn);

  });

  it('should run initializeAuthentication$() and return success not being first time signin', () => {

    spyOn(authenticationService, 'verifyUserSession').and.returnValue(of(true));
    spyOn(authenticationService, 'getUserInfo').and.returnValue(of({ id: 'id', displayName: 'John Doe', type: 'INNOVATOR', organisations: [] }));
    spyOn(authenticationService, 'verifyInnovator').and.returnValue(throwError('error'));
    spyOn(authenticationService, 'getInnovations').and.returnValue(throwError('error'));

    const expectedResponse = true;
    const expectedState = {
      isSignIn: true,
      user: { id: 'id', displayName: 'John Doe', type: 'INNOVATOR', organisations: [], innovations: [] }
    };
    let response: any = null;

    authenticationStore.initializeAuthentication$().subscribe(success => response = success, error => response = error);

    expect(response).toBe(expectedResponse);
    expect(authenticationStore.state.isSignIn).toEqual(expectedState.isSignIn);
    expect(authenticationStore.state.user).toEqual(expectedState.user);

  });

  it('should run initializeAuthentication$() and return error', () => {

    spyOn(authenticationService, 'verifyUserSession').and.returnValue(throwError(false));

    const expectedResponse = false;
    const expectedState = {
      isSignIn: false
    };
    let response: any = null;

    authenticationStore.initializeAuthentication$().subscribe(success => response = success, error => response = error);

    expect(response).toBe(expectedResponse);
    expect(authenticationStore.state.isSignIn).toEqual(expectedState.isSignIn);

  });

  it('should run isInnovatorType() and return true', () => {
    authenticationStore.state.user = { id: 'id', displayName: 'John Doe', type: 'INNOVATOR', organisations: [], innovations: [] };
    expect(authenticationStore.isInnovatorType()).toBe(true);
  });

  it('should run isAccessorType() and return true', () => {
    authenticationStore.state.user = { id: 'id', displayName: 'John Doe', type: 'ACCESSOR', organisations: [], innovations: [] };
    expect(authenticationStore.isAccessorType()).toBe(true);
  });

  it('should run isInnovatorType() + isAccessorType() and return false', () => {
    // authenticationStore.state.user = { id: 'id', displayName: 'John Doe', type: 'INNOVATOR', organisations: [], innovations: [] };
    expect(authenticationStore.isInnovatorType()).toBe(false);
    expect(authenticationStore.isAccessorType()).toBe(false);
  });

  it('should run isQualifyingAccessorRole() and return true', () => {
    authenticationStore.state.user = { id: 'id', displayName: 'John Doe', type: 'ACCESSOR', organisations: [{ id: 'id01', name: 'Organisation Name', role: 'QUALIFYING_ACCESSOR' }], innovations: [] };
    expect(authenticationStore.isQualifyingAccessorRole()).toBe(true);
  });

  it('should run isQualifyingAccessorRole() and return false', () => {
    // authenticationStore.state.user = { id: 'id', displayName: 'John Doe', type: 'ACCESSOR', organisations: [{ id: 'id01', name: 'Organisation Name', role: 'QUALIFYING_ACCESSOR' }], innovations: [] };
    expect(authenticationStore.isQualifyingAccessorRole()).toBe(false);
  });

  it('should run didFirstTimeSignIn() and return true', () => {
    authenticationStore.state.didFirstTimeSignIn = true;
    expect(authenticationStore.didFirstTimeSignIn()).toBe(true);
  });

  it('should run didFirstTimeSignIn() and return false', () => {
    // authenticationStore.state.didFirstTimeSignIn = false;
    expect(authenticationStore.didFirstTimeSignIn()).toBe(false);
  });

  it('should run getUserId() and return true', () => {
    authenticationStore.state.user = { id: '010101', displayName: 'John Doe', type: 'INNOVATOR', organisations: [], innovations: [] };
    expect(authenticationStore.getUserId()).toBe('010101');
  });

  it('should run getUserId() and return false', () => {
    // authenticationStore.state.user = { id: '010101', displayName: 'John Doe', type: 'INNOVATOR', organisations: [], innovations: [] }
    expect(authenticationStore.getUserId()).toBe('');
  });

  it('should run getUserType() and return true', () => {
    authenticationStore.state.user = { id: '010101', displayName: 'John Doe', type: 'INNOVATOR', organisations: [], innovations: [] };
    expect(authenticationStore.getUserType()).toBe('INNOVATOR');
  });

  it('should run getUserType() and return false', () => {
    // authenticationStore.state.user = { id: '010101', displayName: 'John Doe', type: 'INNOVATOR', organisations: [], innovations: [] }
    expect(authenticationStore.getUserType()).toBe('');
  });

  it('should run getUserInfo() and return empty user', () => {
    const expected = { id: '', displayName: '', type: '', organisations: [], innovations: [] };
    expect(authenticationStore.getUserInfo()).toEqual(expected);
  });

  it('should run getUserInfo() and return a valid user', () => {
    const expected = authenticationStore.state.user = { id: '010101', displayName: 'John Doe', type: 'INNOVATOR', organisations: [], innovations: [] };
    expect(authenticationStore.getUserInfo()).toEqual(expected);
  });

});
