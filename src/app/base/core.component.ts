import { isPlatformBrowser, isPlatformServer, Location } from '@angular/common';
import { Component, computed, OnDestroy, PLATFORM_ID } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { Subscription } from 'rxjs';

import { Request, Response } from 'express';
import { REQUEST, RESPONSE } from '../../express.tokens';

import { AppInjector } from '@modules/core/injectors/app-injector';

import { EnvironmentVariablesStore } from '@modules/core/stores/environment-variables.store';
import { AuthenticationStore } from '@modules/stores/authentication/authentication.store';

import { AlertType, LinkType, MappedObjectType } from '@modules/core/interfaces/base.interfaces';
import { URLS } from './constants';
import { UtilsHelper } from './helpers';
import { ContextLayoutType, CtxStore } from '@modules/stores';

type AlertOptions = {
  message?: string;
  listStyleType?: NonNullable<ContextLayoutType['alert']>['listStyleType'];
  itemsList?: NonNullable<ContextLayoutType['alert']>['itemsList'];
  width?: NonNullable<ContextLayoutType['alert']>['width'];
};

@Component({ template: '' })
export class CoreComponent implements OnDestroy {
  private platformId: object;
  private serverRequest: Request | null;
  private serverResponse: Response | null;

  private envVariablesStore: EnvironmentVariablesStore;

  private titleService: Title;
  private translateService: TranslateService;
  protected router: Router;
  protected logger: NGXLogger;
  protected location: Location;
  protected currentUrl?: string;
  protected previousUrl?: string;

  protected CONSTANTS: {
    APP_URL: string;
    APP_ASSETS_URL: string;
    BASE_URL: string;
    BASE_PATH: string;
    URLS: typeof URLS;
  };

  protected stores: {
    authentication: AuthenticationStore;
  };

  protected ctx: CtxStore;

  protected subscriptions: Subscription[] = [];

  public alert: AlertType = { type: null };

  public pageStatus = computed(() => this.ctx.layout.status());

  constructor() {
    const injector = AppInjector.getInjector();

    this.platformId = injector.get(PLATFORM_ID);

    try {
      this.serverRequest = injector.get<Request>(REQUEST);
      this.serverResponse = injector.get<Response>(RESPONSE);
    } catch (error) {
      this.serverRequest = null;
      this.serverResponse = null;
    }

    this.envVariablesStore = injector.get(EnvironmentVariablesStore);

    this.titleService = injector.get(Title);
    this.router = injector.get(Router);
    this.translateService = injector.get(TranslateService);
    this.logger = injector.get(NGXLogger);
    this.location = injector.get(Location);

    this.CONSTANTS = {
      APP_URL: this.envVariablesStore.APP_URL,
      APP_ASSETS_URL: this.envVariablesStore.APP_ASSETS_URL,
      BASE_URL: this.envVariablesStore.BASE_URL,
      BASE_PATH: this.envVariablesStore.BASE_PATH,
      URLS: URLS
    };

    this.stores = {
      authentication: injector.get(AuthenticationStore)
    };

    this.ctx = injector.get(CtxStore);

    this.ctx.layout.setCurrentUrl(this.location.path());

    this.subscriptions.push(
      this.router.events.subscribe((e: any) => {
        if (e instanceof NavigationEnd) {
          this.ctx.layout.setCurrentUrl(e.urlAfterRedirects);
        }
      })
    );
  }

  /* istanbul ignore next */
  get sRequest(): null | Request {
    return this.serverRequest;
  }
  /* istanbul ignore next */
  get sResponse(): null | Response {
    return this.serverResponse;
  }
  /* istanbul ignore next */
  get requestBody(): MappedObjectType {
    return this.serverRequest?.body || {};
  }

  isRunningOnBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  isRunningOnServer(): boolean {
    return isPlatformServer(this.platformId);
  }

  isDataRequest(): boolean {
    return this.serverRequest?.method?.toLowerCase() === 'post';
  }

  setPageTitle(
    main: string,
    options?: {
      hint?: string;
      showTab?: boolean;
      showPage?: boolean;
      size?: 'xl' | 'l';
      width?: 'full' | '2.thirds';
      actions?: LinkType[];
    }
  ): void {
    main = main ? this.translateService.instant(main) : null;

    if (main && (options?.showPage ?? true)) {
      this.ctx.layout.update({
        title: {
          main,
          secondary: options?.hint,
          size: options?.size,
          width: options?.width,
          actions: options?.actions
        }
      });
    } else {
      this.ctx.layout.update({ title: null });
    }

    const tabTitle = main && (options?.showTab ?? true) ? `${main} | ` : '';
    this.titleService.setTitle(`${tabTitle}${this.translateService.instant('app.title')}`);
  }

  setPageStatus(status: 'LOADING' | 'READY' | 'ERROR'): void {
    // When running server side, the status always remains LOADING.
    // The visual effects only are meant to be applied on the browser.
    if (this.isRunningOnBrowser()) {
      this.ctx.layout.update({ status });
    }
  }

  resetBackLink() {
    this.ctx.layout.update({ backLink: null });
  }

  /**
   * This function sets the back link for the current page. If none is provided, it will use the previous url or default to the dashboard.
   *
   * @param label label for the back button
   * @param urlOrCallback either a string url or a callback function to be called
   * @param hiddenLabel hidden label for the back button
   */
  setBackLink(label?: string, urlOrCallback?: string | ((...p: any) => void), hiddenLabel?: string): void {
    if (!label) {
      label = 'Go back';
    }

    // If no url is provided, use the previous url or default to the dashboard to avoid getting out of the app.
    if (!urlOrCallback) {
      urlOrCallback = this.ctx.layout.previousUrl() ?? `/${this.stores.authentication.userUrlBasePath()}/dashboard`;
    }

    this.ctx.layout.update({ backLink: { label, callback: urlOrCallback, hiddenLabel } });
  }

  resetAlert(): void {
    // TODO: Check if we can remote this.alert
    this.alert = { type: null };
    this.ctx.layout.update({ alert: null });
  }
  setAlert(data: NonNullable<ContextLayoutType['alert']>): void {
    // TODO: Check if we can remove this.alert
    this.alert = { type: data.type, title: data.title, message: data.message, setFocus: true };
    this.ctx.layout.update({ alert: data });
  }
  setRedirectAlertSuccess(title: string, options?: AlertOptions): void {
    this.ctx.layout.update({
      alert: {
        type: 'SUCCESS',
        title,
        ...options,
        persistOneRedirect: true
      }
    });
  }
  setRedirectAlertInformation(title: string, options?: AlertOptions): void {
    this.ctx.layout.update({
      alert: {
        type: 'INFORMATION',
        title,
        ...options,
        persistOneRedirect: true
      }
    });
  }
  setRedirectAlertError(message: string, options?: AlertOptions): void {
    this.ctx.layout.update({
      alert: {
        type: 'ERROR',
        title: 'There is a problem',
        message,
        ...options,
        persistOneRedirect: true
      }
    });
  }
  setAlertSuccess(title: string, options?: AlertOptions): void {
    this.setAlert({ type: 'SUCCESS', title, ...options });
  }
  setAlertWarning(title: string, options?: AlertOptions): void {
    this.setAlert({ type: 'WARNING', title, ...options });
  }
  setAlertError(message: string, options?: AlertOptions): void {
    this.setAlert({ type: 'ERROR', title: 'There is a problem', message, ...options });
  }
  setAlertUnknownError(): void {
    this.setAlert({
      type: 'ERROR',
      title: 'There is a problem',
      message: 'It appears that something went wrong! You can try again or contact us for further help'
    });
  }

  // focusBody(): void {
  //   if (isPlatformBrowser(this.platformId)) {
  //     setTimeout(() => {
  //       document.body.setAttribute('tabindex', '-1');
  //       document.body.focus();
  //       document.body.removeAttribute('tabindex');
  //     });
  //   }
  // }

  userUrlBasePath(): string {
    return this.stores.authentication.userUrlBasePath();
  }

  redirectTo(url: string, queryParams: MappedObjectType = {}): void {
    // fix url can include queryParams and we need to extract those into the queryParams object
    const [baseUrl, queryString] = url.split('?');
    queryString?.split('&').forEach(qp => {
      const [key, value] = qp.split('=');
      queryParams[key] = value;
    });

    if (this.isRunningOnBrowser()) {
      this.router.navigate([baseUrl], { queryParams });
      return;
    }

    url = this.encodeUrlQueryParams(baseUrl, queryParams);
    /* istanbul ignore next */
    this.serverResponse?.status(303);
    /* istanbul ignore next */
    this.serverResponse?.setHeader('Location', url);
  }

  encodeInfo(s: string): string {
    return this.isRunningOnBrowser() ? btoa(s) : Buffer.from(s, 'binary').toString('base64');
  }

  decodeInfo(s: string): string {
    if (!s) {
      return '';
    }
    return this.isRunningOnBrowser() ? atob(s) : Buffer.from(s, 'base64').toString('binary');
  }

  encodeUrlQueryParams(url: string, queryParams?: MappedObjectType): string {
    url = `${url.split('?')[0]}`;
    url += Object.keys(queryParams || {}).length > 0 ? '?' : '';

    let qpValue = '';

    for (const [key, value] of Object.entries(queryParams || {})) {
      qpValue = value;

      if (UtilsHelper.isEmpty(value)) {
        continue;
      }

      if (typeof value === 'object') {
        qpValue = JSON.stringify(value);
      }

      url += (url.slice(-1) === '?' ? '' : '&') + `${key}=${encodeURIComponent(this.encodeInfo(qpValue))}`;
    }

    return url;
  }

  decodeQueryParams(queryParams: MappedObjectType): MappedObjectType {
    const o: MappedObjectType = {};

    for (const [key, value] of Object.entries(queryParams)) {
      let decodedValue = decodeURIComponent(value);
      decodedValue = this.decodeInfo(decodedValue);

      try {
        o[key] = JSON.parse(decodedValue);
      } catch {
        o[key] = decodedValue;
      }
    }

    return o;
  }

  translate(translation: string, params?: object): string {
    return this.translateService.instant(translation, params);
  }

  translationExists(translation: string): boolean {
    return this.translateService.instant(translation) !== translation;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}
