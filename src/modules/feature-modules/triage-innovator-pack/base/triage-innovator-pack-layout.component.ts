import { Component } from '@angular/core';

import { CoreComponent } from '@app/base';

import { MenuBarItemType } from '@modules/theme/components/header/header.component';


@Component({
  selector: 'app-triage-innovator-pack-layout',
  templateUrl: './triage-innovator-pack-layout.component.html',
})
export class TriageInnovatorPackLayoutComponent extends CoreComponent {

  navigationMenuBar: {
    leftItems: MenuBarItemType[];
    rightItems: MenuBarItemType[];
  } = { leftItems: [], rightItems: [] };


  constructor() {

    super();

    this.navigationMenuBar = {
      leftItems: [
        { title: 'Find support', url: `/triage-innovator-pack` },
        { title: 'Innovation guides', url: `/innovation-guides`, fullReload: true },
        { title: 'Case studies', url: `/case-studies`, fullReload: true },
        { title: 'About the service', url: `/about-the-service`, fullReload: true },
        { title: 'Find support', url: `/triage-innovator-pack`, fullReload: true }
      ],
      rightItems: [
        { title: 'My dashboard', url: `${this.stores.environment.APP_URL}/dashboard`, fullReload: true }
      ]
    };

  }

}
