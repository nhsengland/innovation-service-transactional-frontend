import {
  Component,
  Input,
  OnInit,
  DoCheck,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Injector,
  PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { AbstractControl, ControlContainer, FormArray, FormControl } from '@angular/forms';

import { RandomGeneratorHelper } from '@modules/core/helpers/random-generator.helper';

import { FormEngineHelperV3 } from '../engine/helpers/form-engine-v3.helper';

import { FormEngineParameterModelV3 } from '../engine/models/form-engine.models';

@Component({
  selector: 'theme-form-checkbox-array-v3',
  templateUrl: './checkbox-array-v3.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormCheckboxArrayV3Component implements OnInit, DoCheck {
  @Input() id?: string;
  @Input() arrayName = '';
  @Input() label?: string;
  @Input() description?: string;
  @Input() items: FormEngineParameterModelV3['items'] = [];
  @Input() size?: 'small' | 'normal';
  @Input() pageUniqueField = true;
  @Input() collapsableGroups = true;

  hasError = false;
  error: { message: string; params: Record<string, string> } = { message: '', params: {} };

  cssClass = '';

  isRunningOnBrowser: boolean;
  isRunningOnServer: boolean;

  exclusiveItem: string | undefined = undefined;

  groupVisibility: Record<string, boolean> = {};

  // Form controls.
  get parentFieldControl(): AbstractControl | null {
    return this.injector.get(ControlContainer).control;
  }
  get fieldArrayControl(): FormArray {
    return this.parentFieldControl?.get(this.arrayName) as FormArray;
  }
  get fieldArrayValues(): string[] {
    return this.fieldArrayControl.value as string[];
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

  conditionalFormControl(f: string): FormControl {
    return this.parentFieldControl?.get(f) as FormControl;
  }

  isConditionalFieldVisible(conditionalFieldId: string): boolean {
    return (
      (this.items || []).filter(
        item => this.fieldArrayValues.includes(item.id!) && item.conditional?.id === conditionalFieldId
      ).length > 0
    );
  }

  isConditionalFieldError(f: string): boolean {
    const control = this.conditionalFormControl(f);
    return control.invalid && (control.touched || control.dirty);
  }

  constructor(
    private injector: Injector,
    private cdr: ChangeDetectorRef
  ) {
    this.isRunningOnBrowser = isPlatformBrowser(injector.get(PLATFORM_ID));
    this.isRunningOnServer = isPlatformServer(injector.get(PLATFORM_ID));
  }

  ngOnInit(): void {
    this.lookForAndSetExclusive();

    console.log('items:', this.items);
    this.items = [
      {
        id: 'UK_MDR_Class_I',
        label: 'UK MDR Class I (Great Britain)',
        group: 'Medical device regulations'
      },
      {
        id: 'UK_MDR_Class_IIA',
        label: 'UK MDR Class IIa (Great Britain)',
        group: 'Medical device regulations'
      },
      {
        id: 'UK_MDR_Class_IIB',
        label: 'UK MDR Class IIb (Great Britain)',
        group: 'Medical device regulations'
      },
      {
        id: 'UK_MDR_Class_III',
        label: 'UK MDR Class III (Great Britain)',
        group: 'Medical device regulations'
      },
      {
        id: 'EU_MDR_Class_I',
        label: 'EU MDR Class I (Northern Ireland & EU)',
        group: 'Medical device regulations'
      },
      {
        id: 'EU_MDR_Class_IIA',
        label: 'EU MDR Class IIa (Northern Ireland & EU)',
        group: 'Medical device regulations'
      },
      {
        id: 'EU_MDR_Class_IIB',
        label: 'EU MDR Class IIb (Northern Ireland & EU)',
        group: 'Medical device regulations'
      },
      {
        id: 'EU_MDR_Class_III',
        label: 'EU MDR Class III (Northern Ireland & EU)',
        group: 'Medical device regulations'
      },

      {
        id: 'UKR_MDR_GENERAL_IVD',
        label: 'UK MDR General IVD (Great Britain)',
        group: 'In-vitro diagnostics regulations'
      },
      {
        id: 'UKR_MDR_IVD_SELF_TEST',
        label: 'UK MDR IVD for self test (Great Britain)',
        group: 'In-vitro diagnostics regulations'
      },
      {
        id: 'UKR_MDR_IVD_ANNEX_II_LIST_B',
        label: 'UK MDR IVD Annex II List B (Great Britain)',
        group: 'In-vitro diagnostics regulations'
      },
      {
        id: 'UKR_MDR_IVD_ANNEX_II_LIST_A',
        label: 'UK MDR IVD Annex II List A (Great Britain)',
        group: 'In-vitro diagnostics regulations'
      },
      {
        id: 'EU_IVDR_IVD_CLASS_A',
        label: 'EU IVDR IVD Class A (Northern Ireland & EU)',
        group: 'In-vitro diagnostics regulations'
      },
      {
        id: 'EU_IVDR_IVD_CLASS_B',
        label: 'EU IVDR IVD Class B (Northern Ireland & EU)',
        group: 'In-vitro diagnostics regulations'
      },
      {
        id: 'EU_IVDR_IVD_CLASS_C',
        label: 'EU IVDR IVD Class C (Northern Ireland & EU)',
        group: 'In-vitro diagnostics regulations'
      },
      {
        id: 'EU_IVDR_IVD_CLASS_D',
        label: 'EU IVDR IVD Class D (Northern Ireland & EU)',
        group: 'In-vitro diagnostics regulations'
      },
      {
        id: 'IONISING_RADIATION',
        label: 'Ionising Radiation (Medical Exposure) Regulations'
      },
      {
        id: 'DTAC',
        label: 'Digital Technology Assessment Criteria (DTAC)'
      },
      {
        id: 'MARKETING_AUTHORISATION',
        label: 'Marketing authorisation for medicines'
      },
      {
        id: 'CQC',
        label: 'Care Quality Commission (CQC) registration, as I am providing a regulated activity'
      },
      {
        id: 'OTHER',
        label: 'Other',
        conditional: {
          id: 'otherRegulationDescription',
          dataType: 'text',
          label: 'Other regulations, standards and certifications that apply',
          validations: {
            isRequired: 'Other regulations, standards and certifications is required',
            maxLength: 100
          }
        }
      }
    ];

    if (this.collapsableGroups) {
      (this.items || []).forEach(item => {
        if (item.group && this.groupVisibility[item.group] === undefined) {
          // Expand if any item in this group is selected
          const groupItemIds = this.items?.filter(i => i.group === item.group).map(i => i.id) || [];
          this.groupVisibility[item.group] = groupItemIds.some(id => this.fieldArrayValues.includes(id!));
        }
      });
    }

    this.id = this.id || RandomGeneratorHelper.generateRandom();
    this.cssClass = this.size === 'small' ? 'form-checkboxes-small' : '';

    // This will filter any value not available on the items variable.
    const itemsValues = (this.items || []).map(item => item.id ?? '');
    this.fieldArrayValues.forEach(item => {
      if (!itemsValues.includes(item)) {
        const index = (this.fieldArrayControl.value as string[]).indexOf(item);
        this.fieldArrayControl.removeAt(index);
      }
    });
  }

  ngDoCheck(): void {
    this.hasError = this.fieldArrayControl.invalid && (this.fieldArrayControl.touched || this.fieldArrayControl.dirty);
    this.error = this.hasError
      ? FormEngineHelperV3.getValidationMessage(this.fieldArrayControl.errors)
      : { message: '', params: {} };

    this.items
      ?.filter(item => item.conditional)
      .forEach(item => {
        if (item.conditional) {
          if (!item.conditional.isHidden && this.isConditionalFieldVisible(item.conditional.id)) {
            this.conditionalFormControl(item.conditional.id).setValidators(
              FormEngineHelperV3.getParameterValidators(item.conditional)
            );
          } else {
            this.conditionalFormControl(item.conditional.id).setValidators(null);
            this.conditionalFormControl(item.conditional.id).reset();
          }
          this.conditionalFormControl(item.conditional.id).updateValueAndValidity();
        }
      });

    this.cdr.detectChanges();
  }

  isChecked(value: string): boolean {
    return this.fieldArrayValues.includes(value);
  }

  onChanged(e: Event): void {
    const event = e.target as HTMLInputElement;
    const valueIndex = (this.fieldArrayControl.value as string[]).indexOf(event.value);

    if (event.checked && valueIndex === -1) {
      if (this.isItemExclusive(event.value) || this.isExclusiveChecked()) {
        this.fieldArrayControl.clear();
      }

      this.fieldArrayControl.push(new FormControl(event.value));
    }

    if (!event.checked && valueIndex > -1) {
      this.fieldArrayControl.removeAt(valueIndex);
    }
  }

  private isItemExclusive(value: string): boolean {
    return this.exclusiveItem === value;
  }

  private isExclusiveChecked(): boolean {
    return this.exclusiveItem !== undefined && (this.fieldArrayControl.value as string[]).includes(this.exclusiveItem);
  }

  private lookForAndSetExclusive() {
    this.items?.forEach(item => item.exclusive && (this.exclusiveItem = item.id ?? ''));
  }

  isGroupVisible(group: string): boolean {
    // If collapsableGroups is off, always visible
    if (!this.collapsableGroups) return true;

    // If user toggled it manually, respect that
    if (this.groupVisibility[group] !== undefined) return this.groupVisibility[group];

    // Otherwise, expand if any item in this group is selected
    const groupItemIds = this.items?.filter(i => i.group === group).map(i => i.id) || [];

    return groupItemIds.some(id => this.fieldArrayValues.includes(id!));
  }

  toggleGroupVisibility(group: string, checked: boolean): void {
    this.groupVisibility[group] = checked;
  }

  isFirstItemInGroup(index: number): boolean {
    if (!this.items || !this.items[index]?.group) {
      return false;
    }

    if (index === 0) {
      return true;
    }

    return this.items[index].group !== this.items[index - 1]?.group;
  }

  isLastItemInGroup(index: number): boolean {
    if (!this.items || !this.items[index]) return false;
    const group = this.items[index].group;
    if (!group) return false;
    return index === this.items.length - 1 || this.items[index + 1].group !== group;
  }
}
