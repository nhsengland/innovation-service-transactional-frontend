import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

import { CoreModule, AppInjector } from '@modules/core';
import { AuthenticationStore, StoresModule } from '@modules/stores';
import { AdminModule } from '@modules/feature-modules/admin/admin.module';

import { PageOrganisationInfoComponent } from './organisation-info.component';

import { AccessorOrganisationRoleEnum, UserRoleEnum } from '@modules/stores/authentication/authentication.enums';
import { USER_INFO_ADMIN } from '@tests/data.mocks';
import { OrganisationsService } from '@modules/shared/services/organisations.service';


describe('FeatureModules/Admin/Pages/Organisations/PageOrganisationInfoComponent', () => {

  let component: PageOrganisationInfoComponent;
  let fixture: ComponentFixture<PageOrganisationInfoComponent>;
  let activatedRoute: ActivatedRoute;
  let organisationsService: OrganisationsService;
  let authenticationStore: AuthenticationStore;

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
    
    authenticationStore = TestBed.inject(AuthenticationStore);
    activatedRoute = TestBed.inject(ActivatedRoute);
    organisationsService = TestBed.inject(OrganisationsService);

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
    expect(component.pageStatus).toBe('ERROR');

  });


  it('should have default information loaded', () => {

    organisationsService.getOrganisationInfo = () => of({
      id: 'OrgId', name: 'Org name', acronym: 'ORG', isActive: true,
      organisationUnits: [{ id: 'OrgUnitId', name: 'Org Unit name', acronym: 'ORGu', isActive: true, userCount: 10 }]
    });

    fixture = TestBed.createComponent(PageOrganisationInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.pageStatus).toBe('READY');

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


  it('should run onShowHideClicked() and do nothing because organisations do not exists', () => {

    fixture = TestBed.createComponent(PageOrganisationInfoComponent);
    component = fixture.componentInstance;
    component.organisation = {
      id: 'orgId', name: 'Org name', acronym: 'ORG', isActive: true,
      organisationUnits: [
        {
          id: 'Unit01',
          name: 'Unit name',
          acronym: 'UNT',
          isActive: true,
          userCount: 10,
          showHideStatus: 'closed',
          showHideText: 'Hide users',
          showHideDescription: 'that belong to the Org name',
          isLoading: false,
          users: []
        }
      ]

    };

    component.onUnitUsersShowHideClicked('invalidOrg');
    expect(component.organisation.organisationUnits[0].showHideStatus).toEqual('closed');

  });

  it('should run onShowHideClicked() when organisations is closed', () => {

    fixture = TestBed.createComponent(PageOrganisationInfoComponent);
    component = fixture.componentInstance;
    component.organisation = {
      id: 'orgId01', name: 'Org name', acronym: 'ORG', isActive: true,
      organisationUnits: [
        {
          id: 'Unit01',
          name: 'Unit name',
          acronym: 'UNT',
          isActive: true,
          userCount: 10,
          showHideStatus: 'closed',
          showHideText: 'show users',
          showHideDescription: 'that belong to the Org name',
          isLoading: false,
          users: []
        }
      ]

    };
    organisationsService.getOrganisationUnitUsersList = () => of([
  
      {
        id: 'user01',
        organisationUnitUserId: '',
        name: 'user01',
        email: 'some@email.com',
        role: UserRoleEnum.ACCESSOR,
        roleDescription: 'Accessor',
        isActive: true,
        lockedAt: undefined
      }
    ]);

    component.onUnitUsersShowHideClicked('Unit01');
    expect(component.organisation.organisationUnits[0].showHideStatus).toEqual('opened');

  });

  it('should throw error when getUsersByUnitId() called', () => {
    organisationsService.getOrganisationUnitUsersList = () => throwError(()=> { new Error('error')});

    fixture = TestBed.createComponent(PageOrganisationInfoComponent);
    component = fixture.componentInstance;
    component.organisation = {
      id: 'orgId01', name: 'Org name', acronym: 'ORG', isActive: true,
      organisationUnits: [
        {
          id: 'Unit01',
          name: 'Unit name',
          acronym: 'UNT',
          isActive: true,
          userCount: 10,
          showHideStatus: 'closed',
          showHideText: 'show users',
          showHideDescription: 'that belong to the Org name',
          isLoading: false,
          users: []
        }
      ]

    };

    component.onUnitUsersShowHideClicked('Unit01');
    expect(component.alert.type).toEqual('ERROR');

  });

  it('should run onShowHideClicked() when organisation is opened', () => {

    fixture = TestBed.createComponent(PageOrganisationInfoComponent);
    component = fixture.componentInstance;
    component.organisation = {
      id: 'orgId01', name: 'Org name', acronym: 'ORG', isActive: true,
      organisationUnits: [
        {
          id: 'Unit01',
          name: 'Unit name',
          acronym: 'UNT',
          isActive: true,
          userCount: 10,
          showHideStatus: 'opened',
          showHideText: 'Hide users',
          showHideDescription: 'that belong to the Org name',
          isLoading: false,
          users: []
        }
      ]

    };

    component.onUnitUsersShowHideClicked('Unit01');
    expect(component.organisation.organisationUnits[0].showHideStatus).toEqual('closed');

  });

  it('should run onShowHideClicked() when organisation hide status is hidden', () => {

    fixture = TestBed.createComponent(PageOrganisationInfoComponent);
    component = fixture.componentInstance;
    component.organisation = {
      id: 'orgId01', name: 'Org name', acronym: 'ORG', isActive: true,
      organisationUnits: [
        {
          id: 'Unit01',
          name: 'Unit name',
          acronym: 'UNT',
          isActive: true,
          userCount: 10,
          showHideStatus: 'hidden',
          showHideText: 'Hide users',
          showHideDescription: 'that belong to the Org name',
          isLoading: false,
          users: []
        }
      ]

    };

    component.onUnitUsersShowHideClicked('Unit01');
    expect(component.organisation.organisationUnits[0].showHideStatus).toEqual('hidden');

  });

});