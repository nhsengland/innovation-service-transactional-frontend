import { NgModule } from '@angular/core';

import { ThemeModule } from '@modules/theme/theme.module';
import { SharedModule } from '@modules/shared/shared.module';

import { AuthenticationRoutingModule } from './authentication-routing.module';

// Pages.
import { SignUpConfirmationComponent } from './pages/sign-up-confirmation.component';

@NgModule({
  imports: [ThemeModule, SharedModule, AuthenticationRoutingModule],
  declarations: [
    // Pages.
    SignUpConfirmationComponent
  ]
})
export class AuthenticationModule {}
