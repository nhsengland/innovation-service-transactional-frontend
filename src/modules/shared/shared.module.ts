import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DynamicModule } from 'ng-dynamic-component';

// Modules.
import { ThemeModule } from '@modules/theme/theme.module';
import { FormsModule } from './forms/forms.module';

// Pages.
// // Account.
import { PageAccountDeleteMessageComponent } from './pages/account/delete-message/delete-message.component';
import { PageAccountEmailNotificationsEditComponent } from './pages/account/email-notifications/email-notifications-edit.component';
import { PageAccountEmailNotificationsListComponent } from './pages/account/email-notifications/email-notifications-list.component';
import { PageAccountManageDetailsEditComponent } from './pages/account/manage-details/manage-details-edit.component';
import { PageAccountManageDetailsInfoComponent } from './pages/account/manage-details/manage-details-info.component';
// // Actions.
import { PageActionsAdvancedSearchComponent } from './pages/actions/actions-advanced-search.component';
// // Error.
import { PageErrorComponent } from './pages/error/error.component';
import { PageNotFoundComponent } from './pages/error/not-found.component';
// // Innovation.
import { PageInnovationActionSectionInfoComponent } from './pages/innovation/actions/action-section-info.component';
import { PageActionStatusListComponent } from './pages/innovation/actions/action-status-list.component';
import { PageInnovationActionTrackerCancelComponent } from './pages/innovation/actions/action-tracker-cancel.component';
import { PageInnovationActionTrackerEditComponent } from './pages/innovation/actions/action-tracker-edit.component';
import { PageInnovationActionTrackerListComponent } from './pages/innovation/actions/action-tracker-list.component';
import { PageInnovationActionTrackerNewComponent } from './pages/innovation/actions/action-tracker-new.component';
import { PageInnovationActivityLogComponent } from './pages/innovation/activity-log/innovation-activity-log.component';
import { PageInnovationAssessmentOverviewComponent } from './pages/innovation/assessment/assessment-overview.component';
import { PageInnovationDataSharingAndSupportComponent } from './pages/innovation/data-sharing-and-support/data-sharing-and-support.component';
import { PageInnovationDocumentsNewditComponent } from './pages/innovation/documents/document-newdit.component';
import { PageInnovationDocumentInfoComponent } from './pages/innovation/documents/document-info.component';
import { PageInnovationDocumentsListComponent } from './pages/innovation/documents/documents-list.component';
import { PageEveryoneWorkingOnInnovationComponent } from './pages/innovation/everyone-working-on-innovation/everyone-working-on-innovation.component';
import { PageExportRecordInfoComponent } from './pages/innovation/export/export-record-info.component';
import { PageExportRecordListComponent } from './pages/innovation/export/export-record-list.component';
import { PageInnovationThreadMessageEditComponent } from './pages/innovation/messages/thread-message-edit.component';
import { PageInnovationThreadMessagesListComponent } from './pages/innovation/messages/thread-messages-list.component';
import { PageInnovationThreadNewComponent } from './pages/innovation/messages/thread-new.component';
import { PageInnovationThreadsListComponent } from './pages/innovation/messages/threads-list.component';
import { PageInnovationRecordComponent } from './pages/innovation/record/innovation-record.component';
import { PageInnovationSectionInfoComponent } from './pages/innovation/sections/section-info.component';
import { PageInnovationSectionEvidenceInfoComponent } from './pages/innovation/sections/section-evidence-info.component';
import { PageInnovationStatusListComponent } from './pages/innovation/status/innovation-status-list.component';
import { PageInnovationSupportStatusListComponent } from './pages/innovation/support/support-status-list.component';
import { PageInnovationSupportSummaryListComponent } from './pages/innovation/support/support-summary-list.component';
import { PageInnovationSupportSummaryProgressUpdateDeleteComponent } from './pages/innovation/support/support-summary-progress-update-delete.component';
import { PageInnovationSupportSummaryProgressUpdateComponent } from './pages/innovation/support/support-summary-progress-update.component';
// // Innovations.
import { PageInnovationsAdvancedReviewComponent } from './pages/innovations/innovations-advanced-review.component';
// // Notifications.
import { PageNotificationsListComponent } from './pages/notifications/notifications-list.component';
// // Switch context.
import { PageSwitchContextComponent } from './pages/switch-context/switch-context.component';
// // Terms of use.
import { PageTermsOfUseAcceptanceComponent } from './pages/terms-of-use/terms-of-use-acceptance.component';

// Wizards.
import { WizardSummaryWithConfirmStepComponent } from './wizards/steps/summary-with-confirm-step.component';

// Pipes.
import { BytesPrettyPrintPipe } from './pipes/bytes-pretty-print.pipe';
import { PluralTranslatePipe } from './pipes/plural-translate.pipe';

// Components
import { OrganisationSuggestionsCardComponent } from './pages/innovation/data-sharing-and-support/components/organisation-suggestion-card.component';

// Resolvers.
import { InnovationActionDataResolver } from './resolvers/innovation-action-data.resolver';
import { InnovationDataResolver } from './resolvers/innovation-data.resolver';
import { InnovationDocumentDataResolver } from './resolvers/innovation-document-data.resolver';
import { InnovationSectionDataResolver } from './resolvers/innovation-section-data.resolver';
import { InnovationSectionEvidenceDataResolver } from './resolvers/innovation-section-evidence-data.resolver';
import { InnovationThreadDataResolver } from './resolvers/innovation-thread-data.resolver';

// Services.
import { InnovationsService } from './services/innovations.service';
import { InnovationDocumentsService } from './services/innovation-documents.service';
import { NotificationsService } from './services/notifications.service';
import { OrganisationsService } from './services/organisations.service';
import { TermsOfUseService } from './services/terms-of-use.service';
import { StatisticsService } from './services/statistics.service';
import { UsersService } from './services/users.service';


@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    TranslateModule.forChild(),
    DynamicModule,

    // Modules.
    ThemeModule,
    FormsModule
  ],
  declarations: [
    // Pages.
    // // Account.
    PageAccountDeleteMessageComponent,
    PageAccountEmailNotificationsEditComponent,
    PageAccountEmailNotificationsListComponent,
    PageAccountManageDetailsEditComponent,
    PageAccountManageDetailsInfoComponent,
    // // Actions.
    PageActionsAdvancedSearchComponent,
    // // Error.
    PageErrorComponent,
    PageNotFoundComponent,
    // // Innovation.
    PageInnovationActionSectionInfoComponent,
    PageActionStatusListComponent,
    PageInnovationActionTrackerCancelComponent,
    PageInnovationActionTrackerEditComponent,
    PageInnovationActionTrackerListComponent,
    PageInnovationActionTrackerNewComponent,
    PageInnovationActivityLogComponent,
    PageInnovationAssessmentOverviewComponent,
    PageInnovationDataSharingAndSupportComponent,
    PageInnovationDocumentsNewditComponent,
    PageInnovationDocumentInfoComponent,
    PageInnovationDocumentsListComponent,
    PageEveryoneWorkingOnInnovationComponent,
    PageExportRecordInfoComponent,
    PageExportRecordListComponent,
    PageInnovationThreadMessageEditComponent,
    PageInnovationThreadMessagesListComponent,
    PageInnovationThreadNewComponent,
    PageInnovationThreadsListComponent,
    PageInnovationRecordComponent,
    PageInnovationSectionInfoComponent,
    PageInnovationSectionEvidenceInfoComponent,
    PageInnovationStatusListComponent,
    PageInnovationSupportStatusListComponent,
    PageInnovationSupportSummaryListComponent,
    PageInnovationSupportSummaryProgressUpdateDeleteComponent,
    PageInnovationSupportSummaryProgressUpdateComponent,
    // // Innovations.
    PageInnovationsAdvancedReviewComponent,
    // // Notifications.
    PageNotificationsListComponent,
    // // Switch context.
    PageSwitchContextComponent,
    // // Terms of use.
    PageTermsOfUseAcceptanceComponent,

    // Wizard.
    WizardSummaryWithConfirmStepComponent,

    // Pipes.
    BytesPrettyPrintPipe,
    PluralTranslatePipe,

    // Components
    OrganisationSuggestionsCardComponent,
  ],
  providers: [
    // Resolvers.
    InnovationActionDataResolver,
    InnovationDataResolver,
    InnovationDocumentDataResolver,
    InnovationSectionDataResolver,
    InnovationSectionEvidenceDataResolver,
    InnovationThreadDataResolver,

    // Services.
    InnovationDocumentsService,
    InnovationsService,
    NotificationsService,
    OrganisationsService,
    TermsOfUseService,
    StatisticsService,
    UsersService
  ],
  exports: [
    CommonModule,
    TranslateModule,
    DynamicModule,

    // Modules.
    FormsModule,

    // Pipes.
    BytesPrettyPrintPipe,
    PluralTranslatePipe
  ]
})
export class SharedModule { }
