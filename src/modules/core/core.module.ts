import { NgModule, Optional, SkipSelf } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_BASE_HREF } from '@angular/common';

import { LoggerModule } from 'ngx-logger';

// Interceptors.
import { ApiOutInterceptor } from './interceptors/api-out.interceptor';

// Guards.
import { AuthenticationGuard } from './guards/authentication.guard';

// Environment.
import { environment } from '../../app/config/environment.config';

@NgModule({
  imports: [

    LoggerModule.forRoot({
      level: environment.LOG_LEVEL,
      timestampFormat: 'mediumTime'
      // serverLoggingUrl: '/api/logs',
      // serverLogLevel: NgxLoggerLevel.ERROR
    }),

  ],
  providers: [
    {
      // App base HREF definition.
      provide: APP_BASE_HREF,
      useValue: (environment.BASE_URL.startsWith('/') ? '' : '/') + environment.BASE_URL
    },

    // Interceptors.
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiOutInterceptor,
      multi: true
    },

    // Guards.
    AuthenticationGuard
  ]
})
export class CoreModule {
  // Makes sure that CoreModule is imported only by one NgModule (AppModule)!
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('Core Module is already loaded. Import it only in AppModule, please!');
    }
  }
}
