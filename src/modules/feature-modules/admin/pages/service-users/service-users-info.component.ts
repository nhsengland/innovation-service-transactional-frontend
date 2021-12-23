import { Component, OnInit } from '@angular/core';

import { CoreComponent } from '@app/base';
import { LinkType } from '@app/base/models';


@Component({
  selector: 'app-admin-pages-service-users-info',
  templateUrl: './service-users-info.component.html'
})
export class PageServiceUsersInfoComponent extends CoreComponent implements OnInit {

  titleActions: LinkType[] = [
    { type: 'link', label: 'Edit user', url: '/admin/service-users/User001/edit' },
    { type: 'link', label: 'Delete user', url: '/admin/service-users/User001/delete' }
  ];

  constructor() {

    super();
    this.setPageTitle('User information');

  }

  ngOnInit(): void { }

}
