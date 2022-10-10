import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { LinkType } from '@app/base/types';
import { RoutingHelper } from '@app/base/helpers';

import { ServiceUsersService } from '../../services/service-users.service';


@Component({
  selector: 'app-admin-pages-admin-users-admin-user-info',
  templateUrl: './admin-user-info.component.html'
})
export class PageAdminUserInfoComponent extends CoreComponent implements OnInit {

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

    this.user = { id: this.activatedRoute.snapshot.params.userId, name: RoutingHelper.getRouteData<any>(this.activatedRoute).user.displayName };

    switch (this.activatedRoute.snapshot.queryParams.alert) {
      case 'adminCreationSuccess':
        this.setAlertSuccess('Admin created successfully');
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
          this.titleActions = [{
            type: 'link',
            label: 'Delete user',
            url: `/admin/administration-users/${this.user.id}/delete`
          }];
        }

        this.setPageStatus('READY');

      },
      error => {
        this.setPageStatus('ERROR');
        this.setAlertError('Unable to fetch the necessary information');
      }
    );

  }

}
