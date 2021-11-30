import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Angular Material.
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Base.
import { BaseLayoutComponent } from './base/base-layout.component';

// Components.
import { ActivityTimeoutComponent } from './components/activity-timeout/activity-timeout.component';
import { AlertComponent } from './components/alert/alert.component';
import { HeaderComponent } from './components/header/header.component';
import { HeaderNavigationBarComponent } from './components/header/navigation-bar.component';
import { FooterComponent } from './components/footer/footer.component';

import { SvgIconComponent } from './components/icons/svg-icon.component';

import { ActionLinkComponent } from './components/navigation/action-link.component';
import { BackLinkComponent } from './components/navigation/back-link.component';
import { PrintLinkComponent } from './components/navigation/print-link.component';

import { NotificationTagComponent } from './components/notification-tag/notification-tag.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { SpinnerComponent } from './components/spinner/spinner.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,

    // Angular Material.
    MatProgressSpinnerModule
  ],
  declarations: [
    // Base.
    BaseLayoutComponent,

    // Components.
    ActivityTimeoutComponent,
    AlertComponent,
    HeaderComponent,
    HeaderNavigationBarComponent,
    FooterComponent,

    SvgIconComponent,

    ActionLinkComponent,
    BackLinkComponent,
    PrintLinkComponent,

    NotificationTagComponent,
    PaginationComponent,
    SpinnerComponent
  ],
  providers: [],
  exports: [
    // Angular Material.
    MatProgressSpinnerModule,

    // Base.
    BaseLayoutComponent,

    // Components.
    ActivityTimeoutComponent,
    AlertComponent,
    HeaderComponent,
    HeaderNavigationBarComponent,
    FooterComponent,

    SvgIconComponent,

    ActionLinkComponent,
    BackLinkComponent,
    PrintLinkComponent,

    NotificationTagComponent,
    PaginationComponent,
    SpinnerComponent
  ]
})
export class ThemeModule { }
