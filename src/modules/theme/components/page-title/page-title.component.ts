import { Component, Input } from '@angular/core';

@Component({
  selector: 'theme-page-title',
  templateUrl: './page-title.component.html'
})
export class PageTitleComponent {

  @Input() title = '';
  @Input() titleHint = '';
  @Input() actions: { type: 'link' | 'button', label: string, url: string, fullReload?: boolean }[] = [];

  constructor() { }

}
