import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  Input,
  OnInit,
  forwardRef
} from '@angular/core';
import { FormArray, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';

export type InnovationRecordFiltersItem = {
  sectionId: string | undefined;
  questionId: string | undefined;
  answersIds: string[];
};

@Component({
  selector: 'theme-form-ir-selectable-filters-component',
  templateUrl: './ir-selectable-filters.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormIRSelectableFiltersComponent),
      multi: true
    }
  ]
})
export class FormIRSelectableFiltersComponent implements OnInit, DoCheck {
  @Input({ required: true }) id!: string;
  @Input() arrayName = '';
  @Input() label?: string;
  @Input() description?: string;
  @Input() pageUniqueField = true;
  @Input({ required: true }) parentFormGroup!: FormGroup;
  @Input() parameterValues?: { section: string; question: string; answers: string[] }[];

  formValues: InnovationRecordFiltersItem[] = [];

  // Accessibility.
  get ariaDescribedBy(): null | string {
    let s = '';
    if (this.description) {
      s += `hint-${this.id}`;
    }

    return s || null;
  }

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    if (this.parameterValues) {
      // If previous values are present, add one FormGroup for each answer
      this.parameterValues?.forEach(() => {
        const newFormGroup = new FormGroup({});
        (this.parentFormGroup.get(this.id) as FormArray).push(newFormGroup);
      });
    } else if (this.formValues.length === 0) {
      this.addNewFilterFormGroup();
    }
  }

  onFilterRemoval(i: number) {
    (this.parentFormGroup.get(this.id) as FormArray).removeAt(i);
    this.parameterValues?.splice(i, 1);
  }

  addNewFilterFormGroup() {
    const newFormGroup = new FormGroup({});
    (this.parentFormGroup.get(this.id) as FormArray).push(newFormGroup);
  }

  get getParentFormGroupItems(): FormArray<FormGroup> {
    return this.parentFormGroup.get(this.id) as FormArray<FormGroup>;
  }

  trackFiltersRowsChanges(index: number, item: Record<string, any>): number {
    return index;
  }

  ngDoCheck(): void {
    this.formValues = this.parentFormGroup.get(this.arrayName)?.value;
    this.cdr.detectChanges();
  }
}
