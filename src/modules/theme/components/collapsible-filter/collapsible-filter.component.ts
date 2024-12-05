import { Component, Input, signal } from '@angular/core';

@Component({
  selector: 'theme-collapsible-filter',
  templateUrl: './collapsible-filter.component.html',
  styleUrls: ['./collapsible-filter.component.scss']
})
export class CollapsibleFilterComponent {
  @Input({ required: true }) title = '';
  @Input() description?: string;
  @Input() scrollable?: boolean = false;
  @Input()
  set preOpen(value: boolean) {
    this.isOpen.set(value);
  }
  isOpen = signal(false);

  onOpenCloseFilter() {
    this.isOpen.update(isOpen => !isOpen);
  }
}
