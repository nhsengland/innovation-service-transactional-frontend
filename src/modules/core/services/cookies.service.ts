import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

import { EnvironmentVariablesStore } from '../stores/environment-variables.store';

declare let gtag: any;

type CookiesConsentType = {
  consented: boolean;
  necessary: boolean;
  analytics: boolean;
};

@Injectable()
export class CookiesService {
  private readonly cookiesOptions: {
    expires?: number | Date;
    path?: string;
    domain?: string;
    secure?: boolean;
    sameSite?: 'Lax' | 'None' | 'Strict';
  };

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private coockieService: CookieService,
    private environment: EnvironmentVariablesStore
  ) {
    this.cookiesOptions = {
      path: '/',
      expires: 365,
      sameSite: 'Strict',
      secure: environment.BASE_URL.startsWith('https')
    };
  }

  shouldAskForCookies(): boolean {
    return isPlatformBrowser(this.platformId) && Object.keys(this.getConsentCookie()).length === 0;
  }

  getConsentCookie(): Partial<CookiesConsentType> {
    try {
      return JSON.parse(this.coockieService.get('cookies-consent') || '{}');
    } catch (error) {
      // console.log('Error parsing consent cookies', error);
      return {};
    }
  }

  setConsentCookie(analytics: boolean): void {
    this.coockieService.set(
      'cookies-consent',
      JSON.stringify({ consented: true, necessary: true, analytics }),
      this.cookiesOptions
    );
    
    gtag &&
      gtag('consent', 'update', {
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        functionality_storage: 'denied',
        personalization_storage: 'denied',
        security_storage: 'denied',
        analytics_storage: analytics ? 'granted' : 'denied'
      });
  }
}
