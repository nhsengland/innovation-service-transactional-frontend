import { NgModule } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { ServerModule } from '@angular/platform-server';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';

import * as xhr2 from 'xhr2';
import { XhrFactory } from '@angular/common';

// Activate cookie handling for server-side rendering.
export class ServerXhr implements XhrFactory {
  build(): XMLHttpRequest {
    xhr2.prototype._restrictedHeaders.cookie = false;
    return new xhr2.XMLHttpRequest();
  }
}

@NgModule({
  imports: [AppModule, ServerModule],
  providers: [provideHttpClient(withFetch()), { provide: XhrFactory, useClass: ServerXhr }],
  bootstrap: [AppComponent]
})
export class AppServerModule {}
