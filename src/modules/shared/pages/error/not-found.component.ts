import { Component, Inject, OnInit, Optional } from '@angular/core';
import { Response } from 'express';

import { CoreComponent } from '@app/base';
import { RESPONSE } from '../../../../express.tokens';

@Component({
  selector: 'shared-pages-not-found',
  templateUrl: './not-found.component.html'
})
export class PageNotFoundComponent extends CoreComponent implements OnInit {
  constructor(@Optional() @Inject(RESPONSE) private response: Response) {
    super();
    this.setPageTitle('features.shared_pages.page_not_found.title');
  }

  ngOnInit(): void {
    if (this.isRunningOnServer()) {
      this.response?.status(404);
    }
  }
}
