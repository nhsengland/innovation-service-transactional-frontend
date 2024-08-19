import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  ElementRef,
  EventEmitter,
  Injector,
  Input,
  OnInit,
  Output,
  ViewChild,
  forwardRef
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ControlValueAccessorComponent } from '../base/control-value-accessor.connector';
import { SelectComponentInputType } from '@modules/theme/components/search/select.component';
import { FormEngineHelper } from '../engine/helpers/form-engine.helper';

@Component({
  selector: 'theme-form-select',
  templateUrl: './select.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormSelectComponent),
      multi: true
    }
  ]
})
export class FormSelectComponent extends ControlValueAccessorComponent implements OnInit, DoCheck {
  @Input({ required: true }) id!: string;
  @Input() label?: string;
  @Input() description?: string;
  @Input() pageUniqueField = true;
  @Input({ required: true }) selectItems!: {
    selectList: { key: string | undefined; text: string }[];
    defaultKey?: string;
  };
  @Input() patchControllerFieldId?: string;
  @ViewChild('select') selectRef?: ElementRef<HTMLSelectElement>;

  @Output() selectChanged = new EventEmitter<string>();

  hasError = false;
  error: { message: string; params: { [key: string]: string } } = { message: '', params: {} };

  selectedField: string | undefined = '';

  constructor(
    injector: Injector,
    private cdr: ChangeDetectorRef
  ) {
    super(injector);

    this.selectItems = {
      selectList: []
    };
  }
  ngOnInit(): void {
    this.selectedField =
      this.selectItems.selectList.find(item => item.key === this.selectItems.defaultKey)?.key ??
      this.selectItems.selectList[0].key;
    this.onChangeSelect();
  }
  ngDoCheck(): void {
    this.hasError =
      this.fieldControl.invalid &&
      this.fieldControl.touched &&
      document.activeElement !== this.selectRef?.nativeElement;

    this.error = this.hasError
      ? FormEngineHelper.getValidationMessage(this.fieldControl.errors)
      : { message: '', params: {} };

    // update selected field when another answer controller is removed
    this.selectedField = this.formControl?.value;
  }

  onClick() {
    this.formControl?.markAsTouched();
    console.log('clicked selected');
  }
  onClose() {
    console.log('closed');
  }

  onChangeSelect(): void {
    this.patchControllerFieldId
      ? this.formControl?.patchValue({ [this.patchControllerFieldId]: this.selectedField })
      : this.formControl?.setValue(this.selectedField);

    // this.formControl?.setValue(this.selectedField);
    this.cdr.detectChanges();
    this.selectChanged.emit(this.formControl?.value);
  }
}
