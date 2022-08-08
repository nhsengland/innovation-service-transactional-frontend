import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';


import { Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { AdminModule } from '@modules/feature-modules/admin/admin.module';

import { WizardOrganisationUnitInactivateComponent } from './organisation-unit-inactivate.component';
import { WizardOrganisationUnitInactivateUsersStepComponent } from './steps/users-step.component';
import { WizardOrganisationUnitInactivateInnovationsStepComponent } from './steps/innovations-step.component';
import { WizardSummaryWithConfirmStepComponent } from '@modules/shared/wizards/steps/summary-with-confirm-step.component';

import { OrganisationsService } from '@modules/shared/services/organisations.service';


describe('FeatureModules/Admin/Wizards//WizardOrganisationUnitInactivateComponent', () => {

  // let activatedRoute: ActivatedRoute;

  let component: WizardOrganisationUnitInactivateComponent;
  let fixture: ComponentFixture<WizardOrganisationUnitInactivateComponent>;

  // let organisationsService: OrganisationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        CoreModule,
        StoresModule,
        AdminModule
      ]
    }).overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [
          WizardOrganisationUnitInactivateUsersStepComponent,
          WizardOrganisationUnitInactivateInnovationsStepComponent,
          WizardSummaryWithConfirmStepComponent
        ]
      }
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    // activatedRoute = TestBed.inject(ActivatedRoute);

    // organisationsService = TestBed.inject(OrganisationsService);

  });


  it('should create the component', () => {
    fixture = TestBed.createComponent(WizardOrganisationUnitInactivateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

});
