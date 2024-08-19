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
import { AbstractControl, ControlContainer, FormArray, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';

export type announcementInnovationFiltersItem = {
  sectionId: string | undefined;
  questionId: string | undefined;
  answersIds: string[];
};

@Component({
  selector: 'app-admin-pages-announcement-innovation-filter-step',
  templateUrl: './announcement-innovations-filter-step.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormAnnouncementInnovationsFilterStep),
      multi: true
    }
  ]
})
export class FormAnnouncementInnovationsFilterStep implements OnInit, DoCheck {
  @Input({ required: true }) id!: string;
  @Input() arrayName = '';
  @Input() label?: string;
  @Input() description?: string;
  @Input() pageUniqueField = true;
  @Input({ required: true }) parentFormGroup!: FormGroup;
  @Input() parameterValues?: FormGroup;

  formValues: announcementInnovationFiltersItem[] = [];

  hasError = false;
  error: { message: string; params: { [key: string]: string } } = { message: '', params: {} };

  filterCount: number = 1;

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

  constructor(
    private injector: Injector,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (this.formValues.length === 0) {
      this.addNewFilterFormGroup();
    }
  }

  addNewFilterFormGroup() {
    const newFormGroup = new FormGroup({});

    // Add to main form
    (this.parentFormGroup.get(this.id) as FormArray).push(newFormGroup);
  }

  get getParentFormGroupItems(): FormArray<FormGroup> {
    return this.parentFormGroup.get(this.id) as FormArray<FormGroup>;
  }

  trackFiltersRowsChanges(index: number, item: { [key: string]: any }): number {
    return index;
  }

  ngDoCheck(): void {
    this.formValues = this.parentFormGroup.get(this.arrayName)?.value;
    this.cdr.detectChanges();
  }
}
