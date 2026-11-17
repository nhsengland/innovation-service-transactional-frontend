import { TestBed } from '@angular/core/testing';
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
