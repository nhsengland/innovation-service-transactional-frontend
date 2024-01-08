import { FormGroup } from '@angular/forms';
import { Filter } from '../filters.model';
import { FilterHandler } from './base-filter.handler';
import { CheckboxGroupHandler } from './checkbox-group.hander';
import { CheckboxesHandler } from './checkboxes.handler';
import { DateRangeHandler } from './date-range.handler';

export class FilterHandlerFactory {
  static create(filter: Filter, form: FormGroup): FilterHandler {
    if (filter.type === 'CHECKBOX_GROUP') return new CheckboxGroupHandler(filter.key, form);
    if (filter.type === 'CHECKBOXES') return new CheckboxesHandler(filter.key, form);
    if (filter.type === 'DATE_RANGE') return new DateRangeHandler(filter.key, form);
    throw new Error('Filter Handler is not defined');
  }
}
