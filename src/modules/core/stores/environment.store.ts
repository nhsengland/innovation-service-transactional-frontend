import { Inject, Injectable, Optional } from '@angular/core';
import { NGXLogger, NgxLoggerLevel } from 'ngx-logger';

import { UrlModel } from '../models/url.model';


type environmentVariables = {
  BASE_URL: string;
  BASE_PATH: string;
  LOG_LEVEL: NgxLoggerLevel;
  ENABLE_ANALYTICS: boolean;
};


/**
 * This service (conceptually a store) is responsible to set and store the environment variables when running server side OR client side.
 * If server side, EXPRESS injects a provider APP_SERVER_ENVIRONMENT_VARIABLES.
 * If client side, index.html calls a gets a script on '/environment' that injects information on 'window' variable.
 * Additionaly, LOGGER configuration is also setted here.
 */
@Injectable()
export class EnvironmentStore {

  private environment: environmentVariables = {
    BASE_URL: '',
    BASE_PATH: '/',
    LOG_LEVEL: NgxLoggerLevel.ERROR,
    ENABLE_ANALYTICS: true
  };

  get ENV(): environmentVariables { return this.environment; }

  get APP_URL(): string { return new UrlModel(this.environment.BASE_URL).setPath(this.environment.BASE_PATH).buildUrl(); }
  get APP_ASSETS_URL(): string { return new UrlModel(this.environment.BASE_URL).setPath(this.environment.BASE_PATH).addPath('static/assets').buildUrl(); }
  get API_URL(): string { return new UrlModel(this.environment.BASE_URL).setPath(this.environment.BASE_PATH).addPath('api').buildUrl(); }
  get API_ADMIN(): string { return new UrlModel(this.environment.BASE_URL).setPath(this.environment.BASE_PATH).addPath('api/configuration').buildUrl(); }
  get API_INNOVATIONS(): string { return new UrlModel(this.environment.BASE_URL).setPath(this.environment.BASE_PATH).addPath('api/innovations').buildUrl(); }
  get API_USERS(): string { return new UrlModel(this.environment.BASE_URL).setPath(this.environment.BASE_PATH).addPath('api/management/users').buildUrl(); }
  get BASE_URL(): string { return this.environment.BASE_URL; }
  get BASE_PATH(): string { return this.environment.BASE_PATH; }

  constructor(
    private logger: NGXLogger,
    @Inject('APP_SERVER_ENVIRONMENT_VARIABLES') @Optional() appServerENV?: Omit<environmentVariables, 'LOG_LEVEL'> & { LOG_LEVEL: keyof typeof NgxLoggerLevel }
  ) {

    try {

      if (appServerENV) {

        this.environment = {
          BASE_URL: appServerENV.BASE_URL,
          BASE_PATH: this.parseBasePath(appServerENV.BASE_PATH),
          LOG_LEVEL: NgxLoggerLevel[appServerENV.LOG_LEVEL],
          ENABLE_ANALYTICS: appServerENV.ENABLE_ANALYTICS
        };

      } else {

        /* istanbul ignore next */
        const browserEnv: Omit<environmentVariables, 'LOG_LEVEL'> & { LOG_LEVEL: keyof typeof NgxLoggerLevel }
          = window && (window as any).__env ? (window as { [key: string]: any }).__env : {};

        this.environment = {
          BASE_URL: browserEnv.BASE_URL,
          BASE_PATH: this.parseBasePath(browserEnv.BASE_PATH),
          LOG_LEVEL: NgxLoggerLevel[browserEnv.LOG_LEVEL],
          ENABLE_ANALYTICS: browserEnv.ENABLE_ANALYTICS
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

    if (['', '/'].includes(p)) {
      return '';
    }

    return `${p.startsWith('/') ? '' : '/'}${p}`;

  }

}
