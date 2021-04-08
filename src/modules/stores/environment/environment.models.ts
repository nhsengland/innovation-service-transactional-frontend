import { environment } from '@app/config/environment.config';
// import { CONSTANTS } from '@app/config/constants.config';

export class EnvironmentModel {

  ENV: typeof environment;

  // CONSTANTS: typeof CONSTANTS;

  authentication: {
    isSignIn: boolean,
    user?: {
      id: string,
      displayName: string,
      innovations: { id: string, name: string }[]
    },
    didFirstTimeSignIn?: boolean
  };

  constructor() {

    this.ENV = environment;

    // this.CONSTANTS = CONSTANTS;

    this.authentication = {
      isSignIn: false
    };

  }

}
