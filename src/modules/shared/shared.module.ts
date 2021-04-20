import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

// Modules.
import { FormsModule } from './forms/forms.module';

// Pages.
import { PageNotFoundComponent } from './pages/not-found.component';

// Services.
import { OrganisationsService } from './services/organisations.service';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),

    // Modules.
    FormsModule
  ],
  declarations: [
    // Pages.
    PageNotFoundComponent
  ],
  providers: [
    OrganisationsService
  ],
  exports: [
    CommonModule,
    TranslateModule,

    FormsModule
  ]
})
export class SharedModule { }
