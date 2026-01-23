import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  EventEmitter,
  Injector,
  Input,
  OnInit,
  Output,
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
import { SelectComponentEmitType } from '@modules/shared/forms/components/select.component';
import { CustomValidators } from '@modules/shared/forms/validators/custom-validators';
import { CtxStore } from '@modules/stores';
import { SelectComponentInputType } from '@modules/theme/components/search/select.component';

export type announcementInnovationFiltersItem = {
  section: string | undefined;
  question: string | undefined;
  answers: string[];
};

@Component({
  selector: 'theme-form-ir-selectable-filters-filter-component',
  templateUrl: './ir-selectable-filters-filter.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormIRSelectableFiltersFilterComponent),
      multi: true
    }
  ]
})
export class FormIRSelectableFiltersFilterComponent implements OnInit, DoCheck {
  @Input({ required: true }) id!: string;
  @Input() arrayName = '';
  @Input() label?: string;
  @Input() description?: string;
  @Input() pageUniqueField = true;
  @Input({ required: true }) filterFormGroup!: FormGroup;
  @Input({ required: true }) filterIndex!: number;
  @Input() previousData?: { section: string; question: string; answers: string[] };
  formValues: announcementInnovationFiltersItem[] = [];

  @Output() removedFilter = new EventEmitter<number>();

  canAddAnswerField = true;

  hasError = false;
  error: { message: string; params: Record<string, string> } = { message: '', params: {} };

  sectionsList: { selectList: SelectComponentInputType[]; defaultKey?: string } = { selectList: [] };
  questionsList: { selectList: SelectComponentInputType[]; defaultKey?: string } = { selectList: [] };
  answersList: { selectList: SelectComponentInputType[]; defaultKey?: string } = { selectList: [] };

  parentFormArray: FormArray = new FormArray<any>([]);

  sectionFormControl: FormControl = new FormControl<string | undefined>(undefined);
  questionFormControl: FormControl = new FormControl<string | undefined>(undefined);
  answersFormArrayControl: FormArray = new FormArray<any>([]);

  previouslySelectedQuestions: string[] = [];

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
    private ctx: CtxStore
  ) {
    this.sectionsList.selectList = [
      { key: undefined, text: 'Select section' },
      ...this.ctx.schema.getSubSectionsIds().map(section => ({ key: section, text: this.formatSectionLabel(section) }))
    ];
  }

  ngOnInit(): void {
    this.parentFormArray = this.filterFormGroup.parent as FormArray;
    this.assignFilterControls();
  }

  ngDoCheck(): void {
    this.cdr.detectChanges();
    this.getSelectedQuestions();
    this.updateFilterControlsReference();
  }

  assignFilterControls() {
    this.filterFormGroup = this.filterFormGroup as FormGroup;

    // Add section controls
    this.sectionFormControl.setValidators(CustomValidators.required('Select a section'));
    this.sectionFormControl.updateValueAndValidity();
    this.filterFormGroup.addControl('section', this.sectionFormControl);

    // Add question controls
    this.questionFormControl.setValidators(CustomValidators.required('Select a question'));
    this.questionFormControl.updateValueAndValidity();
    this.filterFormGroup.addControl('question', this.questionFormControl);

    // Add answer(s) field(s) and push answers control
    this.filterFormGroup.addControl('answers', this.answersFormArrayControl);

    if (!this.previousData) {
      // Add one answer field
      this.addAnswerField();
    } else {
      // Add one for each existing filter
      this.previousData.answers.forEach(() => {
        const newAnswerControl = new FormControl<string | undefined>(undefined);
        newAnswerControl.setValidators(CustomValidators.required('Select an answer'));
        newAnswerControl.updateValueAndValidity();
        this.answersFormArrayControl.push(newAnswerControl);
      });

      // Set previous values
      this.filterFormGroup.patchValue({
        section: this.previousData.section,
        question: this.previousData.question,
        answers: this.previousData.answers
      });
    }
  }

  updateFilterControlsReference() {
    // update controls reference when a filter is deleted
    this.sectionFormControl = (this.filterFormGroup as FormGroup).controls['section'] as FormControl;
    this.questionFormControl = (this.filterFormGroup as FormGroup).controls['question'] as FormControl;
    this.answersFormArrayControl = (this.filterFormGroup as FormGroup).controls['answers'] as FormArray;
  }

  addAnswerField() {
    const answersList = this.getAnswersList(this.questionFormControl.value, 0);
    // only allow if it's empty or is less than amount of possible answers
    if (
      !this.answersFormArrayControl.controls.length ||
      this.answersFormArrayControl.controls.length < answersList.selectList.length - 1
    ) {
      const newAnswerControl = new FormControl<string | undefined>(undefined);
      newAnswerControl.setValidators(CustomValidators.required('Select an answer'));
      newAnswerControl.updateValueAndValidity();
      this.answersFormArrayControl.push(newAnswerControl);

      this.checkCanAddAnswer();
    }
  }

  removeAnswerField(i: number) {
    this.canAddAnswerField = true;
    this.answersFormArrayControl.removeAt(i);
  }

  removeFilter(i: number) {
    this.removedFilter.emit(this.filterIndex);
  }

  formatSectionLabel(sectionId: string) {
    const sectionIdentification = this.ctx.schema.getIrSchemaSectionIdentificationV3(sectionId);
    return `Section ${sectionIdentification?.group.number}.${sectionIdentification?.section.number} - ${sectionIdentification?.section.title}`;
  }

  getSectionsList() {
    return {
      defaultKey: this.sectionFormControl.value,
      selectList: [
        { key: undefined, text: 'Select section', disabled: true },
        ...this.ctx.schema
          .getSubSectionsIds()
          .map(section => ({ key: section, text: this.formatSectionLabel(section) }))
      ]
    };
  }

  getQuestionsList(sectionId: string) {
    // Manually flatten questions to include the step-level 'condition'
    const questionsWithConditions = this.ctx.schema.schema()
      .flatMap(section => section.subSections)
      .find(s => s.id === sectionId)
      ?.steps.flatMap(st =>
        st.questions.map(q => ({ ...q, condition: st.condition }))
      ) ?? [];

    return {
      defaultKey: this.questionFormControl.value,
      selectList: [
        { key: undefined, text: 'Select question', disabled: true },
        ...questionsWithConditions
          .filter(q => ['radio-group', 'checkbox-array', 'autocomplete-array'].includes(q.dataType))
          .filter(q => !['mainCategory'].includes(q.id))
          .filter(q => this.isQuestionVisible(q))
          .map(q => ({ key: q.id, text: q.label }))
      ]
    };
  }

  isQuestionVisible(question: any): boolean {
    if (!question.condition) {
      return true;
    }

    const parentValues = this.parentFormArray.value as any[];

    const matchingFilter = parentValues.find(f => f.question === question.condition.id);

    if (!matchingFilter) {
      return false;
    }

    const selectedAnswers = matchingFilter.answers || [];
    // The condition is met if any of the selected answers match one of the required condition options.
    return selectedAnswers.some((ans: string) => question.condition.options.includes(ans));
  }

  getAnswersList(
    questionId: string,
    answerIndex: number
  ): { selectList: SelectComponentInputType[]; defaultKey?: string } {
    return {
      defaultKey: this.answersFormArrayControl.value[answerIndex],
      selectList: [
        { key: undefined, text: 'Select answer', disabled: true },
        ...(this.ctx.schema
          .getIrSchemaSectionQuestions(this.sectionFormControl.value)
          .find(q => q.id === questionId)
          ?.items?.filter(i => i.id && i.label && !i.itemsFromAnswer)
          .filter(i => !this.answersFormArrayControl.value.includes(i))
          .map(i => ({ key: i.id!, text: i.label! })) ?? [])
      ]
    };
  }

  checkCanAddAnswer() {
    const answersList = this.getAnswersList(this.questionFormControl.value, 0);
    this.canAddAnswerField = !(this.answersFormArrayControl.controls.length == answersList.selectList.length - 1);
  }

  onSelectChange(event: SelectComponentEmitType): void {
    if (['section'].includes(event.id.split('_')[1])) {
      this.clearQuestion();
    }
    if (['question'].includes(event.id.split('_')[1])) {
      this.clearAnswers();
    }
    // Auto-add dependent questions when an answer is selected
    if (event.id.includes('answer') && event.value) {
      this.autoAddDependentQuestions(event.value as string);
    }
    this.checkCanAddAnswer();
  }

  autoAddDependentQuestions(selectedAnswer: string) {
    const currentSectionId = this.sectionFormControl.value;
    const currentQuestionId = this.questionFormControl.value;

    if (!currentSectionId || !currentQuestionId) return;

    // Find questions in this section that depend on the current question and selected answer
    const dependentQuestions = this.ctx.schema.schema()
      .flatMap(section => section.subSections)
      .find(s => s.id === currentSectionId)
      ?.steps.flatMap(st =>
        st.questions.map(q => ({ ...q, condition: st.condition }))
      )
      .filter(q => q.condition?.id === currentQuestionId && q.condition.options.includes(selectedAnswer)) ?? [];

    if (dependentQuestions.length === 0) return;

    const parentValues = this.parentFormArray.value as any[];

    dependentQuestions.forEach(depQ => {
      // Check if dependent question is already in the filter list
      const exists = parentValues.some(f => f.question === depQ.id);
      if (!exists) {
        // We need to add a new FormGroup to the parentFormArray
        // We can do this by emiting an event or accessing parentFormArray directly (which we have)
        // But we need to structure the new FormGroup correctly.
        // The parent component normally handles creation via 'addNewFilterFormGroup'
        
        // Access parent component method? No, direct component coupling is messy.
        // We have `parentFormArray`, we can push a FormGroup.
        const newGroup = new FormGroup({
            section: new FormControl(currentSectionId),
            question: new FormControl(depQ.id),
            answers: new FormArray([
                new FormControl(undefined, CustomValidators.required('Select an answer')) // Pre-add one empty answer field
            ])
        });
        
        this.parentFormArray.push(newGroup);
        // Important: Use Cdr or MarkForCheck to ensure view updates?
        // AdminModule usually handles ChangeDetectionStrategy.Default, but parent might be OnPush.
        // We might need to trigger detection.
      }
    });
  }

  getSelectedQuestions() {
    this.previouslySelectedQuestions = (this.parentFormArray.controls as FormGroup[]).map(formgroup => {
      const questionValue = (formgroup as FormGroup).controls['question'];
      if (questionValue && questionValue.value) {
        return questionValue.value;
      } else {
        return null;
      }
    });
  }

  clearQuestion() {
    this.questionFormControl.setValue(undefined);
    this.answersFormArrayControl.clear();
    this.addAnswerField();
  }

  clearAnswers() {
    this.answersFormArrayControl.clear();
    this.addAnswerField();
  }
}
