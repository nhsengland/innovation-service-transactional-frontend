import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { AdminModule } from '@modules/feature-modules/admin/admin.module';

import { WizardOrganisationUnitInactivateComponent } from './organisation-unit-inactivate.component';
import { WizardOrganisationUnitInactivateUsersStepComponent } from './steps/users-step.component';
import { WizardOrganisationUnitInactivateInnovationsStepComponent } from './steps/innovations-step.component';
import { WizardSummaryWithConfirmStepComponent } from '@modules/shared/wizards/steps/summary-with-confirm-step.component';
import { RouterModule } from '@angular/router';

describe('FeatureModules/Admin/Wizards//WizardOrganisationUnitInactivateComponent', () => {
  let component: WizardOrganisationUnitInactivateComponent;
  let fixture: ComponentFixture<WizardOrganisationUnitInactivateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterModule.forRoot([]), CoreModule, StoresModule, AdminModule]
    });

    AppInjector.setInjector(TestBed.inject(Injector));
  });

  it('should create the component', () => {
    fixture = TestBed.createComponent(WizardOrganisationUnitInactivateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
