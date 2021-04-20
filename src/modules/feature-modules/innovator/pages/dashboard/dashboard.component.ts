import { Component, OnInit } from '@angular/core';

import { CoreComponent } from '@app/base';

@Component({
  selector: 'app-innovator-pages-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent extends CoreComponent implements OnInit {

  user: {
    displayName: string,
    innovations: { id: string, name: string }[]
  };

  constructor() {

    super();

    this.user = {
      displayName: this.stores.authentication.getUserInfo().displayName,
      innovations: this.stores.authentication.getUserInfo().innovations
    };

  }

  ngOnInit(): void { }

}
