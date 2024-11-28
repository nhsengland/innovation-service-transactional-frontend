import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { of } from 'rxjs';

import { CoreModule, AppInjector } from '@modules/core';
import { CtxStore, StoresModule } from '@modules/stores';
import { AdminModule } from '@modules/feature-modules/admin/admin.module';

import { WizardOrganisationUnitActivateComponent } from './organisation-unit-activate.component';

import { OrganisationsService } from '@modules/shared/services/organisations.service';
import { UserContextStore } from '@modules/stores/ctx/user/user.store';
import { UserContextService } from '@modules/stores/ctx/user/user.service';

describe('FeatureModules/Admin/Wizards//WizardOrganisationUnitActivateComponent', () => {
  let activatedRoute: ActivatedRoute;
  let router: Router;
  let routerSpy: jest.SpyInstance;

  let organisationsService: OrganisationsService;

  let component: WizardOrganisationUnitActivateComponent;
  let fixture: ComponentFixture<WizardOrganisationUnitActivateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterModule.forRoot([]), CoreModule, StoresModule, AdminModule],
      providers: [CtxStore, UserContextStore, UserContextService]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    activatedRoute = TestBed.inject(ActivatedRoute);
    router = TestBed.inject(Router);
    routerSpy = jest.spyOn(router, 'navigate');

    organisationsService = TestBed.inject(OrganisationsService);

    activatedRoute.snapshot.params = { organisationId: '_org01', organisationUnitId: '_orgUnit01' };

    organisationsService.getOrganisationUnitInfo = () =>
      of({
        id: '_org01',
        name: 'Org name',
        acronym: 'ORG',
        isActive: true,
        canActivate: false
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
