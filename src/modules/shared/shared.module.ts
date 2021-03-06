import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

// Modules.
import { ThemeModule } from '@modules/theme/theme.module';
import { FormsModule } from './forms/forms.module';

// Pages.
// // Account.
import { PageAccountDeleteMessageComponent } from './pages/account/delete-message/delete-message.component';
import { PageAccountEmailNotificationsComponent } from './pages/account/email-notifications/email-notifications.component';
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
import { PageInnovationRecordComponent } from './pages/innovation/record/innovation-record.component';
import { PageInnovationSectionInfoComponent } from './pages/innovation/sections/section-info.component';
import { PageInnovationSectionEvidenceInfoComponent } from './pages/innovation/sections/section-evidence-info.component';
import { PageInnovationSupportStatusListComponent } from './pages/innovation/support/innovation-support-status-list.component';
// // Notifications.
import { PageNotificationsListComponent } from './pages/notifications/notifications-list.component';
// // Terms of use.
import { PageTermsOfUseAcceptanceComponent } from '@modules/shared/pages/terms-of-use/terms-of-use-acceptance.component';

// Pipes.
import { PluralTranslatePipe } from './pipes/plural-translate.pipe';

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

    // Modules.
    ThemeModule,
    FormsModule
  ],
  declarations: [
    // Pages.
    // // Account.
    PageAccountDeleteMessageComponent,
    PageAccountEmailNotificationsComponent,
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
    PageInnovationRecordComponent,
    PageInnovationSectionInfoComponent,
    PageInnovationSectionEvidenceInfoComponent,
    PageInnovationSupportStatusListComponent,
    // // Notifications.
    PageNotificationsListComponent,
    // // Terms of use.
    PageTermsOfUseAcceptanceComponent,

    // Pipes.
    PluralTranslatePipe
  ],
  providers: [
    InnovationsService,
    NotificationsService,
    OrganisationsService,
    TermsOfUseService
  ],
  exports: [
    CommonModule,
    TranslateModule,

    // Modules.
    FormsModule,

    // Pipes.
    PluralTranslatePipe
  ]
})
export class SharedModule { }
