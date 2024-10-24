import { NgModule, Optional, SkipSelf } from '@angular/core';

import { AuthenticationStore } from './authentication/authentication.store';
import { AuthenticationService } from './authentication/authentication.service';

import { ContextStore } from './context/context.store';
import { ContextService } from './context/context.service';

import { InnovationStore } from './innovation/innovation.store';
import { InnovationService } from './innovation/innovation.service';
import { InnovationRecordSchemaStore } from './innovation/innovation-record/innovation-record-schema/innovation-record-schema.store';
import { InnovationRecordSchemaService } from './innovation/innovation-record/innovation-record-schema/innovation-record-schema.service';
import { InnovationContextStore } from './ctx/innovation/innovation-context.store';
import { InnovationContextService } from './ctx/innovation/innovation-context.service';

@NgModule({
  providers: [
    AuthenticationStore,
    AuthenticationService,

    ContextStore,
    ContextService,

    InnovationStore,
    InnovationService,

    InnovationContextStore,
    InnovationContextService,

    InnovationRecordSchemaStore,
    InnovationRecordSchemaService
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
