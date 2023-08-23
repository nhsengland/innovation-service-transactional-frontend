import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { of, throwError } from 'rxjs';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { AdminModule } from '@modules/feature-modules/admin/admin.module';

import { PageOrganisationsListComponent } from './organisations-list.component';
import { OrganisationsService } from '@modules/shared/services/organisations.service';
import { AlertType } from '@app/base/types';


describe('FeatureModules/Admin/Pages/Organisations/PageOrganisationsListComponent', () => {

  let organisationsService: OrganisationsService;

  let component: PageOrganisationsListComponent;
  let fixture: ComponentFixture<PageOrganisationsListComponent>;

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

    organisationsService = TestBed.inject(OrganisationsService);

  });


  it('should create the component', () => {
    fixture = TestBed.createComponent(PageOrganisationsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });


  it('should have initial information loaded with payload 01 (Organisations with NO organisations units)', () => {

    organisationsService.getOrganisationsList = () => of([{ id: 'orgId', name: 'Org name', acronym: 'ORG', isActive: true, organisationUnits: [] }]);

    const expected = {
      info: { id: 'orgId', name: 'Org name', acronym: 'ORG', isActive: true, organisationUnits: [] },
      unitText: null
    };

    fixture = TestBed.createComponent(PageOrganisationsListComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.organisations[0]).toEqual(expected);

  });


  it('should have initial information loaded with payload 02 (Organisations with MORE THAN ONE organisation unit)', () => {

    organisationsService.getOrganisationsList = () => of([{
      id: 'orgId', name: 'Org name', acronym: 'ORG', isActive: true,
      organisationUnits: [
        { id: 'orgUnitId01', name: 'Org Unit name 01', acronym: 'ORGu01', isActive: true },
        { id: 'orgUnitId02', name: 'Org Unit name 02', acronym: 'ORGu02', isActive: true }
      ]
    }]);

    const expected = {
      info: {
        id: 'orgId', name: 'Org name', acronym: 'ORG', isActive: true,
        organisationUnits: [
          { id: 'orgUnitId01', name: 'Org Unit name 01', acronym: 'ORGu01', isActive: true },
          { id: 'orgUnitId02', name: 'Org Unit name 02', acronym: 'ORGu02', isActive: true }
        ]
      },
      unitText: '2 units attached',
    };

    fixture = TestBed.createComponent(PageOrganisationsListComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.organisations[0]).toEqual(expected);

  });


  it('should have initial information loaded with payload 03 (Organisations with ONE organisation unit)', () => {

    organisationsService.getOrganisationsList = () => of([{
      id: 'orgId', name: 'Org name', acronym: 'ORG', isActive: true,
      organisationUnits: [{ id: 'orgUnitId', name: 'Org Unit name', acronym: 'ORGu', isActive: true }]
    }]);

    const expected = {
      info: { id: 'orgId', name: 'Org name', acronym: 'ORG', isActive: true, organisationUnits: [{ id: 'orgUnitId', name: 'Org Unit name', acronym: 'ORGu', isActive: true }] },
      unitText: '1 unit attached'
    };

    fixture = TestBed.createComponent(PageOrganisationsListComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.organisations[0]).toEqual(expected);

  });


  it('should NOT load initial data', () => {

    organisationsService.getOrganisationsList = () => throwError(() => new Error());

    const expected: AlertType = { type: 'ERROR', title: 'There is a problem', message: 'Unable to fetch organisations information', setFocus: true };

    fixture = TestBed.createComponent(PageOrganisationsListComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.alert).toEqual(expected);

  });
});
