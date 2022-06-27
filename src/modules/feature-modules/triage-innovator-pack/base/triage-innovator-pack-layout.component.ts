import { Component } from '@angular/core';

import { CoreComponent } from '@app/base';
import { HeaderMenuBarItemType } from '@app/base/types';


@Component({
  selector: 'app-triage-innovator-pack-layout',
  templateUrl: './triage-innovator-pack-layout.component.html',
})
export class TriageInnovatorPackLayoutComponent extends CoreComponent {

  headerMenuBar: {
    leftItems: HeaderMenuBarItemType[];
    rightItems: HeaderMenuBarItemType[];
  } = { leftItems: [], rightItems: [] };


  constructor() {

    super();

    this.headerMenuBar = {
      leftItems: [
        { title: 'Find support', url: `/triage-innovator-pack` },
        { title: 'Innovation guides', url: `/innovation-guides`, fullReload: true },
        { title: 'Case studies', url: `/case-studies`, fullReload: true },
        { title: 'About the service', url: `/about-the-service`, fullReload: true }
      ],
      rightItems: [
        { title: 'My dashboard', url: `${this.CONSTANTS.APP_URL}/dashboard`, fullReload: true }
      ]
    };

  }

}
