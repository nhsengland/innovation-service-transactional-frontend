import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';

import { AppInjector } from '@modules/core/injectors/app-injector';

import { EnvironmentVariablesStore } from '@modules/core/stores/environment-variables.store';
import { AuthenticationStore } from '@modules/stores/authentication/authentication.store';
import { UserRoleEnum } from '@modules/stores/authentication/authentication.enums';
import { ContextLayoutType, CtxStore } from '@modules/stores';

@Injectable()
export class CoreService {
  private envVariablesStore: EnvironmentVariablesStore;

  protected http: HttpClient;
  protected translateService: TranslateService;
  protected logger: NGXLogger;

  protected stores: {
    authentication: AuthenticationStore;
  };

  protected ctx: CtxStore;

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
      authentication: injector.get(AuthenticationStore)
    };

    this.ctx = injector.get(CtxStore);
    this.APP_URL = this.envVariablesStore.APP_URL;
    this.API_URL = this.envVariablesStore.API_URL;
    this.API_ADMIN_URL = this.envVariablesStore.API_ADMIN_URL;
    this.API_INNOVATIONS_URL = this.envVariablesStore.API_INNOVATIONS_URL;
    this.API_USERS_URL = this.envVariablesStore.API_USERS_URL;
  }

  setAlert(
    type: NonNullable<ContextLayoutType['alert']>['type'],
    title: string,
    message?: string,
    setFocus?: boolean
  ): void {
    this.ctx.layout.update({ alert: { type, title, message, setFocus: !!setFocus, persistOneRedirect: false } });
  }

  apiUserBasePath(): string {
    switch (this.ctx.user.getUserType()) {
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

  // TODO: could return a computed from the store
  userUrlBasePath(): string {
    return this.ctx.user.userUrlBasePath();
  }

  translate(translation: string, params?: object): string {
    return this.translateService.instant(translation, params);
  }
}
