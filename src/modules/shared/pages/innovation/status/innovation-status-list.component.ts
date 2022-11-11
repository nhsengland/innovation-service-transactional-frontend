import { Component } from '@angular/core';

import { CoreComponent } from '@app/base';
import { GroupedInnovationStatusEnum } from '@modules/stores/innovation/innovation.enums';


@Component({
  selector: 'shared-pages-innovation-status-list',
  templateUrl: './innovation-status-list.component.html'
})
export class PageInnovationStatusListComponent extends CoreComponent {

  visibleStatus: GroupedInnovationStatusEnum[] = [
    GroupedInnovationStatusEnum.RECORD_NOT_SHARED,
    GroupedInnovationStatusEnum.AWAITING_NEEDS_ASSESSMENT,
    GroupedInnovationStatusEnum.NEEDS_ASSESSMENT,
    GroupedInnovationStatusEnum.AWAITING_SUPPORT,
    GroupedInnovationStatusEnum.RECEIVING_SUPPORT,
    GroupedInnovationStatusEnum.AWAITING_NEEDS_REASSESSMENT
  ];

  constructor() {

    super();

    this.setPageTitle('Innovation status key');
    this.setBackLink('Go back', `/${this.stores.authentication.userUrlBasePath()}/`);
    this.setPageStatus('READY');

  }

}
