import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

export type ChipFilterInputType = { id: string; value: string; exclusive?: boolean; count?: number }[];

@Component({
  selector: 'theme-chips-filter-component',
  templateUrl: './chips-filter-component.html'
})
export class ChipsFilterComponent implements OnInit {

  @Input({ required: true }) chipsInput: ChipFilterInputType = [];
  @Input() exclusive: boolean = false;
  @Input() ariaDescribedBy: string = '';

  @Output() chipsChange = new EventEmitter<string[]>();

  selectedChips: string[] = [];

  ngOnInit(): void {
    if (this.exclusive) {
      const totalCounter = this.chipsInput.reduce((acc, cur) => acc + (cur.count ?? 0), 0);
      this.chipsInput.unshift({
        id: 'ALL',
        value: 'All',
        exclusive: true,
        count: totalCounter !== 0 ? totalCounter : undefined
      });
    }
  }

  onClickChip(chip: ChipFilterInputType[number], event: Event) {
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
    (event.target as HTMLElement).blur();
  }

  clearSelectedChips() {
    this.selectedChips = [];
    this.chipsChange.emit(this.selectedChips);
  }

}
