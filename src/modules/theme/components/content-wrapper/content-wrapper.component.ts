import { Component, Input } from '@angular/core';

@Component({
  selector: 'theme-content-wrapper',
  templateUrl: './content-wrapper.component.html'
})
export class ContentWrapperComponent {

  @Input() status: 'LOADING' | 'READY' | 'ERROR' = 'LOADING';

}
