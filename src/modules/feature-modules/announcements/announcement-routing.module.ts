import { NgModule } from '@angular/core';
import { RouterModule, Routes, mapToCanActivate } from '@angular/router';

// Layout.
import { TransactionalLayoutComponent } from '@modules/theme/base/transactional-layout.component';

// Pages
import { AnnouncementsListComponent } from './pages/announcements-list/announcements-list.component';

// Guards
import { AnnouncementsAccessGuard } from './guards/announcements-access.guard';


const routes: Routes = [
  {
    path: '', component: TransactionalLayoutComponent,
    canActivate: mapToCanActivate([AnnouncementsAccessGuard]),
    children: [
      {
        path: '', pathMatch: 'full', component: AnnouncementsListComponent,
        data: {
          header: { menuBarItems: { left: [], right: [], notifications: {} } },
          layout: { type: 'full' }
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnnouncementRoutingModule { }
