import { Component } from '@angular/core';

import { CoreComponent } from '@app/base';

@Component({
  selector: 'app-triage-innovator-pack-survey-start',
  templateUrl: './start.component.html'
})
export class SurveyStartComponent extends CoreComponent {

  constructor() {

    super();

    this.setPageTitle('Find innovation support', { showPage: false });
    this.setPageStatus('READY');

  }

}
