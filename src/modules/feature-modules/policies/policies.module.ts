import { NgModule } from '@angular/core';

import { ThemeModule } from '@modules/theme/theme.module';
import { SharedModule } from '@modules/shared/shared.module';

import { PoliciesRoutingModule } from './policies-routing.module';

// Pages.
import { CookiesInfoComponent } from './pages/cookies/cookies-info.component';
import { CookiesEditComponent } from './pages/cookies/cookies-edit.component';
import { CookiesEditConfirmationComponent } from './pages/cookies/cookies-edit-confirmation.component';


@NgModule({
  imports: [
    ThemeModule,
    SharedModule,

    PoliciesRoutingModule
  ],
  declarations: [
    // Pages.
    CookiesInfoComponent,
    CookiesEditComponent,
    CookiesEditConfirmationComponent
  ]
})
export class PoliciesModule { }
