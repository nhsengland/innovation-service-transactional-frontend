import { Component, Injector } from '@angular/core';


export const ENV = {
  BASE_URL: 'http://demo.com',
  BASE_PATH: '/',
  API_URL: 'http://demo.com/api',
  LOG_LEVEL: 'TRACE',
  ENABLE_ANALYTICS: true
};

export const SERVER_REQUEST = { method: 'get', headers: {} };
export const SERVER_RESPONSE = { status: jest.fn(), setHeader: jest.fn() };


export class LocalStorageMock {

  store: { [key: string]: any } = {};

  clear(): void { this.store = {}; }
  getItem(key: string): null | { [key: string]: any } { return this.store[key] || null; }
  setItem(key: string, value: any): void { this.store[key] = value; }
  removeItem(key: string): void { delete this.store[key]; }

}


@Component({
  template: `<div></div>`,
  selector: 'empty-component',
})
export class EmptyMockComponent { }


export class InjectorMock extends Injector {
  get(token: any, notFoundValue?: any, flags?: any): object {
    return {};
  }
}
