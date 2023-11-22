import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";


export type ChipFilterInputType = { id: string, value: string, exclusive?: boolean }[];

@Component({
  selector: 'theme-chips-filter-component',
  templateUrl: './chips-filter-component.html'
})
export class ChipsFilterComponent implements OnInit {

  @Input({ required: true }) chipsInput: ChipFilterInputType = [];
  @Input() exclusive: boolean = false;

  @Output() chipsChange = new EventEmitter<string[]>();

  selectedChips: string[] = [];

  ngOnInit(): void {
    if (this.exclusive) {
      this.chipsInput.unshift({ id: 'ALL', value: 'All', exclusive: true });
    }
  }

  onClickChip(chip: ChipFilterInputType[number]) {
    if (chip.exclusive) {
      this.selectedChips = [];
      this.chipsChange.emit(this.selectedChips);
      return;
    }

    if (!this.selectedChips.includes(chip.id)) {
      this.selectedChips.push(chip.id);
    } else {
      this.selectedChips = this.selectedChips.filter(item => chip.id !== item);
    }
    this.chipsChange.emit(this.selectedChips);
  }

  clearSelectedChips() {
    this.selectedChips = [];
    this.chipsChange.emit(this.selectedChips);
  }
}
