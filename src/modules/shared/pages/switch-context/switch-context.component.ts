import { Component, OnInit } from '@angular/core';
import { CoreComponent } from '@app/base';
import { InnovatorOrganisationRoleEnum, AccessorOrganisationRoleEnum } from '@app/base/enums';
import { LocalStorageHelper } from '@app/base/helpers';
import { AuthenticationStore } from '@modules/stores';
@Component({
  selector: 'shared-pages-switch-context',
  templateUrl: './switch-context.component.html'
})
export class PageSwitchContextComponent  extends CoreComponent implements OnInit {
  organisations: {
    id: string,
    name: string,
    role: InnovatorOrganisationRoleEnum | AccessorOrganisationRoleEnum,
    profile: string,
    organisationUnit: { id: string; name: string; acronym: string; }
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
    this.isAccessor =  userContext.organisation?.role === AccessorOrganisationRoleEnum.ACCESSOR;

    if(!this.initialSelection) {
      this.currentUserProfile = `${this.authenticationStore.getRoleDescription(userContext.organisation?.role.toString() ?? '').trimEnd()} (${userContext.organisation?.organisationUnit.name.trimEnd()})`;
    }

    userInfo.organisations.forEach(org => {
      org.organisationUnits.forEach((unit) => {
        let profile = `${this.authenticationStore.getRoleDescription(org.role).trimEnd()} (${unit.name.trimEnd()})`;
        
        if (!this.initialSelection) {
          const article = this.isAccessor ? 'an' : 'a';
          profile = this.currentUserProfile === profile ? `Continue as ${article} ${profile}` : `Switch to my ${profile} profile`;
        }      
        
        this.organisations.push({
          id: org.id,
          name: org.name,
          role: org.role,
          profile: profile,
          organisationUnit: {
            ...unit
          }
        })
      })
    });

    const title = this.initialSelection ? 'Choose your profile' : 'Switch profile';
    this.setPageTitle(title);
    this.setPageStatus('READY');
  }

  redirectToHomepage(organisation: {
    id: string,
    name: string,
    role: InnovatorOrganisationRoleEnum | AccessorOrganisationRoleEnum,
    profile: string,
    organisationUnit: { id: string; name: string; acronym: string; }
  }): void {

    if(this.currentUserProfile !== organisation.profile) {
      const userInfo = this.authenticationStore.getUserInfo();
      const roleName = `${this.authenticationStore.getRoleDescription(organisation.role).trimEnd().toLowerCase()} (${organisation.organisationUnit.name.trimEnd()})`;
      const currentOrgUnitId = this.authenticationStore.getUserContextInfo().organisation?.organisationUnit.id;

      this.authenticationStore.updateSelectedUserContext({
        type: userInfo.roles[0].role,
        organisation: {
          id: organisation.id,
          name: organisation.name,
          role: organisation.role,
          organisationUnit: { 
            id: organisation.organisationUnit.id,
            name: organisation.organisationUnit.name, 
            acronym: organisation.organisationUnit.acronym,
          }
        }
      })

      LocalStorageHelper.setObjectItem("orgUnitId", {'id': organisation.organisationUnit.id});
  
      if (!this.initialSelection) {
        const message = currentOrgUnitId === organisation.organisationUnit.id ? `You are logged in as ${this.isAccessor ? 'an' : 'a'} ${roleName}.` : `Switch successful: you are now logged in with your ${roleName} profile.`
        this.setRedirectAlertSuccess(message);
      }
    }   

    this.redirectTo('accessor/dashboard');
  }
}
