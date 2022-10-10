import { Component } from '@angular/core';

import { CoreComponent } from '@app/base';
import { HeaderMenuBarItemType } from '@app/base/types';


@Component({
  selector: 'app-triage-innovator-pack-layout',
  templateUrl: './triage-innovator-pack-layout.component.html',
})
export class TriageInnovatorPackLayoutComponent extends CoreComponent {

  headerSection: {
    menuBarItems: { left: HeaderMenuBarItemType[], right: HeaderMenuBarItemType[] }
  } = {
      menuBarItems: { left: [], right: [] }
    };


  constructor() {

    super();

    this.headerSection = {
      menuBarItems: {
        left: [
          { id: 'findSupport', label: 'Find support', url: `/triage-innovator-pack` },
          { id: 'innovationGuides', label: 'Innovation guides', url: `/innovation-guides`, fullReload: true },
          { id: 'caseStudies', label: 'Case studies', url: `/case-studies`, fullReload: true },
          { id: 'aboutTheService', label: 'About the service', url: `/about-the-service`, fullReload: true }
        ],
        right: [
          { id: 'myDashboard', label: 'My dashboard', url: `${this.CONSTANTS.APP_URL}/dashboard`, fullReload: true }
        ]
      }
    };

  }

}
