import { Component } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';

import { INNOVATION_SUPPORT_STATUS } from '@modules/stores/innovation/innovation.models';


@Component({
  selector: 'shared-pages-innovation-support-status-list',
  templateUrl: './innovation-support-status-list.component.html',
  styleUrls: ['./innovation-support-status-list.component.scss']
})
export class PageInnovationSupportStatusListComponent extends CoreComponent {

  visibleStatus: (keyof typeof INNOVATION_SUPPORT_STATUS)[] = [
    'UNASSIGNED',
    'ENGAGING',
    'FURTHER_INFO_REQUIRED',
    'WAITING',
    'NOT_YET',
    'UNSUITABLE',
    'COMPLETE',
  ];

  innovationSupportStatus = this.stores.innovation.INNOVATION_SUPPORT_STATUS;


  constructor(
    // private activatedRoute: ActivatedRoute
  ) {

    super();
    // const innovationId = this.activatedRoute.snapshot.params.innovationId;

    this.setPageTitle('Support status key ');
    // this.setBackLink('Action tracker', `/${this.stores.authentication.userUrlBasePath()}/innovations/${innovationId}/support`);
    this.setPageStatus('READY');

  }

}
