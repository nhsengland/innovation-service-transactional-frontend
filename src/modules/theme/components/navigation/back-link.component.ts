import { Component, Input } from '@angular/core';

@Component({
  selector: 'theme-back-link',
  templateUrl: './back-link.component.html'
})
export class BackLinkComponent {
  @Input() href = '';

  constructor() {}
}
