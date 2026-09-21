import { Component } from '@angular/core';

import { CoreComponent } from '@app/base';
import { HeaderMenuBarItemType } from '@app/base/types';

@Component({
  selector: 'app-home-layout',
  templateUrl: './home-layout.component.html'
})
export class HomeLayoutComponent extends CoreComponent {
  headerSection: {
    menuBarItems: HeaderMenuBarItemType[];
  } = {
    menuBarItems: []
  };

  constructor() {
    super();

    this.headerSection = {
      menuBarItems: [
        {
          id: 'myDashboard',
          label: 'My dashboard',
          url: `${this.CONSTANTS.APP_URL}/dashboard`,
          fullReload: true,
          align: 'right'
        }
      ]
    };
  }
}
