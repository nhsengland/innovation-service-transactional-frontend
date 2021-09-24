import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AppInjector, CoreModule } from '@modules/core';
import { StoresModule, InnovationService } from '@modules/stores';
import { INNOVATION_SUPPORT_STATUS } from '@modules/stores/innovation/innovation.models';
import { InnovatorModule } from '@modules/feature-modules/innovator/innovator.module';

import { InnovationDataSharingComponent } from './data-sharing.component';

import { InnovatorService } from '@modules/feature-modules/innovator/services/innovator.service';

import { OrganisationsService } from '@shared-module/services/organisations.service';


describe('FeatureModules/Innovator/Pages/Innovation/DataSharingComponent', () => {

  let activatedRoute: ActivatedRoute;

  let innovationService: InnovationService;
  let innovatorService: InnovatorService;
  let organisationsService: OrganisationsService;

  let component: InnovationDataSharingComponent;
  let fixture: ComponentFixture<InnovationDataSharingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        CoreModule,
        StoresModule,
        InnovatorModule
      ]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    activatedRoute = TestBed.inject(ActivatedRoute);

    innovationService = TestBed.inject(InnovationService);
    innovatorService = TestBed.inject(InnovatorService);
    organisationsService = TestBed.inject(OrganisationsService);

  });

  it('should create the component', () => {
    fixture = TestBed.createComponent(InnovationDataSharingComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should show "sharingUpdateSuccess" warning', () => {

    activatedRoute.snapshot.queryParams = { alert: 'sharingUpdateSuccess' };

    const expected = { type: 'SUCCESS', title: 'Data sharing preferences', message: 'Your data sharing preferences were changed.' };

    fixture = TestBed.createComponent(InnovationDataSharingComponent);
    component = fixture.componentInstance;
    expect(component.alert).toEqual(expected);

  });

  it('should show "sharingUpdateError" warning', () => {

    activatedRoute.snapshot.queryParams = { alert: 'sharingUpdateError' };

    const expected = { type: 'ERROR', title: 'An error occurred when updating data sharing preferences', message: 'Please try again or contact us for further help' };

    fixture = TestBed.createComponent(InnovationDataSharingComponent);
    component = fixture.componentInstance;
    expect(component.alert).toEqual(expected);

  });

  it('should have initial information loaded with payload 01 (Organisations with NO organisations units)', () => {

    organisationsService.getOrganisationUnits = () => of([{ id: 'orgId', name: 'Org name', acronym: 'ORG', organisationUnits: [] }]);
    innovatorService.getInnovationShares = () => of([]);
    innovatorService.getInnovationSupports = () => of([]);
    innovationService.getInnovationOrganisationSuggestions = () => of({
      assessment: { id: 'id', suggestedOrganisations: [] },
      accessors: []
    });

    const expected = {
      info: { id: 'orgId', name: 'Org name', acronym: 'ORG', organisationUnits: [] },
      shared: false,
      showHideStatus: 'closed',
      showHideText: null,
      showHideDescription: 'that belong to the Org name'
    };

    fixture = TestBed.createComponent(InnovationDataSharingComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.organisations[0]).toEqual(expected);

  });

  it('should have initial information loaded with payload 02 (Organisations with ONE organisation unit AND mathing organisation share)', () => {

    organisationsService.getOrganisationUnits = () => of([{
      id: 'orgId', name: 'Org name', acronym: 'ORG',
      organisationUnits: [{ id: 'orgUnitId', name: 'Org Unit name', acronym: 'ORGu' }]
    }]);

    innovatorService.getInnovationShares = () => of([
      { id: 'orgId', status: 'ENGAGING' as keyof typeof INNOVATION_SUPPORT_STATUS }
    ]);

    innovatorService.getInnovationSupports = () => of([{
      id: 'SupportId01', status: 'ENGAGING',
      organisationUnit: {
        id: 'orgId', name: 'Org Unit name',
        organisation: { id: 'orgId', name: 'Org name', acronym: 'ORG' }
      }
    }]);

    innovationService.getInnovationOrganisationSuggestions = () => of({
      assessment: { id: 'id', suggestedOrganisations: [] },
      accessors: []
    });

    const expected = {
      info: { id: 'orgId', name: 'Org name', acronym: 'ORG', organisationUnits: [], status: 'ENGAGING' },
      shared: true,
      showHideStatus: 'hidden',
      showHideText: null,
      showHideDescription: null
    };

    fixture = TestBed.createComponent(InnovationDataSharingComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.organisations[0]).toEqual(expected);

  });

  it('should have initial information loaded with payload 03 (Organisations with ONE organisation unit AND NO mathing organisation share)', () => {

    organisationsService.getOrganisationUnits = () => of([{
      id: 'orgId', name: 'Org name', acronym: 'ORG',
      organisationUnits: [{ id: 'orgUnitId', name: 'Org Unit name', acronym: 'ORGu' }]
    }]);

    innovatorService.getInnovationShares = () => of([]);

    innovatorService.getInnovationSupports = () => of([{
      id: 'SupportId01', status: 'ENGAGING',
      organisationUnit: {
        id: 'UnknownOrgUnitId', name: 'Org Unit name',
        organisation: { id: 'orgId', name: 'Org name', acronym: 'ORG' }
      }
    }]);

    innovationService.getInnovationOrganisationSuggestions = () => of({
      assessment: { id: 'id', suggestedOrganisations: [] },
      accessors: []
    });

    const expected = {
      info: { id: 'orgId', name: 'Org name', acronym: 'ORG', organisationUnits: [], status: 'UNASSIGNED' },
      shared: false,
      showHideStatus: 'hidden',
      showHideText: null,
      showHideDescription: null
    };

    fixture = TestBed.createComponent(InnovationDataSharingComponent);
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

    innovatorService.getInnovationShares = () => of([
      { id: 'orgId', status: 'ENGAGING' as keyof typeof INNOVATION_SUPPORT_STATUS }
    ]);

    innovatorService.getInnovationSupports = () => of([
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

    innovationService.getInnovationOrganisationSuggestions = () => of({
      assessment: { id: 'id', suggestedOrganisations: [] },
      accessors: []
    });

    const expected = {
      info: {
        id: 'orgId', name: 'Org name', acronym: 'ORG',
        organisationUnits: [
          { id: 'orgUnitId01', name: 'Org Unit name 01', acronym: 'ORGu01', status: 'ENGAGING' },
          { id: 'orgUnitId02', name: 'Org Unit name 02', acronym: 'ORGu02', status: 'UNASSIGNED' }
        ]
      },
      shared: true,
      showHideStatus: 'closed',
      showHideText: 'Show 2 units',
      showHideDescription: 'that belong to the Org name'
    };

    fixture = TestBed.createComponent(InnovationDataSharingComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.organisations[0]).toEqual(expected);

  });

  it('should NOT load initial data', () => {

    organisationsService.getOrganisationUnits = () => throwError(false);
    innovatorService.getInnovationShares = () => throwError(false);
    innovatorService.getInnovationSupports = () => throwError(false);
    innovationService.getInnovationOrganisationSuggestions = () => throwError(false);

    const expected = {
      type: 'ERROR',
      title: 'Unable to fetch data sharing information',
      message: 'Please try again or contact us for further help'
    };

    fixture = TestBed.createComponent(InnovationDataSharingComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.alert).toEqual(expected);

  });

  it('should run onShowHideClicked() and do nothing because organisations do not exists', () => {

    fixture = TestBed.createComponent(InnovationDataSharingComponent);
    component = fixture.componentInstance;
    component.organisations = [{
      info: {
        id: 'orgId', name: 'Org name', acronym: 'ORG',
        organisationUnits: []
      },
      shared: true,
      showHideStatus: 'opened',
      showHideText: 'Hide 0 units',
      showHideDescription: 'that belong to the Org name'
    }];

    component.onShowHideClicked('invalidOrg');
    expect(component.organisations[0].showHideStatus).toEqual('opened');

  });

  it('should run onShowHideClicked() when organisations is opened', () => {

    fixture = TestBed.createComponent(InnovationDataSharingComponent);
    component = fixture.componentInstance;
    component.organisations = [{
      info: {
        id: 'orgId', name: 'Org name', acronym: 'ORG',
        organisationUnits: []
      },
      shared: true,
      showHideStatus: 'opened',
      showHideText: 'Hide 0 units',
      showHideDescription: 'that belong to the Org name'
    }];

    component.onShowHideClicked('orgId');
    expect(component.organisations[0].showHideStatus).toEqual('closed');

  });

  it('should run onShowHideClicked() when organisation is closed', () => {

    fixture = TestBed.createComponent(InnovationDataSharingComponent);
    component = fixture.componentInstance;
    component.organisations = [{
      info: {
        id: 'orgId', name: 'Org name', acronym: 'ORG',
        organisationUnits: []
      },
      shared: true,
      showHideStatus: 'closed',
      showHideText: 'Show 0 units',
      showHideDescription: 'that belong to the Org name'
    }];

    component.onShowHideClicked('orgId');
    expect(component.organisations[0].showHideStatus).toEqual('opened');

  });

});
