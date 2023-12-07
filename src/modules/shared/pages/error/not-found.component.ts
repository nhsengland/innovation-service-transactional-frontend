import { Component } from '@angular/core';

import { CoreComponent } from '@app/base';

@Component({
  selector: 'shared-pages-not-found',
  templateUrl: './not-found.component.html'
})
export class PageNotFoundComponent extends CoreComponent {
  constructor() {
    super();
    this.setPageTitle('features.shared_pages.page_not_found.title');
  }
}
