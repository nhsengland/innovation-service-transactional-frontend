import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Injector } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AppInjector, CoreModule } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { AdminModule } from '@modules/feature-modules/admin/admin.module';

import { ServiceUsersService } from '../services/service-users.service';

import { ServiceUserDataResolver } from './service-user-data.resolver';


describe('FeatureModules/Admin/Resolvers/ServiceUserDataResolver', () => {

  let resolver: ServiceUserDataResolver;

  let serviceUsersService: ServiceUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        CoreModule,
        StoresModule,
        AdminModule
      ]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    resolver = TestBed.inject(ServiceUserDataResolver);

    serviceUsersService = TestBed.inject(ServiceUsersService);

  });


  it('should load resolver information', () => {

    const routeMock: Partial<ActivatedRouteSnapshot> = { params: { userId: 'UserId01' } };
    const responseMock = { id: 'UserId01', displayName: 'User Name' };

    serviceUsersService.getUserMinimalInfo = () => of(responseMock as any);

    let response: any = null;
    const expected = { id: 'UserId01', displayName: 'User Name' };

    resolver.resolve(routeMock as any).subscribe(success => response = success, error => response = error);
    expect(response).toEqual(expected);

  });


  it('should NOT load resolver information data', () => {

    const routeMock: Partial<ActivatedRouteSnapshot> = { params: { userId: 'UserId01' } };

    serviceUsersService.getUserMinimalInfo = () => throwError('error');

    let response: any = null;

    resolver.resolve(routeMock as any).subscribe(success => response = success, error => response = error);
    expect(response).toBe('error');

  });

});
