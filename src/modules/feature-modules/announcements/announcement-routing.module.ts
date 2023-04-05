import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Base layout.
import { AnnouncementsLayoutComponent } from './base/announcements-layout.component';

// Guards
import { AnnouncementsAccessGuard } from './guards/announcements-access.guard';

// Pages
import { AnnouncementsListComponent } from './pages/announcements-list/announcements-list.component';

const routes: Routes = [
  {
    canActivate: [AnnouncementsAccessGuard],
    path: '',
    component: AnnouncementsLayoutComponent,
    children: [
      { path: '', pathMatch: 'full', component: AnnouncementsListComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnnouncementRoutingModule { }
