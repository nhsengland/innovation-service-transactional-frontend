import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NGXLogger } from 'ngx-logger';

import { AppInjector } from '@modules/core/injectors/app-injector';

import { EnvironmentStore } from '@modules/core/stores/environment.store';
import { AuthenticationStore } from '@modules/stores/authentication/authentication.store';
import { InnovationStore } from '@modules/stores/innovation/innovation.store';


@Injectable()
export class CoreService {

  protected http: HttpClient;
  protected logger: NGXLogger;

  protected stores: {
    environment: EnvironmentStore;
    authentication: AuthenticationStore;
    innovation: InnovationStore;
  };

  protected APP_URL: string;
  protected API_URL: string;


  constructor() {

    const injector = AppInjector.getInjector();

    this.http = injector.get(HttpClient);
    this.logger = injector.get(NGXLogger);

    this.stores = {
      environment: injector.get(EnvironmentStore),
      authentication: injector.get(AuthenticationStore),
      innovation: injector.get(InnovationStore)
    };

    this.APP_URL = this.stores.environment.APP_URL;
    this.API_URL = this.stores.environment.API_URL;

  }

}
