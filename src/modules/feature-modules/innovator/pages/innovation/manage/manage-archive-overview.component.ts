import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { ContextInnovationType } from '@app/base/types';
import { FormFieldActionsEnum } from '../how-to-proceed/how-to-proceed.component';

@Component({
  selector: 'app-innovator-pages-innovation-manage-archive-overview',
  templateUrl: './manage-archive-overview.component.html'
})
export class PageInnovationManageArchiveOverviewComponent extends CoreComponent implements OnInit {
  innovationId: string;
  innovation: ContextInnovationType;

  action: FormFieldActionsEnum;

  constructor(private activatedRoute: ActivatedRoute) {
    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.action = this.activatedRoute.snapshot.queryParams.action;

    this.innovation = this.stores.other.innovation();

    this.setGoBackLink();
  }

  ngOnInit() {
    this.setPageTitle(`Archive ${this.innovation.name} innovation`);
    this.setPageStatus('READY');
  }

  setGoBackLink(): void {
    const previousUrl = this.stores.context.getPreviousUrl();
    if (previousUrl?.includes('how-to-proceed')) {
      const howToProceedUrl = previousUrl.split('?')[0];
      this.setBackLink('Go back', () => {
        this.redirectTo(
          howToProceedUrl,
          this.action && {
            action: this.action
          }
        );
      });
    } else {
      this.setBackLink();
    }
  }
}
