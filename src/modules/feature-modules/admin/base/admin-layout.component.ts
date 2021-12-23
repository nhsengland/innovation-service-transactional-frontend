import { Component } from '@angular/core';

import { CoreComponent } from '@app/base';

import { MenuBarItemType } from '@modules/theme/components/header/header.component';


@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
})
export class AdminLayoutComponent extends CoreComponent {

  navigationMenuBar: {
    leftItems: MenuBarItemType[],
    rightItems: MenuBarItemType[]
  } = { leftItems: [], rightItems: [] };

  constructor() {

    super();

    this.navigationMenuBar = {
      leftItems: [
        { title: 'Home', url: '/admin/dashboard' },
        { title: 'Service users', url: '/admin/service-users' },
        {
          title: 'Management',
          description: 'This is the menu description',
          children: [
            { title: 'Organisations', url: '/admin/organisations', description: 'Manage organisations and assotiated units' },
            { title: 'Terms and conditions', url: '/admin/terms-conditions', description: 'Create a new version and trigger acceptance by the users' }
          ]
        }
      ],
      rightItems: [
        { title: 'My account', url: '/admin/account' },
        { title: 'Sign out', url: `${this.stores.environment.APP_URL}/signout`, fullReload: true }
      ]
    };

    if (this.stores.authentication.isAdminRole()) {
      this.navigationMenuBar.leftItems.splice(0, 0, { title: 'Admin users', url: '/admin/administration-users' } );
    }

  }

}
