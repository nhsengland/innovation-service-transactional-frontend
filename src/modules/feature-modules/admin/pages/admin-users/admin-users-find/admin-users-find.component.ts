import { Component, OnInit } from '@angular/core';

import { CoreComponent, FormControl, FormGroup } from '@app/base';
import { LinkType } from '@app/base/models';

import { searchUserEndpointOutDTO, ServiceUsersService } from '../../../services/service-users.service';


@Component({
  selector: 'app-admin-pages-users-find',
  templateUrl: './admin-users-find.component.html'
})
export class PageAdminUsersFindComponent extends CoreComponent implements OnInit {

  titleActions: LinkType[] = [
    { type: 'button', label: 'New admin user', url: '/admin/administration-users/new' }
  ];

  formSubmitted = false;
  form = new FormGroup({
    email: new FormControl('')
  }, { updateOn: 'change' }); // Needs to be 'change' to allow submtitting using the enter key.

  usersList: searchUserEndpointOutDTO[] = [];


  constructor(
    private serviceUsersService: ServiceUsersService
  ) {

    super();
    this.setPageTitle('Find a admin user');

  }

  ngOnInit(): void {

    this.setPageStatus('READY');

  }

  onSubmit(): void {

    this.setPageStatus('LOADING');
    this.formSubmitted = true;

    this.serviceUsersService.searchUser(this.form.get('email')!.value, true).subscribe(
      response => {
        this.usersList = response;
        this.setPageStatus('READY');
      },
      error => {
        this.usersList = [];
        this.setPageStatus('READY');
      });

  }

}
