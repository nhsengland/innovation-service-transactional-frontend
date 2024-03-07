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
// import { FormInputAutocompleteValueComponent } from './components/input-autocomplete-value.component';
import { FormRadioGroupComponent } from './components/radio-group.component';
import { FormTextareaComponent } from './components/textarea.component';
import { FormFileUploadDescriptiveComponent } from './components/file-upload-descriptive.component';
import { FormDateInputComponent } from './components/date-input.component';
import { FormSelectComponent } from './components/select.component';
import { SelectComponent } from '@modules/theme/components/search/select.component';

@NgModule({
  imports: [
    CommonModule,
    AngularFormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NgxDropzoneModule,

    // Angular Material.
    MatAutocompleteModule
  ],
  declarations: [
    FormEngineComponent,

    FormFileUploadPreviewComponent,
    FormCheckboxComponent,
    FormCheckboxArrayComponent,
    FormCheckboxGroupComponent,
    FormFileUploadArrayComponent,
    FormFileUploadComponent,
    FormGroupedCheckboxArrayComponent,
    FormInputComponent,
    FormInputAutocompleteArrayComponent,
    // FormInputAutocompleteValueComponent,
    FormRadioGroupComponent,
    FormTextareaComponent,
    FormFileUploadDescriptiveComponent,
    FormDateInputComponent,
    FormSelectComponent
  ],
  exports: [
    // CommonModule,
    // FormsModule,
    AngularFormsModule,
    ReactiveFormsModule,

    FormEngineComponent,

    FormCheckboxComponent,
    FormCheckboxArrayComponent,
    FormCheckboxGroupComponent,
    FormFileUploadArrayComponent,
    FormFileUploadComponent,
    FormGroupedCheckboxArrayComponent,
    FormInputComponent,
    FormInputAutocompleteArrayComponent,
    // FormInputAutocompleteValueComponent,
    FormRadioGroupComponent,
    FormTextareaComponent,
    FormFileUploadDescriptiveComponent,
    FormDateInputComponent,
    FormSelectComponent
  ]
})
export class FormsModule {}
