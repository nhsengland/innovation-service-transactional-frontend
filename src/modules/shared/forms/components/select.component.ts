import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Injector,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  forwardRef
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ControlValueAccessorComponent } from '../base/control-value-accessor.connector';
import { SelectComponentInputType } from '@modules/theme/components/search/select.component';
import { FormEngineHelper } from '../engine/helpers/form-engine.helper';

export type SelectComponentEmitType = {
  id: string;
  value: string;
};

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
export class FormSelectComponent extends ControlValueAccessorComponent implements OnInit, OnChanges {
  @Input({ required: true }) id!: string;
  @Input() label?: string;
  @Input() description?: string;
  @Input() pageUniqueField = true;
  @Input({ required: true }) selectItems!: {
    selectList: SelectComponentInputType[];
    defaultKey?: string | undefined;
  };
  @Input() patchControllerFieldId?: string;
  @ViewChild('select') selectRef?: ElementRef<HTMLSelectElement>;

  @Output() selectChanged = new EventEmitter<SelectComponentEmitType>();

  hasError = false;
  error: { message: string; params: { [key: string]: string } } = { message: '', params: {} };

  isFocus: boolean = false;

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

  ngOnChanges(changes: SimpleChanges): void {
    // this.hasError = this.fieldControl.invalid && this.fieldControl.touched;
    //  &&
    // document.activeElement !== this.selectRef?.nativeElement;

    // !this.hasError && this.onTestWhatWorks();
    !this.isFocus && this.checkError();

    this.selectedField = this.formControl?.value;
  }

  ngOnInit(): void {
    this.selectedField =
      this.selectItems.selectList.find(item => item.key === this.selectItems.defaultKey)?.key ??
      this.selectItems.selectList[0].key;

    this.formControl?.setValue(this.selectedField);
  }

  onClick() {
    this.formControl?.markAsTouched();
  }

  onBlur() {
    this.isFocus = false;
    this.checkError();
  }

  onFocus() {
    this.isFocus = true;
  }

  checkError() {
    this.hasError = this.fieldControl.invalid && this.fieldControl.touched;

    this.error = this.hasError
      ? FormEngineHelper.getValidationMessage(this.fieldControl.errors)
      : { message: '', params: {} };
  }

  onChangeSelect(): void {
    this.formControl?.setValue(this.selectedField);
    this.checkError();
    this.cdr.detectChanges();
    this.selectChanged.emit({ id: this.id, value: this.formControl?.value });
  }
}
