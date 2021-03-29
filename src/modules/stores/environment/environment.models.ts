import { environment } from '@app/config/environment.config';
// import { CONSTANTS } from '@app/config/constants.config';

export class EnvironmentModel {

  // CONSTANTS: typeof CONSTANTS;

  ENV: typeof environment;

  authentication: {
    user: { id: string, displayName: string }
  } | null;

  constructor() {

    // this.CONSTANTS = CONSTANTS;
    this.ENV = environment;

    this.authentication = null;

  }

}
