import { Component, OnInit } from '@angular/core';

import { CoreComponent } from '@app/base';


@Component({
  selector: 'app-innovator-pages-innovation-action-tracker',
  templateUrl: './action-tracker.component.html'
})
export class InnovationActionTrackerComponent extends CoreComponent implements OnInit {

  constructor() { super(); }

  ngOnInit(): void { }

}
