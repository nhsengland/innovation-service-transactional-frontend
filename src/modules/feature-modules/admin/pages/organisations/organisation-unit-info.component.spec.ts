import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Injector } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject, of, throwError } from 'rxjs';

import { UserRoleEnum } from '@app/base/enums';
import { AppInjector, CoreModule } from '@modules/core';
import { AdminModule } from '@modules/feature-modules/admin/admin.module';
import { InnovationsService } from '@modules/shared/services/innovations.service';
import { UsersService } from '@modules/shared/services/users.service';
import { StoresModule } from '@modules/stores';

import { OrganisationUnitInfoComponent } from './organisation-unit-info.component';

describe('Organisation unit complete user list', () => {
  let fixture: ComponentFixture<OrganisationUnitInfoComponent>;
  let component: OrganisationUnitInfoComponent;
  let users: jest.SpyInstance;

  const user = (id: string, isActive = true) => ({ id, name: `User ${id}`, email: `${id}@example.test`, isActive });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterModule.forRoot([]), CoreModule, StoresModule, AdminModule]
    });
    AppInjector.setInjector(TestBed.inject(Injector));
    TestBed.inject(ActivatedRoute).snapshot.data = {
      organisation: { id: 'organisation-id', name: 'Organisation', isActive: true },
      organisationUnit: { id: 'unit-id', name: 'Unit', isActive: true }
    };
    jest.spyOn(TestBed.inject(InnovationsService), 'getInnovationsList').mockReturnValue(of({ data: [], count: 0 }));
    users = jest.spyOn(TestBed.inject(UsersService), 'getUsersList');
  });

  function start() {
    fixture = TestBed.createComponent(OrganisationUnitInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it.each([0, 1, 499, 500])('keeps one request for an initial count of %s', count => {
    users.mockReturnValue(of({ data: Array.from({ length: count }, (_, i) => user(String(i))), count }));
    start();
    expect(users).toHaveBeenCalledTimes(1);
    expect(component.activeUsers).toHaveLength(count);
    expect(component.pageStatus()).toBe('READY');
  });

  it('loads users beyond 500 while retaining role, unit and email filters', () => {
    users
      .mockReturnValueOnce(of({ data: [user('first')], count: 501 }))
      .mockReturnValueOnce(of({ data: [user('last', false)], count: 501 }));
    start();
    expect(users.mock.calls.map(([request]) => request.queryParams.skip)).toEqual([0, 500]);
    for (const [request] of users.mock.calls) {
      expect(request.queryParams).toMatchObject({
        take: 500,
        filters: {
          userTypes: [UserRoleEnum.ACCESSOR, UserRoleEnum.QUALIFYING_ACCESSOR],
          organisationUnitId: 'unit-id',
          onlyActive: false,
          email: true
        }
      });
    }
    expect(component.activeUsers.map(item => item.id)).toEqual(['first']);
    expect(component.inactiveUsers.map(item => item.id)).toEqual(['last']);
  });

  it('continues past an empty hydrated page using the original SQL count', () => {
    users
      .mockReturnValueOnce(of({ data: [user('first')], count: 1001 }))
      .mockReturnValueOnce(of({ data: [], count: 2000 }))
      .mockReturnValueOnce(of({ data: [user('last')], count: 2000 }));
    start();
    expect(users.mock.calls.map(([request]) => request.queryParams.skip)).toEqual([0, 500, 1000]);
    expect(component.activeUsers.map(item => item.id)).toEqual(['first', 'last']);
  });

  it('does not duplicate a user repeated across page boundaries', () => {
    users
      .mockReturnValueOnce(of({ data: [user('same')], count: 501 }))
      .mockReturnValueOnce(of({ data: [user('same'), user('other')], count: 501 }));
    start();
    expect(component.activeUsers.map(item => item.id)).toEqual(['same', 'other']);
  });

  it('does not mark an incomplete list ready when a later page fails', () => {
    users
      .mockReturnValueOnce(of({ data: [user('first')], count: 501 }))
      .mockReturnValueOnce(throwError(() => new Error('Second page failed')));
    start();
    expect(component.pageStatus()).toBe('ERROR');
    expect(component.alert.type).toBe('ERROR');
    expect(component.activeUsers).toEqual([]);
  });

  it('cancels pending list work when the component is destroyed', () => {
    const pending = new Subject<{ data: ReturnType<typeof user>[]; count: number }>();
    users.mockReturnValue(pending);
    start();
    fixture.destroy();
    pending.next({ data: [user('first')], count: 501 });
    expect(users).toHaveBeenCalledTimes(1);
    expect(component.activeUsers).toEqual([]);
    pending.complete();
  });

  it.each([UserRoleEnum.ADMIN, UserRoleEnum.ASSESSMENT])('preserves the %s team filter on every page', role => {
    TestBed.inject(ActivatedRoute).snapshot.data = {};
    jest.spyOn(TestBed.inject(Router), 'url', 'get').mockReturnValue(`/admin/organisations/${role}`);
    users
      .mockReturnValueOnce(of({ data: [user('first')], count: 501 }))
      .mockReturnValueOnce(of({ data: [user('last')], count: 501 }));
    start();
    expect(users).toHaveBeenCalledTimes(2);
    for (const [request] of users.mock.calls) {
      expect(request.queryParams.filters.userTypes).toEqual([role]);
      expect(request.queryParams.filters.organisationUnitId).toBeUndefined();
    }
  });
});
