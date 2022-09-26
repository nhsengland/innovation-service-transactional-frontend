import { Component, Input } from '@angular/core';


type LabelType = null | 'dot' | 'new' | number;


@Component({
  selector: 'theme-notification-tag',
  templateUrl: './notification-tag.component.html',
  styleUrls: ['./notification-tag.component.scss']
})
export class NotificationTagComponent {

  @Input()
  // get label(): string { return this.visibleLabel; }
  set label(v: LabelType) {

    if (!v) { // Includes 0!
      this.visibleLabel = '';
    } else if (Number.isInteger(Number(v))) {
      this.visibleLabel = v < 99 ? v.toString() : '99+';
    } else {
      this.visibleLabel = v.toString();
    }

  }

  visibleLabel = '';

}
