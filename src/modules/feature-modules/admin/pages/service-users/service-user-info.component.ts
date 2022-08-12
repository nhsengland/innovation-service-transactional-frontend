import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';

import { CoreComponent } from '@app/base';
import { LinkType } from '@app/base/types';
import { AccessorOrganisationRoleEnum } from '@app/base/enums';
import { RoutingHelper } from '@app/base/helpers';

import { OrganisationsService } from '@modules/feature-modules/admin/services/organisations.service';
import { ServiceUsersService } from '@modules/feature-modules/admin/services/service-users.service';


@Component({
  selector: 'app-admin-pages-service-users-service-user-info',
  templateUrl: './service-user-info.component.html'
})
export class PageServiceUserInfoComponent extends CoreComponent implements OnInit {

  user: { id: string, name: string };

  userInfoType = '';

  titleActions: LinkType[] = [];

  sections: {
    userInfo: { label: string; value: null | string; }[];
    innovations: string[];
    // organisation: { label: string; value: null | string; }[];
    organisation: {
      id: string; name: string; role: null | string;
      units: { id: string; name: string; supportCount: null | string; }[];
    }[];
  } = { userInfo: [], innovations: [], organisation: [] };

  unitLength = 0;

  constructor(
    private activatedRoute: ActivatedRoute,
    private serviceUsersService: ServiceUsersService,
    private organisationService: OrganisationsService
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
      case 'roleChangeSuccess':
        this.alert = {
          type: 'SUCCESS',
          title: 'User role changed successfully',
          // message: 'Your suggestions were saved and notifications sent.'
        };
        break;
      case 'unitChangeSuccess':
        this.alert = {
          type: 'SUCCESS',
          title: 'Organisation unit has been successfully changed',
        };
        break;
      default:
        break;
    }

  }

  ngOnInit(): void {
    forkJoin([
      this.serviceUsersService.getUserFullInfo(this.user.id),
      this.organisationService.getOrganisationsList({ onlyActive: false })
    ]).subscribe(([response, organisations]) => {

      this.userInfoType = response.type;

      const isUserOrganisationUnitActive = organisations
        .flatMap(org => org.organisationUnits.map(unit => ({ id: unit.id, isActive: unit.isActive })))
        .find(unit => unit.id === response.userOrganisations[0]?.units[0]?.id)?.isActive;

      if (isUserOrganisationUnitActive || (!isUserOrganisationUnitActive && !response.lockedAt)) {
        this.titleActions = [
          {
            type: 'link',
            label: !response.lockedAt ? 'Lock user' : 'Unlock user',
            url: `/admin/service-users/${this.user.id}/${!response.lockedAt ? 'lock' : 'unlock'}`
          },
        ];
      }

      if (
        response.userOrganisations.length > 0 &&
        (response.userOrganisations[0].role === AccessorOrganisationRoleEnum.ACCESSOR || response.userOrganisations[0].role === AccessorOrganisationRoleEnum.QUALIFYING_ACCESSOR) &&
        !response.lockedAt
      ) {
        this.titleActions.push({
          type: 'link',
          label: 'Change role',
          url: `/admin/service-users/${this.user.id}/change-role`
        });

        this.unitLength = organisations.filter(org => (response.userOrganisations[0].id === org.id))[0].organisationUnits.length;
      }

      if (response.type === AccessorOrganisationRoleEnum.ACCESSOR && response.userOrganisations.length > 0) {
        this.sections.userInfo = [
          { label: 'Name', value: response.displayName },
          { label: 'Type', value: 'Authorised person' },
          { label: 'Role', value: this.stores.authentication.getRoleDescription(response.userOrganisations[0].role) },
          { label: 'Email address', value: response.email },
          { label: 'Phone number', value: response.phone ? response.phone : ' NA' },
          { label: 'Account status', value: !response.lockedAt ? 'Active' : 'Locked' }
        ];
      }
      else {
        this.sections.userInfo = [
          { label: 'Name', value: response.displayName },
          { label: 'Type', value: this.stores.authentication.getRoleDescription(response.type) },
          { label: 'Email address', value: response.email },
          { label: 'Phone number', value: response.phone ? response.phone : ' NA' },
          { label: 'Account status', value: !response.lockedAt ? 'Active' : 'Locked' }
        ];
      }

      if (response.type === 'INNOVATOR') {
        this.sections.innovations = response.innovations.map(x => x.name);
        if (response.userOrganisations.length > 0 && !response.userOrganisations[0].isShadow) {
          this.sections.userInfo = [...this.sections.userInfo,
          { label: 'Company name', value: response.userOrganisations[0].name },
          { label: 'Company size', value: response.userOrganisations[0].size }
          ];
        }
      }

      if (response.type === AccessorOrganisationRoleEnum.ACCESSOR) {
        this.sections.organisation = response.userOrganisations;
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
