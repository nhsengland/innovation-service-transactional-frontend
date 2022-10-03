import { ErrorHandler, Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { TransferHttpCacheModule } from '@nguniversal/common';

import { CoreModule } from '@modules/core/core.module';
import { StoresModule } from '@modules/stores/stores.module';
import { ThemeModule } from '@modules/theme/theme.module';

import { AppInjector } from '@modules/core';

import { GlobalErrorHandler } from './config/handlers/global-error.handler';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


@NgModule({
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserAnimationsModule,
    HttpClientModule,
    HttpClientXsrfModule,
    TransferHttpCacheModule,

    CoreModule,
    StoresModule,
    ThemeModule,

    AppRoutingModule
  ],
  providers: [
    { provide: ErrorHandler, useClass: GlobalErrorHandler }
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(injector: Injector) {
    AppInjector.setInjector(injector);
  }
}
