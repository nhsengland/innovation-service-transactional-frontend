import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Base.
import { BaseLayoutComponent } from './base/base-layout.component';

// Components.
import { ActivityTimeoutComponent } from './components/activity-timeout/activity-timeout.component';
import { HeaderComponent } from './components/header/header.component';
import { HeaderBreadcrumbsBarComponent } from './components/header/breadcrumbs-bar.component';
import { HeaderNavigationBarComponent } from './components/header/navigation-bar.component';
import { FooterComponent } from './components/footer/footer.component';

import { SvgIconComponent } from './components/icons/svg-icon.component';

import { ActionLinkComponent } from './components/navigation/action-link.component';
import { BackLinkComponent } from './components/navigation/back-link.component';
import { PrintLinkComponent } from './components/navigation/print-link.component';

import { NotificationTagComponent } from './components/tag/notification-tag.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [
    // Base.
    BaseLayoutComponent,

    // Components.
    ActivityTimeoutComponent,
    HeaderComponent,
    HeaderBreadcrumbsBarComponent,
    HeaderNavigationBarComponent,
    FooterComponent,

    SvgIconComponent,

    ActionLinkComponent,
    BackLinkComponent,
    PrintLinkComponent,

    NotificationTagComponent
  ],
  providers: [],
  exports: [
    // Base.
    BaseLayoutComponent,

    // Components.
    ActivityTimeoutComponent,
    HeaderComponent,
    HeaderBreadcrumbsBarComponent,
    HeaderNavigationBarComponent,
    FooterComponent,

    SvgIconComponent,

    ActionLinkComponent,
    BackLinkComponent,
    PrintLinkComponent,

    NotificationTagComponent
  ]
})
export class ThemeModule { }
