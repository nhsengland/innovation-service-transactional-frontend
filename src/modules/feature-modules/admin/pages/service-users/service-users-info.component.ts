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
    { type: 'link', label: 'Lock user', url: '/admin/service-users/User001/lock' },
    { type: 'link', label: 'Delete user', url: '/admin/service-users/User001/delete' }
  ];

  sections: {
    userInfo: { label: string; value: null | string; }[];
    innovations: string[];
    organisation: { label: string; value: null | string; }[];
  } = { userInfo: [], innovations: [], organisation: [] };

  constructor() {

    super();
    this.setPageTitle('User information');

  }

  ngOnInit(): void {

    this.sections.userInfo = [
      { label: 'Name', value: 'John Doe' },
      { label: 'Type', value: 'Innovator' },
      { label: 'Email address', value: 'email@some.uk' },
      { label: 'Phone number', value: null }
    ];

    this.sections.innovations = ['Innovation 01', 'Innovation 02'];

    this.sections.organisation = [
      { label: 'Organisation', value: 'NICE' },
      { label: 'Unit', value: 'NICE unit (if accessor)' },
      { label: 'Assigned innovations', value: '57 (if accessor)' }
    ];


  }

}
