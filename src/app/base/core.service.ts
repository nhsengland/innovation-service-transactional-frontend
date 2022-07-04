import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';

import { AppInjector } from '@modules/core/injectors/app-injector';

import { EnvironmentVariablesStore } from '@modules/core/stores/environment-variables.store';
import { AuthenticationStore } from '@modules/stores/authentication/authentication.store';
import { InnovationStore } from '@modules/stores/innovation/innovation.store';


@Injectable()
export class CoreService {

  private envVariablesStore: EnvironmentVariablesStore;

  protected http: HttpClient;
  protected translateService: TranslateService;
  protected logger: NGXLogger;

  protected stores: {
    authentication: AuthenticationStore;
    innovation: InnovationStore;
  };

  protected APP_URL: string;
  protected API_URL: string;
  protected API_ADMIN: string;
  protected API_INNOVATIONS: string;
  protected API_USERS: string;


  constructor() {

    const injector = AppInjector.getInjector();

    this.envVariablesStore = injector.get(EnvironmentVariablesStore);
    this.http = injector.get(HttpClient);
    this.translateService = injector.get(TranslateService);
    this.logger = injector.get(NGXLogger);

    this.stores = {
      authentication: injector.get(AuthenticationStore),
      innovation: injector.get(InnovationStore)
    };

    this.APP_URL = this.envVariablesStore.APP_URL;
    this.API_URL = this.envVariablesStore.API_URL;
    this.API_ADMIN = this.envVariablesStore.API_ADMIN;
    this.API_INNOVATIONS = this.envVariablesStore.API_INNOVATIONS;
    this.API_USERS = this.envVariablesStore.API_USERS;

  }


  userUrlBasePath(): string { return this.stores.authentication.userUrlBasePath(); }

  translate(translation: string, params?: object): string {
    return this.translateService.instant(translation, params);
  }

}
