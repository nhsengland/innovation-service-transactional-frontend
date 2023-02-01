import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoggerTestingModule } from 'ngx-logger/testing';

import { Injector } from '@angular/core';

import { CoreModule, AppInjector } from '@modules/core';
import { AuthenticationStore, StoresModule } from '@modules/stores';

import { UserRoleEnum } from './enums';

import { CoreService } from './core.service';


describe('App/Base/CoreService', () => {

  let authenticationStore: AuthenticationStore;

  let service: CoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        LoggerTestingModule,
        CoreModule,
        StoresModule
      ],
      providers: [
        CoreService
      ]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    authenticationStore = TestBed.inject(AuthenticationStore);

    service = TestBed.inject(CoreService);

  });


  it('should create the service', () => {

    expect(service).toBeTruthy();

  });

  it(`should run apiUserBasePath() as Admin`, () => {
    authenticationStore.getUserType = () => UserRoleEnum.ADMIN;
    expect(service.apiUserBasePath()).toBe('user-admin');
  });
  it(`should run apiUserBasePath() as Admin`, () => {
    authenticationStore.getUserType = () => UserRoleEnum.ASSESSMENT;
    expect(service.apiUserBasePath()).toBe('assessments');
  });
  it(`should run apiUserBasePath() as Admin`, () => {
    authenticationStore.getUserType = () => UserRoleEnum.ACCESSOR;
    expect(service.apiUserBasePath()).toBe('accessors');
  });
  it(`should run apiUserBasePath() as Admin`, () => {
    authenticationStore.getUserType = () => UserRoleEnum.INNOVATOR;
    expect(service.apiUserBasePath()).toBe('innovators');
  });
  it(`should run apiUserBasePath() as Admin`, () => {
    authenticationStore.getUserType = () => '';
    expect(service.apiUserBasePath()).toBe('');
  });


  it(`should run userUrlBasePath()`, () => {

    authenticationStore.userUrlBasePath = () => 'innovator';

    expect(service.userUrlBasePath()).toBe('innovator');

  });

  it('should run translate()', () => {

    expect(service.translate('app.title')).toBe('app.title');

  });

});
