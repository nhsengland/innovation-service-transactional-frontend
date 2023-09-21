import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { InnovationTaskStatusEnum } from '@modules/stores/innovation';


@Component({
  selector: 'shared-pages-innovation-action-status-list',
  templateUrl: './task-status-list.component.html'
})
export class PageTaskStatusListComponent extends CoreComponent {

  visibleStatus: InnovationTaskStatusEnum[] = [
    InnovationTaskStatusEnum.OPEN,
    InnovationTaskStatusEnum.DECLINED,
    InnovationTaskStatusEnum.DONE,
    InnovationTaskStatusEnum.CANCELLED,
  ];


  constructor(private activatedRoute: ActivatedRoute) {

    super();

    const innovationId = this.activatedRoute.snapshot.params.innovationId;
    const taskId = this.activatedRoute.snapshot.params.taskId;

    this.setPageTitle('Task status');

    if (innovationId) {
      this.setBackLink('Go back', `/${this.stores.authentication.userUrlBasePath()}/innovations/${innovationId}/tasks/${taskId}`);
    }
    else {
      this.setBackLink('Go back', `/${this.stores.authentication.userUrlBasePath()}/tasks`);
    }

    this.setPageStatus('READY');

  }

}
