import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

// Angular Material.
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Base.
import { BaseLayoutComponent } from './base/base-layout.component';
import { TransactionalLayoutComponent } from './base/transactional-layout.component';

// Components.
import { ActivityTimeoutComponent } from './components/activity-timeout/activity-timeout.component';
import { AlertComponent } from './components/alert/alert.component';
import { AnnouncementGenericComponent } from './components/announcements/announcement-generic.component';
import { ContentWrapperComponent } from './components/content-wrapper/content-wrapper.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderBreadcrumbsBarComponent } from './components/header/breadcrumbs-bar.component';
import { HeaderComponent } from './components/header/header.component';
import { HeaderNavigationBarComponent } from './components/header/navigation-bar.component';

import { SvgIconComponent } from './components/icons/svg-icon.component';

import { ActionLinkComponent } from './components/navigation/action-link.component';
import { BackLinkComponent } from './components/navigation/back-link.component';
import { PrintLinkComponent } from './components/navigation/print-link.component';

import { ChipsFilterComponent } from './components/chips/chips-filter-component';
import { CollapsibleFilterComponent } from './components/collapsible-filter/collapsible-filter.component';
import { InnovationRecordExportComponent } from './components/innovation-record-export/innovation-record-export.component';
import { GoToTopComponent } from './components/navigation/go-to-top-link.component';
import { NotificationTagComponent } from './components/notification-tag/notification-tag.component';
import { PageTitleComponent } from './components/page-title/page-title.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { StatisticsCardsComponent } from './components/statistics-cards/statistics-cards.component';
import { TagComponent } from './components/tag/tag.component';
import { InnovationAdvancedSearchCardComponent } from '@modules/shared/pages/innovations/innovation-advanced-search-card.component';
import { SelectComponent } from './components/search/select.component';
import { FormsModule } from '@angular/forms';
import { HeaderArchivedBannerComponent } from './components/header/header-archived-banner.component';
import { OnOffTagComponent } from './components/on-off-tag/on-off-tag.component';
import { AccountMFAListComponent } from '@modules/shared/pages/account/mfa/mfa-list.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule.forChild(),

    // Angular Material.
    MatProgressSpinnerModule,

    FormsModule
  ],
  declarations: [
    // Base.
    BaseLayoutComponent,
    TransactionalLayoutComponent,

    // Components.
    ActivityTimeoutComponent,
    AlertComponent,
    AnnouncementGenericComponent,
    ContentWrapperComponent,
    HeaderComponent,
    HeaderBreadcrumbsBarComponent,
    HeaderNavigationBarComponent,
    FooterComponent,

    SvgIconComponent,

    ActionLinkComponent,
    BackLinkComponent,
    PrintLinkComponent,

    NotificationTagComponent,
    PageTitleComponent,
    PaginationComponent,
    SpinnerComponent,
    TagComponent,
    OnOffTagComponent,
    StatisticsCardsComponent,

    InnovationRecordExportComponent,

    ChipsFilterComponent,
    CollapsibleFilterComponent,

    GoToTopComponent,

    InnovationAdvancedSearchCardComponent,

    SelectComponent,

    HeaderArchivedBannerComponent,
    AccountMFAListComponent
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
    AnnouncementGenericComponent,
    ContentWrapperComponent,
    HeaderComponent,
    HeaderBreadcrumbsBarComponent,
    HeaderNavigationBarComponent,
    FooterComponent,

    SvgIconComponent,

    ActionLinkComponent,
    BackLinkComponent,
    PrintLinkComponent,

    NotificationTagComponent,
    PageTitleComponent,
    PaginationComponent,
    SpinnerComponent,
    TagComponent,
    OnOffTagComponent,
    StatisticsCardsComponent,

    ChipsFilterComponent,
    CollapsibleFilterComponent,

    InnovationRecordExportComponent,

    GoToTopComponent,

    SelectComponent,

    InnovationAdvancedSearchCardComponent,

    HeaderArchivedBannerComponent,

    AccountMFAListComponent
  ]
})
export class ThemeModule {}
