import { sortBy } from 'lodash';

import { Component } from '@angular/core';

import { CoreComponent } from '@app/base';
import { UserRoleEnum } from '@app/base/enums';

@Component({
  selector: 'shared-pages-switch-context',
  templateUrl: './switch-context.component.html'
})
export class PageSwitchContextComponent extends CoreComponent {
  currentRole: null | { id: string; description: string };

  user: {
    id: string;
    roles: {
      id: string;
      label: string;
      type: UserRoleEnum;
      organisation?: { id: string; name: string; acronym: null | string };
      organisationUnit?: { id: string; name: string; acronym: string };
    }[];
  };

  constructor() {
    super();

    const currentUserContext = this.ctx.user.getUserContext();

    if (!currentUserContext) {
      this.currentRole = null;
    } else {
      this.currentRole = {
        id: currentUserContext.roleId,
        description: `${this.ctx.user.getRoleDescription(currentUserContext.type)}${
          this.ctx.user.isAccessorType() ? ` (${currentUserContext.organisationUnit?.name.trimEnd()})` : ''
        }`
      };
    }

    const user = this.ctx.user.getUserInfo();

    this.user = {
      id: user.id,
      roles: sortBy(user.roles, ['organisation', 'organisationUnit']).map(role => {
        let label = `${this.ctx.user.getRoleDescription(role.role)}${
          role.organisationUnit
            ? ` (${this.displayNameOrAcronym(role.organisationUnit.name, role.organisationUnit.acronym)})`
            : ''
        }`;

        if (currentUserContext) {
          label = currentUserContext.roleId === role.id ? `Continue as ${label}` : `Switch to ${label} profile`;
        }

        return {
          id: role.id,
          label,
          type: role.role,
          ...(role.organisation && { organisation: role.organisation }),
          ...(role.organisationUnit && { organisationUnit: role.organisationUnit })
        };
      })
    };

    this.setPageTitle(!currentUserContext ? 'Choose your profile' : 'Switch profile');
  }

  onSubmit(chosenRoleId: string): void {
    const role = this.user.roles.find(item => item.id === chosenRoleId);

    if (!role) {
      console.error('Chosen role not found!');
      return;
    }

    if (this.currentRole?.id !== role.id) {
      sessionStorage.clear();

      this.ctx.user.setUserContext({
        id: this.user.id,
        roleId: role.id,
        type: role.type,
        organisation: role.organisation,
        organisationUnit: role.organisationUnit
      });

      const roleDescription = `${this.ctx.user.getRoleDescription(role.type).toLowerCase()}${
        role.organisationUnit ? `, ${role.organisationUnit.name}` : ''
      }`;
      this.setRedirectAlertSuccess(`You are now logged in as ${roleDescription}`);

      this.ctx.user.initializeAuthentication$().subscribe(() => {
        if (this.ctx.user.hasAnnouncements()) {
          this.redirectTo('announcements');
        }
        this.redirectTo(`${this.ctx.user.userUrlBasePath()}/dashboard`);
      });

      return;
    }

    this.redirectTo(`${this.ctx.user.userUrlBasePath()}/dashboard`);
  }

  displayNameOrAcronym(name: string, acronym: string): string {
    return name.includes(acronym) ? acronym : name.trimEnd();
  }
}
