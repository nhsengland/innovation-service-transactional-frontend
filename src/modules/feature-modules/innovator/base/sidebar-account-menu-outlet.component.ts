import { Component } from '@angular/core';


@Component({
  selector: 'app-base-sidebar-account-menu-outlet',
  templateUrl: './sidebar-account-menu-outlet.component.html'
})
export class SidebarAccountMenuOutletComponent {

  disableCreateButton = false;
  sidebarItems: { label: string, url: string }[] = [];


  constructor() {

    this.sidebarItems = [
      { label: 'Your details', url: `/innovator/account/manage-details` },
      { label: 'Manage account', url: `/innovator/account/manage-account` },
      { label: 'Email notifications', url: `/innovator/account/email-notifications` }
    ];

  }

}
