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
      { label: 'Overview', url: `/innovator/innovations/${innovation.id}/overview` },
      { label: 'Innovation record', url: `/innovator/innovations/${innovation.id}/record` },
      { label: 'Action tracker', url: `/innovator/innovations/${innovation.id}/action-tracker` },
      { label: 'Messages', url: `/innovator/innovations/${innovation.id}/threads` },
      { label: 'Data sharing and support', url: `/innovator/innovations/${innovation.id}/support` },
      { label: 'Activity log', url: `/innovator/innovations/${innovation.id}/activity-log` }
    ];

  }

}
