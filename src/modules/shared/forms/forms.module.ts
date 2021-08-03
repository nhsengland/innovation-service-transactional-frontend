import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule as AngularFormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDropzoneModule } from 'ngx-dropzone';

// Components.
import { FormEngineComponent } from './engine/form-engine.component';

import { FormCheckboxComponent } from './components/checkbox.component';
import { FormCheckboxArrayComponent } from './components/checkbox-array.component';
import { FormCheckboxGroupComponent } from './components/checkbox-group.component';
import { FormFileUploadComponent } from './components/file-upload.component';
import { FormGroupedCheckboxArrayComponent } from './components/grouped-checkbox-array.component';
import { FormInputComponent } from './components/input.component';
import { FormRadioGroupComponent } from './components/radio-group.component';
import { FormTextareaComponent } from './components/textarea.component';

@NgModule({
  imports: [
    CommonModule,
    AngularFormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NgxDropzoneModule

  ],
  declarations: [
    FormEngineComponent,

    FormCheckboxComponent,
    FormCheckboxArrayComponent,
    FormCheckboxGroupComponent,
    FormFileUploadComponent,
    FormGroupedCheckboxArrayComponent,
    FormInputComponent,
    FormRadioGroupComponent,
    FormTextareaComponent

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
    FormFileUploadComponent,
    FormGroupedCheckboxArrayComponent,
    FormInputComponent,
    FormRadioGroupComponent,
    FormTextareaComponent
  ]
})
export class FormsModule { }
