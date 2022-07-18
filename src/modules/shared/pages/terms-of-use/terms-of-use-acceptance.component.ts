import { Component, OnInit } from '@angular/core';

import { CoreComponent } from '@app/base';
import { HeaderNavigationBarItemType } from '@app/base/types';

import { TermsOfUseService } from '@modules/shared/services/terms-of-use.service';


@Component({
  selector: 'shared-pages-terms-of-use-acceptance',
  templateUrl: './terms-of-use-acceptance.component.html'
})
export class PageTermsOfUseAcceptanceComponent extends CoreComponent implements OnInit {

  baseUrl: string;
  appUrl: string;
  policyURL: string;

  navigationMenuBar: { rightItems: HeaderNavigationBarItemType } = { rightItems: [] };

  termsOfUseVersion: { id: string, summary: string, name: string } = { id: '', summary: '', name: '' };


  constructor(
    private termsOfUserService: TermsOfUseService
  ) {

    super();
    this.setPageTitle('Terms of use update');

    this.baseUrl = this.CONSTANTS.BASE_URL;
    this.appUrl = this.CONSTANTS.APP_URL;

    this.navigationMenuBar = {
      rightItems: [
        { key: 'signOut', label: 'Sign out', link: `${this.appUrl}/signout`, fullReload: true }
      ]
    };

    if (this.stores.authentication.getUserType() === 'INNOVATOR') {
      this.policyURL = `${this.baseUrl}/terms-of-use/innovator-terms-of-use`;
    }
    else {
      this.policyURL = `${this.baseUrl}/terms-of-use/support-organisation-terms-of-use`;
    }

  }


  ngOnInit(): void {

    this.termsOfUserService.getTermsOfUseLastVersionInfo().subscribe(
      response => {
        this.termsOfUseVersion = { id: response.id, summary: response.summary, name: response.name };
        this.setPageStatus('READY');
      },
      () => {
        this.setPageStatus('ERROR');
        this.alert = {
          type: 'ERROR',
          title: 'Unable to retrieve information',
          message: 'Please try again or contact us for further help'
        };
      });

  }

  onAgree(): void {

    this.alert = { type: null };

    this.termsOfUserService.acceptTermsOfUseVersion(this.termsOfUseVersion.id).subscribe(
      () => { window.location.assign(`${this.appUrl}/dashboard`); },
      () => {
        this.alert = {
          type: 'ERROR',
          title: 'Unable to save terms of use',
          message: 'Please try again or contact us for further help'
        };
      });
  }

}
