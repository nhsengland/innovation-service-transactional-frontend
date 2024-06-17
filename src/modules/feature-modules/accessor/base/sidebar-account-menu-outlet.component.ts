import { Component } from '@angular/core';

@Component({
  selector: 'app-base-sidebar-account-menu-outlet-accessor',
  templateUrl: './sidebar-account-menu-outlet.component.html'
})
export class SidebarAccountMenuOutletComponent {
  sidebarItems: { label: string; url: string }[] = [];

  constructor() {
    this.sidebarItems = [
      { label: 'Your details', url: `/accessor/account/manage-details` },
      { label: 'Email notifications', url: `/accessor/account/email-notifications` },
      { label: 'Manage custom notifications', url: `/accessor/account/manage-custom-notifications` },
      { label: 'Manage account', url: `/accessor/account/manage-account` }
    ];
  }
}
