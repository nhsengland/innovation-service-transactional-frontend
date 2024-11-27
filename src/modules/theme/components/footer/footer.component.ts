import { Component } from '@angular/core';
import { URLS } from '@app/base/constants';
import { CtxStore } from '@modules/stores';

@Component({
  selector: 'theme-footer',
  templateUrl: './footer.component.html'
})
export class FooterComponent {
  URLS: typeof URLS;

  constructor(protected ctx: CtxStore) {
    this.URLS = URLS;
  }

  onTimeout(): void {
    this.ctx.user.signOut();
  }
}
