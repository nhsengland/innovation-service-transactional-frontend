import { EnvironmentInnovationType } from './environment.types';


// Store state model.
export class ContextModel {

  notifications = {
    UNREAD: 0
  };

  // If has value, user is navigating within the context of a innovation.
  innovation: null | EnvironmentInnovationType = null;

  constructor() { }

}
