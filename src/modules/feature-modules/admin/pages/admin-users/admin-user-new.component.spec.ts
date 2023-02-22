import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule, AuthenticationStore } from '@modules/stores';
import { AdminModule } from '@modules/feature-modules/admin/admin.module';

import { PageAdminUserNewComponent } from './admin-user-new.component';

import { OrganisationsService } from '@modules/shared/services/organisations.service';
import { ServiceUsersService } from '@modules/feature-modules/admin/services/service-users.service';


describe('FeatureModules/Admin/Pages/AdminUsers/PageAdminUserNewComponent', () => {

  let component: PageAdminUserNewComponent;
  let fixture: ComponentFixture<PageAdminUserNewComponent>;
  let router: Router;
  let routerSpy: jest.SpyInstance;

  let authenticationStore: AuthenticationStore;
  let serviceUserService: ServiceUsersService;
  let organisationsService: OrganisationsService;

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

    router = TestBed.inject(Router);
    routerSpy = jest.spyOn(router, 'navigate');

    authenticationStore = TestBed.inject(AuthenticationStore);
    serviceUserService = TestBed.inject(ServiceUsersService);
    organisationsService = TestBed.inject(OrganisationsService);

    organisationsService.getOrganisationsList = () => of([
      { id: 'orgId', acronym: 'orgId01', name: 'Org name 01', isActive: true, organisationUnits: [{ id: 'orgId', acronym: 'orgId01', name: 'Org name 01', isActive: true }] },
      { id: 'orgId', acronym: 'orgId02', name: 'Org name 02', isActive: true, organisationUnits: [{ id: 'orgId', acronym: 'orgId01', name: 'Org name 01', isActive: true }] }
    ]);

  });

  it('should create the component', () => {
    fixture = TestBed.createComponent(PageAdminUserNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

});
