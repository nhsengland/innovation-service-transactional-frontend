import { Component, OnInit } from '@angular/core';
import { CoreComponent } from '@app/base';
import { UserRoleEnum } from '@app/base/enums';
import { LocalStorageHelper, UtilsHelper } from '@app/base/helpers';
import { AuthenticationStore } from '@modules/stores';
import { sortBy } from 'lodash';
@Component({
  selector: 'shared-pages-switch-context',
  templateUrl: './switch-context.component.html'
})
export class PageSwitchContextComponent  extends CoreComponent implements OnInit {
  roles: {
    profile: string,
    roleId: string,
    type: UserRoleEnum,
    organisation?: {
      id: string,
      name: string,
      acronym: string | null,
      organisationUnit?: { id: string; name: string; acronym: string; }
    },
  }[] = [];
  initialSelection = false;
  currentUserProfile = '';
  title = '';

  constructor(private authenticationStore: AuthenticationStore) { 
    super();
  }

  ngOnInit(): void {
    const userInfo = this.authenticationStore.getUserInfo();
    const userContext = this.authenticationStore.getUserContextInfo();

    this.initialSelection = !userContext;

    if(userContext) { 
      if (this.authenticationStore.isAccessorType()) {
        this.currentUserProfile = `${this.authenticationStore.getRoleDescription(userContext.type.toString() ?? '').trimEnd()} (${userContext.organisation?.organisationUnit?.name.trimEnd()})`;
      } else {
        this.currentUserProfile = `${this.authenticationStore.getRoleDescription(userContext.type.toString() ?? '').trimEnd()}`;
      }
    }

    // I'm not considering if innovator roles + others should be sorted by organisation or have some special order, that can be changed in the future
    // since it never happens nowadays. Previous code didn't order by organisation name but kept units together with organisation and other cases in the end
    sortBy(userInfo.roles, ['organisation', 'organisationUnit']).forEach((role) => {
      let profile = role.organisationUnit ?
        `${this.authenticationStore.getRoleDescription(role.role).trimEnd()} (${role.organisationUnit.name.trimEnd()})` :
        this.authenticationStore.getRoleDescription(role.role);
      
      if (!this.initialSelection) {
        profile = this.currentUserProfile === profile ? `Continue as ${UtilsHelper.indefiniteArticle(profile)}` : `Switch to my ${profile} profile`;
      }

      this.roles.push({
        profile: profile,
        roleId: role.id,
        type: role.role,
        ...role.organisation && { organisation: {
          name: role.organisation.name,
          id: role.organisation.id,
          acronym: role.organisation.acronym,
          ...role.organisationUnit && { organisationUnit: role.organisationUnit }
          } }
      })
    });

    this.title = this.initialSelection ? 'Choose your profile' : 'Switch profile';
  }

  redirectToHomepage(role: {
    profile: string,
    roleId: string,
    type: UserRoleEnum,
    organisation?: {
      id: string,
      name: string,
      acronym: string | null,
      organisationUnit?: { id: string; name: string; acronym: string; }
    },
  }): void {

    if (this.currentUserProfile !== role.profile) {
      let message = '';
      const currentUserContext = this.authenticationStore.getUserContextInfo();

      const roleName = role.organisation?.organisationUnit ? 
        `${this.authenticationStore.getRoleDescription(role.type).trimEnd().toLowerCase()} (${role.organisation.organisationUnit.name.trimEnd()})` :
        `${this.authenticationStore.getRoleDescription(role.type).trimEnd().toLowerCase()}`;

      this.authenticationStore.updateSelectedUserContext(role);

      message = (currentUserContext?.type === role.type && currentUserContext?.organisation?.organisationUnit?.id === role.organisation?.organisationUnit?.id) ? 
        `You are logged in as ${UtilsHelper.indefiniteArticle(roleName)}.`:
        `Switch successful: you are now logged in with your ${roleName} profile.`;

      LocalStorageHelper.setObjectItem("role", role);
  
      if (!this.initialSelection) {
        this.setRedirectAlertSuccess(message);
      }
    }   

    this.redirectTo(`${this.authenticationStore.userUrlBasePath()}/dashboard`);
  }

  currentlyLoggedMessage() {
    return `You are currently logged in as ${UtilsHelper.indefiniteArticle(this.currentUserProfile)}`;
  } 

}
