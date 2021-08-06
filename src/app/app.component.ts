import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs/operators';

import { isPlatformBrowser } from '@angular/common';

import { locale as enLanguage } from './config/translations/en';

declare let gtag: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private titleService: Title,
    public router: Router,
    private translateService: TranslateService
  ) {

    this.translateService.addLangs(['en']);
    this.translateService.setTranslation(enLanguage.lang, enLanguage.data, true);
    this.translateService.setDefaultLang('en');
    this.translateService.use('en');

    this.titleService.setTitle(translateService.instant('app.title'));

    if (isPlatformBrowser(this.platformId)) {

      this.router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd)).subscribe(e => {
        gtag('config', 'G-4XB9VSJZ0G', {
          page_path: e.urlAfterRedirects
        });
      });

    }

  }

}
