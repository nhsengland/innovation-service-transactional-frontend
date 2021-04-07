import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Base.
import { BaseLayoutComponent } from './base/base-layout.component';

// Components.
import { HeaderComponent } from './components/header/header.component';
import { HeaderNavigationBarComponent } from './components/header/navigation-bar.component';
import { FooterComponent } from './components/footer/footer.component';

import { ActionLinkComponent } from './components/navigation/action-link.component';
import { BackLinkComponent } from './components/navigation/back-link.component';
import { PrintLinkComponent } from './components/navigation/print-link.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [
    // Base.
    BaseLayoutComponent,

    // Components.
    HeaderComponent,
    HeaderNavigationBarComponent,
    FooterComponent,

    ActionLinkComponent,
    BackLinkComponent,
    PrintLinkComponent
  ],
  providers: [],
  exports: [
    // Base.
    BaseLayoutComponent,

    // Components.
    HeaderComponent,
    HeaderNavigationBarComponent,
    FooterComponent,

    ActionLinkComponent,
    BackLinkComponent,
    PrintLinkComponent
  ]
})
export class ThemeModule { }
