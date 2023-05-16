import { NgModule } from '@angular/core';

import { SharedModule } from '@modules/shared/shared.module';
import { ThemeModule } from '@modules/theme/theme.module';

import { AnnouncementRoutingModule } from './announcement-routing.module';

// Base.
import { AnnouncementsLayoutComponent } from './base/announcements-layout.component';

// Pages.
import { AnnouncementsListComponent } from './pages/announcements-list/announcements-list.component';

// Guards.
import { AnnouncementsAccessGuard } from './guards/announcements-access.guard';

// Services.
import { AnnouncementsService } from './services/announcements.service';


@NgModule({
  imports: [
    ThemeModule,
    SharedModule,

    AnnouncementRoutingModule
  ],
  declarations: [
    AnnouncementsLayoutComponent,

    // Pages
    AnnouncementsListComponent
  ],
  providers: [
    // Guards
    AnnouncementsAccessGuard,

    // Services.
    AnnouncementsService
  ]
})
export class AnnouncementsModule { }
