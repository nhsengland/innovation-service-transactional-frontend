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
    private serviceUsersService: ServiceUsersService
  ) {

    super();

    this.user = { id: this.activatedRoute.snapshot.params.userId, name: RoutingHelper.getRouteData<any>(this.activatedRoute).user.displayName };

    this.setPageTitle('Unlock user', { hint: this.user.name });

  }


  ngOnInit(): void {

    this.serviceUsersService.getUserFullInfo(this.user.id).subscribe({

      next: response => {

        if (!response.lockedAt) {
          this.redirectTo(`admin/service-users/${this.user.id}`);
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

    this.serviceUsersService.unlockUser(this.user.id).subscribe({
      next: () => this.redirectTo(`admin/service-users/${this.user.id}`, { alert: 'unlockSuccess' }),
      error: () => {
        this.setPageStatus('ERROR');
        this.setAlertUnknownError();
      }
    });

  }

}
