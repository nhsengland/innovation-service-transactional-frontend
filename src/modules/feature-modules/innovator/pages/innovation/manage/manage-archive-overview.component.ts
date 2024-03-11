import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { ContextInnovationType } from '@app/base/types';

@Component({
  selector: 'app-innovator-pages-innovation-manage-archive-overview',
  templateUrl: './manage-archive-overview.component.html'
})
export class PageInnovationManageArchiveOverviewComponent extends CoreComponent implements OnInit {
  innovationId: string;

  innovation: ContextInnovationType;

  constructor(private activatedRoute: ActivatedRoute) {
    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;

    this.innovation = this.stores.context.getInnovation();

    this.setBackLink('Go back', `/innovator/innovations/${this.innovationId}/manage/innovation`);
  }

  ngOnInit() {
    this.setPageTitle(`Archive ${this.innovation.name} innovation`);
    this.setPageStatus('READY');
  }
}
