import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';

export type SortByInputType = { id: string; label: string; order: 'ascending' | 'descending' };

@Component({
  selector: 'theme-sort-by',
  templateUrl: './sort-by.component.html'
})
export class SortByComponent implements OnInit {
  @Input() sortByList: SortByInputType[] = [];
  @Output() sortByChange = new EventEmitter<SortByInputType>();

  selectedField: SortByInputType = { id: '', label: '', order: 'ascending' };

  ngOnInit(): void {
    this.sortByList = [
      { id: 'statusUpdatedAt', label: 'Last status update', order: 'descending' },
      { id: 'submittedAt', label: 'Last submitted Innovation', order: 'descending' },
      { id: 'name', label: 'Innovation Name', order: 'ascending' },
      { id: 'location', label: 'Location', order: 'ascending' }
    ];

    this.selectedField = this.sortByList[0];
  }

  onChangeSelect() {
    this.sortByChange.emit(this.selectedField);
    console.log(this.selectedField);
  }
}
