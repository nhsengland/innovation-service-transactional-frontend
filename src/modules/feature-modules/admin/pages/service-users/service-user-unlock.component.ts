import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { RoutingHelper } from '@app/base/helpers';

import { ServiceUsersService } from '../../services/service-users.service';


@Component({
  selector: 'app-admin-pages-service-users-service-user-unlock',
  templateUrl: './service-user-unlock.component.html'
})
export class PageServiceUserUnlockComponent extends CoreComponent implements OnInit {

  user: { id: string, name: string };

  constructor(
    private activatedRoute: ActivatedRoute,
    private usersService: ServiceUsersService
  ) {

    super();

    this.user = { id: this.activatedRoute.snapshot.params.userId, name: RoutingHelper.getRouteData<any>(this.activatedRoute).user.displayName };

    this.setPageTitle('Unlock user', { hint: this.user.name });

  }


  ngOnInit(): void {

    this.usersService.getUserInfo(this.user.id).subscribe({

      next: response => {

        if (response.isActive) {
          this.redirectTo(`/admin/users/${this.user.id}`);
          return;
        }

        this.setPageStatus('READY');

      },
      error: () => {
        this.setPageStatus('ERROR');
        this.setAlertUnknownError();
      }

    });

  }


  onSubmit(): void {

    this.usersService.unlockUser(this.user.id).subscribe({
      next: () => this.redirectTo(`/admin/users/${this.user.id}`, { alert: 'unlockSuccess' }),
      error: () => {
        this.setPageStatus('ERROR');
        this.setAlertUnknownError();
      }
    });

  }

}
