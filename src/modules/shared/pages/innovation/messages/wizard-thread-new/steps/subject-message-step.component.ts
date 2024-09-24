import { ActivatedRoute } from '@angular/router';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Validators } from '@angular/forms';

import { CoreComponent } from '@app/base';
import { CustomValidators, FileTypes, FormControl, FormGroup } from '@app/base/forms';
import { WizardStepComponentType, WizardStepEventType } from '@app/base/types';

import { SubjectMessageStepInputType, SubjectMessageStepOutputType } from './subject-message-step.types';

@Component({
  selector: 'shared-pages-innovation-messages-wizard-thread-new-subject-message-step',
  templateUrl: './subject-message-step.component.html'
})
export class WizardInnovationThreadNewSubjectMessageStepComponent
  extends CoreComponent
  implements WizardStepComponentType<SubjectMessageStepInputType, SubjectMessageStepOutputType>, OnInit
{
  @Input() title = '';
  @Input() data: SubjectMessageStepInputType = {
    innovation: { id: '' },
    teams: [],
    subject: '',
    message: '',
    file: null,
    fileName: ''
  };
  @Output() cancelEvent = new EventEmitter<WizardStepEventType<SubjectMessageStepOutputType>>();
  @Output() previousStepEvent = new EventEmitter<WizardStepEventType<SubjectMessageStepOutputType>>();
  @Output() nextStepEvent = new EventEmitter<WizardStepEventType<SubjectMessageStepOutputType>>();
  @Output() submitEvent = new EventEmitter<WizardStepEventType<SubjectMessageStepOutputType>>();

  sectionId?: string;

  isInnovatorType: boolean;

  form = new FormGroup(
    {
      subject: new FormControl<string>('', [
        CustomValidators.required('A subject is required'),
        Validators.maxLength(100)
      ]),
      message: new FormControl<string>('', CustomValidators.required('A message is required')),
      file: new FormControl<File | null>(null, [
        CustomValidators.emptyFileValidator(),
        CustomValidators.maxFileSizeValidator(20)
      ]),
      fileName: new FormControl<string>(''),
      confirmation: new FormControl<boolean>(
        false,
        CustomValidators.required("You must select 'I understand' to send your message")
      )
    },
    { updateOn: 'blur' }
  );

  formConfirmationField = { label: '', description: '' };

  configInputFile = {
    acceptedFiles: [FileTypes.CSV, FileTypes.XLSX, FileTypes.DOCX, FileTypes.PDF],
    maxFileSize: 20 // In Mb.
  };

  constructor(private activatedRoute: ActivatedRoute) {
    super();

    this.sectionId = this.activatedRoute.snapshot.queryParams.sectionId;

    this.isInnovatorType = this.stores.authentication.isInnovatorType();
  }

  ngOnInit(): void {
    this.setPageTitle(this.title);
    this.setBackLink('Go back', this.onPreviousStep.bind(this));

    this.form.get('subject')?.setValue(this.data.subject);
    this.form.get('message')?.setValue(this.data.message);
    this.form.get('file')?.setValue(this.data.file);
    this.form.get('fileName')?.setValue(this.data.fileName);
    if (!this.stores.authentication.isInnovatorType()) {
      this.form.get('confirmation')?.setValue(true);
    }

    this.formConfirmationField = {
      label:
        'I understand that for transparency reasons, this message can be seen and replied by everyone who has access to this innovation.',
      description: `<a href="${this.stores.authentication.userUrlBasePath()}/innovations/${
        this.data.innovation.id
      }/support" target="_blank" rel="noopener noreferrer">View a list of this innovation's data sharing preferences (opens in a new window).</a>`
    };

    this.setPageStatus('READY');
  }

  prepareOutputData(): SubjectMessageStepOutputType {
    return {
      subject: this.form.value.subject ?? '',
      message: this.form.value.message ?? '',
      file: this.form.value.file ?? null,
      fileName: this.form.value.fileName ?? ''
    };
  }

  onCancelStep(): void {
    this.cancelEvent.emit({ isComplete: true, data: this.prepareOutputData() });
  }

  onPreviousStep(): void {
    this.previousStepEvent.emit({ isComplete: true, data: this.prepareOutputData() });
  }

  onSubmitStep(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitEvent.emit({ isComplete: true, data: this.prepareOutputData() });
  }
}
