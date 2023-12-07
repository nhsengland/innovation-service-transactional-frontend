import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Base layout.
import { BaseLayoutComponent } from '@modules/theme/base/base-layout.component';

// Pages.
import { CookiesInfoComponent } from './pages/cookies/cookies-info.component';
import { CookiesEditComponent } from './pages/cookies/cookies-edit.component';
import { CookiesEditConfirmationComponent } from './pages/cookies/cookies-edit-confirmation.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'cookies-policy' },

  {
    path: 'cookies-policy',
    component: BaseLayoutComponent,
    children: [
      { path: '', pathMatch: 'full', component: CookiesInfoComponent },
      { path: 'edit', pathMatch: 'full', component: CookiesEditComponent },
      { path: 'confirmation', pathMatch: 'full', component: CookiesEditConfirmationComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PoliciesRoutingModule {}
