import { Component, OnInit } from '@angular/core';
import { CoreComponent } from '@app/base';
import { InnovatorOrganisationRoleEnum, AccessorOrganisationRoleEnum } from '@app/base/enums';
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
    roleName: string,
    organisationUnits: { id: string; name: string; acronym: string; }[]
  }[] = []
  initialSelection = false
  currentUserProfile = ''

  constructor(private authenticationStore: AuthenticationStore) { 
    super();
  }

  ngOnInit(): void {
    const userInfo = this.authenticationStore.getUserInfo();
    const userContext = this.authenticationStore.getUserContextInfo();

    this.initialSelection = userContext === undefined;

    if(!this.initialSelection) {
      this.currentUserProfile = `${this.authenticationStore.getRoleDescription(userContext.type).trimEnd()} (${userContext.organisation?.name.trimEnd()})`
    }

    this.organisations = userInfo.organisations.map(i => {
      let role = `${this.authenticationStore.getRoleDescription(i.role).trimEnd()} (${i.name.trimEnd()})`
      if(!this.initialSelection) {
        role = this.currentUserProfile === role ? `Continue as a ${role}` : `Switch to my ${role} profile`;
      }

      return {
        ...i,
        roleName: role
      }
    });

    const title = this.initialSelection ? 'Choose your profile' : 'Switch profile';
    this.setPageTitle(title);
    this.setPageStatus('READY');
  }

  redirectToHomepage(organisation: {
    id: string,
    name: string,
    role: InnovatorOrganisationRoleEnum | AccessorOrganisationRoleEnum,
    roleName: string,
    organisationUnits: { id: string; name: string; acronym: string; }[]
  }): void {
    this.authenticationStore.updateSelectedUserContext({
      type: organisation.role,
      organisation: {
        id: organisation.id,
        name: organisation.name,
        organisationUnit: { 
          id: organisation.organisationUnits[0].id,
          name: organisation.organisationUnits[0].name, 
          acronym: organisation.organisationUnits[0].acronym,
        }
      }
    })

    this.redirectTo('accessor/dashboard');
  }

}
