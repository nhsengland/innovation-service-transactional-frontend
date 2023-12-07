import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { APP_ID, ErrorHandler, Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from '@modules/core/core.module';
import { StoresModule } from '@modules/stores/stores.module';
import { ThemeModule } from '@modules/theme/theme.module';

import { AppInjector } from '@modules/core/injectors/app-injector';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GlobalErrorHandler } from './config/handlers/global-error.handler';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    HttpClientXsrfModule,

    CoreModule,
    StoresModule,
    ThemeModule,

    AppRoutingModule
  ],
  providers: [
    { provide: APP_ID, useValue: 'serverApp' },
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
