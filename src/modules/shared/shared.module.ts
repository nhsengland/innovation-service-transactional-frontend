import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DynamicModule } from 'ng-dynamic-component';

// Modules.
import { ReactiveFormsModule } from '@angular/forms';
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
import { InnovationSectionSummaryComponent } from './pages/innovation/sections/section-summary.component';
import { PageInnovationStatusListComponent } from './pages/innovation/status/innovation-status-list.component';
import { PageInnovationSupportStatusListComponent } from './pages/innovation/support/support-status-list.component';
import { PageInnovationSupportSummaryListComponent } from './pages/innovation/support/support-summary-list.component';
import { PageInnovationSupportSummaryProgressUpdateDeleteComponent } from './pages/innovation/support/support-summary-progress-update-delete.component';
import { PageInnovationSupportSummaryProgressUpdateWrapperComponent } from './pages/innovation/support/support-summary-progress-update-wrapper.component';
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
import { IrV3TranslatePipe } from './pipes/ir-v3-translate.pipe';
import { JoinArrayPipe } from './pipes/join-array.pipe';
import { PluralTranslatePipe } from './pipes/plural-translate.pipe';
import { ProgressCategoriesSubcategoryDescriptionPipe } from './pipes/progress-categories/category-description.pipe';
import { ProgressCategoriesCategoryDescriptionPipe } from './pipes/progress-categories/subcategory-description.pipe';
import { ServiceRoleTranslatePipe } from './pipes/service-role-translate.pipe';

// Components
import { OrganisationSuggestionsCardComponent } from './pages/innovation/data-sharing-and-support/components/organisation-suggestion-card.component';

// Resolvers.
import { InnovationAssessmentDataResolver } from './resolvers/innovation-assessment-data.resolver';
import { InnovationDataResolver } from './resolvers/innovation-data.resolver';
import { InnovationDocumentDataResolver } from './resolvers/innovation-document-data.resolver';
import { InnovationSectionDataResolver } from './resolvers/innovation-section-data.resolver';
import { InnovationSectionEvidenceDataResolver } from './resolvers/innovation-section-evidence-data.resolver';
import { InnovationTaskDataResolver } from './resolvers/innovation-task-data.resolver';
import { InnovationThreadDataResolver } from './resolvers/innovation-thread-data.resolver';

// Services.
import { FileUploadService } from '@modules/shared/services/file-upload.service';
import { FiltersSelectionWrapperComponent } from './components/filters-selection-wrapper/filters-selection-wrapper.component';
import { FiltersWrapperComponent } from './components/filters-wrapper/filters-wrapper.component';
import { PageSharedAccountManageAccountInfoComponent } from './pages/account/manage-account-info/manage-account-info.component';
import { PageAccountMFAEditComponent } from './pages/account/mfa/mfa-edit.component';
import { InnovationAssessmentDetailsComponent } from './pages/innovation/assessment/assessment-details.component';
import { PageInnovationRecordWrapperComponent } from './pages/innovation/record/innovation-record-wrapper.component';
import { PageInnovationAllSectionsInfoComponent } from './pages/innovation/sections/section-info-all.component';
import { WizardInnovationSupportSummaryProgressUpdateMilestonesCategoriesStepComponent } from './pages/innovation/support/wizard-support-summary-progress-update-milestones/steps/categories-step.component';
import { WizardInnovationSupportSummaryProgressUpdateMilestonesDateStepComponent } from './pages/innovation/support/wizard-support-summary-progress-update-milestones/steps/date-step.component';
import { WizardInnovationSupportSummaryProgressUpdateMilestonesDescriptionStepComponent } from './pages/innovation/support/wizard-support-summary-progress-update-milestones/steps/description-step.component';
import { WizardInnovationSupportSummaryProgressUpdateMilestonesSubcategoriesStepComponent } from './pages/innovation/support/wizard-support-summary-progress-update-milestones/steps/subcategories-step.component';
import { WizardInnovationSupportSummaryProgressUpdateMilestonesSummaryStepComponent } from './pages/innovation/support/wizard-support-summary-progress-update-milestones/steps/summary-step.component';
import { WizardInnovationSupportSummaryProgressUpdateMilestonesComponent } from './pages/innovation/support/wizard-support-summary-progress-update-milestones/support-summary-progress-update-milestones.component';
import { WizardInnovationSupportSummaryProgressUpdateAddDocumentStepComponent } from './pages/innovation/support/wizard-support-summary-progress-update/steps/add-document-step.component';
import { WizardInnovationSupportSummaryProgressUpdateDescriptionStepComponent } from './pages/innovation/support/wizard-support-summary-progress-update/steps/description-step.component';
import { WizardInnovationSupportSummaryProgressUpdateDocumentDescriptionStepComponent } from './pages/innovation/support/wizard-support-summary-progress-update/steps/document-description-step.component';
import { WizardInnovationSupportSummaryProgressUpdateDocumentFileStepComponent } from './pages/innovation/support/wizard-support-summary-progress-update/steps/document-file-step.component';
import { WizardInnovationSupportSummaryProgressUpdateDocumentNameStepComponent } from './pages/innovation/support/wizard-support-summary-progress-update/steps/document-name-step.component';
import { WizardInnovationSupportSummaryProgressUpdateSummaryStepComponent } from './pages/innovation/support/wizard-support-summary-progress-update/steps/summary-step.component';
import { WizardInnovationSupportSummaryProgressUpdateTitleStepComponent } from './pages/innovation/support/wizard-support-summary-progress-update/steps/title-step.component';
import { WizardInnovationSupportSummaryProgressUpdateComponent } from './pages/innovation/support/wizard-support-summary-progress-update/support-summary-progress-update.component';
import { PageProgressCategoriesOneLevelMilestoneComponent } from './pages/progress-categories/progress-categories-one-level-milestone.component';
import { PageProgressCategoriesTwoLevelMilestoneComponent } from './pages/progress-categories/progress-categories-two-level-milestone.component';
import { PageProgressCategoriesWrapperComponent } from './pages/progress-categories/progress-categories-wrapper.component';
import { InnovationDocumentsService } from './services/innovation-documents.service';
import { InnovationsService } from './services/innovations.service';
import { NotificationsService } from './services/notifications.service';
import { OrganisationsService } from './services/organisations.service';
import { StatisticsService } from './services/statistics.service';
import { TermsOfUseService } from './services/terms-of-use.service';
import { UsersService } from './services/users.service';

// Standalone components
import { InnovationSubmissionReadyComponent } from '@modules/feature-modules/innovator/pages/innovation/submission-ready/innovation-submission-ready.component';
import { InnovationRecordProgressComponent } from './pages/innovation/record/innovation-record-progress.component';

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    TranslateModule.forChild(),
    DynamicModule,

    // Modules.
    ThemeModule,
    FormsModule,
    ReactiveFormsModule,

    // Standalone
    PluralTranslatePipe,
    InnovationRecordProgressComponent,
    InnovationSubmissionReadyComponent
  ],
  declarations: [
    // Pages.
    // // Account.
    PageAccountDeleteMessageComponent,
    PageAccountEmailNotificationsEditComponent,
    PageAccountEmailNotificationsListComponent,
    PageAccountManageDetailsEditComponent,
    PageAccountManageDetailsInfoComponent,
    PageSharedAccountManageAccountInfoComponent,
    PageAccountMFAEditComponent,
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
    InnovationAssessmentDetailsComponent,
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
    PageInnovationRecordWrapperComponent,
    PageInnovationRecordComponent,
    PageInnovationSectionInfoComponent,
    PageInnovationAllSectionsInfoComponent,
    PageInnovationSectionEvidenceInfoComponent,
    PageInnovationStatusListComponent,
    PageInnovationSupportStatusListComponent,
    PageInnovationSupportSummaryListComponent,
    PageInnovationSupportSummaryProgressUpdateDeleteComponent,
    PageInnovationSupportSummaryProgressUpdateWrapperComponent,
    WizardInnovationSupportSummaryProgressUpdateMilestonesComponent,
    WizardInnovationSupportSummaryProgressUpdateMilestonesCategoriesStepComponent,
    WizardInnovationSupportSummaryProgressUpdateMilestonesSubcategoriesStepComponent,
    WizardInnovationSupportSummaryProgressUpdateMilestonesDescriptionStepComponent,
    WizardInnovationSupportSummaryProgressUpdateMilestonesDateStepComponent,
    WizardInnovationSupportSummaryProgressUpdateMilestonesSummaryStepComponent,
    PageProgressCategoriesWrapperComponent,
    PageProgressCategoriesOneLevelMilestoneComponent,
    PageProgressCategoriesTwoLevelMilestoneComponent,
    WizardInnovationSupportSummaryProgressUpdateComponent,
    WizardInnovationSupportSummaryProgressUpdateTitleStepComponent,
    WizardInnovationSupportSummaryProgressUpdateDescriptionStepComponent,
    WizardInnovationSupportSummaryProgressUpdateAddDocumentStepComponent,
    WizardInnovationSupportSummaryProgressUpdateDocumentNameStepComponent,
    WizardInnovationSupportSummaryProgressUpdateDocumentDescriptionStepComponent,
    WizardInnovationSupportSummaryProgressUpdateDocumentFileStepComponent,
    WizardInnovationSupportSummaryProgressUpdateSummaryStepComponent,

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
    JoinArrayPipe,
    ProgressCategoriesCategoryDescriptionPipe,
    ProgressCategoriesSubcategoryDescriptionPipe,
    IrV3TranslatePipe,
    ServiceRoleTranslatePipe,

    // Components
    OrganisationSuggestionsCardComponent,
    FiltersWrapperComponent,
    FiltersSelectionWrapperComponent
  ],
  providers: [
    // Resolvers.
    InnovationAssessmentDataResolver,
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
    FileUploadService,

    // Pipes.
    PluralTranslatePipe
  ],
  exports: [
    CommonModule,
    TranslateModule,
    DynamicModule,

    // Modules.
    FormsModule,

    // Pipes.
    BytesPrettyPrintPipe,
    PluralTranslatePipe,
    IrV3TranslatePipe,
    JoinArrayPipe,
    ServiceRoleTranslatePipe,

    // Components.
    InnovationAssessmentDetailsComponent
  ]
})
export class SharedModule {}
