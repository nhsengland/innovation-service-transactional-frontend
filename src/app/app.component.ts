import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs/operators';

import { CookiesService } from '@modules/core/services/cookies.service';
import { EnvironmentVariablesStore } from '@modules/core/stores/environment-variables.store';

import { locale as enLanguage } from './config/translations/en';

declare let gtag: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    public router: Router,
    private translateService: TranslateService,
    private environmentStore: EnvironmentVariablesStore,
    private cookiesService: CookiesService
  ) {
    this.translateService.addLangs(['en']);
    this.translateService.setTranslation(enLanguage.lang, enLanguage.data, true);
    this.translateService.setDefaultLang('en');
    this.translateService.use('en');

    if (
      isPlatformBrowser(this.platformId) &&
      this.environmentStore.ENV.ENABLE_ANALYTICS &&
      this.environmentStore.ENV.TAG_MEASUREMENT_ID &&
      this.environmentStore.ENV.GTM_ID &&
      this.cookiesService.getConsentCookie().analytics
    ) {
      this.router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd)).subscribe(e => {
        if (this.environmentStore.ENV.ENABLE_ANALYTICS) {
          gtag &&
            gtag('config', this.environmentStore.ENV.TAG_MEASUREMENT_ID, {
              page_path: e.urlAfterRedirects
            });
        }
      });
    }
  }
}
