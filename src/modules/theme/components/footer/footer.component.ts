import { Component } from '@angular/core';

import { EnvironmentStore } from '@modules/core/stores/environment.store';
import { AuthenticationStore } from '@modules/stores/authentication/authentication.store';

@Component({
  selector: 'theme-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  applySignOutTimeout: boolean;

  constructor(
    private environmentStore: EnvironmentStore,
    private authenticationStore: AuthenticationStore
  ) {

    // This can be done on the contructor as all sign in/out, refreshes the entire app.
    this.applySignOutTimeout = this.authenticationStore.isSignIn();

  }


  onTimeout(): void {

    /* istanbul ignore next */
    window.location.assign(`${this.environmentStore.APP_URL}/signout`); // Full reload is needed to hit SSR.

  }

}
