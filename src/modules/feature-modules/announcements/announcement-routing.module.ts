import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Base layout.
import { AnnouncementsLayoutComponent } from './base/announcements-layout.component';

// Pages
import { AnnouncementsListComponent } from './pages/announcements-list/announcements-list.component';

const routes: Routes = [
  {
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
