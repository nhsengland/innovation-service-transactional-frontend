import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';

import { EnvironmentVariablesStore } from '@modules/core';
import { UserContextService } from './user.service';
import { UserContextStore } from './user.store';
import { DomainUserContext, EMPTY_USER_INFO, UserInfo, UserRoleEnum } from './user.types';

describe('UserContextStore role restoration', () => {
  let store: UserContextStore;
  let user: UserInfo;
  const role = { id: 'role-1', role: UserRoleEnum.QUALIFYING_ACCESSOR };
  const saved: DomainUserContext = { id: 'user-1', roleId: role.id, type: UserRoleEnum.ACCESSOR };

  beforeEach(() => {
    localStorage.clear();
    user = { ...EMPTY_USER_INFO, id: saved.id, roles: [role] };
    TestBed.configureTestingModule({
      providers: [
        UserContextStore,
        { provide: EnvironmentVariablesStore, useValue: {} },
        { provide: UserContextService, useValue: { getUserInfo: () => of(user) } }
      ]
    });
    store = TestBed.inject(UserContextStore);
  });

  afterEach(() => localStorage.clear());

  function initialize(context: DomainUserContext | null = saved): void {
    if (context) {
      localStorage.setItem('userContext', JSON.stringify(context));
    }
    store.initializeAuthentication$();
    tick(100);
  }

  function expectContext(context: DomainUserContext | null): void {
    expect(store.getUserContext()).toEqual(context);
    expect(JSON.parse(localStorage.getItem('userContext') ?? 'null')).toEqual(context);
  }

  it.each([
    [UserRoleEnum.ACCESSOR, UserRoleEnum.QUALIFYING_ACCESSOR],
    [UserRoleEnum.QUALIFYING_ACCESSOR, UserRoleEnum.ACCESSOR]
  ])('refreshes a saved %s role to %s with the same ID', (oldRole, newRole) => {
    fakeAsync(() => {
      user.roles = [{ ...role, role: newRole }];
      initialize({ ...saved, type: oldRole });
      expectContext({ ...saved, type: newRole });
    })();
  });

  it('refreshes organisation and unit details', fakeAsync(() => {
    const organisation = { id: 'org-new', name: 'New organisation', acronym: 'NEW' };
    const organisationUnit = { id: 'unit-new', name: 'New unit', acronym: 'NU' };
    user.roles = [{ ...role, organisation, organisationUnit }];
    initialize({
      ...saved,
      organisation: { ...organisation, id: 'org-old' },
      organisationUnit: { ...organisationUnit, id: 'unit-old' }
    });
    expectContext({ ...saved, type: role.role, organisation, organisationUnit });
  }));

  it('removes organisation details absent from the current role', fakeAsync(() => {
    initialize({ ...saved, organisation: { id: 'old', name: 'Old', acronym: null } });
    expectContext({ ...saved, type: role.role });
  }));

  it('preserves a valid selection among multiple roles using fresh details', fakeAsync(() => {
    user.roles = [{ id: 'other', role: UserRoleEnum.ADMIN }, role];
    initialize();
    expectContext({ ...saved, type: role.role });
  }));

  it.each(['missing', 'removed', 'other-user'])(
    'requires a choice for multiple roles with a %s selection',
    selection => {
      fakeAsync(() => {
        user.roles = [role, { id: 'other', role: UserRoleEnum.ADMIN }];
        initialize(
          selection === 'missing'
            ? null
            : { ...saved, ...(selection === 'removed' ? { roleId: 'removed' } : { id: 'other-user' }) }
        );
        expectContext(null);
      })();
    }
  );

  it.each(['missing', 'removed', 'other-user'])('selects the sole role with a %s selection', selection => {
    fakeAsync(() => {
      initialize(
        selection === 'missing'
          ? null
          : { ...saved, ...(selection === 'removed' ? { roleId: 'removed' } : { id: 'other-user' }) }
      );
      expectContext({ ...saved, type: role.role });
    })();
  });

  it('clears the saved context when no roles remain', fakeAsync(() => {
    user.roles = [];
    initialize();
    expectContext(null);
  }));

  it('falls back to the sole role when stored JSON is corrupt', fakeAsync(() => {
    localStorage.setItem('userContext', '{broken');
    initialize(null);
    expectContext({ ...saved, type: role.role });
  }));
});
