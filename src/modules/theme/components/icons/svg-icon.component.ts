import { Component, Input } from '@angular/core';

@Component({
  selector: 'theme-svg-icon',
  templateUrl: './svg-icon.component.html'
})
export class SvgIconComponent {

  @Input() type: '' | 'action' | 'success' | 'error' | 'edit' = '';

}
