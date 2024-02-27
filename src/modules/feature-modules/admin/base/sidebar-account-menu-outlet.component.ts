import { Component } from '@angular/core';

@Component({
  selector: 'app-base-sidebar-account-menu-outlet',
  templateUrl: './sidebar-account-menu-outlet.component.html'
})
export class SidebarAccountMenuOutletComponent {
  sidebarItems: { label: string; url: string }[] = [];

  constructor() {
    this.sidebarItems = [
      { label: 'Your details', url: `/admin/account/manage-details` },
      { label: 'Manage account', url: `/admin/account/manage-account` }
    ];
  }
}
