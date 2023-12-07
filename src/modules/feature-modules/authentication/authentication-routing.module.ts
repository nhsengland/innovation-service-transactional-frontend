import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Base layout.
import { BaseLayoutComponent } from '@modules/theme/base/base-layout.component';

// Pages.
import { SignUpConfirmationComponent } from './pages/sign-up-confirmation.component';

const routes: Routes = [
  {
    path: '',
    component: BaseLayoutComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: '/not-found' },

      {
        path: 'signup',
        children: [
          { path: '', pathMatch: 'full', redirectTo: '/not-found' },

          { path: 'confirmation', pathMatch: 'full', component: SignUpConfirmationComponent }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule {}
