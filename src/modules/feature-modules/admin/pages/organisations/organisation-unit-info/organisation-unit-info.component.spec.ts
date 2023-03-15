import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Injector } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AppInjector, CoreModule } from '@modules/core';
import { AdminModule } from '@modules/feature-modules/admin/admin.module';
import { InnovationsService } from '@modules/shared/services/innovations.service';
import { OrganisationsService } from '@modules/shared/services/organisations.service';
import { StoresModule } from '@modules/stores';

import { PageOrganisationUnitInfoComponent } from './organisation-unit-info.component';

describe('FeatureModules/Admin/Pages/Organisations/PageOrganisationUnitInfoComponent', () => {
  let activatedRoute: ActivatedRoute;

  let organisationsService: OrganisationsService;
  let innovationsService: InnovationsService;

  let component: PageOrganisationUnitInfoComponent;
  let fixture: ComponentFixture<PageOrganisationUnitInfoComponent>;

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
    innovationsService = TestBed.inject(InnovationsService);
  });


  it('should create the component', () => {
    fixture = TestBed.createComponent(PageOrganisationUnitInfoComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
