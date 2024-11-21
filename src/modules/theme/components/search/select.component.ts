import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

export type SelectComponentInputType = { key: string | undefined; text: string; disabled?: boolean };

@Component({
  selector: 'theme-select-component',
  templateUrl: './select.component.html'
})
export class SelectComponent implements OnInit {
  @Input({ required: true }) id = '';
  @Input({ required: true }) label = '';
  @Input({ required: true }) selectList: SelectComponentInputType[] = [];
  @Input() defaultValueKey?: string;
  @Output() selectChanged = new EventEmitter<string>();

  selectedField: string | undefined = '';

  ngOnInit(): void {
    this.selectedField = this.selectList.find(item => item.key === this.defaultValueKey)?.key ?? this.selectList[0].key;
  }

  onChangeSelect() {
    this.selectChanged.emit(this.selectedField);
  }
}
