import { Component, ElementRef, Input, QueryList, ViewChildren } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Filter, FiltersModel } from '@modules/core/models/filters/filters.model';

@Component({
  selector: 'shared-filters-wrapper-component',
  templateUrl: './filters-wrapper.component.html',
  styleUrls: []
})
export class FiltersWrapperComponent {
  @Input() title = 'Filter your search';
  @Input({ required: true }) form!: FormGroup;
  @Input({ required: true }) model!: FiltersModel;

  @ViewChildren('autocompleteSearchInput') autocompleteInputs?: QueryList<ElementRef<HTMLInputElement>>;

  onCheckboxInputFilter(filter: Filter, e: Event): void {
    const search = (e.target as HTMLInputElement).value;
    this.model.updateDataset(filter, search);
  }

  clearFilters(): void {
    this.autocompleteInputs?.forEach(i => (i.nativeElement.value = ''));
    this.model.clearAll();
  }
}
