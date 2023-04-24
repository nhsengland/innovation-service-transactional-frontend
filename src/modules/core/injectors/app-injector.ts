import { Injector } from '@angular/core';

export class AppInjector {

  private static injector: Injector;

  static setInjector(injector: Injector): void {
    AppInjector.injector = injector;
  }

  static getInjector(): Injector {
    return AppInjector.injector;
  }

}
