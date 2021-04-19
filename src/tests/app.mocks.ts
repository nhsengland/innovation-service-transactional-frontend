import { Component, Injector } from '@angular/core';


export const ENV = {
  BASE_URL: 'http://demo.com',
  BASE_PATH: '/',
  API_URL: 'http://demo.com/api',
  LOG_LEVEL: 'TRACE'
};


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
