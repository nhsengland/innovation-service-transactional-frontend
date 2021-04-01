import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NGXLogger } from 'ngx-logger';

import { AppInjector } from '@modules/core/injectors/app-injector';

import { EnvironmentStore } from '@modules/stores/environment/environment.store';

@Injectable()
export class CoreService {

  protected http: HttpClient;
  protected logger: NGXLogger;

  protected stores: {
    environment: EnvironmentStore
  };


  constructor() {
    const injector = AppInjector.getInjector();

    this.http = injector.get(HttpClient);
    this.logger = injector.get(NGXLogger);

    this.stores = {
      environment: injector.get(EnvironmentStore)
    };

  }

}
