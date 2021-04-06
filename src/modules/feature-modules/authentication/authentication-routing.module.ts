import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Pages.
import { SignUpConfirmationComponent } from './pages/sign-up-confirmation.component';

const routes: Routes = [

  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/not-found'
  },

  {
    path: 'signup',
    pathMatch: 'full',
    redirectTo: '/not-found'
  },

  {
    path: 'signup',
    children: [
      {
        path: 'confirmation',
        pathMatch: 'full',
        component: SignUpConfirmationComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
