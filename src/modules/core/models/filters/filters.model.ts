import { FormGroup } from '@angular/forms';
import { FilterHandler, GetHandlerValue } from './handlers/base-filter.handler';
import { CheckboxGroupHandler } from './handlers/checkbox-group.handler';
import { FilterHandlerFactory } from './handlers/filter-handler.factory';

export type Filter = BaseFilter & (CheckboxGroupFilter | CheckboxesFilter | DateRangeFilter);
type BaseFilter = { key: string } & FilterOptions;

type CheckboxesFilter = {
  type: 'CHECKBOXES';
  checkboxes: ({ title: string; defaultValue?: boolean } & BaseFilter)[];
  selected?: { key: string; value: boolean }[];
};

type CheckboxGroupFilter = {
  type: 'CHECKBOX_GROUP';
  selected?: { key: string; value: string }[];
  searchable?: boolean;
  items: Dataset;
} & CollapsibleFilter;

type DateRangeFilter = {
  type: 'DATE_RANGE';
  startDate: DateFilter;
  endDate: DateFilter;
  selected?: { key: string; value: string }[];
} & CollapsibleFilter;

type CollapsibleFilter = { title: string; description?: string; state: 'opened' | 'closed'; scrollable?: boolean };
type DateFilter = { key: string; label: string; description?: string; defaultValue?: string };
type FilterOptions = { options?: { updateOn?: 'blur' | 'change'; emitEvent?: boolean } };

type Dataset = { value: string; label: string; description?: string }[];

/**
 * TODOS:
 * Make a documentation
 */
export class FiltersModel {
  form: FormGroup;

  filters: Filter[];
  handlers: Map<string, FilterHandler>;

  #datasets: Map<string, Dataset>;

  constructor(config?: { filters?: Filter[]; datasets?: Record<string, Dataset>; data?: any }) {
    this.form = new FormGroup({}, { updateOn: 'blur' });

    this.filters = [];
    this.handlers = new Map<string, FilterHandler>();

    this.#datasets = new Map();

    if (config?.filters) {
      for (const filter of config.filters) {
        this.addFilter(filter);
      }
    }

    if (config?.data) {
      this.loadData(config.data);
    }

    if (config?.datasets) {
      this.addDatasets(config.datasets);
    }
  }

  addFilter(filter: Filter) {
    this.filters.push(filter);

    // To truly decouple this factory, it should be injected from the constructor.
    const handler = FilterHandlerFactory.create(filter, this.form);
    handler.create(filter);
    this.handlers.set(filter.key, handler);
  }

  addDatasets(datasets: Record<string, Dataset>) {
    for (const [key, dataset] of Object.entries(datasets)) {
      this.#datasets.set(key, dataset);

      const handler = this.handlers.get(key);
      if (handler instanceof CheckboxGroupHandler) {
        handler.translation = dataset.map(c => ({ key: c.value, value: c.label }));
      }

      const filter = this.filters.find(f => f.key === key);
      if (filter && filter.type === 'CHECKBOX_GROUP') {
        filter.items = dataset;
        if (filter.searchable) {
          this.updateDataset(filter, '');
        }
      }
    }
  }

  loadData(data: any) {
    for (const [key, value] of Object.entries(data)) {
      const handler = this.handlers.get(key);
      if (handler) {
        handler.setSelected({ key, value });
      } else {
        this.form.get(key)?.setValue(value, { emitEvent: false });
      }
    }
  }

  getCurrentStateFilters() {
    const filters: Record<string, any> = {};
    let selected = 0;

    for (let filter of this.filters) {
      const handler = this.handlers.get(filter.key)!;
      const value = handler.value;
      if (filter.type === 'CHECKBOXES') {
        Object.assign(filters, value);
      } else {
        filters[filter.key] = handler.value;
      }
      filter.selected = handler.getSelected();
      selected += filter.selected.length ?? 0;

      if (filter.type === 'CHECKBOX_GROUP' || filter.type === 'DATE_RANGE') {
        filter.description = `${filter.selected?.length ?? 0} selected`;
      }
    }

    return { filters, selected };
  }

  updateDataset(filter: Filter, search: string): void {
    if (filter.type !== 'CHECKBOX_GROUP' || !filter.searchable) {
      return;
    }

    search = this.#sanitizeText(search);
    const selected = this.getFilterValue(filter);

    filter.items = (this.#datasets.get(filter.key) ?? []).filter(
      item => selected.includes(item.value) || this.#sanitizeText(item.label).includes(search)
    );
  }

  getFilterValue<F extends Filter, T extends F['type']>(filter: F): GetHandlerValue<T> {
    const handler = this.handlers.get(filter.key)!;
    return handler.value as GetHandlerValue<T>; // Types have to be improved on FilterHandler
  }

  removeSelection(filterKey: string, key: string) {
    const handler = this.handlers.get(filterKey)!;
    handler.delete(key);
  }

  #sanitizeText(text: string) {
    return text.trim().replace(/ {2,}/g, ' ').toLowerCase();
  }
}
