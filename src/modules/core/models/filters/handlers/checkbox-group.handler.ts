import { FormArray, FormControl, FormGroup } from '@angular/forms';

import { Filter } from '../filters.model';
import { FilterHandler } from './base-filter.handler';

export class CheckboxGroupHandler extends FilterHandler {
  #translation?: { key: string; value: string }[];

  get control(): FormArray {
    return this.form.get(this.id) as FormArray;
  }

  get value(): string[] {
    return this.control.value;
  }

  set translation(translation: { key: string; value: string }[]) {
    this.#translation = translation;
  }

  constructor(id: string, form: FormGroup) {
    super(id, form);
  }

  create(filter: Filter): void {
    this.form.addControl(this.id, new FormArray([], { updateOn: filter.options?.updateOn }), { emitEvent: false });
  }

  getSelected(): { key: string; value: string }[] {
    const selected = this.value;
    if (!this.#translation) {
      return selected.map(v => ({ key: v, value: v }));
    }

    return this.#translation.filter(cur => selected.includes(cur.key));
  }

  setSelected({ value }: { value: string[] }): void {
    value.forEach(v => this.control.push(new FormControl(v), { emitEvent: true }));
  }

  delete(key: string): void {
    const control = this.control;
    const index = control.controls.findIndex(i => i.value === key);

    if (index > -1) {
      control.removeAt(index);
    }
  }
}
