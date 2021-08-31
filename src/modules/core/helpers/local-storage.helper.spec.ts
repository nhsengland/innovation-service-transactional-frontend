import { LocalStorageMock } from '@tests/app.mocks';

import { LocalStorageHelper } from './local-storage.helper';


global.localStorage = new LocalStorageMock() as any;


describe('Core/Helpers/LocalStorageHelper', () => {

  it(`should run getObjectItem() with a NON existing key`, () => {

    expect(LocalStorageHelper.getObjectItem('key')).toBeNull();

  });

  it(`should run getObjectItem() with a existing key`, () => {

    LocalStorageHelper.setObjectItem('key', { id: 'id' });
    expect(LocalStorageHelper.getObjectItem('key')).toEqual({ id: 'id' });

  });

  it(`should run setObjectItem()`, () => {

    LocalStorageHelper.setObjectItem('key', { id: 'id' });
    expect(localStorage.getItem('key')).toBe('{\"id\":\"id\"}');

  });

  it(`should run removeItem()`, () => {

    LocalStorageHelper.setObjectItem('key', { id: 'id' });
    LocalStorageHelper.removeItem('key');
    expect(localStorage.getItem('key')).toBeFalsy();

  });

});
