import { Component, Input } from '@angular/core';
import { LinkType } from '@app/base/types';
import { CtxStore } from '@modules/stores';

@Component({
  selector: 'theme-page-title',
  templateUrl: './page-title.component.html'
})
export class PageTitleComponent {
  @Input() title = '';
  @Input() titleHint?: string;
  @Input() size?: 'xl' | 'l' = 'xl';
  @Input() actions?: LinkType[] = [];

  constructor(protected ctx: CtxStore) {}
}
