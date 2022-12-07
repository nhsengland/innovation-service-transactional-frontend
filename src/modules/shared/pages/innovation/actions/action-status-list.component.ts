import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { InnovationActionStatusEnum } from '@modules/stores/innovation';


@Component({
  selector: 'shared-pages-innovation-action-status-list',
  templateUrl: './action-status-list.component.html'
})
export class PageActionStatusListComponent extends CoreComponent {

  visibleStatus: InnovationActionStatusEnum[] = [
    InnovationActionStatusEnum.REQUESTED,
    InnovationActionStatusEnum.IN_REVIEW,
    InnovationActionStatusEnum.COMPLETED,
    InnovationActionStatusEnum.DECLINED,
    InnovationActionStatusEnum.CANCELLED,
    InnovationActionStatusEnum.DELETED
  ];


  constructor(
    private activatedRoute: ActivatedRoute
  ) {

    super();

    const innovationId = this.activatedRoute.snapshot.params.innovationId;
    const actionId = this.activatedRoute.snapshot.params.actionId;

    this.setPageTitle('Actions status key');
    this.setBackLink('Action tracker', `/${this.stores.authentication.userUrlBasePath()}/actions`);
    this.setPageStatus('READY');

  }

}
