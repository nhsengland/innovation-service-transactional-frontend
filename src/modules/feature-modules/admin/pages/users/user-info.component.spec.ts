import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule } from '@modules/stores';

import { AccessorOrganisationRoleEnum, InnovatorOrganisationRoleEnum, UserRoleEnum } from '@app/base/enums';

import { AdminModule } from '@modules/feature-modules/admin/admin.module';
import { PageUserInfoComponent } from './user-info.component';
import { getUserFullInfoDTO, UsersService } from '@modules/shared/services/users.service';
import { AlertType } from '@app/base/types';
import { OrganisationsService } from '@modules/shared/services/organisations.service';



describe('FeatureModules/Admin/Pages/Users/PageUserInfoComponent', () => {

  let activatedRoute: ActivatedRoute;

  let usersService: UsersService;
  let organisationsService: OrganisationsService;

  let component: PageUserInfoComponent;
  let fixture: ComponentFixture<PageUserInfoComponent>;

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


    usersService = TestBed.inject(UsersService);
    organisationsService = TestBed.inject(OrganisationsService);

    activatedRoute.snapshot.params = { userId: 'User01' };
    activatedRoute.snapshot.data = { user: { userId: 'User01', displayName: 'User Name' } };

  });


  it('should create the component', () => {
    fixture = TestBed.createComponent(PageUserInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should show "userCreationSuccess" alert', () => {

    activatedRoute.snapshot.queryParams = { alert: 'userCreationSuccess' };

    const expected: AlertType = { type: 'SUCCESS', title: 'A new user has been added to the service', setFocus: true };

    fixture = TestBed.createComponent(PageUserInfoComponent);
    component = fixture.componentInstance;
    expect(component.alert).toEqual(expected);

  });

  it('should show "lockSuccess" warning', () => {

    activatedRoute.snapshot.queryParams = { alert: 'lockSuccess' };

    const expected: AlertType = { type: 'SUCCESS', title: 'User locked successfully', setFocus: true };

    fixture = TestBed.createComponent(PageUserInfoComponent);
    component = fixture.componentInstance;
    expect(component.alert).toEqual(expected);

  });

  it('should show "unlockSuccess" warning', () => {

    activatedRoute.snapshot.queryParams = { alert: 'unlockSuccess' };

    const expected: AlertType = { type: 'SUCCESS', title: 'User unlocked successfully', setFocus: true };

    fixture = TestBed.createComponent(PageUserInfoComponent);
    component = fixture.componentInstance;
    expect(component.alert).toEqual(expected);

  });

  it('should show "roleChangeSuccess" warning', () => {

    activatedRoute.snapshot.queryParams = { alert: 'roleChangeSuccess' };

    const expected: AlertType = { type: 'SUCCESS', title: 'User role changed successfully', setFocus: true };

    fixture = TestBed.createComponent(PageUserInfoComponent);
    component = fixture.componentInstance;
    expect(component.alert).toEqual(expected);

  });

  it('should show "unitChangeSuccess" warning', () => {

    activatedRoute.snapshot.queryParams = { alert: 'unitChangeSuccess' };

    const expected: AlertType = { type: 'SUCCESS', title: 'Organisation unit has been successfully changed', setFocus: true };

    fixture = TestBed.createComponent(PageUserInfoComponent);
    component = fixture.componentInstance;
    expect(component.alert).toEqual(expected);

  });

/*   it('should have initial information loaded with payload 01', () => {

    activatedRoute.snapshot.params = { innovationId: 'Inno01', actionId: 'Action01' };

    const responseMock: getUserFullInfoDTO = {
      id: 'User01',
      email: 'user@email.com',
      displayName: 'User name',
      phone: null,
      type: UserRoleEnum.ACCESSOR,
      lockedAt: null,
      innovations: [{ id: 'inn1', name: 'innovation' }],
      userOrganisations: [
        { id: 'Org01', name: 'Org Name', size: '10 to 20', isShadow: false, role: AccessorOrganisationRoleEnum.QUALIFYING_ACCESSOR, units: [{ id: 'orgUnitId01', name: 'Org Unit name 01', acronym: 'ORGu01', supportCount: 2 }] }
      ]
    };

    usersService.getUserFullInfo = () => of(responseMock);

    organisationsService.getOrganisationsList = () => of([
      {
        id: 'Org01', name: 'Org name 01', acronym: 'ORG01', isActive: true,
        organisationUnits: [
          { id: 'orgUnitId01', name: 'Org Unit name 01', acronym: 'ORGu01', isActive: true },
          { id: 'orgUnitId02', name: 'Org Unit name 02', acronym: 'ORGu02', isActive: true },
          { id: 'orgUnitId03', name: 'Org Unit name 03', acronym: 'ORGu03', isActive: true }
        ]
      },
      {
        id: 'Org02', name: 'Org name 02', acronym: 'ORG02', isActive: true,
        organisationUnits: [
          { id: 'orgUnitId02', name: 'Org Unit name 02', acronym: 'ORGu02', isActive: true },
          { id: 'orgUnitId03', name: 'Org Unit name 03', acronym: 'ORGu03', isActive: true }
        ]
      }
    ]);

    fixture = TestBed.createComponent(PageUserInfoComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.titleActions.length).toBe(2);


  });

  it('should have initial information loaded with payload 02', () => {

    const responseMock: getUserFullInfoDTO = {
      id: 'User01',
      email: 'user@email.com',
      displayName: 'User name',
      phone: '12345',
      type: UserRoleEnum.INNOVATOR,
      lockedAt: '2020-01-01T00:00:00.000Z',
      innovations: [{ id: 'inn1', name: 'innovation' }],
      userOrganisations: [
        { id: 'Org01', name: 'Org Name', size: '10 to 20', isShadow: true, role: InnovatorOrganisationRoleEnum.INNOVATOR_OWNER, units: [{ id: 'orgUnitId01', name: 'Org Unit name 01', acronym: 'ORGu01', supportCount: 2 }] }
      ]
    };

    usersService.getUserFullInfo = () => of(responseMock);

    organisationsService.getOrganisationsList = () => of([
      {
        id: 'Org01', name: 'Org name 01', acronym: 'ORG01', isActive: true,
        organisationUnits: [
          { id: 'orgUnitId01', name: 'Org Unit name 01', acronym: 'ORGu01', isActive: true },
          { id: 'orgUnitId02', name: 'Org Unit name 02', acronym: 'ORGu02', isActive: true },
          { id: 'orgUnitId03', name: 'Org Unit name 03', acronym: 'ORGu03', isActive: true }
        ]
      },
      {
        id: 'Org02', name: 'Org name 02', acronym: 'ORG02', isActive: true,
        organisationUnits: [
          { id: 'orgUnitId02', name: 'Org Unit name 02', acronym: 'ORGu02', isActive: true },
          { id: 'orgUnitId03', name: 'Org Unit name 03', acronym: 'ORGu03', isActive: true }
        ]
      }
    ]);

    const expected = 'User name';

    fixture = TestBed.createComponent(PageUserInfoComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.sections.userInfo[0].value).toBe(expected);

  });

  it('should have initial information loaded with payload 03', () => {

    activatedRoute.snapshot.params = { innovationId: 'Inno01', actionId: 'Action01' };

    const responseMock: getUserFullInfoDTO = {
      id: 'User01',
      email: 'user@email.com',
      displayName: 'User name',
      phone: '12345',
      type: UserRoleEnum.INNOVATOR,
      lockedAt: null,
      innovations: [{ id: 'inn1', name: 'innovation' }],
      userOrganisations: [
        { id: 'Org01', name: 'Org Name', size: '10 to 20', isShadow: false, role: InnovatorOrganisationRoleEnum.INNOVATOR_OWNER, units: [{ id: 'orgUnitId01', name: 'Org Unit name 01', acronym: 'ORGu01', supportCount: 2 }] }
      ]
    };
    usersService.getUserFullInfo = () => of(responseMock);
    organisationsService.getOrganisationsList = () => of([
      {
        id: 'Org01', name: 'Org name 01', acronym: 'ORG01', isActive: true,
        organisationUnits: [
          { id: 'orgUnitId01', name: 'Org Unit name 01', acronym: 'ORGu01', isActive: true },
          { id: 'orgUnitId02', name: 'Org Unit name 02', acronym: 'ORGu02', isActive: true },
          { id: 'orgUnitId03', name: 'Org Unit name 03', acronym: 'ORGu03', isActive: true }
        ]
      },
      {
        id: 'Org02', name: 'Org name 02', acronym: 'ORG02', isActive: true,
        organisationUnits: [
          { id: 'orgUnitId02', name: 'Org Unit name 02', acronym: 'ORGu02', isActive: true },
          { id: 'orgUnitId03', name: 'Org Unit name 03', acronym: 'ORGu03', isActive: true }
        ]
      }
    ]);
    const expected = 'innovation';

    fixture = TestBed.createComponent(PageUserInfoComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.sections.innovations[0]).toBe(expected);

  });

  it('should NOT have initial information loaded', () => {

    usersService.getUserFullInfo = () => throwError('error');

    fixture = TestBed.createComponent(PageUserInfoComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.alert.type).toBe('ERROR');

  }); */

});
