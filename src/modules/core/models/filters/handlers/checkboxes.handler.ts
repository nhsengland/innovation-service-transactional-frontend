import { FormControl, FormGroup } from '@angular/forms';

import { Filter } from '../filters.model';
import { FilterHandler } from './base-filter.handler';

export class CheckboxesHandler extends FilterHandler {
  #keys: Set<string>;

  get value(): Record<string, boolean> {
    const values: Record<string, boolean> = {};
    for (const key of this.#keys) {
      values[key] = this.#getControl(key).value;
    }
    return values;
  }

  constructor(id: string, form: FormGroup) {
    super(id, form);
    this.#keys = new Set();
  }

  create(filter: Filter): void {
    if (filter.type !== 'CHECKBOXES') {
      throw new Error('A filter of type Checkboxes has to be passed to this handler.');
    }

    for (const checkbox of filter.checkboxes) {
      this.#keys.add(checkbox.key);

      this.form.addControl(
        checkbox.key,
        new FormControl(checkbox.defaultValue ?? false, { updateOn: checkbox.options?.updateOn }),
        { emitEvent: false }
      );
    }
  }

  getSelected(): { key: string; value: boolean }[] {
    return Object.entries(this.value).flatMap(([key, value]) => (value ? [{ key, value }] : []));
  }

  setSelected({ key, value }: { key: string; value: boolean }): void {
    if (!key || !this.#keys.has(key)) {
      throw new Error('A valid key has to be defined');
    }
    this.#getControl(key).patchValue(value, { emitEvent: true });
  }

  delete(key: string): void {
    this.setSelected({ key, value: false });
  }

  #getControl(key: string): FormControl {
    return this.form.get(key) as FormControl;
  }
}
