import { Component } from '@angular/core';

@Component({
  selector: 'app-base-sidebar-account-menu-outlet-innovator',
  templateUrl: './sidebar-account-menu-outlet.component.html'
})
export class SidebarAccountMenuOutletComponent {
  sidebarItems: { label: string; url: string }[] = [];

  constructor() {
    this.sidebarItems = [
      { label: 'Your details', url: `/innovator/account/manage-details` },
      { label: 'Email preferences', url: `/innovator/account/email-notifications` },
      { label: 'Manage account', url: `/innovator/account/manage-account` }
    ];
  }
}
