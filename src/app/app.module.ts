import { Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { TransferHttpCacheModule } from '@nguniversal/common';
import { TranslateModule } from '@ngx-translate/core';

import { CoreModule } from '@modules/core/core.module';
import { StoreModule } from '@modules/stores/store.module';
import { ThemeModule } from '@modules/theme/theme.module';
import { AppInjector } from '@modules/core';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

@NgModule({
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    HttpClientModule,
    TransferHttpCacheModule,
    TranslateModule.forRoot(),

    CoreModule,
    StoreModule,
    ThemeModule,

    AppRoutingModule
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(injector: Injector) {
    AppInjector.setInjector(injector);
  }
}
