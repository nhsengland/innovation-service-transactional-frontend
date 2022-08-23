import { Component } from '@angular/core';

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


  constructor() {

    super();
    this.setPageTitle('Actions status key');

  }

}
