import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

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
    fixture.detectChanges();
    expect(component).toBeTruthy();

  });


  it('should have initial information loaded', () => {

    organisationsService.getOrganisationUnits = () => of([{
      id: 'orgId', name: 'Org name', acronym: 'ORG',
      organisationUnits: [{ id: 'orgUnitId', name: 'Org Unit name', acronym: 'ORGu' }]
    }]);

    accessorService.getInnovationSupports = () => of([]);

    const expected = {
      info: {
        id: 'orgId', name: 'Org name', acronym: 'ORG',
        organisationUnits: [],
        status: 'UNASSIGNED'

      },
      showHideStatus: 'hidden',
      showHideText: null,
      showHideDescription: null
    };

    fixture = TestBed.createComponent(InnovationSupportOrganisationsSupportStatusInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.organisations[0]).toEqual(expected);

  });

});
