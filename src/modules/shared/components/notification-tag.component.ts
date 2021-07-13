import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'notification-tag',
  templateUrl: './notification-tag.component.html',
  styleUrls: ['./notification-tag.component.scss'],
})
export class NotificationTagComponent implements OnInit {
  @Input() count?: number | undefined;
  @Input() isNew: boolean;
  @Input() type: string;

  label: string;
  constructor() {
    this.count = this.count || 0;
    this.label = '';
    this.isNew = false;
    this.type = '';
  }
  ngOnInit(): void {
    if (!this.isNew) {
      this.label = this.count && this.count < 99 ? this.count.toString() : '99+';
    } else {
      this.label = 'New';
    }
  }
}
