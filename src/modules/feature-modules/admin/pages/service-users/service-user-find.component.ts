import { Component } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

import { CoreComponent } from '@app/base';
import { FormGroup } from '@app/base/forms';
import { LinkType } from '@app/base/types';

import { searchUserEndpointOutDTO, ServiceUsersService } from '../../services/service-users.service';


@Component({
  selector: 'app-admin-pages-service-users-service-user-find',
  templateUrl: './service-user-find.component.html'
})
export class PageServiceUserFindComponent extends CoreComponent {

  titleActions: LinkType[] = [
    { type: 'button', label: 'New user', url: '/admin/service-users/new' }
  ];

  formSubmitted = false;
  form = new FormGroup({
    email: new UntypedFormControl('')
  }, { updateOn: 'change' }); // Needs to be 'change' to allow submtitting using the enter key.

  usersList: searchUserEndpointOutDTO[] = [];


  constructor(
    private serviceUsersService: ServiceUsersService
  ) {

    super();
    this.setPageTitle('Find a service user', { actions: this.titleActions });
    this.setPageStatus('READY');

  }

  onSubmit(): void {

    this.setPageStatus('LOADING');
    this.formSubmitted = true;

    this.serviceUsersService.searchUser(this.form.get('email')!.value, false).subscribe({

      next: (response) => {
        this.usersList = response;
        this.setPageStatus('READY');
      },
      error: () => {
        this.usersList = [];
        this.setPageStatus('READY');
      }
      
    });
  }

}
