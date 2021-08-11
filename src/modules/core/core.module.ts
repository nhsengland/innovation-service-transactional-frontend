import { NgModule, Optional, SkipSelf } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { LoggerModule } from 'ngx-logger';
import { TranslateModule } from '@ngx-translate/core';

// Interceptors.
import { ApiOutInterceptor } from './interceptors/api-out.interceptor';

// Guards.
import { AuthenticationGuard } from './guards/authentication.guard';
import { AuthenticationRedirectionGuard } from './guards/authentication-redirection.guard';
import { InnovationTransferRedirectionGuard } from './guards/innovation-transfer-redirection.guard';

// Stores.
import { EnvironmentStore } from './stores/environment.store';

// Services.
import { CookiesService } from './services/cookies.service';
import { InnovationService } from './services/innovation.service';
import { LoggerService } from './services/logger.service';


@NgModule({
  imports: [
    LoggerModule.forRoot(null),
    TranslateModule.forRoot()
  ],
  providers: [
    CookieService,

    // App base HREF definition.
    {
      provide: APP_BASE_HREF,
      useFactory: (environmentStore: EnvironmentStore): string => environmentStore.ENV.BASE_PATH || '/',
      deps: [EnvironmentStore]
    },

    // Interceptors.
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiOutInterceptor,
      multi: true
    },

    // Guards.
    AuthenticationGuard,
    AuthenticationRedirectionGuard,
    InnovationTransferRedirectionGuard,

    // Stores.
    EnvironmentStore,

    // Services.
    CookiesService,
    InnovationService,
    LoggerService
  ]
})
export class CoreModule {
  // Makes sure that this module is imported only by one NgModule (AppModule)!
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('Core Module is already loaded. Import it only in AppModule, please!');
    }
  }
}
