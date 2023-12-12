import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

export type SelectComponentInputType = { key: string; text: string; order: 'ascending' | 'descending' };

@Component({
  selector: 'theme-select-component',
  templateUrl: './select.component.html'
})
export class SelectComponent {
  @Input() id: string = '';
  @Input() label: string = '';
  @Input() sortByList: SelectComponentInputType[] = [];
  @Input() labelOrientation: 'row' | 'column' = 'column';

  @Output() sortByChange = new EventEmitter<SelectComponentInputType>();

  selectedField: SelectComponentInputType = { key: '', text: '', order: 'ascending' };

  onChangeSelect() {
    this.sortByChange.emit(this.selectedField);
  }
}
