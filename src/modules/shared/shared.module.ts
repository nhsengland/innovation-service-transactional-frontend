import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

// Modules.
import { ThemeModule } from '@modules/theme/theme.module';
import { FormsModule } from './forms/forms.module';

// Pages.
import { PageAccountDeleteAccountMessageComponent } from './pages/account/delete-account-message/delete-account-message.component';
import { PageAccountEmailNotificationsComponent } from './pages/account/email-notifications/email-notifications.component';
import { PageAccountManageDetailsInfoComponent } from './pages/account/manage-details/manage-details-info.component';
import { PageAccountManageDetailsEditComponent } from './pages/account/manage-details/manage-details-edit.component';

import { InnovationSectionInfoComponent } from './pages/innovation/section-info.component';
import { InnovationSectionEvidenceViewComponent } from './pages/innovation/evidence-view.component';
import { PageActionStatusListComponent } from './pages/innovation/action-status-list.component';
import { PageInnovationActivityLogComponent } from './pages/innovation/innovation-activity-log.component';
import { PageInnovationRecordComponent } from './pages/innovation/innovation-record.component';
import { PageInnovationCommentsEditComponent } from './pages/innovation/comments/comments-edit.component';
import { PageInnovationCommentsListComponent } from './pages/innovation/comments/comments-list.component';
import { PageInnovationCommentsNewComponent } from './pages/innovation/comments/comments-new.component';
import { PageInnovationSupportStatusListComponent } from './pages/innovation/innovation-support-status-list.component';

import { PageTermsOfUseAcceptanceComponent } from '@shared-module/pages/terms-of-use/terms-of-use-acceptance.component';

import { PageErrorComponent } from './pages/error/error.component';
import { PageNotFoundComponent } from './pages/not-found/not-found.component';

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
    PageAccountDeleteAccountMessageComponent,
    PageAccountEmailNotificationsComponent,
    PageAccountManageDetailsInfoComponent,
    PageAccountManageDetailsEditComponent,

    InnovationSectionInfoComponent,
    InnovationSectionEvidenceViewComponent,
    PageInnovationActivityLogComponent,
    PageInnovationRecordComponent,
    PageActionStatusListComponent,
    PageInnovationCommentsListComponent,
    PageInnovationCommentsNewComponent,
    PageInnovationCommentsEditComponent,
    PageInnovationSupportStatusListComponent,
    PageTermsOfUseAcceptanceComponent,

    PageErrorComponent,
    PageNotFoundComponent,

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
