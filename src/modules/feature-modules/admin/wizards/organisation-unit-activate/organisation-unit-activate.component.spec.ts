import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { AdminModule } from '@modules/feature-modules/admin/admin.module';

import { WizardOrganisationUnitActivateComponent } from './organisation-unit-activate.component';
import { WizardOrganisationUnitActivateUsersStepComponent } from './steps/users-step.component';
import { WizardSummaryWithConfirmStepComponent } from '@modules/shared/wizards/steps/summary-with-confirm-step.component';


describe('FeatureModules/Admin/Wizards//WizardOrganisationUnitActivateComponent', () => {

  let component: WizardOrganisationUnitActivateComponent;
  let fixture: ComponentFixture<WizardOrganisationUnitActivateComponent>;

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
          WizardOrganisationUnitActivateUsersStepComponent,
          WizardSummaryWithConfirmStepComponent
        ]
      }
    });

    AppInjector.setInjector(TestBed.inject(Injector));

  });


  it('should create the component', () => {
    fixture = TestBed.createComponent(WizardOrganisationUnitActivateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

});
