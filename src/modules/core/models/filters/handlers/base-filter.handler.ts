import { FormGroup } from '@angular/forms';

import { Filter } from '../filters.model';

export type GetHandlerValue<T extends Filter['type']> = T extends 'CHECKBOX_GROUP'
  ? CheckboxGroupValue
  : T extends 'CHECKBOXES'
    ? CheckboxesValue
    : T extends 'DATE_RANGE'
      ? DateRangeValue
      : null;
type CheckboxGroupValue = string[];
type CheckboxesValue = Record<string, boolean>;
type DateRangeValue = { key: string; startDate: string | null; endDate: string | null };

export abstract class FilterHandler {
  protected readonly id: string;
  protected readonly form: FormGroup;

  constructor(id: string, form: FormGroup) {
    this.id = id;
    this.form = form;
  }

  // abstract getValue<T extends Filter['type']>(): GetHandlerValue<T>;
  abstract get value(): CheckboxGroupValue | DateRangeValue | CheckboxesValue | null;

  abstract create(filter: Filter): void;

  abstract getSelected(): { key: string; value: string }[] | { key: string; value: boolean }[];
  abstract setSelected(value: { key?: string; value: string | string[] | boolean | null }): void;

  abstract delete(key: string): void;
}
