import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';

import { EnvironmentVariablesStore } from '../stores/environment-variables.store';


type CookiesConsentType = {
  consented: boolean;
  necessary: boolean;
  analytics: boolean;
};


@Injectable()
export class CookiesService {

  private cookiesOptions: {
    expires?: number | Date;
    path?: string;
    domain?: string;
    secure?: boolean;
    sameSite?: 'Lax' | 'None' | 'Strict';
  } = { path: '/', expires: 365, sameSite: 'Strict' };


  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private coockieService: CookieService,
    private environment: EnvironmentVariablesStore
  ) { }


  shouldAskForCookies(): boolean { return (isPlatformBrowser(this.platformId) && Object.keys(this.getConsentCookie()).length === 0); }

  getConsentCookie(): Partial<CookiesConsentType> {
    try {
      return JSON.parse(this.coockieService.get('cookies-consent') || '{}');
    } catch (error) {
      // console.log('Error parsing consent cookies', error);
      return {};
    }
  }

  setConsentCookie(analytics: boolean): void {

    this.coockieService.set('cookies-consent', JSON.stringify({ consented: true, necessary: true, analytics }), this.cookiesOptions);

    if (analytics) { this.setAnalyticsScripts(); }
    else {
      this.deleteAnalyticsCookies();
      this.removeAnalyticsScripts();
    }

  }

  deleteAnalyticsCookies(): void {

    const cookies = this.coockieService.getAll();

    Object.entries(cookies).forEach(([key, value]) => {
      if (key.startsWith('_hj') || key.startsWith('_ga')) { this.coockieService.delete(key); }
    });

  }


  setAnalyticsScripts(): void { // Add analytics scripts to header.

    if (isPlatformBrowser(this.platformId) && this.getConsentCookie().analytics) {
      const node = document.createElement('script');
      node.id = 'hj-analytics';
      node.src = `${this.environment.APP_ASSETS_URL}/js/analytics.js`;
      node.type = 'text/javascript';
      node.async = true;
      document.getElementsByTagName('head')[0].appendChild(node);
    }

  }

  removeAnalyticsScripts(): void { // Add analytics scripts to header.

    if (isPlatformBrowser(this.platformId)) {

      let element: HTMLElement | null;

      element = document.getElementById('hj-analytics');
      /* istanbul ignore next */
      element?.parentNode?.removeChild(element);

      element = document.getElementById('ga-analytics');
      /* istanbul ignore next */
      element?.parentNode?.removeChild(element);

    }

  }

}
