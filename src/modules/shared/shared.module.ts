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
import { PageAccountManageDetailsInfoComponent } from './pages/account/manage-details/manage-details-info.component';
import { PageAccountManageDetailsEditComponent } from './pages/account/manage-details/manage-details-edit.component';
// // Error.
import { PageErrorComponent } from './pages/error/error.component';
import { PageNotFoundComponent } from './pages/error/not-found.component';
// // Innovation.
import { PageActionStatusListComponent } from './pages/innovation/actions/action-status-list.component';
import { PageInnovationActivityLogComponent } from './pages/innovation/activity-log/innovation-activity-log.component';
import { PageInnovationCommentsEditComponent } from './pages/innovation/comments/comments-edit.component';
import { PageInnovationCommentsListComponent } from './pages/innovation/comments/comments-list.component';
import { PageInnovationCommentsNewComponent } from './pages/innovation/comments/comments-new.component';
import { PageInnovationThreadMessageEditComponent } from './pages/innovation/messages/thread-message-edit.component';
import { PageInnovationThreadMessagesListComponent } from './pages/innovation/messages/thread-messages-list.component';
import { PageInnovationThreadNewComponent } from './pages/innovation/messages/thread-new.component';
import { PageInnovationThreadsListComponent } from './pages/innovation/messages/threads-list.component';
import { PageInnovationRecordComponent } from './pages/innovation/record/innovation-record.component';
import { PageInnovationSectionInfoComponent } from './pages/innovation/sections/section-info.component';
import { PageInnovationSectionEvidenceInfoComponent } from './pages/innovation/sections/section-evidence-info.component';
import { PageInnovationSupportStatusListComponent } from './pages/innovation/support/innovation-support-status-list.component';
import { PageInnovationStatusListComponent } from './pages/innovation/status/innovation-status-list.component';
import { PageExportRecordInfoComponent } from './pages/innovation/export/export-record-info.component';
import { PageExportRecordListComponent } from './pages/innovation/export/export-record-list.component';
// // Notifications.
import { PageNotificationsListComponent } from './pages/notifications/notifications-list.component';
// // Terms of use.
import { PageTermsOfUseAcceptanceComponent } from '@modules/shared/pages/terms-of-use/terms-of-use-acceptance.component';

// Wizards.
import { WizardSummaryWithConfirmStepComponent } from './wizards/steps/summary-with-confirm-step.component';

// Pipes.
import { PluralTranslatePipe } from './pipes/plural-translate.pipe';

// Resolvers.
import { InnovationActionDataResolver } from './resolvers/innovation-action-data.resolver';
import { InnovationDataResolver } from './resolvers/innovation-data.resolver';
import { InnovationSectionDataResolver } from './resolvers/innovation-section-data.resolver';
import { InnovationSectionEvidenceDataResolver } from './resolvers/innovation-section-evidence-data.resolver';
import { InnovationThreadDataResolver } from './resolvers/innovation-thread-data.resolver';

// Services.
import { InnovationsService } from './services/innovations.service';
import { NotificationsService } from './services/notifications.service';
import { OrganisationsService } from './services/organisations.service';
import { TermsOfUseService } from './services/terms-of-use.service';


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
    PageAccountManageDetailsInfoComponent,
    PageAccountManageDetailsEditComponent,
    // // Error.
    PageErrorComponent,
    PageNotFoundComponent,
    // // Innovation.
    PageActionStatusListComponent,
    PageInnovationActivityLogComponent,
    PageInnovationCommentsEditComponent,
    PageInnovationCommentsListComponent,
    PageInnovationCommentsNewComponent,
    PageInnovationThreadMessageEditComponent,
    PageInnovationThreadMessagesListComponent,
    PageInnovationThreadNewComponent,
    PageInnovationThreadsListComponent,
    PageInnovationRecordComponent,
    PageInnovationSectionInfoComponent,
    PageInnovationSectionEvidenceInfoComponent,
    PageInnovationSupportStatusListComponent,
    PageInnovationStatusListComponent,
    PageExportRecordListComponent,
    PageExportRecordInfoComponent,
    // // Notifications.
    PageNotificationsListComponent,
    // // Terms of use.
    PageTermsOfUseAcceptanceComponent,

    // Wizard.
    WizardSummaryWithConfirmStepComponent,

    // Pipes.
    PluralTranslatePipe
  ],
  providers: [
    // Resolvers.
    InnovationActionDataResolver,
    InnovationDataResolver,
    InnovationSectionDataResolver,
    InnovationSectionEvidenceDataResolver,
    InnovationThreadDataResolver,

    // Services.
    InnovationsService,
    NotificationsService,
    OrganisationsService,
    TermsOfUseService
  ],
  exports: [
    CommonModule,
    TranslateModule,
    DynamicModule,

    // Modules.
    FormsModule,

    // Pipes.
    PluralTranslatePipe
  ]
})
export class SharedModule { }
