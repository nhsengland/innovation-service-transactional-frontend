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

  termsOfUseVersion: { id: string; summary: string; name: string } = { id: '', summary: '', name: '' };

  constructor(private termsOfUserService: TermsOfUseService) {
    super();
    this.setPageTitle('Terms of use update');

    this.baseUrl = this.CONSTANTS.BASE_URL;
    this.appUrl = this.CONSTANTS.APP_URL;

    this.navigationMenuBar = {
      rightItems: [{ key: 'signOut', label: 'Sign out', link: `${this.appUrl}/signout`, fullReload: true }]
    };

    if (this.ctx.user.isInnovator()) {
      this.policyURL = this.CONSTANTS.URLS.TOU_INNOVATOR;
    } else {
      this.policyURL = this.CONSTANTS.URLS.TOU_SUPPORT_ORGANISATION;
    }
  }

  ngOnInit(): void {
    this.termsOfUserService.getTermsOfUseLastVersionInfo().subscribe(response => {
      this.termsOfUseVersion = { id: response.id, summary: response.summary, name: response.name };
      this.setPageStatus('READY');
    });
  }

  onAgree(): void {
    this.termsOfUserService.acceptTermsOfUseVersion(this.termsOfUseVersion.id).subscribe({
      next: () => {
        window.location.assign(`${this.appUrl}/dashboard`);
      },
      error: () => this.setAlertError('Unable to save terms of use. Please try again or contact us for further help')
    });
  }
}
