import { NgModule, Optional, SkipSelf } from '@angular/core';

import { AuthenticationStore } from './authentication/authentication.store';
import { AuthenticationService } from './authentication/authentication.service';

import { InnovationStore } from './innovation/innovation.store';
import { InnovationService } from './innovation/innovation.service';

import { ContextStore } from './context/context.store';



@NgModule({
  providers: [
    AuthenticationStore,
    AuthenticationService,
    InnovationStore,
    InnovationService,
    ContextStore
  ]
})
export class StoresModule {
  // Makes sure that this module is imported only by one NgModule (AppModule)!
  constructor(@Optional() @SkipSelf() parentModule: StoresModule) {
    if (parentModule) {
      throw new Error('Store Module is already loaded. Import it only in AppModule, please!');
    }
  }
}
