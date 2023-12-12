import { Component, Input, Output, EventEmitter } from '@angular/core';

export type SortByInputType = { id: string; label: string; order: 'ascending' | 'descending' };

@Component({
  selector: 'theme-sort-by',
  templateUrl: './sort-by.component.html'
})
export class SortByComponent {
  @Input() sortByList: SortByInputType[] = [];
  @Output() sortByChange = new EventEmitter<SortByInputType>();

  selectedField: SortByInputType = { id: '', label: '', order: 'ascending' };

  onChangeSelect() {
    this.sortByChange.emit(this.selectedField);
  }
}
