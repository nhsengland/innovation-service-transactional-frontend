import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AppInjector, CoreModule } from '@modules/core';
import { AdminModule } from '@modules/feature-modules/admin/admin.module';
import { AuthenticationStore, StoresModule } from '@modules/stores';

import { PageOrganisationInfoComponent } from './organisation-info.component';

import { OrganisationsService } from '@modules/shared/services/organisations.service';
import { UsersService } from '@modules/shared/services/users.service';
import { USER_INFO_ADMIN } from '@tests/data.mocks';

describe('FeatureModules/Admin/Pages/Organisations/PageOrganisationInfoComponent', () => {
  let component: PageOrganisationInfoComponent;
  let fixture: ComponentFixture<PageOrganisationInfoComponent>;
  let activatedRoute: ActivatedRoute;
  let organisationsService: OrganisationsService;
  let usersService: UsersService;
  let authenticationStore: AuthenticationStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterModule.forRoot([]), CoreModule, StoresModule, AdminModule]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    authenticationStore = TestBed.inject(AuthenticationStore);
    activatedRoute = TestBed.inject(ActivatedRoute);
    organisationsService = TestBed.inject(OrganisationsService);
    usersService = TestBed.inject(UsersService);

    authenticationStore.getUserInfo = () => USER_INFO_ADMIN;
  });

  it('should create the component', () => {
    fixture = TestBed.createComponent(PageOrganisationInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should NOT have default information loaded', () => {
    organisationsService.getOrganisationInfo = () => throwError(() => new Error('error'));

    fixture = TestBed.createComponent(PageOrganisationInfoComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.pageStatus()).toBe('ERROR');
  });

  it('should have default information loaded', () => {
    organisationsService.getOrganisationInfo = () =>
      of({
        id: 'OrgId',
        name: 'Org name',
        acronym: 'ORG',
        isActive: true,
        organisationUnits: [{ id: 'OrgUnitId', name: 'Org Unit name', acronym: 'ORGu', isActive: true, userCount: 10 }]
      });

    fixture = TestBed.createComponent(PageOrganisationInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.pageStatus()).toBe('READY');
  });

  it('should show "updateOrganisationSuccess" warning', () => {
    activatedRoute.snapshot.params = { organisationId: 'Org01' };
    activatedRoute.snapshot.queryParams = { alert: 'updateOrganisationSuccess' };

    fixture = TestBed.createComponent(PageOrganisationInfoComponent);
    component = fixture.componentInstance;
    expect(component.alert.type).toEqual('SUCCESS');
  });
  it('should show "updateUnitSuccess" warning', () => {
    activatedRoute.snapshot.params = { organisationId: 'Org01' };
    activatedRoute.snapshot.queryParams = { alert: 'updateUnitSuccess' };

    fixture = TestBed.createComponent(PageOrganisationInfoComponent);
    component = fixture.componentInstance;
    expect(component.alert.type).toEqual('SUCCESS');
  });
});
