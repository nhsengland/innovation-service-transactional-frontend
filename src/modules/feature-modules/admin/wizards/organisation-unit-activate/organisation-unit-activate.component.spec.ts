import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { AdminModule } from '@modules/feature-modules/admin/admin.module';

import { WizardOrganisationUnitActivateComponent } from './organisation-unit-activate.component';
import { WizardOrganisationUnitActivateUsersStepComponent } from './steps/users-step.component';
import { WizardSummaryWithConfirmStepComponent } from '@modules/shared/wizards/steps/summary-with-confirm-step.component';

import { OrganisationsService } from '@modules/shared/services/organisations.service';


describe('FeatureModules/Admin/Wizards//WizardOrganisationUnitActivateComponent', () => {

  let activatedRoute: ActivatedRoute;
  let router: Router;
  let routerSpy: jest.SpyInstance;


  let organisationsService: OrganisationsService;

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

    activatedRoute = TestBed.inject(ActivatedRoute);
    router = TestBed.inject(Router);
    routerSpy = jest.spyOn(router, 'navigate');

    organisationsService = TestBed.inject(OrganisationsService);

    activatedRoute.snapshot.params = { organisationId: '_org01', organisationUnitId: '_orgUnit01' };

    organisationsService.getOrganisationUnitInfo = () => of({
      id: '_org01', name: 'Org name', acronym: 'ORG', isActive: true, userCount: 10
    });

  });


  it('should create the component', () => {
    fixture = TestBed.createComponent(WizardOrganisationUnitActivateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });


  it('should have initial information loaded and wizard with initial steps', () => {

    const expected = {
      organisation: { id: '_org01' },
      organisationUnit: { id: '_orgUnit01', name: 'Org name' },
      usersStep: { agree: false, users: [] }
    };

    fixture = TestBed.createComponent(WizardOrganisationUnitActivateComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.wizard.data).toEqual(expected);

  });

});
