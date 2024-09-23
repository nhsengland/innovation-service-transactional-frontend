import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UtilsHelper } from '@app/base/helpers';
import { BehaviorSubject, Observable } from 'rxjs';
import { FilterHandler, GetHandlerValue } from './handlers/base-filter.handler';
import { CheckboxGroupHandler } from './handlers/checkbox-group.handler';
import { FilterHandlerFactory } from './handlers/filter-handler.factory';

export type FiltersConfig = { search?: SearchFilter; filters: Filter[] };
export type Dataset = { value: string; label: string; description?: string }[];

export type Filter = BaseFilter & (CheckboxGroupFilter | CheckboxesFilter | DateRangeFilter);
type BaseFilter = { key: string } & FilterOptions;

export type CheckboxesFilter = {
  type: 'CHECKBOXES';
  checkboxes: ({ title: string; defaultValue?: boolean; translation: string } & BaseFilter)[];
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
  selectionTitle: string; // This is used in the selection since title !== selection title
} & CollapsibleFilter;

type SearchFilter = BaseFilter & { label?: string; placeholder?: string; maxLength?: number };

type CollapsibleFilter = { title: string; description?: string; state: 'opened' | 'closed'; scrollable?: boolean };
type DateFilter = { key: string; label: string; description?: string; defaultValue?: string };
type FilterOptions = { options?: { updateOn?: 'blur' | 'change'; emitEvent?: boolean } };

/**
 * Class that orchestrates the filters and exposes the most used functionalities related to filters.
 */
export class FiltersModel {
  form: FormGroup;

  filters: Filter[];
  handlers: Map<string, FilterHandler>;

  search: SearchFilter | null;

  #datasets: Map<string, Dataset>;

  #selected: BehaviorSubject<Filter[]>;
  selected$: Observable<Filter[]>;

  #state: { filters: Record<string, any>; selected: number } | null;

  get hasSelectedFilters(): boolean {
    return this.#state ? this.#state.selected > 0 : false;
  }

  /**
   * Creates a FilterModel instance.
   * If config is not passed, initialize the variables with empty values.
   * If config is passed, initialize the model with filters, datasets, and data (if they exist).
   */
  constructor(config?: { filters?: FiltersConfig; datasets?: Record<string, Dataset>; data?: any }) {
    this.form = new FormGroup({}, { updateOn: 'blur' });

    this.filters = [];
    this.handlers = new Map<string, FilterHandler>();
    this.search = null;

    this.#datasets = new Map();

    this.#selected = new BehaviorSubject<Filter[]>([]);
    this.selected$ = this.#selected.asObservable();

    this.#state = null;

    if (config?.filters) {
      if (config.filters.search) {
        this.addSearch(config.filters.search);
      }

      for (const filter of config.filters.filters) {
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

  /**
   * Adds a filter to the model.
   * Adds the filter to the array of displayed filters and adds it to the form group (each filter handler handles it differently).
   */
  addFilter(filter: Filter) {
    this.filters.push(filter);

    // To truly decouple this factory, it should be injected from the constructor.
    const handler = FilterHandlerFactory.create(filter, this.form);
    handler.create(filter);
    this.handlers.set(filter.key, handler);
  }

  /**
   * Adds a search filter to the model.
   * This implementation assumes only one search per page.
   */
  addSearch(search: SearchFilter) {
    this.search = search;
    this.form.addControl(
      search.key,
      new FormControl('', {
        validators: [Validators.maxLength(search.maxLength ?? 100)],
        updateOn: search.options?.updateOn
      }),
      { emitEvent: false }
    );
  }

  /**
   * Adds datasets to the FiltersModel.
   * These datasets are currently being used only for CheckboxGroup. This datasets are displayed as the options on the CheckboxGroup.
   */
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

  /**
   * Loads data into the model.
   * This can be used to provide values to the form. Example: filling the filters with local storage saved data.
   */
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

  /**
   * Handles state changes in the FiltersModel.
   * It's the core of the functionality and should be called every time a form is updated.
   * This orchestrates updating the current state of filters and selected filters.
   */
  handleStateChanges(): void {
    this.#updateFilters();
    this.#updateSelected();
  }

  /**
   * Returns the API query parameters based on the current filters state.
   * This method returns the standard format the BE "should" expect.
   */
  getAPIQueryParams(): Record<string, any> {
    if (!this.#state) {
      return {};
    }

    const qp = {
      ...this.#state.filters,
      dateFilters:
        this.#state.filters.dateFilters &&
        this.#state.filters.dateFilters.map((f: GetHandlerValue<'DATE_RANGE'>) => ({
          field: f.key,
          startDate: f.startDate ?? undefined,
          endDate: f.endDate ?? undefined
        }))
    };

    return Object.fromEntries(Object.entries(qp).filter(([_k, v]) => !UtilsHelper.isEmpty(v)));
  }

  /**
   * Updates the dataset of a searchable checkbox group filter based on the provided search string.
   * @param {Filter} filter - The checkbox group filter to update.
   * @param {string} search - The search string.
   */
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

  /**
   * Retrieves the typed value of a specific filter.
   */
  getFilterValue<F extends Filter, T extends F['type']>(filter: F): GetHandlerValue<T> {
    const handler = this.handlers.get(filter.key)!;
    return handler.value as GetHandlerValue<T>; // Types have to be improved on FilterHandler
  }

  /**
   * Removes a selection from a specific filter.
   * @param {string} filterKey - The key of the filter.
   * @param {string} key - The key of the selection to remove.
   */
  removeSelection(filterKey: string, key: string) {
    const handler = this.handlers.get(filterKey)!;
    handler.delete(key);
  }

  /**
   * Clears all filters and resets their values.
   */
  clearAll(): void {
    // If search is available reset the value
    if (this.search) {
      this.form.get(this.search.key)?.patchValue('');
    }

    // Reset all filters values
    for (const handler of this.handlers.values()) {
      handler.reset();
    }

    // Reset checkbox group items to their default
    for (const filter of this.filters) {
      if (filter.type === 'CHECKBOX_GROUP' && filter.searchable) {
        this.updateDataset(filter, '');
      }
    }
  }

  /**
   * Retrieves translations for checkboxes selections.
   * Since the checkboxes don't have a matching translation with their title on the filter selection component this
   * method provides the translations that can be used for each of the checkboxes. This method is only applicable when
   * Checkboxes filters are defined in the current model.
   */
  getCheckboxesSelectionTranslations(): Map<string, string> {
    const translations = new Map<string, string>();
    for (const filter of this.filters) {
      if (filter.type === 'CHECKBOXES') {
        for (const checkbox of filter.checkboxes) {
          translations.set(checkbox.key, checkbox.translation);
        }
      }
    }
    return translations;
  }

  /**
   * Internal method to update the filters in the model.
   * Contains all the necessary logic to update the current state of the filters. Including:
   * * Selected filters.
   * * Current state to be returned in the getAPIQueryParams method.
   * * If any filters are currently selected.
   */
  #updateFilters(): void {
    const filters: Record<string, any> = {};
    let selected = 0;

    for (let filter of this.filters) {
      const handler = this.handlers.get(filter.key)!;
      const value = handler.value;
      switch (filter.type) {
        case 'CHECKBOXES':
          Object.assign(filters, value);
          break;
        case 'DATE_RANGE':
          if (!filters['dateFilters']) {
            filters['dateFilters'] = [];
          }
          if (value) {
            filters['dateFilters'].push(value);
          }
          break;
        default:
          filters[filter.key] = value;
      }
      filter.selected = handler.getSelected();
      selected += filter.selected.length ?? 0;

      if (filter.type === 'CHECKBOX_GROUP' || filter.type === 'DATE_RANGE') {
        filter.description = `${filter.selected?.length ?? 0} selected`;
      }
    }

    if (this.search) {
      const control = this.form.get(this.search.key);
      if (control?.valid) {
        filters[this.search.key] = control.value;
      }
    }

    this.#state = { filters, selected };
  }

  /**
   * Internal method to update the selected filters in the model.
   * Making sure it is ordered to always appear with checkboxes at the bottom.
   */
  #updateSelected() {
    const filters = this.filters
      .filter(f => f.selected?.length)
      .sort((a, b) => {
        if (a.type === 'CHECKBOXES' && b.type !== 'CHECKBOXES') return 1;
        if (a.type !== 'CHECKBOXES' && b.type === 'CHECKBOXES') return -1;
        return 0;
      });

    this.#selected.next(filters);
  }

  /**
   * Internal method to sanitize search text.
   * Currently used on the searchable CheckboxGroup.
   */
  #sanitizeText(text: string) {
    return text.trim().replace(/ {2,}/g, ' ').toLowerCase();
  }
}
