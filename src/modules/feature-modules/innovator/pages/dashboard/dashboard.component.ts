import { Component, OnInit } from '@angular/core';

import { CoreComponent } from '@app/base/core.component';

@Component({
  selector: 'app-dashboard-pages-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent extends CoreComponent implements OnInit {

  constructor() {
    super();
  }

  ngOnInit(): void { }

}
