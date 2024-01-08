import { FormGroup } from '@angular/forms';

import { Filter } from '../filters.model';

export abstract class FilterHandler {
  protected readonly id: string;
  protected readonly form: FormGroup;

  constructor(id: string, form: FormGroup) {
    this.id = id;
    this.form = form;
  }

  abstract get value():
    | string[]
    | { key: string; startDate: string | null; endDate: string | null }
    | Record<string, boolean>
    | null;

  abstract create(filter: Filter): void;

  abstract getSelected(): { key: string; value: string }[] | { key: string; value: boolean }[];
  abstract setSelected(value: { key?: string; value: string | string[] | boolean | null }): void;

  abstract delete(key: string): void;
}
