import { Component } from '@angular/core';

import { CoreComponent } from '@app/base';
import { HeaderMenuBarItemType } from '@app/base/types';

@Component({
  selector: 'app-home-layout',
  templateUrl: './home-layout.component.html'
})
export class HomeLayoutComponent extends CoreComponent {
  headerSection: {
    menuBarItems: { left: HeaderMenuBarItemType[]; right: HeaderMenuBarItemType[] };
  } = {
    menuBarItems: { left: [], right: [] }
  };

  constructor() {
    super();

    this.headerSection = {
      menuBarItems: {
        left: [],
        right: [
          { id: 'myDashboard', label: 'My dashboard', url: `${this.CONSTANTS.APP_URL}/dashboard`, fullReload: true }
        ]
      }
    };
  }
}
