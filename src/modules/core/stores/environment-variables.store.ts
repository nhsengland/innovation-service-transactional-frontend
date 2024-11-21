import { Inject, Injectable, Optional } from '@angular/core';
import { NGXLogger, NgxLoggerLevel } from 'ngx-logger';

import { UrlModel } from '../models/url.model';

type envVariablesType = {
  BASE_URL: string;
  BASE_PATH: string;
  LOG_LEVEL: NgxLoggerLevel;
  ENABLE_ANALYTICS: boolean;
  APPLICATIONINSIGHTS_CONNECTION_STRING: string;
  TAG_MEASUREMENT_ID: string;
  GTM_ID: string;
};

/**
 * This service (conceptually a store) is responsible to set and store the environment variables when running server side OR client side.
 * If server side, EXPRESS injects a provider APP_SERVER_ENVIRONMENT_VARIABLES.
 * If client side, index.html calls a gets a script on '/environment' that injects information on 'window' variable.
 * Additionaly, LOGGER configuration is also setted here.
 */
@Injectable()
export class EnvironmentVariablesStore {
  private environment: envVariablesType = {
    BASE_URL: '',
    BASE_PATH: '/',
    LOG_LEVEL: NgxLoggerLevel.ERROR,
    ENABLE_ANALYTICS: true,
    APPLICATIONINSIGHTS_CONNECTION_STRING: '',
    TAG_MEASUREMENT_ID: '',
    GTM_ID: ''
  };

  get ENV(): envVariablesType {
    return this.environment;
  }

  get APP_URL(): string {
    return new UrlModel(this.environment.BASE_URL).setPath(this.environment.BASE_PATH).buildUrl();
  }
  get APP_ASSETS_URL(): string {
    return new UrlModel(this.environment.BASE_URL)
      .setPath(this.environment.BASE_PATH)
      .addPath('static/assets')
      .buildUrl();
  }
  get API_URL(): string {
    return new UrlModel(this.environment.BASE_URL).setPath(this.environment.BASE_PATH).addPath('api').buildUrl();
  }
  get API_ADMIN_URL(): string {
    return new UrlModel(this.environment.BASE_URL).setPath(this.environment.BASE_PATH).addPath('api/admins').buildUrl();
  }
  get API_INNOVATIONS_URL(): string {
    return new UrlModel(this.environment.BASE_URL)
      .setPath(this.environment.BASE_PATH)
      .addPath('api/innovations')
      .buildUrl();
  }
  get API_USERS_URL(): string {
    return new UrlModel(this.environment.BASE_URL).setPath(this.environment.BASE_PATH).addPath('api/users').buildUrl();
  }
  get BASE_URL(): string {
    return this.environment.BASE_URL;
  }
  get BASE_PATH(): string {
    return this.environment.BASE_PATH;
  }

  constructor(
    private logger: NGXLogger,
    @Inject('APP_SERVER_ENVIRONMENT_VARIABLES')
    @Optional()
    appServerENV?: Omit<envVariablesType, 'LOG_LEVEL'> & { LOG_LEVEL: keyof typeof NgxLoggerLevel }
  ) {
    try {
      if (appServerENV) {
        this.environment = {
          BASE_URL: appServerENV.BASE_URL,
          BASE_PATH: this.parseBasePath(appServerENV.BASE_PATH),
          LOG_LEVEL: NgxLoggerLevel[appServerENV.LOG_LEVEL],
          ENABLE_ANALYTICS: appServerENV.ENABLE_ANALYTICS,
          APPLICATIONINSIGHTS_CONNECTION_STRING: appServerENV.APPLICATIONINSIGHTS_CONNECTION_STRING,
          TAG_MEASUREMENT_ID: appServerENV.TAG_MEASUREMENT_ID,
          GTM_ID: appServerENV.GTM_ID
        };
      } else {
        /* istanbul ignore next */
        const browserEnv: Omit<envVariablesType, 'LOG_LEVEL'> & { LOG_LEVEL: keyof typeof NgxLoggerLevel } =
          window && (window as any).__env ? (window as Record<string, any>).__env : {};

        this.environment = {
          BASE_URL: browserEnv.BASE_URL,
          BASE_PATH: this.parseBasePath(browserEnv.BASE_PATH),
          LOG_LEVEL: NgxLoggerLevel[browserEnv.LOG_LEVEL],
          ENABLE_ANALYTICS: browserEnv.ENABLE_ANALYTICS,
          APPLICATIONINSIGHTS_CONNECTION_STRING: browserEnv.APPLICATIONINSIGHTS_CONNECTION_STRING,
          TAG_MEASUREMENT_ID: browserEnv.TAG_MEASUREMENT_ID,
          GTM_ID: browserEnv.GTM_ID
        };
      }
    } catch (error) {
      /* istanbul ignore next */
      this.logger.error('EnvironmentStore: Error setting ENV variables.');
      /* istanbul ignore next */
      this.logger.error(error);
    }

    // Set Logger configuration.
    this.logger.updateConfig({
      level: this.environment.LOG_LEVEL,
      timestampFormat: 'mediumTime'
    });
  }

  parseBasePath(p: string): string {
    return ['', '/'].includes(p) ? '' : `${p.startsWith('/') ? '' : '/'}${p}`;
  }
}
