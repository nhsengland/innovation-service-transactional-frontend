import { Component, OnInit } from '@angular/core';

import { CoreComponent } from '@app/base';


@Component({
  selector: 'app-admin-pages-service-users-new',
  templateUrl: './service-users-new.component.html'
})
export class PageServiceUsersNewComponent extends CoreComponent implements OnInit {

  constructor() {

    super();
    this.setPageTitle('Create new user');

  }

  ngOnInit(): void { }

}
