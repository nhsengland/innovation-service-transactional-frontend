import { Component, OnInit } from '@angular/core';

import { CoreComponent } from '@app/base/core.component';

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


    console.log(this.stores.environment.getUserInfo());
    this.user = {
      displayName: this.stores.environment.getUserInfo().displayName,
      innovations: this.stores.environment.getUserInfo().innovations
    };


  }

  ngOnInit(): void { }

}
