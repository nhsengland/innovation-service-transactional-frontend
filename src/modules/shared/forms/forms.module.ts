import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule as AngularFormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDropzoneModule } from 'ngx-dropzone';

// Angular Material.
import { MatAutocompleteModule } from '@angular/material/autocomplete';

// Components.
import { FormEngineComponent } from './engine/form-engine.component';

import { FormCheckboxComponent } from './components/checkbox.component';
import { FormCheckboxArrayComponent } from './components/checkbox-array.component';
import { FormCheckboxGroupComponent } from './components/checkbox-group.component';
import { FormFileUploadArrayComponent } from './components/file-upload-array.component';
import { FormFileUploadComponent } from './components/file-upload.component';
import { FormFileUploadPreviewComponent } from './components/file-upload-preview.component';
import { FormGroupedCheckboxArrayComponent } from './components/grouped-checkbox-array.component';
import { FormInputComponent } from './components/input.component';
import { FormInputAutocompleteArrayComponent } from './components/input-autocomplete-array.component';
import { FormInputAutocompleteValueComponent } from './components/input-autocomplete-value.component';
import { FormRadioGroupComponent } from './components/radio-group.component';
import { FormTextareaComponent } from './components/textarea.component';
import { FormFileUploadDescriptiveComponent } from './components/file-upload-descriptive.component';
import { FormDateInputComponent } from './components/date-input.component';
import { FormSelectComponent } from './components/select.component';
import { FormRadioGroupV3Component } from './components/radio-group-v3.component';
import { FormCheckboxArrayV3Component } from './components/checkbox-array-v3.component';
import { FormEngineV3Component } from './engine/form-engine-v3.component';
import { FormCheckboxGroupV3Component } from './components/checkbox-group-v3.component';
import { FormInputAutocompleteArrayV3Component } from './components/input-autocomplete-array-v3.component';
import { FormIRSelectableFiltersFilterComponent } from '@modules/feature-modules/admin/pages/announcements/ir-selectable-filters-filter.component';
import { ThemeModule } from '../../theme/theme.module';
import { FormIRSelectableFiltersComponent } from '@modules/feature-modules/admin/pages/announcements/ir-selectable-filters.component';

@NgModule({
  imports: [
    CommonModule,
    AngularFormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NgxDropzoneModule,
    // Angular Material.
    MatAutocompleteModule,
    ThemeModule
  ],
  declarations: [
    FormEngineComponent,
    FormEngineV3Component,

    FormFileUploadPreviewComponent,
    FormCheckboxComponent,
    FormCheckboxArrayComponent,
    FormCheckboxArrayV3Component,
    FormCheckboxGroupComponent,
    FormCheckboxGroupV3Component,
    FormFileUploadArrayComponent,
    FormFileUploadComponent,
    FormGroupedCheckboxArrayComponent,
    FormInputComponent,
    FormInputAutocompleteArrayComponent,
    FormInputAutocompleteArrayV3Component,
    FormInputAutocompleteValueComponent,
    FormRadioGroupComponent,
    FormRadioGroupV3Component,
    FormTextareaComponent,
    FormFileUploadDescriptiveComponent,
    FormDateInputComponent,
    FormSelectComponent,
    FormIRSelectableFiltersFilterComponent,
    FormIRSelectableFiltersComponent
  ],
  exports: [
    // CommonModule,
    // FormsModule,
    AngularFormsModule,
    ReactiveFormsModule,

    FormEngineComponent,
    FormEngineV3Component,

    FormCheckboxComponent,
    FormCheckboxArrayComponent,
    FormCheckboxArrayV3Component,
    FormCheckboxGroupComponent,
    FormCheckboxGroupV3Component,
    FormFileUploadArrayComponent,
    FormFileUploadComponent,
    FormGroupedCheckboxArrayComponent,
    FormInputComponent,
    FormInputAutocompleteArrayComponent,
    FormInputAutocompleteArrayV3Component,
    FormInputAutocompleteValueComponent,
    FormRadioGroupComponent,
    FormRadioGroupV3Component,
    FormTextareaComponent,
    FormFileUploadDescriptiveComponent,
    FormDateInputComponent,
    FormSelectComponent,
    FormIRSelectableFiltersFilterComponent,
    FormIRSelectableFiltersComponent
  ]
})
export class FormsModule {}
