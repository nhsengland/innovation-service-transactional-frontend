import { Component, OnInit } from '@angular/core';

import { CoreComponent } from '@app/base';
import { INNOVATION_SUPPORT_STATUS } from '@modules/stores/innovation/innovation.models';


@Component({
  selector: 'shared-pages-innovation-support-status-list',
  templateUrl: './innovation-support-status-list.component.html'
})
export class PageInnovationSupportStatusListComponent extends CoreComponent implements OnInit {

  visibleStatus: (keyof typeof INNOVATION_SUPPORT_STATUS)[]
    = [
      'COMPLETE',
      'ENGAGING',
      'FURTHER_INFO_REQUIRED',
      'NOT_YET',
      'UNSUITABLE',
      'WAITING',
      'UNASSIGNED',
      ];

  innovationSupportStatus = this.stores.innovation.INNOVATION_SUPPORT_STATUS;


  constructor() { super(); }


  ngOnInit(): void { }

}
