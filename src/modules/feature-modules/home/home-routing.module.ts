import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Pages.
import { HomeLayoutComponent } from './base/home-layout.component';
import { HomeComponent } from './home.component';


const routes: Routes = [
  {
    path: '',
    component: HomeLayoutComponent,
    children: [
      { path: '', pathMatch: 'full', component: HomeComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
