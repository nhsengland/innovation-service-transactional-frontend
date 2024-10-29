import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, Injector, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs/operators';

import { CookiesService } from '@modules/core/services/cookies.service';
import { EnvironmentVariablesStore } from '@modules/core/stores/environment-variables.store';

import { AngularPlugin } from '@microsoft/applicationinsights-angularplugin-js';
import { ClickAnalyticsPlugin } from '@microsoft/applicationinsights-clickanalytics-js';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { GlobalErrorHandler } from './config/handlers/global-error.handler';
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
    private cookiesService: CookiesService,
    private injector: Injector
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
      const angularPlugin = new AngularPlugin();
      // *** Add the Click Analytics plug-in. ***
      const clickPluginInstance = new ClickAnalyticsPlugin();
      const clickPluginConfig = {
        autoCapture: true,
        dataTags: {
          useDefaultContentNameOrId: true
        }
      };
      const appInsights = new ApplicationInsights({
        config: {
          connectionString:
            'InstrumentationKey=1477c2e2-3c23-4553-9aad-88e18f2c1d2d;IngestionEndpoint=https://uksouth-1.in.applicationinsights.azure.com/;LiveEndpoint=https://uksouth.livediagnostics.monitor.azure.com/;ApplicationId=913c6b33-c768-4747-b6c5-c53472de9c32',
          // *** Add the Click Analytics plug-in. ***
          extensions: [angularPlugin, clickPluginInstance],
          extensionConfig: {
            [angularPlugin.identifier]: { router: this.router, errorServices: [new GlobalErrorHandler(this.injector)] },
            // *** Add the Click Analytics plug-in. ***
            [clickPluginInstance.identifier]: clickPluginConfig
          }
        }
      });
      appInsights.addTelemetryInitializer(envelope => {
        // Don't send telemetry for google analytics or browser-sync
        if (
          envelope.baseData?.target?.includes('google-analytics.com') ||
          envelope.baseData?.target?.includes('browser-sync')
        ) {
          return false;
        }
        return true;
      });

      appInsights.loadAppInsights();

      this.router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd)).subscribe(e => {
        if (this.environmentStore.ENV.ENABLE_ANALYTICS) {
          typeof gtag === 'function' &&
            gtag('config', this.environmentStore.ENV.TAG_MEASUREMENT_ID, {
              page_path: e.urlAfterRedirects
            });
        }
      });
    }
  }
}
