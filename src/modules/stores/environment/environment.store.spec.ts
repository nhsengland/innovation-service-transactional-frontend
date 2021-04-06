import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { of, throwError } from 'rxjs';

import { environment } from '@app/config/environment.config';

import { EnvironmentStore } from './environment.store';
import { EnvironmentService } from './environment.service';

describe('Store/EnvironmentStore/EnvironmentStore tests Suite', () => {

  let httpMock: HttpTestingController;
  let environmentStore: EnvironmentStore;
  let environmentService: EnvironmentService;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        EnvironmentStore,
        EnvironmentService
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    environmentStore = TestBed.inject(EnvironmentStore);
    environmentService = TestBed.inject(EnvironmentService);

  });

  afterEach(() => {
    httpMock.verify();
  });


  it('should return static variables', () => {

    expect(environmentStore.ENV).toEqual(environment);

  });

  it('should run initializeAuthentication$() and return success', () => {

    spyOn(environmentService, 'verifyUserSession').and.returnValue(of(true));
    spyOn(environmentService, 'getUserInfo').and.returnValue(of({ user: { id: '010101', displayName: 'A user' } }));
    spyOn(environmentService, 'verifyInnovator').and.returnValue(of(true));

    const expected = {
      response: false,
      stateAuthentication: {
        user: { id: '010101', displayName: 'A user' },
        isSignIn: true,
        didFirstTimeSignIn: true
      },
      error: { status: 0, statusText: '' }
    };

    environmentStore.initializeAuthentication$().subscribe(
      response => expected.response = response,
      error => expected.error = error
    );

    expect(expected.response).toBe(true);
    expect(environmentStore.state.authentication).toEqual(expected.stateAuthentication);

  });

  it('should run initializeAuthentication$() and return success not being first time signin', () => {

    spyOn(environmentService, 'verifyUserSession').and.returnValue(of(true));
    spyOn(environmentService, 'getUserInfo').and.returnValue(of({ user: { id: '010101', displayName: 'A user' } }));
    spyOn(environmentService, 'verifyInnovator').and.returnValue(throwError('error'));

    const expected = {
      response: false,
      stateAuthentication: {
        user: { id: '010101', displayName: 'A user' },
        isSignIn: true
      },
      error: { status: 0, statusText: '' }
    };

    environmentStore.initializeAuthentication$().subscribe(
      response => expected.response = response,
      error => expected.error = error
    );

    expect(expected.response).toBe(true);
    expect(environmentStore.state.authentication).toEqual(expected.stateAuthentication);

  });

  it('should run initializeAuthentication$() and return error', () => {

    spyOn(environmentService, 'verifyUserSession').and.returnValue(throwError('error'));

    const expected = {
      response: false,
      stateAuthentication: {
        isSignIn: false
      },
      error: { status: 0, statusText: '' }
    };

    environmentStore.initializeAuthentication$().subscribe(
      response => expected.response = response,
      error => expected.error = error
    );

    expect(expected.response).toBe(false);
    expect(environmentStore.state.authentication).toEqual(expected.stateAuthentication);

  });


  it('should run isUserAuthenticated$() and return success', () => {

    environmentStore.state.authentication.isSignIn = true;

    const expected = {
      response: false,
      stateAuthentication: { isSignIn: false },
      error: { status: 0, statusText: '' }
    };

    environmentStore.isUserAuthenticated$().subscribe(
      response => expected.response = response,
      error => expected.error = error
    );

    expect(expected.response).toBe(true);
    expect(environmentStore.state.authentication.isSignIn).toBe(true);

  });


  it('should run userDidFirstTimeSignIn() and return false', () => {
    // environmentStore.state.authentication.isSignIn = true;
    expect(environmentStore.userDidFirstTimeSignIn()).toBe(false);
  });

  it('should run userDidFirstTimeSignIn() and return false', () => {
    environmentStore.state.authentication.isSignIn = true;
    expect(environmentStore.userDidFirstTimeSignIn()).toBe(false);
  });


  it('should run getUserInfo() and return empty user', () => {
    // environmentStore.state.authentication.isSignIn = true;
    expect(environmentStore.getUserInfo()).toEqual({ id: '', displayName: '' });
  });

  it('should run getUserInfo() and valid user', () => {
    environmentStore.state.authentication.user = { id: '010101', displayName: 'A user' };
    expect(environmentStore.getUserInfo()).toEqual({ id: '010101', displayName: 'A user' });
  });

});
