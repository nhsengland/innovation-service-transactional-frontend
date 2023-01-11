import { Component, PLATFORM_ID, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';

import { Request, Response } from 'express';
import { REQUEST, RESPONSE } from '@nguniversal/express-engine/tokens';

import { AppInjector } from '@modules/core/injectors/app-injector';

import { EnvironmentVariablesStore } from '@modules/core/stores/environment-variables.store';
import { AuthenticationStore } from '@modules/stores/authentication/authentication.store';
import { ContextStore } from '@modules/stores/context/context.store';
import { ContextPageLayoutType, ContextPageStatusType } from '@modules/stores/context/context.types';
import { InnovationStore } from '@modules/stores/innovation/innovation.store';

import { AlertType, LinkType, MappedObjectType } from '@modules/core/interfaces/base.interfaces';
import { UtilsHelper } from './helpers';


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

  protected CONSTANTS: {
    APP_URL: string;
    APP_ASSETS_URL: string;
    BASE_URL: string;
    BASE_PATH: string;
  };

  protected stores: {
    authentication: AuthenticationStore;
    context: ContextStore;
    innovation: InnovationStore;
  };

  protected subscriptions: Subscription[] = [];

  public alert: AlertType = { type: null };

  public pageStatus: ContextPageStatusType = 'LOADING';

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

    this.CONSTANTS = {
      APP_URL: this.envVariablesStore.APP_URL,
      APP_ASSETS_URL: this.envVariablesStore.APP_ASSETS_URL,
      BASE_URL: this.envVariablesStore.BASE_URL,
      BASE_PATH: this.envVariablesStore.BASE_PATH
    };

    this.stores = {
      authentication: injector.get(AuthenticationStore),
      context: injector.get(ContextStore),
      innovation: injector.get(InnovationStore)
    };

    this.subscriptions.push(
      this.stores.context.pageLayoutStatus$().subscribe(item => { this.pageStatus = item; })
    );

  }

  /* istanbul ignore next */
  get sRequest(): null | Request { return this.serverRequest; }
  /* istanbul ignore next */
  get sResponse(): null | Response { return this.serverResponse; }
  /* istanbul ignore next */
  get requestBody(): MappedObjectType { return this.serverRequest?.body || {}; }
  /* istanbul ignore next */
  get pageTitle(): string { return this.stores.context.state.pageLayoutBS.getValue().title.main ?? ''; } // Deprecated!



  isRunningOnBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  isRunningOnServer(): boolean {
    return isPlatformServer(this.platformId);
  }

  isDataRequest(): boolean {
    return this.serverRequest?.method?.toLowerCase() === 'post';
  }

  setPageTitle(main: string, options?: { hint?: string, showTab?: boolean, showPage?: boolean, size?: 'xl' | 'l', width?: 'full' | '2.thirds', actions?: LinkType[] }): void {

    main = main ? this.translateService.instant(main) : null;

    if (main && (options?.showPage ?? true)) {
      this.stores.context.setPageTitle({ main, secondary: options?.hint, size: options?.size, width: options?.width, actions: options?.actions });
    } else {
      this.stores.context.setPageTitle({ main: null });
    }

    const tabTitle = (main && (options?.showTab ?? true)) ? `${main} | ` : '';
    this.titleService.setTitle(`${tabTitle}${this.translateService.instant('app.title')}`);

  }


  setPageStatus(status: 'LOADING' | 'READY' | 'ERROR'): void {

    // When running server side, the status always remains LOADING.
    // The visual effects only are meant to be applied on the browser.
    if (this.isRunningOnBrowser()) {
      this.stores.context.setPageStatus(status);
    }

  }

  resetBackLink() {
    this.stores.context.setPageBackLink({ label: null });
  }
  setBackLink(label: string, urlOrCallback: string | ((...p: any) => void), hiddenLabel?: string): void {

    if (typeof urlOrCallback === 'string') {
      this.stores.context.setPageBackLink({ label, url: urlOrCallback, hiddenLabel });
    } else {
      this.stores.context.setPageBackLink({ label, callback: urlOrCallback, hiddenLabel });
    }
  }

  resetAlert(): void {
    this.alert = { type: null };
    this.stores.context.resetPageAlert();
  }
  setAlert(data: ContextPageLayoutType['alert']): void {
    this.alert = { type: data.type, title: data.title, message: data.message, setFocus: true };
    this.stores.context.setPageAlert(data);
  }
  setRedirectAlertSuccess(title: string, options?: { message?: string, width?: ContextPageLayoutType['alert']['width'] }): void {
    this.stores.context.setPageAlert({ type: 'SUCCESS', title, message: options?.message, width: options?.width, persistOneRedirect: true });
  }
  setRedirectAlertInformation(title: string, options?: { message?: string, width?: ContextPageLayoutType['alert']['width'] }): void {
    this.stores.context.setPageAlert({ type: 'INFORMATION', title, message: options?.message, width: options?.width, persistOneRedirect: true });
  }
  setRedirectAlertError(message: string, options?: { message?: string, itemsList?: ContextPageLayoutType['alert']['itemsList'], width?: ContextPageLayoutType['alert']['width'] }): void {
    this.stores.context.setPageAlert({ type: 'ERROR', title: 'There is a problem', message, width: options?.width, persistOneRedirect: true });
  }
  setAlertSuccess(title: string, options?: { message?: string, width?: ContextPageLayoutType['alert']['width'] }): void {
    this.setAlert({ type: 'SUCCESS', title, message: options?.message, width: options?.width });
  }
  setAlertWarning(title: string, options?: { message?: string, width?: ContextPageLayoutType['alert']['width'] }): void {
    this.setAlert({ type: 'WARNING', title, message: options?.message, width: options?.width });
  }
  setAlertError(message: string, options?: { message?: string, itemsList?: ContextPageLayoutType['alert']['itemsList'], width?: ContextPageLayoutType['alert']['width'] }): void {
    this.setAlert({ type: 'ERROR', title: 'There is a problem', message, itemsList: options?.itemsList, width: options?.width });
  }
  setAlertUnknownError(): void { this.setAlert({ type: 'ERROR', title: 'There is a problem', message: 'It appears that something went wrong! You can try again or contact us for further help' }); }


  // focusBody(): void {
  //   if (isPlatformBrowser(this.platformId)) {
  //     setTimeout(() => {
  //       document.body.setAttribute('tabindex', '-1');
  //       document.body.focus();
  //       document.body.removeAttribute('tabindex');
  //     });
  //   }
  // }


  userUrlBasePath(): string { return this.stores.authentication.userUrlBasePath(); }

  redirectTo(url: string, queryParams?: MappedObjectType): void {

    if (this.isRunningOnBrowser()) {
      this.router.navigate([url], (queryParams ? { queryParams } : {}));
      return;
    }

    url = this.encodeUrlQueryParams(url, queryParams);
    /* istanbul ignore next */
    this.serverResponse?.status(303);
    /* istanbul ignore next */
    this.serverResponse?.setHeader('Location', url);
  }


  encodeInfo(s: string): string {
    return this.isRunningOnBrowser() ? btoa(s) : Buffer.from(s, 'binary').toString('base64');
  }

  decodeInfo(s: string): string {
    if (!s) { return ''; }
    return this.isRunningOnBrowser() ? atob(s) : Buffer.from(s, 'base64').toString('binary');
  }

  encodeUrlQueryParams(url: string, queryParams?: MappedObjectType): string {

    url = `${url.split('?')[0]}`;
    url += Object.keys(queryParams || {}).length > 0 ? '?' : '';

    let qpValue = '';

    for (const [key, value] of Object.entries(queryParams || {})) {

      qpValue = value;

      if (UtilsHelper.isEmpty(value)) { continue; }

      if (typeof value === 'object') { qpValue = JSON.stringify(value); }

      url += (url.slice(-1) === '?' ? '' : '&') + `${key}=${encodeURIComponent(this.encodeInfo(qpValue))}`;

    }

    return url;

  }

  decodeQueryParams(queryParams: MappedObjectType): MappedObjectType {

    const o: MappedObjectType = {};

    for (let [key, value] of Object.entries(queryParams)) {

      value = decodeURIComponent(value);
      value = this.decodeInfo(value);

      try { o[key] = JSON.parse(value); }
      catch { o[key] = value; }

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
