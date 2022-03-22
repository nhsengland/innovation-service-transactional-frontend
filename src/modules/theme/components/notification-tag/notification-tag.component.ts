import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'notification-tag',
  templateUrl: './notification-tag.component.html',
  styleUrls: ['./notification-tag.component.scss']
})
export class NotificationTagComponent implements OnInit {

  @Input() count = 0;
  @Input() isNew = false;
  @Input() type: 'circle' | '' = '';

  label = '';


  constructor() { }


  ngOnInit(): void {

    if (this.isNew) {
      this.label = 'New';
    } else {
      this.label = this.count && this.count < 99 ? this.count.toString() : '99+';
    }

  }

}
