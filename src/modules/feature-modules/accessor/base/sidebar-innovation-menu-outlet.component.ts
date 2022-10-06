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
      { label: 'Overview', url: `/accessor/innovations/${innovation.id}/overview` },
      { label: 'Innovation record', url: `/accessor/innovations/${innovation.id}/record` },
      { label: 'Action tracker', url: `/accessor/innovations/${innovation.id}/action-tracker` },
      { label: 'Messages', url: `/accessor/innovations/${innovation.id}/threads` },
      { label: 'Support status', url: `/accessor/innovations/${innovation.id}/support` },
      { label: 'Activity log', url: `/accessor/innovations/${innovation.id}/activity-log` }
    ];

  }

}
