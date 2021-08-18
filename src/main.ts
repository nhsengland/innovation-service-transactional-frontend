import { enableProdMode } from '@angular/core';
import { Injectable } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppInjector } from '@modules/core/injectors/app-injector';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { CookiesService } from '@modules/core';

if (environment.production) {
  enableProdMode();
}

document.addEventListener('DOMContentLoaded', () => {
  platformBrowserDynamic().bootstrapModule(AppModule)
  .then(ref => {
    if (!environment.enableAnalytics){
      const cookiesService = AppInjector.getInjector().get(CookiesService);
      cookiesService.updateConsentCookie(false);
    }
  })
  .catch(err => console.error(err));
});
