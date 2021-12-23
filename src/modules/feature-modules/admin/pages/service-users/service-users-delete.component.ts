import { Component, OnInit } from '@angular/core';

import { CoreComponent } from '@app/base';


@Component({
  selector: 'app-admin-pages-service-users-delete',
  templateUrl: './service-users-delete.component.html'
})
export class PageServiceUsersDeleteComponent extends CoreComponent implements OnInit {

  constructor() {

    super();
    this.setPageTitle('Delete User');

  }

  ngOnInit(): void { }

}
