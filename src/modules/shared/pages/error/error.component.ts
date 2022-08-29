import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';


@Component({
  selector: 'shared-pages-error',
  templateUrl: './error.component.html'
})
export class PageErrorComponent extends CoreComponent {

  errorType: 'generic' | 'forbidden_innovation';
  message: string;
  buttonLabel: string;


  constructor(
    private activatedRoute: ActivatedRoute,
  ) {

    super();

    switch (this.activatedRoute.snapshot.params.errorType) {
      case 'forbidden-innovation':
        this.errorType = 'forbidden_innovation';
        break;

      case 'generic':
      default:
        this.errorType = 'generic';
        break;
    }

    this.setPageTitle(`features.shared_pages.page_error.${this.errorType}.title`);
    this.message = `features.shared_pages.page_error.${this.errorType}.message`;
    this.buttonLabel = `features.shared_pages.page_error.${this.errorType}.button_label`;

  }

}
