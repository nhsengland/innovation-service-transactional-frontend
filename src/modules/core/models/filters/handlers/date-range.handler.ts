import { FormControl, FormGroup } from '@angular/forms';
import { DatesHelper } from '@app/base/helpers';
import { CustomValidators } from '@modules/shared/forms';

import { Filter } from '../filters.model';
import { FilterHandler } from './base-filter.handler';

export class DateRangeHandler extends FilterHandler {
  #keys: Set<string>;

  get value(): { key: string; startDate: string | null; endDate: string | null } | null {
    const [startKey, endKey] = this.#keys;
    const startDate = this.#getDate(startKey);
    const endDate = this.#getDate(endKey);

    if (startDate || endDate) {
      return { key: this.id, startDate, endDate };
    }

    return null;
  }

  constructor(id: string, form: FormGroup) {
    super(id, form);
    this.#keys = new Set([this.#generateKey('startDate'), this.#generateKey('endDate')]);
  }

  create(filter: Filter): void {
    for (const key of this.#keys) {
      this.form.addControl(
        key,
        new FormControl(null, {
          validators: CustomValidators.parsedDateStringValidator(),
          updateOn: filter.options?.updateOn
        }),
        { emitEvent: false }
      );
    }
  }

  getSelected(): { key: string; value: string }[] {
    const value = this.value;
    if (!value) {
      return [];
    }

    return [
      ...(value.startDate !== null ? [{ key: 'startDate', value: value.startDate }] : []),
      ...(value.endDate !== null ? [{ key: 'endDate', value: value.endDate }] : [])
    ];
  }

  setSelected({ key, value }: { key: string; value: string | null }): void {
    const control = this.#getControl(this.#generateKey(key));
    control.patchValue(DatesHelper.parseIntoValidFormat(value), { emitEvent: true });
  }

  delete(key: string): void {
    this.setSelected({ key, value: null });
  }

  #getDate(key: string): string | null {
    return DatesHelper.parseIntoValidFormat(this.#getControl(key).value);
  }

  #getControl(key: string): FormControl {
    return this.form.get(key) as FormControl;
  }

  #generateKey(key: string) {
    return `${this.id}::${key}`;
  }
}
