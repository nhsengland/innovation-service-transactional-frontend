import { Component } from '@angular/core';

import { ContextStore } from '@modules/stores';


@Component({
  selector: 'app-base-sidebar-innovation-menu-outlet',
  templateUrl: './sidebar-innovation-menu-outlet.component.html'
})
export class SidebarInnovationMenuOutletComponent {

  sidebarItems: { label: string, url: string }[] = [];


  constructor(
    private contextStore: ContextStore
  ) {

    const innovation = this.contextStore.getInnovation();

    this.sidebarItems = [
      { label: 'Overview', url: `/admin/innovations/${innovation.id}/overview` },
      { label: 'Innovation record', url: `/admin/innovations/${innovation.id}/record` },
      { label: 'Action tracker', url: `/admin/innovations/${innovation.id}/action-tracker` },
      { label: 'Messages', url: `/admin/innovations/${innovation.id}/threads` },
      { label: 'Data sharing and support', url: `/admin/innovations/${innovation.id}/support` }, // TODO: this url may change
      { label: 'Needs assessment', url: `/assessment/innovations/${innovation.id}/assessments/${innovation.assessment?.id}` }, // TODO: This may have to be status checked to show
      { label: 'Activity log', url: `/admin/innovations/${innovation.id}/activity-log` }
    ];

  }

}
