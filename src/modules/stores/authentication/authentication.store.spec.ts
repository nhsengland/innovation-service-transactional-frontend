import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { of } from 'rxjs';

import { CoreModule } from '@modules/core';

import { AuthenticationStore } from './authentication.store';
import { AuthenticationService } from './authentication.service';
import { AuthenticationModel } from './authentication.models';
import { AccessorOrganisationRoleEnum, InnovatorOrganisationRoleEnum, UserRoleEnum, UserTypeEnum } from './authentication.enums';


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
    authenticationService.getUserInfo = () => of({ id: 'id', email: 'john.doe@mail.com', displayName: 'John Doe', type: UserTypeEnum.INNOVATOR, roles: [], organisations: [], passwordResetOn: '', phone: '' });
    authenticationService.verifyInnovator = () => of({ userExists: true, hasInvites: false });
    authenticationService.userTermsOfUseInfo = () => of({ id: 'abc123zxc', name: 'HealthyApp', summary: '', isAccepted: true });

    const expectedResponse = true;
    const expectedState: AuthenticationModel = {
      isSignIn: true,
      isTermsOfUseAccepted: true,
      user: { id: 'id', email: 'john.doe@mail.com', displayName: 'John Doe', type: UserTypeEnum.INNOVATOR, roles: [], organisations: [], passwordResetOn: '', phone: '' }
    };
    let response: any = null;

    authenticationStore.initializeAuthentication$().subscribe(success => response = success, error => response = error);

    expect(response).toBe(expectedResponse);
    expect(authenticationStore.state.isSignIn).toEqual(expectedState.isSignIn);
    expect(authenticationStore.state.user).toEqual(expectedState.user);
    expect(authenticationStore.state.isValidUser).toEqual(true);
    expect(authenticationStore.state.isTermsOfUseAccepted).toEqual(expectedState.isTermsOfUseAccepted);

  });

  it('should run initializeAuthentication$() and return success not being first time signin', () => {

    authenticationService.verifyUserSession = () => of(true);
    authenticationService.getUserInfo = () => of({ id: 'id', email: 'john.doe@mail.com', displayName: 'John Doe', type: UserTypeEnum.INNOVATOR, roles: [], organisations: [], passwordResetOn: '', phone: '' });
    authenticationService.verifyInnovator = () => of({ userExists: false, hasInvites: false });
    authenticationService.userTermsOfUseInfo = () => of(null);

    const expectedResponse = true;
    const expectedState: AuthenticationModel = {
      isSignIn: true,
      isTermsOfUseAccepted: false,
      user: { id: 'id', email: 'john.doe@mail.com', displayName: 'John Doe', type: UserTypeEnum.INNOVATOR, roles: [], organisations: [], passwordResetOn: '', phone: '' }
    };
    let response: any = null;

    authenticationStore.initializeAuthentication$().subscribe(success => response = success, error => response = error);

    expect(response).toBe(expectedResponse);
    expect(authenticationStore.state.isSignIn).toEqual(expectedState.isSignIn);
    expect(authenticationStore.state.user).toEqual(expectedState.user);
    expect(authenticationStore.state.isTermsOfUseAccepted).toEqual(expectedState.isTermsOfUseAccepted);
  });

  it('should run initializeAuthentication$() and return error', () => {

    authenticationService.verifyUserSession = () => of(false);

    const expectedResponse = null;
    const expectedState: AuthenticationModel = {
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
    expect(authenticationStore.isValidUser()).toBe(false);
  });


  it('should run isInnovatorType() and return true', () => {
    authenticationStore.state.user = { id: 'id', email: 'john.doe@mail.com', displayName: 'John Doe', type: UserTypeEnum.INNOVATOR, roles: [], organisations: [], passwordResetOn: '', phone: '' };
    expect(authenticationStore.isInnovatorType()).toBe(true);
  });

  it('should run isAccessorType() and return true', () => {
    authenticationStore.state.user = { id: 'id', email: 'john.doe@mail.com', displayName: 'John Doe', type: UserTypeEnum.ACCESSOR, roles: [], organisations: [], passwordResetOn: '', phone: '' };
    expect(authenticationStore.isAccessorType()).toBe(true);
  });

  it('should run isInnovatorType() + isAccessorType() and return false', () => {
    expect(authenticationStore.isInnovatorType()).toBe(false);
    expect(authenticationStore.isAccessorType()).toBe(false);
  });

  it('should run isAccessorRole() and return true', () => {
    authenticationStore.state.user = {
      id: 'id', email: 'john.doe@mail.com', displayName: 'John Doe', type: UserTypeEnum.ACCESSOR, roles: [],
      organisations: [{ id: 'id01', name: 'Organisation Name', size: '1 to 5 employees', role: AccessorOrganisationRoleEnum.ACCESSOR, isShadow: false, organisationUnits: [] }],
      passwordResetOn: '', phone: ''
    };
    expect(authenticationStore.isAccessorRole()).toBe(true);
  });

  it('should run isAccessorRole() and return false', () => {
    // authenticationStore.state.user = { id: 'id', displayName: 'John Doe', type: UserTypeEnum.ACCESSOR, organisations: [{ id: 'id01', name: 'Organisation Name', role: AccessorOrganisationRoleEnum.QUALIFYING_ACCESSOR }] };
    expect(authenticationStore.isQualifyingAccessorRole()).toBe(false);
  });

  it('should run isQualifyingAccessorRole() and return true', () => {
    authenticationStore.state.user = {
      id: 'id', email: 'john.doe@mail.com', displayName: 'John Doe', type: UserTypeEnum.ACCESSOR, roles: [],
      organisations: [{ id: 'id01', name: 'Organisation Name', size: '1 to 5 employees', role: AccessorOrganisationRoleEnum.QUALIFYING_ACCESSOR, isShadow: false, organisationUnits: [] }],
      passwordResetOn: '', phone: ''
    };
    expect(authenticationStore.isQualifyingAccessorRole()).toBe(true);
  });

  it('should run isQualifyingAccessorRole() and return false', () => {
    // authenticationStore.state.user = { id: 'id', displayName: 'John Doe', type: UserTypeEnum.ACCESSOR, organisations: [{ id: 'id01', name: 'Organisation Name', role: AccessorOrganisationRoleEnum.QUALIFYING_ACCESSOR }], innovations: [] };
    expect(authenticationStore.isQualifyingAccessorRole()).toBe(false);
  });

  it('should run getUserId() and return true', () => {
    authenticationStore.state.user = { id: '010101', email: 'john.doe@mail.com', displayName: 'John Doe', type: UserTypeEnum.INNOVATOR, roles: [], organisations: [], passwordResetOn: '', phone: '' };
    expect(authenticationStore.getUserId()).toBe('010101');
  });

  it('should run getUserId() and return false', () => {
    // authenticationStore.state.user = { id: '010101', displayName: 'John Doe', type: UserTypeEnum.INNOVATOR, organisations: [], innovations: [] }
    expect(authenticationStore.getUserId()).toBe('');
  });

  it('should run getUserType() and return true', () => {
    authenticationStore.state.user = { id: '010101', email: 'john.doe@mail.com', displayName: 'John Doe', type: UserTypeEnum.INNOVATOR, roles: [], organisations: [], passwordResetOn: '', phone: '' };
    expect(authenticationStore.getUserType()).toBe('INNOVATOR');
  });

  it('should run getUserType() and return false', () => {
    // authenticationStore.state.user = { id: '010101', displayName: 'John Doe', type: UserTypeEnum.INNOVATOR, organisations: [], innovations: [] }
    expect(authenticationStore.getUserType()).toBe('');
  });


  it('should run getAccessorOrganisationUnitName() and return empty name', () => {
    const expected = '';
    expect(authenticationStore.getAccessorOrganisationUnitName()).toEqual(expected);
  });

  it('should run getAccessorOrganisationUnitName() and return a valid name', () => {
    authenticationStore.state.user = {
      id: '010101', email: 'john.doe@mail.com', displayName: 'John Doe', type: UserTypeEnum.INNOVATOR, roles: [],
      organisations: [{ id: 'Org01', name: 'Org name 01', size: '1 to 5 employees', role: InnovatorOrganisationRoleEnum.INNOVATOR_OWNER, isShadow: false, organisationUnits: [{ id: 'OrgUnit01', name: 'Org. Unit 01' }] }],
      passwordResetOn: '', phone: ''
    };
    expect(authenticationStore.getAccessorOrganisationUnitName()).toEqual('Org. Unit 01');
  });


  it('should run getUserInfo() and return empty user', () => {
    const expected = { id: '', email: '', displayName: '', type: '', roles: [], organisations: [], passwordResetOn: '', phone: '' };
    expect(authenticationStore.getUserInfo()).toEqual(expected);
  });

  it('should run getUserInfo() and return a valid user', () => {
    const expected = authenticationStore.state.user = { id: '010101', email: 'john.doe@mail.com', displayName: 'John Doe', type: UserTypeEnum.INNOVATOR, roles: [], organisations: [], passwordResetOn: '', phone: '' };
    expect(authenticationStore.getUserInfo()).toEqual(expected);
  });

});
