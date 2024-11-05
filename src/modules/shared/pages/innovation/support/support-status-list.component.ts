import { Component } from '@angular/core';

import { CoreComponent } from '@app/base';
import { InnovationSupportStatusEnum } from '@modules/stores';

@Component({
  selector: 'shared-pages-innovation-support-support-status-list',
  templateUrl: './support-status-list.component.html'
})
export class PageInnovationSupportStatusListComponent extends CoreComponent {
  visibleStatus: InnovationSupportStatusEnum[] = [
    InnovationSupportStatusEnum.UNASSIGNED,
    InnovationSupportStatusEnum.ENGAGING,
    InnovationSupportStatusEnum.WAITING,
    InnovationSupportStatusEnum.UNSUITABLE,
    InnovationSupportStatusEnum.CLOSED
  ];

  constructor() {
    super();

    this.setPageTitle('Support status key');
    this.setBackLink('Go back');
    this.setPageStatus('READY');
  }
}
