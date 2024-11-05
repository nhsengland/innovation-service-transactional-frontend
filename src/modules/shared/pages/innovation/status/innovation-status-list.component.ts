import { Component } from '@angular/core';

import { CoreComponent } from '@app/base';
import { InnovationGroupedStatusEnum } from '@modules/stores';

@Component({
  selector: 'shared-pages-innovation-status-list',
  templateUrl: './innovation-status-list.component.html'
})
export class PageInnovationStatusListComponent extends CoreComponent {
  visibleStatus: InnovationGroupedStatusEnum[] = [
    InnovationGroupedStatusEnum.RECORD_NOT_SHARED,
    InnovationGroupedStatusEnum.AWAITING_NEEDS_ASSESSMENT,
    InnovationGroupedStatusEnum.NEEDS_ASSESSMENT,
    InnovationGroupedStatusEnum.AWAITING_SUPPORT,
    InnovationGroupedStatusEnum.RECEIVING_SUPPORT,
    InnovationGroupedStatusEnum.AWAITING_NEEDS_REASSESSMENT,
    InnovationGroupedStatusEnum.NO_ACTIVE_SUPPORT,
    InnovationGroupedStatusEnum.ARCHIVED
  ];

  constructor() {
    super();

    this.setPageTitle('Innovation status key');
    this.setBackLink('Go back');
    this.setPageStatus('READY');
  }
}
