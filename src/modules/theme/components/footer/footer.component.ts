import { Component } from '@angular/core';

import { EnvironmentVariablesStore } from '@modules/core/stores/environment-variables.store';
import { AuthenticationStore } from '@modules/stores/authentication/authentication.store';

@Component({
  selector: 'theme-footer',
  templateUrl: './footer.component.html'
})
export class FooterComponent {

  applySignOutTimeout: boolean;

  constructor(
    private authenticationStore: AuthenticationStore,
    private envVariablesStore: EnvironmentVariablesStore
  ) {

    // This can be done on the contructor as all sign in/out, refreshes the entire app.
    this.applySignOutTimeout = this.authenticationStore.isSignIn();

  }


  onTimeout(): void {

    /* istanbul ignore next */
    window.location.assign(`${this.envVariablesStore.APP_URL}/signout`); // Full reload is needed to hit SSR.

  }

}
