import { Component, Input } from '@angular/core';

@Component({
  selector: 'theme-print-link',
  templateUrl: './print-link.component.html',
  styleUrls: ['./print-link.component.scss']

})
export class PrintLinkComponent {

  @Input() href = '';

  constructor() { }

}
