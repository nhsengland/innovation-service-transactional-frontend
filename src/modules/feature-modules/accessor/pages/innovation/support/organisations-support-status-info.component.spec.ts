import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AppInjector, CoreModule } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { AccessorModule } from '@modules/feature-modules/accessor/accessor.module';

import { InnovationSupportOrganisationsSupportStatusInfoComponent } from './organisations-support-status-info.component';

import { AccessorService } from '@modules/feature-modules/accessor/services/accessor.service';

import { OrganisationsService } from '@shared-module/services/organisations.service';


describe('FeatureModules/Accessor/Innovation/Support/InnovationSupportOrganisationsSupportStatusInfoComponent', () => {

  let activatedRoute: ActivatedRoute;

  let accessorService: AccessorService;
  let organisationsService: OrganisationsService;

  let component: InnovationSupportOrganisationsSupportStatusInfoComponent;
  let fixture: ComponentFixture<InnovationSupportOrganisationsSupportStatusInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        CoreModule,
        StoresModule,
        AccessorModule
      ]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    activatedRoute = TestBed.inject(ActivatedRoute);

    accessorService = TestBed.inject(AccessorService);
    organisationsService = TestBed.inject(OrganisationsService);

    activatedRoute.snapshot.params = { innovationId: 'Inno01' };
    activatedRoute.snapshot.data = { innovationData: { id: 'Inno01', name: 'Innovation 01', support: { id: 'Inno01Support01', status: 'ENGAGING' }, assessment: {} } };

  });


  it('should create the component', () => {
    fixture = TestBed.createComponent(InnovationSupportOrganisationsSupportStatusInfoComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should have initial information loaded with payload 01 (Organisations with NO organisations units)', () => {

    organisationsService.getOrganisationUnits = () => of([{ id: 'orgId', name: 'Org name', acronym: 'ORG', organisationUnits: [] }]);
    accessorService.getInnovationSupports = () => of([]);

    const expected = {
      info: { id: 'orgId', name: 'Org name', acronym: 'ORG', organisationUnits: [] },
      showHideStatus: 'closed',
      showHideText: null,
      showHideDescription: 'that belong to the Org name'
    };

    fixture = TestBed.createComponent(InnovationSupportOrganisationsSupportStatusInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.organisations[0]).toEqual(expected);

  });

  it('should have initial information loaded with payload 02 (Organisations with ONE organisation unit AND mathing organisation support)', () => {

    organisationsService.getOrganisationUnits = () => of([{
      id: 'orgId', name: 'Org name', acronym: 'ORG',
      organisationUnits: [{ id: 'orgUnitId', name: 'Org Unit name', acronym: 'ORGu' }]
    }]);

    accessorService.getInnovationSupports = () => of([{
      id: 'SupportId01', status: 'ENGAGING',
      organisationUnit: {
        id: 'orgId', name: 'Org Unit name',
        organisation: { id: 'orgId', name: 'Org name', acronym: 'ORG' }
      }
    }]);

    const expected = {
      info: { id: 'orgId', name: 'Org name', acronym: 'ORG', organisationUnits: [], status: 'ENGAGING' },
      showHideStatus: 'hidden',
      showHideText: null,
      showHideDescription: null
    };

    fixture = TestBed.createComponent(InnovationSupportOrganisationsSupportStatusInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.organisations[0]).toEqual(expected);

  });

  it('should have initial information loaded with payload 03 (Organisations with ONE organisation unit AND NO mathing organisation support)', () => {

    organisationsService.getOrganisationUnits = () => of([{
      id: 'orgId', name: 'Org name', acronym: 'ORG',
      organisationUnits: [{ id: 'orgUnitId', name: 'Org Unit name', acronym: 'ORGu' }]
    }]);

    accessorService.getInnovationSupports = () => of([{
      id: 'SupportId01', status: 'ENGAGING',
      organisationUnit: {
        id: 'UnknownOrgUnitId', name: 'Org Unit name',
        organisation: { id: 'orgId', name: 'Org name', acronym: 'ORG' }
      }
    }]);

    const expected = {
      info: { id: 'orgId', name: 'Org name', acronym: 'ORG', organisationUnits: [], status: 'UNASSIGNED' },
      showHideStatus: 'hidden',
      showHideText: null,
      showHideDescription: null
    };

    fixture = TestBed.createComponent(InnovationSupportOrganisationsSupportStatusInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.organisations[0]).toEqual(expected);

  });

  it('should have initial information loaded with payload 04 (Organisations with MORE THAN ONE organisation unit)', () => {

    organisationsService.getOrganisationUnits = () => of([{
      id: 'orgId', name: 'Org name', acronym: 'ORG',
      organisationUnits: [
        { id: 'orgUnitId01', name: 'Org Unit name 01', acronym: 'ORGu01' },
        { id: 'orgUnitId02', name: 'Org Unit name 02', acronym: 'ORGu02' }
      ]
    }]);

    accessorService.getInnovationSupports = () => of([
      {
        id: 'SupportId01', status: 'ENGAGING',
        organisationUnit: {
          id: 'orgUnitId01', name: 'Org Unit name',
          organisation: { id: 'orgId', name: 'Org name', acronym: 'ORG' }
        }
      },
      {
        id: 'SupportId02', status: 'ENGAGING',
        organisationUnit: {
          id: 'UnknownOrgUnitId', name: 'Org Unit name',
          organisation: { id: 'orgId', name: 'Org name', acronym: 'ORG' }
        }
      }
    ]);

    const expected = {
      info: {
        id: 'orgId', name: 'Org name', acronym: 'ORG',
        organisationUnits: [
          { id: 'orgUnitId01', name: 'Org Unit name 01', acronym: 'ORGu01', status: 'ENGAGING' },
          { id: 'orgUnitId02', name: 'Org Unit name 02', acronym: 'ORGu02', status: 'UNASSIGNED' }
        ]
      },
      showHideStatus: 'closed',
      showHideText: 'Show 2 units',
      showHideDescription: 'that belong to the Org name'
    };

    fixture = TestBed.createComponent(InnovationSupportOrganisationsSupportStatusInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.organisations[0]).toEqual(expected);

  });

  it('should NOT have initial information loaded', () => {

    organisationsService.getOrganisationUnits = () => throwError('error');
    accessorService.getInnovationSupports = () => throwError('error');

    fixture = TestBed.createComponent(InnovationSupportOrganisationsSupportStatusInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.organisations.length).toBe(0);

  });

  it('should run onShowHideClicked() and do nothing because organisations do not exists', () => {

    fixture = TestBed.createComponent(InnovationSupportOrganisationsSupportStatusInfoComponent);
    component = fixture.componentInstance;
    component.organisations = [{
      info: {
        id: 'orgId', name: 'Org name', acronym: 'ORG',
        organisationUnits: []
      },
      showHideStatus: 'opened',
      showHideText: 'Hide 0 units',
      showHideDescription: 'that belong to the Org name'
    }];

    component.onShowHideClicked('invalidOrg');
    expect(component.organisations[0].showHideStatus).toEqual('opened');

  });

  it('should run onShowHideClicked() when organisations is opened', () => {

    fixture = TestBed.createComponent(InnovationSupportOrganisationsSupportStatusInfoComponent);
    component = fixture.componentInstance;
    component.organisations = [{
      info: {
        id: 'orgId', name: 'Org name', acronym: 'ORG',
        organisationUnits: []
      },
      showHideStatus: 'opened',
      showHideText: 'Hide 0 units',
      showHideDescription: 'that belong to the Org name'
    }];

    component.onShowHideClicked('orgId');
    expect(component.organisations[0].showHideStatus).toEqual('closed');

  });

  it('should run onShowHideClicked() when organisation is closed', () => {

    fixture = TestBed.createComponent(InnovationSupportOrganisationsSupportStatusInfoComponent);
    component = fixture.componentInstance;
    component.organisations = [{
      info: {
        id: 'orgId', name: 'Org name', acronym: 'ORG',
        organisationUnits: []
      },
      showHideStatus: 'closed',
      showHideText: 'Show 0 units',
      showHideDescription: 'that belong to the Org name'
    }];

    component.onShowHideClicked('orgId');
    expect(component.organisations[0].showHideStatus).toEqual('opened');

  });

});
