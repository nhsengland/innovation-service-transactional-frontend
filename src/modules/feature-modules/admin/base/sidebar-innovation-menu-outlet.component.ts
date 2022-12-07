import { Component } from '@angular/core';

import { ContextStore } from '@modules/stores';
import { InnovationStatusEnum } from '@modules/stores/innovation';


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
    ];
    
    if (innovation.status !== InnovationStatusEnum.CREATED && innovation.status !== InnovationStatusEnum.WAITING_NEEDS_ASSESSMENT) {
      this.sidebarItems.push({ label: 'Needs assessment', url: `/admin/innovations/${innovation.id}/assessments/${innovation.assessment?.id}` });
    }

    this.sidebarItems.push({ label: 'Activity log', url: `/admin/innovations/${innovation.id}/activity-log` });
  }

}
