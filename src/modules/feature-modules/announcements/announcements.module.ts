import { NgModule } from '@angular/core';

import { SharedModule } from '@modules/shared/shared.module';
import { ThemeModule } from '@modules/theme/theme.module';

import { AnnouncementRoutingModule } from './announcement-routing.module';

// Base Layout
import { AnnouncementsLayoutComponent } from './base/announcements-layout.component';

// Pages
import { AnnouncementsListComponent } from './pages/announcements-list/announcements-list.component';

// Components/Templates
import { AnnouncementGenericComponent } from './components/announcement-generic/announcement-generic.component';

// Services
import { AnnouncementsService } from './services/announcements.service';

// Guards
import { AnnouncementsAccessGuard } from './guards/announcements-access.guard';


@NgModule({
  imports: [
    ThemeModule,
    SharedModule,

    AnnouncementRoutingModule
  ],
  declarations: [
    AnnouncementsLayoutComponent,

    // Components/Templates
    AnnouncementGenericComponent,

    // Pages
    AnnouncementsListComponent
  ],
  providers: [
    // Services
    AnnouncementsService,

    // Guards
    AnnouncementsAccessGuard
  ]
})
export class AnnouncementsModule { }
