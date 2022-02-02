import { Component, OnInit } from '@angular/core';

import { CoreComponent, FormControl, FormGroup } from '@app/base';
import { LinkType } from '@app/base/models';
import { response } from 'express';
import { searchUserEndpointDTO, ServiceUsersService } from '../../services/service-users.service';


@Component({
  selector: 'app-admin-pages-service-users-find',
  templateUrl: './service-users-find.component.html'
})
export class PageServiceUsersFindComponent extends CoreComponent implements OnInit {

  titleActions: LinkType[] = [
    { type: 'button', label: 'New user', url: '/admin/service-users/new' }
  ];

  form = new FormGroup({
    search: new FormControl()
  });

  serviceUsers?: searchUserEndpointDTO[];

  constructor(
    private serviceUsersService: ServiceUsersService
  ) {

    super();
    this.setPageTitle('Service users search');
    this.serviceUsers = [];
  }

  ngOnInit(): void { }

  onSubmit(): void {
    const email = this.form.get('search')!.value;

    this.serviceUsersService.searchUser(email).subscribe( response => {
      this.serviceUsers = response;
    });
  }
}
