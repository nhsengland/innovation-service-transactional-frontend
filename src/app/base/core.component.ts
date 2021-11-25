import { Component, OnInit, OnDestroy, PLATFORM_ID } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';

import { Request, Response } from 'express';
import { REQUEST, RESPONSE } from '@nguniversal/express-engine/tokens';

import { AppInjector } from '@modules/core/injectors/app-injector';

import { EnvironmentStore } from '@modules/core/stores/environment.store';
import { AuthenticationStore } from '@modules/stores/authentication/authentication.store';
import { InnovationStore } from '@modules/stores/innovation/innovation.store';

import { UtilsHelper } from './helpers';
import { MappedObject } from './models';


@Component({ template: '' })
export class CoreComponent implements OnInit, OnDestroy {

  private platformId: object;
  private serverRequest: Request | null;
  private serverResponse: Response | null;

  private pageTitleHolder = '';
  private pageStatusHolder: 'LOADING' | 'READY' | 'ERROR' = 'LOADING';

  protected titleService: Title;
  protected router: Router;
  protected http: HttpClient;
  protected translateService: TranslateService;
  protected logger: NGXLogger;

  protected stores: {
    environment: EnvironmentStore;
    authentication: AuthenticationStore;
    innovation: InnovationStore;
  };

  protected subscriptions: Subscription[] = [];

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

    this.titleService = injector.get(Title);
    this.router = injector.get(Router);
    this.http = injector.get(HttpClient);
    this.translateService = injector.get(TranslateService);
    this.logger = injector.get(NGXLogger);

    this.stores = {
      environment: injector.get(EnvironmentStore),
      authentication: injector.get(AuthenticationStore),
      innovation: injector.get(InnovationStore)
    };

  }

  /* istanbul ignore next */
  get sRequest(): null | Request { return this.serverRequest; }
  /* istanbul ignore next */
  get sResponse(): null | Response { return this.serverResponse; }
  /* istanbul ignore next */
  get requestBody(): MappedObject { return this.serverRequest?.body || {}; }
  /* istanbul ignore next */
  get pageTitle(): string { return this.pageTitleHolder || ''; }
  /* istanbul ignore next */
  get pageStatus(): string { return this.pageStatusHolder; }


  ngOnInit(): void { }

  isRunningOnBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  isRunningOnServer(): boolean {
    return isPlatformServer(this.platformId);
  }

  isDataRequest(): boolean {
    return this.serverRequest?.method?.toLowerCase() === 'post';
  }


  setPageTitle(s: undefined | string): void {

    if (!s) { this.pageTitleHolder = ''; }
    else { this.pageTitleHolder = this.translateService.instant(s); }

    this.titleService.setTitle(`${this.pageTitleHolder ? this.pageTitleHolder + ' | ' : ''}${this.translateService.instant('app.title')}`);
  }

  setPageStatus(s: 'LOADING' | 'READY' | 'ERROR'): void {

    // When running server side, the status always remains LOADING.
    // The visual effects only are meant to be applied on the browser.
    if (this.isRunningOnBrowser()) {
      this.pageStatusHolder = s;
    }

  }


  focusBody(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        document.body.setAttribute('tabindex', '-1');
        document.body.focus();
        document.body.removeAttribute('tabindex');
      });
    }
  }


  redirectTo(url: string, queryParams?: MappedObject): void {

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

  encodeUrlQueryParams(url: string, queryParams?: MappedObject): string {

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

  decodeQueryParams(queryParams: MappedObject): MappedObject {

    const o: MappedObject = {};

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

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
