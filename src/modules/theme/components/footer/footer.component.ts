import { Component } from '@angular/core';

import { AuthenticationStore } from '@modules/stores/authentication/authentication.store';


@Component({
  selector: 'theme-footer',
  templateUrl: './footer.component.html'
})
export class FooterComponent {

  applySignOutTimeout: boolean;

  constructor(
    private authenticationStore: AuthenticationStore
  ) {

    // This can be done on the contructor as all sign in/out, refreshes the entire app.
    this.applySignOutTimeout = this.authenticationStore.isSignIn();

  }


  onTimeout(): void {

    this.authenticationStore.signOut();

  }

}
