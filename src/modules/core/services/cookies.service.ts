import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';


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
    private coockieService: CookieService
  ) { }


  shouldAskForCookies(): boolean { return Object.keys(this.getConsentCookie()).length === 0; }

  getConsentCookie(): Partial<CookiesConsentType> {
    try {
      return JSON.parse(this.coockieService.get('cookies-consent') || '{}');
    } catch (error) {
      console.log('Error parsing consent cookies', error);
      return {};
    }
  }

  setConsentCookie(agreed: boolean): void {
    this.coockieService.set('cookies-consent', JSON.stringify({ consented: true, necessary: true, analytics: agreed }), this.cookiesOptions);

    if (!agreed) { this.deleteAnalyticsCookies(); }
  }

  updateConsentCookie(analytics: boolean): void {
    this.coockieService.set('cookies-consent', JSON.stringify({ consented: true, necessary: true, analytics }), this.cookiesOptions);

    if (!analytics) { this.deleteAnalyticsCookies(); }
  }


  deleteAnalyticsCookies(): void {

    const cookies = this.coockieService.getAll();

    Object.entries(cookies).forEach(([key, value]) => {
      if (key.startsWith('_hj')) { this.coockieService.delete(key); }
    });

  }

}
