import { NgModule, Optional, SkipSelf } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_BASE_HREF } from '@angular/common';

import { LoggerModule } from 'ngx-logger';

// Services.
import { AuthenticationService } from './services/authentication.service';

// Interceptors.
// import { HttpInterceptorService } from './interceptors/http-interceptor.service';
// import { ApiInInterceptor } from './interceptors/api-in.interceptor';
import { ApiOutInterceptor } from './interceptors/api-out.interceptor';

// Guards.
import { AuthenticationGuard } from './guards/authentication.guard';

// Resolvers.
import { StoresResolver } from './resolvers/stores.resolver';

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
    AuthenticationService,

    {
      // App base HREF definition.
      provide: APP_BASE_HREF,
      useValue: (environment.BASE_URL.startsWith('/') ? '' : '/') + environment.BASE_URL
    },

    // Interceptors.
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: HttpInterceptorService,
    //   multi: true
    // },
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: ApiInInterceptor,
    //   multi: true
    // },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiOutInterceptor,
      multi: true
    },

    // Guards.
    AuthenticationGuard,

    // Resolvers.
    StoresResolver
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
