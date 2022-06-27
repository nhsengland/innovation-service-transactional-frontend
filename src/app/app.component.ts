import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { EnvironmentVariablesStore } from '@modules/core/stores/environment-variables.store';
import { CookiesService } from '@modules/core/services/cookies.service';

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

    if (isPlatformBrowser(this.platformId) && this.environmentStore.ENV.ENABLE_ANALYTICS && this.cookiesService.getConsentCookie().analytics) {

      this.router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd)).subscribe(e => {
        gtag('config', 'G-4XB9VSJZ0G', {
          page_path: e.urlAfterRedirects
        });
      });

    }

  }

}
