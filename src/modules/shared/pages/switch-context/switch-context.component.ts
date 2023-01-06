import { Component, OnInit } from '@angular/core';
import { CoreComponent } from '@app/base';
import { InnovatorOrganisationRoleEnum, AccessorOrganisationRoleEnum } from '@app/base/enums';

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

  constructor() { 
    super();
    this.setPageTitle('Choose your profile');
  }

  ngOnInit(): void {
    this.organisations = this.stores.authentication.getUserInfo().organisations.map(i => {
      return {
        ...i,
        roleName: this.stores.authentication.getRoleDescription(i.role)
      }
    });

    this.setPageStatus('READY');
  }

}
