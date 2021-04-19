import { Component, Input, OnInit, DoCheck, ChangeDetectionStrategy, ChangeDetectorRef, forwardRef, Injector, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { RandomGeneratorHelper } from '@modules/core';

import { ControlValueAccessorConnector } from '../base/control-value-accessor.connector';

@Component({
  selector: 'theme-form-checkbox',
  templateUrl: './checkbox.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => FormCheckboxComponent),
    multi: true
  }]
})
export class FormCheckboxComponent extends ControlValueAccessorConnector implements OnInit, DoCheck {

  @Input() id?: string;
  @Input() value = '';
  @Input() label = '';
  @Input() description?: string;
  // @Input() label?: string;
  // @Input() items: FormFieldModel['items'] = [];

  hasError = false;

  isRunningOnBrowser: boolean;
  isRunningOnServer: boolean;


  constructor(
    injector: Injector,
    private cdr: ChangeDetectorRef
  ) {

    super(injector);

    this.isRunningOnBrowser = isPlatformBrowser(injector.get(PLATFORM_ID));
    this.isRunningOnServer = isPlatformServer(injector.get(PLATFORM_ID));

    this.id = this.id || RandomGeneratorHelper.generateRandom();

  }


  ngOnInit(): void { }

  ngDoCheck(): void {

    this.hasError = (this.fieldControl.invalid && (this.fieldControl.touched || this.fieldControl.dirty));
    this.cdr.detectChanges();

  }

}
