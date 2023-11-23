import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
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
import { PageTasksAdvancedSearchComponent } from './pages/tasks/tasks-advanced-search.component';
// // Error.
import { PageErrorComponent } from './pages/error/error.component';
import { PageNotFoundComponent } from './pages/error/not-found.component';
// // Innovation.
import { PageInnovationActivityLogComponent } from './pages/innovation/activity-log/innovation-activity-log.component';
import { PageInnovationAssessmentOverviewComponent } from './pages/innovation/assessment/assessment-overview.component';
import { PageInnovationDataSharingAndSupportComponent } from './pages/innovation/data-sharing-and-support/data-sharing-and-support.component';
import { PageInnovationDocumentInfoComponent } from './pages/innovation/documents/document-info.component';
import { PageInnovationDocumentsNewditComponent } from './pages/innovation/documents/document-newdit.component';
import { PageInnovationDocumentsListComponent } from './pages/innovation/documents/documents-list.component';
import { PageEveryoneWorkingOnInnovationComponent } from './pages/innovation/everyone-working-on-innovation/everyone-working-on-innovation.component';
import { PageInnovationExportRequestInfoComponent } from './pages/innovation/export-requests/export-request-info.component';
import { PageInnovationExportRequestNewComponent } from './pages/innovation/export-requests/export-request-new.component';
import { PageInnovationExportRequestsListComponent } from './pages/innovation/export-requests/export-requests-list.component';
import { PageInnovationTaskActionComponent } from './pages/innovation/tasks/task-action.component';
import { PageInnovationTaskDetailsComponent } from './pages/innovation/tasks/task-details.component';
import { PageTaskStatusListComponent } from './pages/innovation/tasks/task-status-list.component';
import { PageInnovationTaskToDoListComponent } from './pages/innovation/tasks/task-to-do-list.component';
import { WizardTaskNewMessageStepComponent } from './pages/innovation/tasks/wizard-task-new/steps/message-step.component';
import { WizardTaskNewSectionStepComponent } from './pages/innovation/tasks/wizard-task-new/steps/section-step.component';
import { PageInnovationTaskNewComponent } from './pages/innovation/tasks/wizard-task-new/task-new.component';

import { PageInnovationThreadMessageEditComponent } from './pages/innovation/messages/thread-message-edit.component';
import { PageInnovationThreadMessagesListComponent } from './pages/innovation/messages/thread-messages-list.component';
import { PageInnovationThreadRecipientsComponent } from './pages/innovation/messages/thread-recipients.component';
import { PageInnovationThreadsListComponent } from './pages/innovation/messages/threads-list.component';
import { WizardInnovationThreadNewOrganisationsStepComponent } from './pages/innovation/messages/wizard-thread-new/steps/organisations-step.component';
import { WizardInnovationThreadNewSubjectMessageStepComponent } from './pages/innovation/messages/wizard-thread-new/steps/subject-message-step.component';
import { WizardInnovationThreadNewWarningStepComponent } from './pages/innovation/messages/wizard-thread-new/steps/warning-step.component';
import { WizardInnovationThreadNewComponent } from './pages/innovation/messages/wizard-thread-new/thread-new.component';

import { PageInnovationRecordDownloadComponent } from './pages/innovation/record/innovation-record-download.component';
import { PageInnovationRecordComponent } from './pages/innovation/record/innovation-record.component';
import { PageInnovationSectionEvidenceInfoComponent } from './pages/innovation/sections/section-evidence-info.component';
import { PageInnovationSectionInfoComponent } from './pages/innovation/sections/section-info.component';
import { PageInnovationStatusListComponent } from './pages/innovation/status/innovation-status-list.component';
import { PageInnovationSupportStatusListComponent } from './pages/innovation/support/support-status-list.component';
import { PageInnovationSupportSummaryListComponent } from './pages/innovation/support/support-summary-list.component';
import { PageInnovationSupportSummaryProgressUpdateDeleteComponent } from './pages/innovation/support/support-summary-progress-update-delete.component';
import { PageInnovationSupportSummaryProgressUpdateComponent } from './pages/innovation/support/support-summary-progress-update.component';

import { InnovationSectionSummaryComponent } from './pages/innovation/sections/section-summary.component';
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
import { InnovationDataResolver } from './resolvers/innovation-data.resolver';
import { InnovationDocumentDataResolver } from './resolvers/innovation-document-data.resolver';
import { InnovationSectionDataResolver } from './resolvers/innovation-section-data.resolver';
import { InnovationSectionEvidenceDataResolver } from './resolvers/innovation-section-evidence-data.resolver';
import { InnovationTaskDataResolver } from './resolvers/innovation-task-data.resolver';
import { InnovationThreadDataResolver } from './resolvers/innovation-thread-data.resolver';

// Services.
import { InnovationDocumentsService } from './services/innovation-documents.service';
import { InnovationsService } from './services/innovations.service';
import { NotificationsService } from './services/notifications.service';
import { OrganisationsService } from './services/organisations.service';
import { StatisticsService } from './services/statistics.service';
import { TermsOfUseService } from './services/terms-of-use.service';
import { UsersService } from './services/users.service';
import { FileUploadService } from '@modules/shared/services/file-upload.service';
import { PageInnovationAllSectionsInfoComponent } from './pages/innovation/sections/secion-info-all.component';

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
    // // Tasks.
    PageTasksAdvancedSearchComponent,
    // // Error.
    PageErrorComponent,
    PageNotFoundComponent,
    // // Innovation.
    PageInnovationTaskDetailsComponent,
    PageTaskStatusListComponent,
    PageInnovationTaskToDoListComponent,
    PageInnovationTaskNewComponent,
    WizardTaskNewSectionStepComponent,
    WizardTaskNewMessageStepComponent,
    PageInnovationActivityLogComponent,
    PageInnovationAssessmentOverviewComponent,
    PageInnovationDataSharingAndSupportComponent,
    PageInnovationDocumentsNewditComponent,
    PageInnovationDocumentInfoComponent,
    PageInnovationDocumentsListComponent,
    PageEveryoneWorkingOnInnovationComponent,
    PageInnovationExportRequestInfoComponent,
    PageInnovationExportRequestNewComponent,
    PageInnovationExportRequestsListComponent,
    PageInnovationTaskActionComponent,

    WizardInnovationThreadNewComponent,
    WizardInnovationThreadNewOrganisationsStepComponent,
    WizardInnovationThreadNewSubjectMessageStepComponent,
    WizardInnovationThreadNewWarningStepComponent,
    PageInnovationThreadMessageEditComponent,
    PageInnovationThreadMessagesListComponent,
    PageInnovationThreadsListComponent,
    PageInnovationThreadRecipientsComponent,

    PageInnovationRecordDownloadComponent,
    PageInnovationRecordComponent,
    PageInnovationSectionInfoComponent,
    PageInnovationAllSectionsInfoComponent,
    PageInnovationSectionEvidenceInfoComponent,
    PageInnovationStatusListComponent,
    PageInnovationSupportStatusListComponent,
    PageInnovationSupportSummaryListComponent,
    PageInnovationSupportSummaryProgressUpdateDeleteComponent,
    PageInnovationSupportSummaryProgressUpdateComponent,

    InnovationSectionSummaryComponent,
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
    InnovationTaskDataResolver,
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
    UsersService,
    FileUploadService
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
