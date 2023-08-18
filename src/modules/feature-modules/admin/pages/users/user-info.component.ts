import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { LinkType } from '@app/base/types';
import { RoutingHelper } from '@app/base/helpers';

import { AccessorOrganisationRoleEnum, UserRoleEnum } from '@app/base/enums';
import { OrganisationsService } from '@modules/shared/services/organisations.service';
import { forkJoin } from 'rxjs';
import { UsersService } from '@modules/shared/services/users.service';


@Component({
  selector: 'app-admin-pages-users-user-info',
  templateUrl: './user-info.component.html'
})
export class PageUserInfoComponent extends CoreComponent implements OnInit {

  user: { id: string, name: string };

  userInfoType = '';

  titleActions: LinkType[] = [];

  unitLength = 0;

  sections: {
    userInfo: { label: string; value: null | string; }[];
    innovations: string[];
    organisation: {
      id: string; name: string; role: null | string;
      units: { id: string; name: string; supportCount: null | number; }[];
    }[];
  } = { userInfo: [], innovations: [], organisation: [] };


  constructor(
    private activatedRoute: ActivatedRoute,
    private usersService: UsersService,
    private organisationService: OrganisationsService
  ) {

    super();

    this.user = { id: this.activatedRoute.snapshot.params.userId, name: RoutingHelper.getRouteData<any>(this.activatedRoute).user.displayName };

    switch (this.activatedRoute.snapshot.queryParams.alert) {
      case 'lockSuccess':
        this.setAlertSuccess('User locked successfully');
        break;
      case 'unlockSuccess':
        this.setAlertSuccess('User unlocked successfully');
        break;
      case 'userCreationSuccess':
        this.setAlertSuccess('A new user has been added to the service');
        break;
      case 'roleChangeSuccess':
        this.setAlertSuccess('User role changed successfully');
        break;
      case 'unitChangeSuccess':
        this.setAlertSuccess('Organisation unit has been successfully changed')
        break;
      default:
        break;
    }

  }

  ngOnInit(): void {

    forkJoin([
      this.usersService.getUserFullInfo(this.user.id),
      this.organisationService.getOrganisationsList({ unitsInformation: true, withInactive: true })
    ]).subscribe({
      next: ([response, organisations]) => {

        this.userInfoType = response.type;

        if (response.type === UserRoleEnum.ADMIN) {
          const currentUser = this.stores.authentication.getUserInfo();
          if (currentUser.id !== this.user.id) {
            this.titleActions = [{
              type: 'link',
              label: 'Delete user',
              url: `/admin/users/${this.user.id}/administration-users/delete`
            }];
          }
        }
        else if ([UserRoleEnum.ASSESSMENT, UserRoleEnum.INNOVATOR].includes(response.type)) {
          this.titleActions = [{ type: 'link', label: !response.lockedAt ? 'Lock user' : 'Unlock user', url: `/admin/users/${this.user.id}/service-users/${!response.lockedAt ? 'lock' : 'unlock'}` }];
        }
        else {
          const isUserOrganisationUnitActive = organisations
            .flatMap(org => org.organisationUnits.map(unit => ({ id: unit.id, isActive: unit.isActive })))
            .find(unit => unit.id === response.userOrganisations[0]?.units[0]?.id)?.isActive;

          if (isUserOrganisationUnitActive || (!isUserOrganisationUnitActive && !response.lockedAt)) {
            this.titleActions = [{ type: 'link', label: !response.lockedAt ? 'Lock user' : 'Unlock user', url: `/admin/users/${this.user.id}/service-users/${!response.lockedAt ? 'lock' : 'unlock'}` }];
          }
        }

        if (
          response.userOrganisations.length > 0 &&
          (response.userOrganisations[0].role === AccessorOrganisationRoleEnum.ACCESSOR || response.userOrganisations[0].role === AccessorOrganisationRoleEnum.QUALIFYING_ACCESSOR) &&
          !response.lockedAt
        ) {
          this.titleActions.push({
            type: 'link',
            label: 'Change role',
            url: `/admin/users/${this.user.id}/service-users/change-role`
          });

          this.unitLength = organisations.filter(org => (response.userOrganisations[0].id === org.id))[0].organisationUnits.length;
        }

        if (response.type === UserRoleEnum.ACCESSOR || response.type === UserRoleEnum.QUALIFYING_ACCESSOR) {
          if (response.userOrganisations.length > 0) {
            this.sections.userInfo = [
              { label: 'Name', value: response.displayName },
              { label: 'Type', value: 'Authorised person' },
              { label: 'Role', value: this.stores.authentication.getRoleDescription(response.userOrganisations[0].role) },
              { label: 'Email address', value: response.email },
              { label: 'Phone number', value: response.phone ? response.phone : ' NA' },
              { label: 'Account status', value: !response.lockedAt ? 'Active' : 'Locked' }
            ];
          }
          this.sections.organisation = response.userOrganisations;
        }
        else if ([UserRoleEnum.ASSESSMENT, UserRoleEnum.INNOVATOR].includes(response.type)) {
          this.sections.userInfo = [
            { label: 'Name', value: response.displayName },
            { label: 'Type', value: this.stores.authentication.getRoleDescription(response.type) },
            { label: 'Email address', value: response.email },
            { label: 'Phone number', value: response.phone ? response.phone : ' NA' },
            { label: 'Account status', value: !response.lockedAt ? 'Active' : 'Locked' }
          ];
          if (response.type === UserRoleEnum.INNOVATOR) {
            this.sections.innovations = response.innovations.map(x => x.name);
            if (response.userOrganisations.length > 0 && !response.userOrganisations[0].isShadow) {
              this.sections.userInfo = [...this.sections.userInfo,
              { label: 'Company name', value: response.userOrganisations[0].name },
              { label: 'Company size', value: response.userOrganisations[0].size }
              ];
            }
          }
        }
        else {
          this.sections.userInfo = [
            { label: 'Name', value: response.displayName },
            { label: 'Type', value: this.stores.authentication.getRoleDescription(response.type) },
            { label: 'Email address', value: response.email }
          ];
        }

        this.setPageTitle('User information', { hint: this.user.name, actions: this.titleActions });

        this.setPageStatus('READY');

      },
      error: () => {
        this.setPageStatus('ERROR');
        this.setAlertError('Unable to fetch the necessary information', { message: 'Please try again or contact us for further help'});
      }
    });

  }

}
