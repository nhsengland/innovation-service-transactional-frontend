import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';

import { AppInjector } from '@modules/core/injectors/app-injector';

import { EnvironmentVariablesStore } from '@modules/core/stores/environment-variables.store';
import { AuthenticationStore } from '@modules/stores/authentication/authentication.store';
import { UserRoleEnum } from '@modules/stores/authentication/authentication.enums';
import { ContextStore } from '@modules/stores/context/context.store';
import { ContextPageLayoutType } from '@modules/stores/context/context.types';
import { InnovationStore } from '@modules/stores/innovation/innovation.store';

@Injectable()
export class CoreService {
  private envVariablesStore: EnvironmentVariablesStore;

  protected http: HttpClient;
  protected translateService: TranslateService;
  protected logger: NGXLogger;

  protected stores: {
    authentication: AuthenticationStore;
    context: ContextStore;
    innovation: InnovationStore;
  };

  protected APP_URL: string;
  protected API_URL: string;
  protected API_ADMIN_URL: string;
  protected API_INNOVATIONS_URL: string;
  protected API_USERS_URL: string;

  constructor() {
    const injector = AppInjector.getInjector();

    this.envVariablesStore = injector.get(EnvironmentVariablesStore);
    this.http = injector.get(HttpClient);
    this.translateService = injector.get(TranslateService);
    this.logger = injector.get(NGXLogger);

    this.stores = {
      authentication: injector.get(AuthenticationStore),
      context: injector.get(ContextStore),
      innovation: injector.get(InnovationStore)
    };

    this.APP_URL = this.envVariablesStore.APP_URL;
    this.API_URL = this.envVariablesStore.API_URL;
    this.API_ADMIN_URL = this.envVariablesStore.API_ADMIN_URL;
    this.API_INNOVATIONS_URL = this.envVariablesStore.API_INNOVATIONS_URL;
    this.API_USERS_URL = this.envVariablesStore.API_USERS_URL;
  }

  setAlert(type: ContextPageLayoutType['alert']['type'], title: string, message?: string, setFocus?: boolean): void {
    this.stores.context.setPageAlert({ type, title, message, setFocus: !!setFocus, persistOneRedirect: false });
  }

  apiUserBasePath(): string {
    switch (this.stores.authentication.getUserType()) {
      case UserRoleEnum.ADMIN:
        return 'user-admin';
      case UserRoleEnum.ASSESSMENT:
        return 'assessments';
      case UserRoleEnum.ACCESSOR:
      case UserRoleEnum.QUALIFYING_ACCESSOR:
        return 'accessors';
      case UserRoleEnum.INNOVATOR:
        return 'innovators';
      default:
        return '';
    }
  }

  userUrlBasePath(): string {
    return this.stores.authentication.userUrlBasePath();
  }

  translate(translation: string, params?: object): string {
    return this.translateService.instant(translation, params);
  }
}
