import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Injector, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { of } from 'rxjs';

import { AppInjector, CoreModule } from '@modules/core';
import { AdminModule } from '@modules/feature-modules/admin/admin.module';
import { CtxStore, StoresModule } from '@modules/stores';

import { AdminUsersService } from '@modules/feature-modules/admin/services/users.service';
import { OrganisationsService } from '@modules/shared/services/organisations.service';
import { PageUserNewComponent } from './user-new.component';
import { UserContextStore } from '@modules/stores/ctx/user/user.store';
import { getStrategicRolesEditStep } from './user-new.config';
import { UserRoleEnum } from '@app/base/enums';

describe('FeatureModules/Admin/Pages/AdminUsers/PageAdminUserNewComponent', () => {
  let component: PageUserNewComponent;
  let fixture: ComponentFixture<PageUserNewComponent>;
  let router: Router;
  let routerSpy: jest.SpyInstance;

  let ctx: CtxStore;
  let userCtx: UserContextStore;
  let usersService: AdminUsersService;
  let organisationsService: OrganisationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterModule.forRoot([]), CoreModule, StoresModule, AdminModule]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    router = TestBed.inject(Router);
    routerSpy = jest.spyOn(router, 'navigate');

    usersService = TestBed.inject(AdminUsersService);
    organisationsService = TestBed.inject(OrganisationsService);
    ctx = TestBed.inject(CtxStore);
    userCtx = TestBed.inject(UserContextStore);
    userCtx.getRoleDescription = signal('ADMIN');
    ctx.user.getRoleDescription = userCtx.getRoleDescription;

    organisationsService.getOrganisationsList = () =>
      of([
        {
          id: 'orgId',
          acronym: 'orgId01',
          name: 'Org name 01',
          isActive: true,
          organisationUnits: [{ id: 'orgId', acronym: 'orgId01', name: 'Org name 01', isActive: true }]
        },
        {
          id: 'orgId',
          acronym: 'orgId02',
          name: 'Org name 02',
          isActive: true,
          organisationUnits: [{ id: 'orgId', acronym: 'orgId01', name: 'Org name 01', isActive: true }]
        }
      ]);
  });

  it('should create the component', () => {
    fixture = TestBed.createComponent(PageUserNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should calculate the strategic roles summary edit step from runtime steps', () => {
    fixture = TestBed.createComponent(PageUserNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.wizard
      .setAnswers({
        contextType: 'BASE',
        role: UserRoleEnum.ACCESSOR,
        organisationId: 'orgId',
        organisations: [{ id: 'orgId', name: 'Org name 01', units: [{ id: 'orgId', name: 'Unit name' }] }]
      })
      .runRules();

    expect(getStrategicRolesEditStep(component.wizard.steps)).toBe(6);
  });
});
