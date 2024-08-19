import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  Injector,
  Input,
  OnInit,
  forwardRef
} from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  FormArray,
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import { CustomValidators } from '@modules/shared/forms/validators/custom-validators';
import { ContextStore, InnovationRecordSchemaStore } from '@modules/stores';
import { InnovationRecordSchemaInfoType } from '@modules/stores/innovation/innovation-record/innovation-record-schema/innovation-record-schema.models';

export type announcementInnovationFiltersItem = {
  section: string | undefined;
  question: string | undefined;
  answers: string[];
};

@Component({
  selector: 'theme-form-announcement-innovation-type-filter',
  templateUrl: './announcement-innovations-type-filter.html',
  changeDetection: ChangeDetectionStrategy.Default,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormAnnouncementInnovationsTypeFilter),
      multi: true
    }
  ]
})
export class FormAnnouncementInnovationsTypeFilter implements OnInit, DoCheck {
  @Input({ required: true }) id!: string;
  @Input() arrayName = '';
  @Input() label?: string;
  @Input() description?: string;
  @Input() pageUniqueField = true;
  @Input({ required: true }) parentFormGroup!: FormGroup;
  @Input({ required: true }) filterIndex!: number;
  formValues: announcementInnovationFiltersItem[] = [];

  schema: InnovationRecordSchemaInfoType;
  hasError = false;
  error: { message: string; params: { [key: string]: string } } = { message: '', params: {} };

  sectionsList: { selectList: { key: string | undefined; text: string }[] } = { selectList: [] };
  questionsList: { selectList: { key: string | undefined; text: string }[] } = { selectList: [] };
  answersList: { selectList: { key: string | undefined; text: string }[] } = { selectList: [] };

  filterFormGroup: FormGroup = new FormGroup({});
  sectionFormControl: FormControl = new FormControl<string | null>(null);
  questionFormControl: FormControl = new FormControl<string | null>(null);

  answersFormArrayControl: FormArray = new FormArray<any>([]);

  // Form controls.
  get parentFieldControl(): AbstractControl | null {
    return this.injector.get(ControlContainer).control;
  }

  // Accessibility.
  get ariaDescribedBy(): null | string {
    let s = '';
    if (this.description) {
      s += `hint-${this.id}`;
    }
    if (this.hasError) {
      s += `${s ? ' ' : ''}error-${this.id}`;
    }
    return s || null;
  }

  get answersFormAsFormArray(): FormArray<FormControl> {
    return this.answersFormArrayControl as FormArray<FormControl>;
  }

  constructor(
    private injector: Injector,
    private cdr: ChangeDetectorRef,
    private contextStore: ContextStore,
    private schemaStore: InnovationRecordSchemaStore
  ) {
    this.schema = this.contextStore.getIrSchema();
    this.sectionsList.selectList = [
      { key: undefined, text: 'Select section' },
      ...this.schemaStore
        .getIrSchemaSubSectionsIdsListV3()
        .map(section => ({ key: section, text: this.formatSectionLabel(section) }))
    ];
  }

  ngOnInit(): void {
    this.assignFilterControls();
  }

  updateFilterControls() {
    // update controls reference when a filter is deleted
    this.sectionFormControl = (this.parentFormGroup as FormGroup).controls['sectionFormControl'] as FormControl;
    this.questionFormControl = (this.parentFormGroup as FormGroup).controls['questionFormControl'] as FormControl;
    this.answersFormArrayControl = (this.parentFormGroup as FormGroup).controls['answersFormArrayControl'] as FormArray;
  }

  assignFilterControls() {
    this.filterFormGroup = this.parentFormGroup as FormGroup;

    // Add section controls
    this.sectionFormControl.setValidators(CustomValidators.required('Select a section'));
    this.sectionFormControl.updateValueAndValidity();
    this.filterFormGroup.addControl('sectionFormControl', this.sectionFormControl);

    // Add question controls
    this.questionFormControl.setValidators(CustomValidators.required('Select a question'));
    this.questionFormControl.updateValueAndValidity();
    this.filterFormGroup.addControl('questionFormControl', this.questionFormControl);

    // Add 1 answer field and push answers control
    this.addAnswerField();
    this.filterFormGroup.addControl('answersFormArrayControl', this.answersFormArrayControl);
  }

  ngDoCheck(): void {
    this.cdr.detectChanges();

    this.updateFilterControls();
  }

  addAnswerField() {
    if (
      !this.answersFormArrayControl.controls.length ||
      this.answersFormArrayControl.controls.length < this.answersList.selectList.length - 1
    ) {
      const newAnswerControl = new FormControl<string | undefined>(undefined);
      newAnswerControl.setValidators(CustomValidators.required('Select an answer'));
      newAnswerControl.updateValueAndValidity();
      this.answersFormArrayControl.push(newAnswerControl);
    }
  }

  removeAnswerField(i: number) {
    this.answersFormArrayControl.removeAt(i);
  }

  removeFilter(i: number) {
    ((this.parentFormGroup as FormGroup).parent as FormArray).removeAt(i);
  }

  parentFormControlByName(controlName: string): FormControl {
    return this.parentFormGroup.get(controlName) as FormControl;
  }

  formatSectionLabel(sectionId: string) {
    const sectionIdentification = this.schemaStore.getIrSchemaSectionIdentificationV3(sectionId);
    return `Section ${sectionIdentification?.group.number}.${sectionIdentification?.section.number} - ${sectionIdentification?.section.title}`;
  }

  onSelectChange(selectKey: string): void {
    if (this.sectionFormControl.value) {
      this.questionsList.selectList = [
        { key: undefined, text: 'Select question' },
        ...this.schemaStore
          .getIrSchemaSectionQuestions(this.sectionFormControl.value)
          .filter(q => ['radio-group', 'checkbox-array'].includes(q.dataType))
          .map(q => ({ key: q.id, text: q.label }))
      ];
    }
    if (this.questionFormControl.value) {
      this.answersList.selectList = [
        { key: undefined, text: 'Select answer' },
        ...(this.schemaStore
          .getIrSchemaSectionQuestions(this.sectionFormControl.value)
          .find(q => q.id === this.questionFormControl.value)
          ?.items?.filter(i => i.id && i.label && !i.itemsFromAnswer)
          .map(i => ({ key: i.id!, text: i.label! })) ?? [])
      ];
    }
  }
}
