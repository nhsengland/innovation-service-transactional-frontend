import { Component } from '@angular/core';

@Component({
  selector: 'app-base-sidebar-innovation-record-menu-outlet.component-outlet-admin',
  templateUrl: './sidebar-innovation-record-menu-outlet.component.html'
})
export class SidebarAccountInnovationRecordManagementOutletComponent {
  sidebarItems: { label: string; url: string }[] = [];

  constructor() {
    this.sidebarItems = [
      { label: 'Manage innovation record', url: `/admin/innovation-record/sections` },
      { label: 'Rules and guidance', url: `/admin/innovation-record/rules-and-guidance` },
      { label: 'Change log', url: `/admin/innovation-record/change-log` }
    ];
  }
}
