import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DatesHelper } from '@app/base/helpers';
import { Filter, FiltersModel } from '@modules/core/models/filters/filters.model';

@Component({
  selector: 'shared-filters-selection-wrapper-component',
  templateUrl: './filters-selection-wrapper.component.html'
})
export class FiltersSelectionWrapperComponent implements OnInit {
  @Input({ required: true }) model!: FiltersModel;
  @Output() filterRemoved = new EventEmitter<void>();

  checkboxesTranslations = new Map();

  ngOnInit(): void {
    this.checkboxesTranslations = this.model.getCheckboxesSelectionTranslations();
  }

  onRemoveFilter(filterKey: string, selection: string): void {
    this.model.removeSelection(filterKey, selection);
    this.filterRemoved.emit();
  }

  getDaterangeFilterTitle(filter: Filter): string {
    if (filter.type !== 'DATE_RANGE') return '';

    const date = this.model.getFilterValue(filter);
    return DatesHelper.translateTwoDatesOrder(date.startDate, date.endDate);
  }
}
