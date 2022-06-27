import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { AlertType, LinkType } from '@app/base/types';
import { RoutingHelper } from '@app/base/helpers';
import { ServiceUsersService } from '../../../services/service-users.service';

@Component({
  selector: 'app-admin-pages-admin-users-info',
  templateUrl: './admin-users-info.component.html'
})
export class PageAdminUsersInfoComponent extends CoreComponent implements OnInit {
  alert: AlertType = { type: null };

  user: { id: string, name: string };

  titleActions: LinkType[] = [];

  sections: {
    userInfo: { label: string; value: null | string; }[];
    innovations: string[];
    organisation: { label: string; value: null | string; }[];
  } = { userInfo: [], innovations: [], organisation: [] };

  constructor(
    private activatedRoute: ActivatedRoute,
    private serviceUsersService: ServiceUsersService
  ) {
    super();
    this.setPageTitle('Admin User information');
    this.user = { id: this.activatedRoute.snapshot.params.userId, name: RoutingHelper.getRouteData(this.activatedRoute).user.displayName };
    switch (this.activatedRoute.snapshot.queryParams.alert) {
      case 'adminCreationSuccess':
        this.alert = {
          type: 'SUCCESS',
          title: 'Admin created successfully',
          // message: 'Your suggestions were saved and notifications sent.'
        };
        break;
      default:
        break;
    }
  }

  ngOnInit(): void {

    this.serviceUsersService.getUserFullInfo(this.user.id).subscribe(
      response => {
        this.sections.userInfo = [
          { label: 'Name', value: response.displayName },
          { label: 'Type', value: response.type },
          { label: 'Email address', value: response.email }
        ];
        const currentUser = this.stores.authentication.getUserInfo();
        if (currentUser.id !== this.user.id) {
          this.titleActions = [
            {
              type: 'link',
              label:  'Delete user',
              url: `/admin/administration-users/${this.user.id}/delete`
            },
          ];
        }
        this.setPageStatus('READY');
      },
      error => {
        this.setPageStatus('ERROR');
        this.alert = {
          type: 'ERROR',
          title: 'Unable to fetch the necessary information',
          message: 'Please try again or contact us for further help'
        };
      }
    );

  }

}
