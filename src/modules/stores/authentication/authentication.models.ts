export class AuthenticationModel {

  isSignIn: boolean;
  isValidUser?: boolean;
  hasInnovationTransfers?: boolean;

  user?: {
    id: string;
    email: string;
    displayName: string;
    type: '' | 'ASSESSMENT' | 'ACCESSOR' | 'INNOVATOR';
    organisations: {
      id: string;
      name: string;
      size: string;
      role: 'OWNER' | 'QUALIFYING_ACCESSOR' | 'ACCESSOR';
      isShadow: boolean;
      organisationUnits?: {
        id: string;
        name: string;
      }[];
    }[];
    innovations: { id: string, name: string }[];
    passwordResetOn: string
  };


  constructor() {

    this.isSignIn = false;

  }

}
