import { Component } from '@angular/core';

import { CoreComponent } from '@app/base';


@Component({
  selector: 'shared-pages-error',
  templateUrl: './error.component.html'
})
export class PageErrorComponent extends CoreComponent {

  constructor() {

    super();
    this.setPageTitle('features.shared_pages.page_error.title');

  }

}
