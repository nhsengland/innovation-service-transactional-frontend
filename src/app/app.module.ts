import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { APP_ID, ErrorHandler, Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from '@modules/core/core.module';
import { StoresModule } from '@modules/stores/stores.module';
import { ThemeModule } from '@modules/theme/theme.module';

import { AppInjector } from '@modules/core/injectors/app-injector';

import { ApplicationinsightsAngularpluginErrorService } from '@microsoft/applicationinsights-angularplugin-js';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

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
    {
      provide: ErrorHandler,
      useClass: ApplicationinsightsAngularpluginErrorService
    }
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(injector: Injector) {
    AppInjector.setInjector(injector);
  }
}
