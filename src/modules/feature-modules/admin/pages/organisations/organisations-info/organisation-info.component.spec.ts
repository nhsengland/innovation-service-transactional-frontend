import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Injector } from '@angular/core';
import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { AdminModule } from '@modules/feature-modules/admin/admin.module';
import { PageAdminOrganisationInfoComponent } from './organisation-info.component';
import { ActivatedRoute } from '@angular/router';
import { OrganisationsService } from '@modules/shared/services/organisations.service';
import { of, throwError } from 'rxjs';


describe('FeatureModules/Admin/Pages/ServiceUsers/PageAdminOrganisationInfoComponent', () => {

  let component: PageAdminOrganisationInfoComponent;
  let fixture: ComponentFixture<PageAdminOrganisationInfoComponent>;
  let activatedRoute: ActivatedRoute;
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
    activatedRoute = TestBed.inject(ActivatedRoute);
    organisationsService = TestBed.inject(OrganisationsService);
  });


  it('should create the component', () => {
    fixture = TestBed.createComponent(PageAdminOrganisationInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should NOT have default information loaded', () => {

    organisationsService.getOrganisation = () => throwError('error');

    fixture = TestBed.createComponent(PageAdminOrganisationInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.pageStatus).toBe('ERROR');

  });


  it('should have default information loaded', () => {

    organisationsService.getOrganisation = () => of({ id: 'OrgId', name: 'Org name', acronym: 'ORG', organisationUnits: [{ id: 'OrgUnitId', name: 'Org Unit name', acronym: 'ORGu' }] });

    fixture = TestBed.createComponent(PageAdminOrganisationInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.pageStatus).toBe('READY');

  });

  it('should show "updateOrganisationSuccess" warning', () => {

    activatedRoute.snapshot.params = { orgId: 'Org01' };
    activatedRoute.snapshot.queryParams = { alert: 'updateOrganisationSuccess' };

    const expected = { type: 'SUCCESS', title: 'You\'ve successfully updated the organisation.' };

    fixture = TestBed.createComponent(PageAdminOrganisationInfoComponent);
    component = fixture.componentInstance;
    expect(component.alert).toEqual(expected);

  });
  it('should show "updateUnitSuccess" warning', () => {

    activatedRoute.snapshot.params = { orgId: 'Org01' };
    activatedRoute.snapshot.queryParams = { alert: 'updateUnitSuccess' };

    const expected = { type: 'SUCCESS', title: 'You\'ve successfully updated the organisation unit.' };

    fixture = TestBed.createComponent(PageAdminOrganisationInfoComponent);
    component = fixture.componentInstance;
    expect(component.alert).toEqual(expected);

  });


  it('should run onShowHideClicked() and do nothing because organisations do not exists', () => {

    fixture = TestBed.createComponent(PageAdminOrganisationInfoComponent);
    component = fixture.componentInstance;
    component.organisation = {
      id: 'orgId', name: 'Org name', acronym: 'ORG',
      organisationUnits: [
        {
          id: 'Unit01',
          name: 'Unit name',
          acronym: 'UNT',
          showHideStatus: 'closed',
          showHideText: 'Hide users',
          showHideDescription: 'that belong to the Org name',
          isLoading: false,
          users: []
        }
      ]

    };

    component.onShowHideClicked('invalidOrg');
    expect(component.organisation.organisationUnits[0].showHideStatus).toEqual('closed');

  });

  it('should run onShowHideClicked() when organisations is closed', () => {

    fixture = TestBed.createComponent(PageAdminOrganisationInfoComponent);
    component = fixture.componentInstance;
    component.organisation = {
      id: 'orgId01', name: 'Org name', acronym: 'ORG',
      organisationUnits: [
        {
          id: 'Unit01',
          name: 'Unit name',
          acronym: 'UNT',
          showHideStatus: 'closed',
          showHideText: 'show users',
          showHideDescription: 'that belong to the Org name',
          isLoading: false,
          users: []
        }
      ]

    };
    organisationsService.getUsersByUnitId = () => of([
      {
        id: 'user01',
        name: 'user01',
        role: 'ACCESSOR',
        roleDescription: 'Accessor'
      }
    ]);

    component.onShowHideClicked('Unit01');
    expect(component.organisation.organisationUnits[0].showHideStatus).toEqual('opened');

  });
  it('should throw error when getUsersByUnitId() called', () => {

    fixture = TestBed.createComponent(PageAdminOrganisationInfoComponent);
    component = fixture.componentInstance;
    component.organisation = {
      id: 'orgId01', name: 'Org name', acronym: 'ORG',
      organisationUnits: [
        {
          id: 'Unit01',
          name: 'Unit name',
          acronym: 'UNT',
          showHideStatus: 'closed',
          showHideText: 'show users',
          showHideDescription: 'that belong to the Org name',
          isLoading: false,
          users: []
        }
      ]

    };
    organisationsService.getUsersByUnitId = () => throwError('error');

    const expected = {
      type: 'ERROR',
      title: 'Unable to fetch organisation users information',
      message: 'Please try again or contact us for further help'
    };

    component.onShowHideClicked('Unit01');
    expect(component.alert).toEqual(expected);

  });

  it('should run onShowHideClicked() when organisation is opened', () => {

    fixture = TestBed.createComponent(PageAdminOrganisationInfoComponent);
    component = fixture.componentInstance;
    component.organisation = {
      id: 'orgId01', name: 'Org name', acronym: 'ORG',
      organisationUnits: [
        {
          id: 'Unit01',
          name: 'Unit name',
          acronym: 'UNT',
          showHideStatus: 'opened',
          showHideText: 'Hide users',
          showHideDescription: 'that belong to the Org name',
          isLoading: false,
          users: []
        }
      ]

    };

    component.onShowHideClicked('Unit01');
    expect(component.organisation.organisationUnits[0].showHideStatus).toEqual('closed');

  });

  it('should run onShowHideClicked() when organisation hide status is hidden', () => {

    fixture = TestBed.createComponent(PageAdminOrganisationInfoComponent);
    component = fixture.componentInstance;
    component.organisation = {
      id: 'orgId01', name: 'Org name', acronym: 'ORG',
      organisationUnits: [
        {
          id: 'Unit01',
          name: 'Unit name',
          acronym: 'UNT',
          showHideStatus: 'hidden',
          showHideText: 'Hide users',
          showHideDescription: 'that belong to the Org name',
          isLoading: false,
          users: []
        }
      ]

    };

    component.onShowHideClicked('Unit01');
    expect(component.organisation.organisationUnits[0].showHideStatus).toEqual('hidden');

  });
});
