import { Component } from '@angular/core';

import { CoreComponent } from '@app/base';
import { InnovationSupportStatusEnum } from '@modules/stores/innovation';


@Component({
  selector: 'shared-pages-innovation-support-status-list',
  templateUrl: './innovation-support-status-list.component.html',
  styleUrls: ['./innovation-support-status-list.component.scss']
})
export class PageInnovationSupportStatusListComponent extends CoreComponent {

  visibleStatus: InnovationSupportStatusEnum[] = [
    InnovationSupportStatusEnum.UNASSIGNED,
    InnovationSupportStatusEnum.ENGAGING,
    InnovationSupportStatusEnum.FURTHER_INFO_REQUIRED,
    InnovationSupportStatusEnum.WAITING,
    InnovationSupportStatusEnum.NOT_YET,
    InnovationSupportStatusEnum.UNSUITABLE,
    InnovationSupportStatusEnum.COMPLETE
  ]

  constructor() {

    super();

    this.setPageTitle('Support status key');
    this.setPageStatus('READY');

  }

}
