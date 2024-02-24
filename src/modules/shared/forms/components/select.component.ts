import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Injector,
  Input,
  OnInit,
  Output,
  forwardRef
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ControlValueAccessorComponent } from '../base/control-value-accessor.connector';
import { SelectComponentInputType } from '@modules/theme/components/search/select.component';

@Component({
  selector: 'theme-form-select',
  templateUrl: './select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormSelectComponent),
      multi: true
    }
  ]
})
export class FormSelectComponent extends ControlValueAccessorComponent implements OnInit {
  @Input() id?: string;
  @Input() label?: string;
  @Input() description?: string;
  @Input({ required: true }) selectItems!: { selectList: SelectComponentInputType[]; defaultKey?: string };

  @Output() selectChanged = new EventEmitter<string>();

  hasError = false;
  error: { message: string; params: { [key: string]: string } } = { message: '', params: {} };
  cssClass = '';

  selectedField: string = '';

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

  onChangeSelect(): void {
    console.log('changed value');
    this.fieldControl.setValue(this.selectedField);
    this.cdr.detectChanges();
  }
}
