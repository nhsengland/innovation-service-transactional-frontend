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

    authenticationService.verifyUserSession = () => of(true);
    authenticationService.getUserInfo = () => of({ id: 'id', email: 'john.doe@mail.com', displayName: 'John Doe', type: 'INNOVATOR', organisations: [] });
    authenticationService.verifyInnovator = () => of({ userExists: true, hasInvites: false });
    authenticationService.getInnovations = () => of([{ id: 'abc123zxc', name: 'HealthyApp' }]);

    const expectedResponse = true;
    const expectedState = {
      isSignIn: true,
      user: { id: 'id', email: 'john.doe@mail.com', displayName: 'John Doe', type: 'INNOVATOR', organisations: [], innovations: [{ id: 'abc123zxc', name: 'HealthyApp' }] },
      didFirstTimeSignIn: true
    };
    let response: any = null;

    authenticationStore.initializeAuthentication$().subscribe(success => response = success, error => response = error);

    expect(response).toBe(expectedResponse);
    expect(authenticationStore.state.isSignIn).toEqual(expectedState.isSignIn);
    expect(authenticationStore.state.user).toEqual(expectedState.user);
    expect(authenticationStore.state.isValidUser).toEqual(expectedState.didFirstTimeSignIn);

  });

  it('should run initializeAuthentication$() and return success not being first time signin', () => {

    authenticationService.verifyUserSession = () => of(true);
    authenticationService.getUserInfo = () => of({ id: 'id', email: 'john.doe@mail.com', displayName: 'John Doe', type: 'INNOVATOR', organisations: [] });
    authenticationService.verifyInnovator = () => throwError('error');
    authenticationService.getInnovations = () => throwError('error');

    const expectedResponse = true;
    const expectedState = {
      isSignIn: true,
      user: { id: 'id', email: 'john.doe@mail.com', displayName: 'John Doe', type: 'INNOVATOR', organisations: [], innovations: [] }
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


  it('should run isValidUser() and return true', () => {
    authenticationStore.state.isValidUser = true;
    expect(authenticationStore.isValidUser()).toBe(true);
  });

  it('should run isValidUser() and return false', () => {
    // authenticationStore.state.didFirstTimeSignIn = false;
    expect(authenticationStore.isValidUser()).toBe(false);
  });


  it('should run isInnovatorType() and return true', () => {
    authenticationStore.state.user = { id: 'id', email: 'john.doe@mail.com', displayName: 'John Doe', type: 'INNOVATOR', organisations: [], innovations: [] };
    expect(authenticationStore.isInnovatorType()).toBe(true);
  });

  it('should run isAccessorType() and return true', () => {
    authenticationStore.state.user = { id: 'id', email: 'john.doe@mail.com', displayName: 'John Doe', type: 'ACCESSOR', organisations: [], innovations: [] };
    expect(authenticationStore.isAccessorType()).toBe(true);
  });

  it('should run isInnovatorType() + isAccessorType() and return false', () => {
    // authenticationStore.state.user = { id: 'id', displayName: 'John Doe', type: 'INNOVATOR', organisations: [], innovations: [] };
    expect(authenticationStore.isInnovatorType()).toBe(false);
    expect(authenticationStore.isAccessorType()).toBe(false);
  });

  it('should run isAccessorRole() and return true', () => {
    authenticationStore.state.user = {
      id: 'id', email: 'john.doe@mail.com', displayName: 'John Doe', type: 'ACCESSOR',
      organisations: [{ id: 'id01', name: 'Organisation Name', size: '1 to 5 employees', role: 'ACCESSOR', isShadow: false, organisationUnits: [] }],
      innovations: []
    };
    expect(authenticationStore.isAccessorRole()).toBe(true);
  });

  it('should run isAccessorRole() and return false', () => {
    // authenticationStore.state.user = { id: 'id', displayName: 'John Doe', type: 'ACCESSOR', organisations: [{ id: 'id01', name: 'Organisation Name', role: 'QUALIFYING_ACCESSOR' }], innovations: [] };
    expect(authenticationStore.isQualifyingAccessorRole()).toBe(false);
  });

  it('should run isQualifyingAccessorRole() and return true', () => {
    authenticationStore.state.user = {
      id: 'id', email: 'john.doe@mail.com', displayName: 'John Doe', type: 'ACCESSOR',
      organisations: [{ id: 'id01', name: 'Organisation Name', size: '1 to 5 employees', role: 'QUALIFYING_ACCESSOR', isShadow: false, organisationUnits: [] }],
      innovations: []
    };
    expect(authenticationStore.isQualifyingAccessorRole()).toBe(true);
  });

  it('should run isQualifyingAccessorRole() and return false', () => {
    // authenticationStore.state.user = { id: 'id', displayName: 'John Doe', type: 'ACCESSOR', organisations: [{ id: 'id01', name: 'Organisation Name', role: 'QUALIFYING_ACCESSOR' }], innovations: [] };
    expect(authenticationStore.isQualifyingAccessorRole()).toBe(false);
  });

  it('should run getUserId() and return true', () => {
    authenticationStore.state.user = { id: '010101', email: 'john.doe@mail.com', displayName: 'John Doe', type: 'INNOVATOR', organisations: [], innovations: [] };
    expect(authenticationStore.getUserId()).toBe('010101');
  });

  it('should run getUserId() and return false', () => {
    // authenticationStore.state.user = { id: '010101', displayName: 'John Doe', type: 'INNOVATOR', organisations: [], innovations: [] }
    expect(authenticationStore.getUserId()).toBe('');
  });

  it('should run getUserType() and return true', () => {
    authenticationStore.state.user = { id: '010101', email: 'john.doe@mail.com', displayName: 'John Doe', type: 'INNOVATOR', organisations: [], innovations: [] };
    expect(authenticationStore.getUserType()).toBe('INNOVATOR');
  });

  it('should run getUserType() and return false', () => {
    // authenticationStore.state.user = { id: '010101', displayName: 'John Doe', type: 'INNOVATOR', organisations: [], innovations: [] }
    expect(authenticationStore.getUserType()).toBe('');
  });


  it('should run getAccessorOrganisationUnitName() and return empty name', () => {
    const expected = '';
    expect(authenticationStore.getAccessorOrganisationUnitName()).toEqual(expected);
  });

  it('should run getAccessorOrganisationUnitName() and return a valid name', () => {
    authenticationStore.state.user = {
      id: '010101', email: 'john.doe@mail.com', displayName: 'John Doe', type: 'INNOVATOR',
      organisations: [{ id: 'Org01', name: 'Org name 01', size: '1 to 5 employees', role: 'OWNER', isShadow: false, organisationUnits: [{ id: 'OrgUnit01', name: 'Org. Unit 01' }] }],
      innovations: []
    };
    expect(authenticationStore.getAccessorOrganisationUnitName()).toEqual('Org. Unit 01');
  });


  it('should run getUserInfo() and return empty user', () => {
    const expected = { id: '', email: '', displayName: '', type: '', organisations: [], innovations: [] };
    expect(authenticationStore.getUserInfo()).toEqual(expected);
  });

  it('should run getUserInfo() and return a valid user', () => {
    const expected = authenticationStore.state.user = { id: '010101', email: 'john.doe@mail.com', displayName: 'John Doe', type: 'INNOVATOR', organisations: [], innovations: [] };
    expect(authenticationStore.getUserInfo()).toEqual(expected);
  });

});
