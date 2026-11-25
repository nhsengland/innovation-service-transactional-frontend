import { of, Subject, throwError } from 'rxjs';
import { DomainUserContext, EMPTY_USER_INFO, UserInfo, UserRoleEnum } from './user.types';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LocalStorageHelper } from '@app/base/helpers';
import { EnvironmentVariablesStore } from '@modules/core';
import { UserContextStore } from './user.store';
import { UserContextService } from './user.service';

describe('UserContextStore signOut', () => {
  it('clears the identity before storage cleanup and navigation', () => {
    const store = TestBed.runInInjectionContext(
      () =>
        new UserContextStore(
          'browser' as unknown as object,
          { APP_URL: '/transactional' } as EnvironmentVariablesStore,
          {} as UserContextService
        )
    );
    store.updateInfo({ id: 'signed-in-user' });
    expect(store.getUserId()).toBe('signed-in-user');
    const expectCleared = () => expect(store.getUserId()).toBe('');
    const remove = jest.spyOn(LocalStorageHelper, 'removeItem').mockImplementation(expectCleared);
    const clear = jest.spyOn(Storage.prototype, 'clear').mockImplementation(expectCleared);
    const replace = jest.fn(expectCleared);
    const windowGetter = jest
      .spyOn(globalThis, 'window', 'get')
      .mockReturnValue({ location: { replace } } as unknown as Window & typeof globalThis);
    try {
      store.signOut();
      expect(remove).toHaveBeenCalledWith('userContext');
      expect(clear).toHaveBeenCalledTimes(1);
      expect(replace).toHaveBeenCalledWith('/transactional/signout');
    } finally {
      windowGetter.mockRestore();
      clear.mockRestore();
      remove.mockRestore();
    }
  });
});

describe('UserContextStore acknowledged names', () => {
  const names = { givenName: 'New', surname: 'Name', displayName: 'New Name' };
  const oldUser = { ...EMPTY_USER_INFO, id: 'user-a', givenName: 'Old', surname: 'Name', displayName: 'Old Name' };
  let service: { getUserInfo: jest.Mock; updateUserInfo: jest.Mock };
  const create = (platform = 'browser') =>
    TestBed.runInInjectionContext(
      () =>
        new UserContextStore(
          platform as unknown as object,
          { APP_URL: '/transactional' } as EnvironmentVariablesStore,
          service as unknown as UserContextService
        )
    );
  const fetch = (store: UserContextStore) => {
    store.fetch$.next(false);
    jest.advanceTimersByTime(101);
  };
  const save = (store: UserContextStore) => {
    store.updateInfo(oldUser);
    store.updateUserInfo$(names, false).subscribe();
  };
  beforeEach(() => {
    jest.useFakeTimers();
    sessionStorage.clear();
    localStorage.clear();
    service = { getUserInfo: jest.fn(() => of(oldUser)), updateUserInfo: jest.fn(() => of({ id: 'user-a' })) };
  });
  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  it('keeps acknowledged names across reload and clear while refreshing server roles and status', () => {
    save(create());
    const reloaded = create();
    reloaded.clear();
    const fresh = {
      ...oldUser,
      roles: [{ id: 'role-a', role: UserRoleEnum.INNOVATOR }],
      firstTimeSignInAt: '2026-01-01'
    };
    service.getUserInfo.mockReturnValue(of(fresh));
    fetch(reloaded);
    expect(service.getUserInfo).toHaveBeenCalledWith(true);
    expect(reloaded.getUserInfo()).toEqual({ ...fresh, ...names });
    expect(reloaded.getUserContext()?.roleId).toBe('role-a');
    expect(reloaded.isFirstTimeSignInDone()).toBe(true);
  });
  it('stops forcing refresh once server names converge', () => {
    save(create());
    const store = create();
    service.getUserInfo.mockReturnValue(of({ ...oldUser, ...names }));
    fetch(store);
    service.getUserInfo.mockClear();
    fetch(create());
    expect(service.getUserInfo).toHaveBeenCalledWith(false);
  });
  it('clears pending names for another identity', () => {
    save(create());
    const store = create();
    service.getUserInfo.mockReturnValue(of({ ...oldUser, id: 'user-b' }));
    fetch(store);
    expect(store.getUserInfo().givenName).toBe('Old');
    service.getUserInfo.mockClear();
    fetch(create());
    expect(service.getUserInfo).toHaveBeenCalledWith(false);
  });
  it('never records failed writes', () => {
    service.updateUserInfo.mockReturnValue(throwError(() => new Error('write failed')));
    const store = create();
    store.updateInfo(oldUser);
    store.updateUserInfo$(names).subscribe({ error: error => expect(error.message).toBe('write failed') });
    fetch(create());
    expect(service.getUserInfo).toHaveBeenCalledWith(false);
  });
  it('retains pending names after a refresh fails', () => {
    save(create());
    const store = create();
    service.getUserInfo.mockReturnValueOnce(throwError(() => new Error('read failed')));
    fetch(store);
    fetch(create());
    expect(service.getUserInfo).toHaveBeenLastCalledWith(true);
  });
  it('does not acknowledge an update completed after identity changes', () => {
    const completion = new Subject<{ id: string }>();
    service.updateUserInfo.mockReturnValue(completion);
    const store = create();
    store.updateInfo(oldUser);
    store.updateUserInfo$(names).subscribe();
    store.updateInfo({ id: 'user-b', givenName: 'Other' });
    completion.next({ id: 'user-a' });
    expect(store.getUserInfo().givenName).toBe('Other');
    fetch(create());
    expect(service.getUserInfo).toHaveBeenCalledWith(false);
  });
  it('does not persist names during server rendering', () => {
    const set = jest.spyOn(Storage.prototype, 'setItem');
    save(create('server'));
    expect(set).not.toHaveBeenCalled();
  });
  it('tolerates blocked storage and preserves names in memory', () => {
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    const store = create();
    save(store);
    fetch(store);
    expect(store.getUserInfo().givenName).toBe('New');
    expect(service.getUserInfo).toHaveBeenCalledWith(true);
  });
  it('ignores malformed stored names', () => {
    sessionStorage.setItem('pendingUserNames', '{');
    const store = create();
    fetch(store);
    expect(store.getUserInfo()).toEqual(oldUser);
    expect(service.getUserInfo).toHaveBeenCalledWith(false);
  });
  it('only restores name fields from storage', () => {
    save(create());
    const key = Object.keys(sessionStorage)[0];
    const value = JSON.parse(sessionStorage.getItem(key)!);
    sessionStorage.setItem(
      key,
      JSON.stringify({ ...value, roles: [{ id: 'injected' }], firstTimeSignInAt: 'injected' })
    );
    const store = create();
    fetch(store);
    expect(store.getUserInfo()).toEqual({ ...oldUser, ...names });
  });
  it('waits for successful acknowledgement before persisting names', () => {
    const completion = new Subject<{ id: string }>();
    service.updateUserInfo.mockReturnValue(completion);
    const store = create();
    store.updateInfo(oldUser);
    store.updateUserInfo$(names, false).subscribe();
    expect(sessionStorage.length).toBe(0);
    completion.next({ id: 'user-a' });
    expect(JSON.parse(sessionStorage.getItem('pendingUserNames')!)).toEqual({ id: 'user-a', ...names });
  });
  it('clears pending names on logout', () => {
    const store = create();
    save(store);
    jest
      .spyOn(globalThis, 'window', 'get')
      .mockReturnValue({ location: { replace: jest.fn() } } as unknown as Window & typeof globalThis);
    store.signOut();
    fetch(create());
    expect(service.getUserInfo).toHaveBeenCalledWith(false);
  });
  it('ignores invalid name types and unavailable storage reads', () => {
    sessionStorage.setItem('pendingUserNames', JSON.stringify({ id: 'user-a', ...names, givenName: [] }));
    fetch(create());
    expect(service.getUserInfo).toHaveBeenLastCalledWith(false);
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    expect(() => create()).not.toThrow();
  });
  it('clears pending names and redirects when local storage cleanup fails', () => {
    const store = create();
    save(store);
    const replace = jest.fn();
    jest
      .spyOn(globalThis, 'window', 'get')
      .mockReturnValue({ location: { replace } } as unknown as Window & typeof globalThis);
    jest.spyOn(LocalStorageHelper, 'removeItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    expect(() => store.signOut()).not.toThrow();
    expect(sessionStorage.getItem('pendingUserNames')).toBeNull();
    expect(replace).toHaveBeenCalledWith('/transactional/signout');
  });
});

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
