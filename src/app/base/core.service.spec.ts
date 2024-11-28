import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { LoggerTestingModule } from 'ngx-logger/testing';

import { Injector, signal } from '@angular/core';

import { AppInjector, CoreModule } from '@modules/core';
import { CtxStore, StoresModule } from '@modules/stores';

import { UserRoleEnum } from './enums';

import { CoreService } from './core.service';

describe('App/Base/CoreService', () => {
  let ctx: CtxStore;

  let service: CoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, LoggerTestingModule, CoreModule, StoresModule],
      providers: [CoreService]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    ctx = TestBed.inject(CtxStore);

    service = TestBed.inject(CoreService);
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  it(`should run apiUserBasePath() as Admin`, () => {
    ctx.user.getUserType = signal(UserRoleEnum.ADMIN);
    expect(service.apiUserBasePath()).toBe('user-admin');
  });
  it(`should run apiUserBasePath() as NA`, () => {
    ctx.user.getUserType = signal(UserRoleEnum.ASSESSMENT);
    expect(service.apiUserBasePath()).toBe('assessments');
  });
  it(`should run apiUserBasePath() as Accessor`, () => {
    ctx.user.getUserType = signal(UserRoleEnum.ACCESSOR);
    expect(service.apiUserBasePath()).toBe('accessors');
  });
  it(`should run apiUserBasePath() as Innovator`, () => {
    ctx.user.getUserType = signal(UserRoleEnum.INNOVATOR);
    expect(service.apiUserBasePath()).toBe('innovators');
  });
  it(`should run apiUserBasePath() as nothing`, () => {
    ctx.user.getUserType = signal(undefined);
    expect(service.apiUserBasePath()).toBe('');
  });

  it(`should run userUrlBasePath()`, () => {
    ctx.user.userUrlBasePath = signal('innovator');

    expect(service.userUrlBasePath()).toBe('innovator');
  });

  it('should run translate()', () => {
    expect(service.translate('app.title')).toBe('app.title');
  });
});
