import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

// Modules.
import { ThemeModule } from '@modules/theme/theme.module';
import { FormsModule } from './forms/forms.module';

// Pages.
import { InnovationSectionViewComponent } from './pages/innovation/section-view.component';
import { InnovationSectionEvidenceViewComponent } from './pages/innovation/evidence-view.component';
import { PageInnovationRecordComponent } from './pages/innovation/innovation-record.component';
import { PageActionStatusListComponent } from './pages/innovation/action-status-list.component';
import { PageInnovationCommentsListComponent } from './pages/innovation/comments/comments-list.component';
import { PageInnovationCommentsNewComponent } from './pages/innovation/comments/comments-new.component';
import { PageInnovationSupportStatusListComponent } from './pages/innovation/innovation-support-status-list.component';
import { PageNotFoundComponent } from './pages/not-found/not-found.component';

// Services.
import { OrganisationsService } from './services/organisations.service';

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
    InnovationSectionViewComponent,
    InnovationSectionEvidenceViewComponent,
    PageInnovationRecordComponent,
    PageActionStatusListComponent,
    PageInnovationCommentsListComponent,
    PageInnovationCommentsNewComponent,
    PageInnovationSupportStatusListComponent,
    PageNotFoundComponent
  ],
  providers: [
    OrganisationsService
  ],
  exports: [
    CommonModule,
    TranslateModule,

    // Modules.
    FormsModule
  ]
})
export class SharedModule { }
