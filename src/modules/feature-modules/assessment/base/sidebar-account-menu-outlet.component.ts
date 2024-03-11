import { Component } from '@angular/core';

@Component({
  selector: 'app-base-sidebar-account-menu-outlet-assessment',
  templateUrl: './sidebar-account-menu-outlet.component.html'
})
export class SidebarAccountMenuOutletComponent {
  sidebarItems: { label: string; url: string }[] = [];

  constructor() {
    this.sidebarItems = [
      { label: 'Your details', url: `/assessment/account/manage-details` },
      { label: 'Email notifications', url: `/assessment/account/email-notifications` },
      { label: 'Manage account', url: `/assessment/account/manage-account` }
    ];
  }
}
