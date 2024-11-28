import { NgModule, Optional, SkipSelf } from '@angular/core';

import { InnovationContextStore } from './ctx/innovation/innovation-context.store';
import { InnovationContextService } from './ctx/innovation/innovation-context.service';
import { CtxStore } from './ctx/ctx.store';
import { AssessmentContextStore } from './ctx/assessment/assessment-context.store';
import { AssessmentContextService } from './ctx/assessment/assessment-context.service';
import { SchemaContextStore } from './ctx/schema/schema.store';
import { SchemaContextService } from './ctx/schema/schema.service';
import { LayoutContextStore } from './ctx/layout/layout.store';
import { NotificationsContextStore } from './ctx/notifications/notifications.store';
import { NotificationsContextService } from './ctx/notifications/notifications.service';
import { UserContextStore } from './ctx/user/user.store';
import { UserContextService } from './ctx/user/user.service';

@NgModule({
  providers: [
    CtxStore,

    InnovationContextStore,
    InnovationContextService,
    AssessmentContextStore,
    AssessmentContextService,
    SchemaContextStore,
    SchemaContextService,
    LayoutContextStore,
    NotificationsContextStore,
    NotificationsContextService,
    UserContextStore,
    UserContextService
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
