import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, Validators } from '@angular/forms';

import { CoreComponent } from '@app/base';
import { CustomValidators, FileTypes, FormEngineParameterModel, FormGroup } from '@app/base/forms';
import { WizardStepComponentType, WizardStepEventType } from '@app/base/types';
import { DescriptionStepInputType, DescriptionStepOutputType } from './description-step.types';

@Component({
  selector: 'shared-pages-innovation-support-wizard-support-summary-progress-update-milestones-description-step',
  templateUrl: './description-step.component.html'
})
export class WizardInnovationSupportSummaryProgressUpdateMilestonesDescriptionStepComponent
  extends CoreComponent
  implements WizardStepComponentType<DescriptionStepInputType, DescriptionStepOutputType>, OnInit
{
  @Input() title = '';
  @Input() data: DescriptionStepInputType = {
    selectedCategories: [],
    selectedSubcategories: [],
    description: '',
    file: null,
    fileName: ''
  };

  @Output() cancelEvent = new EventEmitter<WizardStepEventType<DescriptionStepOutputType>>();
  @Output() previousStepEvent = new EventEmitter<WizardStepEventType<DescriptionStepOutputType>>();
  @Output() nextStepEvent = new EventEmitter<WizardStepEventType<DescriptionStepOutputType>>();
  @Output() submitEvent = new EventEmitter<WizardStepEventType<DescriptionStepOutputType>>();

  form = new FormGroup(
    {
      description: new FormControl<string>('', [
        CustomValidators.required('Description is required'),
        Validators.maxLength(2000)
      ]),
      file: new FormControl<File | null>(null, [
        CustomValidators.emptyFileValidator(),
        CustomValidators.maxFileSizeValidator(20)
      ]),
      fileName: new FormControl<string>('')
    },
    { updateOn: 'blur' }
  );

  configInputFile = {
    acceptedFiles: [FileTypes.CSV, FileTypes.XLSX, FileTypes.DOCX, FileTypes.PDF],
    maxFileSize: 20 // In Mb.
  };

  constructor() {
    super();

    this.setBackLink('Go back', this.onPreviousStep.bind(this));
  }

  ngOnInit(): void {
    this.setPageTitle(this.title);

    this.form.get('description')?.setValue(this.data.description);
    this.form.get('file')?.setValue(this.data.file);
    this.form.get('fileName')?.setValue(this.data.fileName);

    this.setPageStatus('READY');
  }

  prepareOutputData(): DescriptionStepOutputType {
    return {
      description: this.form.value.description ?? '',
      file: this.form.value.file ?? null,
      fileName: this.form.value.fileName ?? ''
    };
  }

  onPreviousStep(): void {
    this.previousStepEvent.emit({ isComplete: true, data: this.prepareOutputData() });
  }

  onNextStep(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.nextStepEvent.emit({ isComplete: true, data: this.prepareOutputData() });
  }
}
