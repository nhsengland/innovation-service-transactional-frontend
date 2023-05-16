import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { FormGroup } from '@app/base/forms';
import { LinkType } from '@app/base/types';
import { searchUserEndpointOutDTO, UsersService } from '@modules/shared/services/users.service';


@Component({
  selector: 'app-admin-pages-users-user-find',
  templateUrl: './user-find.component.html'
})
export class PageUserFindComponent extends CoreComponent implements OnInit {

  titleActions: LinkType[] = [
    { type: 'button', label: 'New user', url: '/admin/users/new' }
  ];

  formSubmitted = false;
  form = new FormGroup({
    email: new UntypedFormControl('')
  }, { updateOn: 'change' }); // Needs to be 'change' to allow submtitting using the enter key.

  usersList: searchUserEndpointOutDTO[] = [];


  constructor(
    private activatedRoute: ActivatedRoute,
    private usersService: UsersService
  ) {

    super();
    this.setPageTitle('Find a user', { actions: this.titleActions });

    switch (this.activatedRoute.snapshot.queryParams.alert) {
      case 'adminDeletedSuccess':
        this.setAlertSuccess('Admin deleted successfully');
        break;
      default:
        break;
    }
  }

  ngOnInit(): void {

    this.setPageStatus('READY');

  }

  onSubmit(): void {

    this.resetAlert();
    this.setPageStatus('LOADING');

    this.formSubmitted = true;

    this.usersService.searchUser(this.form.get('email')!.value).subscribe({
      next: (response) => {
        this.usersList = response;
        this.setPageStatus('READY');
      },
      error: () => {
        this.usersList = [];
        this.setAlertUnknownError();
        this.setPageStatus('ERROR');
      }
    });

  }

}
