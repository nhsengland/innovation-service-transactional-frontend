import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { InnovationActionStatusEnum } from '@modules/stores/innovation';


@Component({
  selector: 'shared-pages-innovation-action-status-list',
  templateUrl: './task-status-list.component.html'
})
export class PageTaskStatusListComponent extends CoreComponent {

  visibleStatus: InnovationActionStatusEnum[] = [
    InnovationActionStatusEnum.OPEN,
    InnovationActionStatusEnum.DECLINED,
    InnovationActionStatusEnum.DONE,
    InnovationActionStatusEnum.CANCELLED,
  ];


  constructor(
    private activatedRoute: ActivatedRoute
  ) {

    super();

    const innovationId = this.activatedRoute.snapshot.params.innovationId;
    const actionId = this.activatedRoute.snapshot.params.actionId;

    this.setPageTitle('Task status');

    if (innovationId) {
      this.setBackLink('Tasks to do', `/${this.stores.authentication.userUrlBasePath()}/innovations/${innovationId}/action-tracker${actionId ?? ''}`);
    }
    else {
      this.setBackLink('Tasks to do', `/${this.stores.authentication.userUrlBasePath()}/actions`);
    }

    this.setPageStatus('READY');

  }

}
