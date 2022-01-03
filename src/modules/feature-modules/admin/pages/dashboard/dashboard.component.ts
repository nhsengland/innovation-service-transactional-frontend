import { Component, OnInit } from '@angular/core';

import { CoreComponent } from '@app/base';


@Component({
  selector: 'app-admin-pages-dashboard',
  templateUrl: './dashboard.component.html'
})
export class PageDashboardComponent extends CoreComponent implements OnInit {

  constructor() {

    super();
    this.setPageTitle('Dashboard');

  }

  ngOnInit(): void { }

}
