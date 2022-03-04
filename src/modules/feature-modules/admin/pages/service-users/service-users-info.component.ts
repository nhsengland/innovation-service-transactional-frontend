import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { AlertType, LinkType } from '@app/base/models';

import { RoutingHelper } from '@modules/core';

import { ServiceUsersService, UserType } from '../../services/service-users.service';


@Component({
  selector: 'app-admin-pages-service-users-info',
  templateUrl: './service-users-info.component.html'
})
export class PageServiceUsersInfoComponent extends CoreComponent implements OnInit {

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
    this.setPageTitle('User information');

    this.user = { id: this.activatedRoute.snapshot.params.userId, name: RoutingHelper.getRouteData(this.activatedRoute).user.displayName };

    switch (this.activatedRoute.snapshot.queryParams.alert) {
      case 'lockSuccess':
        this.alert = {
          type: 'SUCCESS',
          title: 'User locked successfully',
          // message: 'You\'ve updated your support status and posted a comment to the innovator.'
        };
        break;
      case 'unlockSuccess':
        this.alert = {
          type: 'SUCCESS',
          title: 'User unlocked successfully',
          // message: 'Your suggestions were saved and notifications sent.'
        };
        break;
      case 'userCreationSuccess':
        this.alert = {
          type: 'SUCCESS',
          title: 'User created successfully',
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
        console.log(response);
        this.titleActions = [
          // { type: 'link', label: 'Edit user', url: `/admin/service-users/${this.userId}/edit` },
          {
            type: 'link',
            label: !response.lockedAt ? 'Lock user' : 'Unlock user',
            url: `/admin/service-users/${this.user.id}/${!response.lockedAt ? 'lock' : 'unlock'}`
          },
          // { type: 'link', label: 'Delete user', url: `/admin/service-users/${this.userId}/delete` }
        ];

        if(
          response.userOrganisations[0].role === UserType.ACCESSOR ||
          response.userOrganisations[0].role === UserType.QUALIFYING_ACCESSOR
        ) {
          this.titleActions.push({
            type: 'link',
            label: 'Change Role',
            url: `/admin/service-users/${this.user.id}/change-role`
          });
        }

        this.sections.userInfo = [
          { label: 'Name', value: response.displayName },
          { label: 'Type', value: this.stores.authentication.getRoleDescription(response.type) },
          { label: 'Email address', value: response.email }
        ];

        // this.sections.innovations = ['Innovation 01', 'Innovation 02'];

        // this.sections.organisation = [
        //   { label: 'Organisation', value: 'NICE' },
        //   { label: 'Unit', value: 'NICE unit (if accessor)' },
        //   { label: 'Assigned innovations', value: '57 (if accessor)' }
        // ];

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
