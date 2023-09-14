import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { FormGroup } from '@app/base/forms';
import { UserInfo } from '@modules/shared/dtos/users.dto';
import { AdminUsersService } from '../../services/users.service';


@Component({
  selector: 'app-admin-pages-users-user-find',
  templateUrl: './user-find.component.html'
})
export class PageUserFindComponent extends CoreComponent implements OnInit {

  formSubmitted = false;
  form = new FormGroup({
    email: new UntypedFormControl('')
  }, { updateOn: 'change' }); // Needs to be 'change' to allow submtitting using the enter key.

  searchUser: null | (UserInfo & { rolesDescription: string[]}) = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private usersService: AdminUsersService
  ) {

    super();
    this.setPageTitle('Find or add a user');

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

    this.usersService.getUserInfo(this.form.get('email')!.value).subscribe({
      next: (response) => {
        this.searchUser = {
          ...response,
          rolesDescription: [...new Set(response.roles.map(r => r.role))].map(r => this.stores.authentication.getRoleDescription(r))
        };
        this.setPageStatus('READY');
      },
      error: () => {
        this.searchUser = null;
        this.setPageStatus('READY');
      }
    });
  }

}
