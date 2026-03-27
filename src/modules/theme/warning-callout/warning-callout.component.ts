import { Component, Input } from '@angular/core';

@Component({
  selector: 'theme-warning-callout',
  templateUrl: './warning-callout.component.html'
})
export class WarningCalloutComponent {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) description!: string;

  constructor() {}
}
