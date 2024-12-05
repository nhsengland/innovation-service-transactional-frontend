import { Component, Injectable, Injector } from '@angular/core';

export const ENV = {
  BASE_URL: 'http://demo.com',
  BASE_PATH: '/',
  LOG_LEVEL: 'TRACE',
  ENABLE_ANALYTICS: true
};

export const SERVER_REQUEST = { method: 'get', headers: {} };
export const SERVER_RESPONSE = { status: jest.fn(), setHeader: jest.fn() };

export class LocalStorageMock {
  store: Record<string, any> = {};

  clear(): void {
    this.store = {};
  }
  getItem(key: string): null | Record<string, any> {
    return this.store[key] || null;
  }
  setItem(key: string, value: any): void {
    this.store[key] = value;
  }
  removeItem(key: string): void {
    delete this.store[key];
  }
}

@Component({
  template: `<div></div>`,
  selector: 'app-empty-component'
})
export class EmptyMockComponent {}

@Injectable()
export class InjectorMock extends Injector {
  get(token: any, notFoundValue?: any, flags?: any): object {
    return {};
  }
}
