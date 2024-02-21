import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

export type SelectComponentInputType = { key: string; text: string };

@Component({
  selector: 'theme-select-component',
  templateUrl: './select.component.html'
})
export class SelectComponent implements OnInit {
  @Input({ required: true }) id: string = '';
  @Input({ required: true }) label: string = '';
  @Input({ required: true }) selectList: SelectComponentInputType[] = [];
  @Input() defaultValueKey: string = '';
  @Output() selectChanged = new EventEmitter<string>();

  selectedField: string = '';

  ngOnInit(): void {
    this.selectedField = this.selectList.find(item => item.key === this.defaultValueKey)?.key ?? this.selectList[0].key;
  }

  onChangeSelect() {
    this.selectChanged.emit(this.selectedField);
  }
}
