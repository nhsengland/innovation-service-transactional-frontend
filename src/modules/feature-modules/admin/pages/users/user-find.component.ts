import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { FormGroup } from '@app/base/forms';
import { UserInfo } from '@modules/shared/dtos/users.dto';
import { debounceTime } from 'rxjs';
import { AdminUsersService } from '../../services/users.service';

@Component({
  selector: 'app-admin-pages-users-user-find',
  templateUrl: './user-find.component.html'
})
export class PageUserFindComponent extends CoreComponent implements OnInit {
  formSubmitted = false;
  form = new FormGroup({ email: new UntypedFormControl('', { updateOn: 'blur' }) });

  searchUser: null | (UserInfo & { rolesDescription: string[] }) = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private usersService: AdminUsersService
  ) {
    super();
    this.setPageTitle('Find or add a user');

    switch (this.activatedRoute.snapshot.queryParams.alert) {
      case 'deleteSuccess':
        this.setAlertSuccess('User deleted successfully');
        break;
      default:
        break;
    }
  }

  ngOnInit(): void {
    this.setPageStatus('READY');
    this.subscriptions.push(this.form.valueChanges.pipe(debounceTime(500)).subscribe(() => this.onSubmit()));
  }

  onSubmit(): void {
    this.resetAlert();
    this.setPageStatus('LOADING');

    this.formSubmitted = true;

    this.usersService.getUserInfo(this.form.get('email')!.value).subscribe({
      next: response => {
        this.searchUser = {
          ...response,
          rolesDescription: [...new Set(response.roles.map(r => r.role))].map(r => this.ctx.user.getRoleDescription(r))
        };
        this.setPageStatus('READY');
      },
      error: () => {
        this.searchUser = null;
        this.setPageStatus('READY');
      }
    });
  }

  onSearchClick() {
    this.form.updateValueAndValidity({ onlySelf: true });
  }
}
