import { Component } from '@angular/core';

import { CoreComponent } from '@app/base';

import { INNOVATION_SECTION_ACTION_STATUS } from '@modules/stores/innovation/innovation.models';


@Component({
  selector: 'shared-pages-innovation-action-status-list',
  templateUrl: './action-status-list.component.html'
})
export class PageActionStatusListComponent extends CoreComponent {

  visibleStatus: (keyof typeof INNOVATION_SECTION_ACTION_STATUS)[] = ['REQUESTED', 'IN_REVIEW', 'COMPLETED', 'DECLINED', 'CANCELLED'];

  innovationSectionActionStatus = this.stores.innovation.INNOVATION_SECTION_ACTION_STATUS;


  constructor() {

    super();
    this.setPageTitle('Actions status key');

  }

}
