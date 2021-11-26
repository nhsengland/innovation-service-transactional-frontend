import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

// Modules.
import { ThemeModule } from '@modules/theme/theme.module';
import { FormsModule } from './forms/forms.module';

// Pages.
import { PageAccountManageDetailsInfoComponent } from './pages/account/manage-details/manage-details-info.component';
import { PageAccountManageDetailsEditComponent } from './pages/account/manage-details/manage-details-edit.component';
import { PageAccountEmailNotificationsComponent } from './pages/account/email-notifications/email-notifications.component';

import { InnovationSectionViewComponent } from './pages/innovation/section-view.component';
import { InnovationSectionEvidenceViewComponent } from './pages/innovation/evidence-view.component';
import { PageActionStatusListComponent } from './pages/innovation/action-status-list.component';
import { PageInnovationActivityLogComponent } from './pages/innovation/innovation-activity-log.component';
import { PageInnovationRecordComponent } from './pages/innovation/innovation-record.component';
import { PageInnovationCommentsListComponent } from './pages/innovation/comments/comments-list.component';
import { PageInnovationCommentsNewComponent } from './pages/innovation/comments/comments-new.component';
import { PageInnovationSupportStatusListComponent } from './pages/innovation/innovation-support-status-list.component';

import { PageErrorComponent } from './pages/error/error.component';
import { PageNotFoundComponent } from './pages/not-found/not-found.component';

import { PageAccountManageUserDeleteAccountMesasageComponent } from './pages/account/manage-deleteaccoount/manage-deleteaccount-message.component';

// Services.
import { OrganisationsService } from './services/organisations.service';
import { NotificationsService } from './services/notifications.service';

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
    PageAccountManageDetailsInfoComponent,
    PageAccountManageDetailsEditComponent,
    PageAccountEmailNotificationsComponent,

    InnovationSectionViewComponent,
    InnovationSectionEvidenceViewComponent,
    PageInnovationActivityLogComponent,
    PageInnovationRecordComponent,
    PageActionStatusListComponent,
    PageInnovationCommentsListComponent,
    PageInnovationCommentsNewComponent,
    PageInnovationSupportStatusListComponent,

    PageErrorComponent,
    PageNotFoundComponent,
    PageAccountManageUserDeleteAccountMesasageComponent
  ],
  providers: [
    OrganisationsService,
    NotificationsService
  ],
  exports: [
    CommonModule,
    TranslateModule,

    // Modules.
    FormsModule
  ]
})
export class SharedModule { }
