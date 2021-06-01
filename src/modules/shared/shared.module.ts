import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

// Modules.
import { ThemeModule } from '@modules/theme/theme.module';
import { FormsModule } from './forms/forms.module';

// Pages.
import { PageInnovationRecordComponent } from './pages/innovation/innovation-record.component';
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
    PageInnovationRecordComponent,
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
