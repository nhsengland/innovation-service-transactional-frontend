import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

export type SelectComponentInputType = { key: string; text: string; order: 'ascending' | 'descending' };

@Component({
  selector: 'theme-select-component',
  templateUrl: './select.component.html'
})
export class SelectComponent implements OnInit {
  @Input() id: string = '';
  @Input() label: string = '';
  @Input() selectList: SelectComponentInputType[] = [];

  @Output() selectChanged = new EventEmitter<SelectComponentInputType>();

  selectedField: SelectComponentInputType = { key: '', text: '', order: 'ascending' };

  ngOnInit(): void {
    this.selectedField = this.selectList[0];
    console.log();
  }

  onChangeSelect() {
    this.selectChanged.emit(this.selectedField);
  }
}
