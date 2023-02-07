import { Component, OnInit } from '@angular/core';
import { CoreComponent } from '@app/base';
import { InnovatorOrganisationRoleEnum, AccessorOrganisationRoleEnum, UserRoleEnum } from '@app/base/enums';
import { LocalStorageHelper } from '@app/base/helpers';
import { AuthenticationStore } from '@modules/stores';
@Component({
  selector: 'shared-pages-switch-context',
  templateUrl: './switch-context.component.html'
})
export class PageSwitchContextComponent  extends CoreComponent implements OnInit {
  roles: {
    profile: string,
    type: UserRoleEnum,
    organisation?: {
      id: string,
      name: string,
      organisationUnit: { id: string; name: string; acronym: string; }
    },
  }[] = []

  initialSelection = false
  currentUserProfile = ''
  isAccessor = false;


  constructor(private authenticationStore: AuthenticationStore) { 
    super();
  }

  ngOnInit(): void {
    const userInfo = this.authenticationStore.getUserInfo();
    const userContext = this.authenticationStore.getUserContextInfo();

    this.initialSelection = userContext.type === '';
    this.isAccessor =  this.authenticationStore.isAccessorType();

    if(!this.initialSelection) {
      if (this.isAccessor) {
        this.currentUserProfile = `${this.authenticationStore.getRoleDescription(userContext.type.toString() ?? '').trimEnd()} (${userContext.organisation?.organisationUnit.name.trimEnd()})`;
      } else {
        this.currentUserProfile = `${this.authenticationStore.getRoleDescription(userContext.type.toString() ?? '').trimEnd()}`;
      }
    }

    userInfo.organisations.forEach(org => {
      org.organisationUnits.forEach((unit) => {
        let profile = `${this.authenticationStore.getRoleDescription(org.role).trimEnd()} (${unit.name.trimEnd()})`;
        
        if (!this.initialSelection) {
          const article = this.isAccessor ? 'an' : 'a';
          profile = this.currentUserProfile === profile ? `Continue as ${article} ${profile}` : `Switch to my ${profile} profile`;
        }      
        
        this.roles.push({
          profile: profile,
          type: org.role as string as UserRoleEnum,
          organisation: {
            id: org.id,
            name: org.name,
            organisationUnit: {
              ...unit
            }
          }
        })
      })
    });


    userInfo.roles.filter(i => ![UserRoleEnum.ACCESSOR, UserRoleEnum.QUALIFYING_ACCESSOR].includes(i.role)).forEach((j) => {
      this.roles.push({
        profile: this.authenticationStore.getRoleDescription(j.role),
        type: j.role
      });
    })

    const title = this.initialSelection ? 'Choose your profile' : 'Switch profile';
    this.setPageTitle(title);
    this.setPageStatus('READY');
  }

  redirectToHomepage(role: {
    profile: string,
    type: UserRoleEnum,
    organisation?: {
      id: string,
      name: string,
      organisationUnit: { id: string; name: string; acronym: string; }
    },
  }): void {

    if (this.currentUserProfile !== role.profile) {
      let message = '';
      const currentUserContext = this.authenticationStore.getUserContextInfo();

      if (role.organisation) {
        const roleName = `${this.authenticationStore.getRoleDescription(role.type).trimEnd().toLowerCase()} (${role.organisation.organisationUnit.name.trimEnd()})`;
  
        this.authenticationStore.updateSelectedUserContext({
          type: role.type,
          organisation: {
            ...role.organisation
          }
        });

        message = currentUserContext.organisation?.organisationUnit.id === role.organisation.organisationUnit.id ? `You are logged in as ${this.isAccessor ? 'an' : 'a'} ${roleName}.` : `Switch successful: you are now logged in with your ${roleName} profile.`
        LocalStorageHelper.setObjectItem("orgUnitId", {'id': role.organisation.organisationUnit.id});
      } else {
        const roleName = `${this.authenticationStore.getRoleDescription(role.type).trimEnd().toLowerCase()}`;
        message = currentUserContext.type === role.type? `You are logged in as a ${roleName}.` : `Switch successful: you are now logged in with your ${roleName} profile.`
        
        this.authenticationStore.updateSelectedUserContext({
          type: role.type
        });
      }
     

      LocalStorageHelper.setObjectItem("role", {'id': role.type});
  
      if (!this.initialSelection) {
        this.setRedirectAlertSuccess(message);
      }
    }   

    this.redirectTo(`${this.authenticationStore.userUrlBasePath()}/dashboard`);
  }
}
