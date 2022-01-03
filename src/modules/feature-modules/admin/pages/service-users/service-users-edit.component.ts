import { Component, OnInit } from '@angular/core';

import { CoreComponent } from '@app/base';


@Component({
  selector: 'app-admin-pages-service-users-edit',
  templateUrl: './service-users-edit.component.html'
})
export class PageServiceUsersEditComponent extends CoreComponent implements OnInit {

  constructor() {

    super();
    this.setPageTitle('Edit information');

  }

  ngOnInit(): void { }

}
