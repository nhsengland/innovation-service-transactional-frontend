import { Component } from '@angular/core';

import { CoreComponent } from '@app/base';


@Component({
  selector: 'app-assessment-layout',
  templateUrl: './assessment-layout.component.html'
})
export class AssessmentLayoutComponent extends CoreComponent {

  navigationMenuBar: {
    leftItems: { title: string, link: string, fullReload?: boolean }[],
    rightItems: { title: string, link: string, fullReload?: boolean }[]
  } = { leftItems: [], rightItems: [] };


  constructor() {

    super();

    this.navigationMenuBar = {
      leftItems: [
        { title: 'Home', link: '/assessment/dashboard' }
      ],
      rightItems: [
        { title: 'Innovations', link: '/assessment/review-innovations' },
        { title: 'Account', link: '/assessment/account' },
        { title: 'Sign out', link: `${this.stores.environment.APP_URL}/signout`, fullReload: true }
      ]
    };

  }

}
