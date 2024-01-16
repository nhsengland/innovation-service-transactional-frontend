import { Component, Input } from '@angular/core';

@Component({
  selector: 'theme-action-link',
  templateUrl: './action-link.component.html'
})
export class ActionLinkComponent {
  @Input() href = '';
  @Input() text = '';

  constructor() {}
}
