import { Component } from '@angular/core';
import { URLS } from '@app/base/constants';

import { AuthenticationStore } from '@modules/stores/authentication/authentication.store';


@Component({
  selector: 'theme-footer',
  templateUrl: './footer.component.html'
})
export class FooterComponent {

  applySignOutTimeout: boolean;

  URLS: typeof URLS;

  constructor(
    private authenticationStore: AuthenticationStore
  ) {

    // This can be done on the contructor as all sign in/out, refreshes the entire app.
    this.applySignOutTimeout = this.authenticationStore.isSignIn();

    this.URLS = URLS;

  }


  onTimeout(): void {

    this.authenticationStore.signOut();

  }

}
