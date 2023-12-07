import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Store } from './store.class';

describe('Stores/StoreClass', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
  });

  it('should return static variables', () => {
    const store = new Store('storeId', { storeName: 'Initial value' });

    store.setStoreId('aNewStoreId');
    store.setState({ storeName: 'A new store name' });

    let expectedSubscription = { storeName: '' };
    store.state$.subscribe(s => (expectedSubscription = s));

    expect(store.getStoreId()).toBe('aNewStoreId');
    expect(store.state).toEqual({ storeName: 'A new store name' });
    expect(expectedSubscription).toEqual({ storeName: 'A new store name' });
  });
});
