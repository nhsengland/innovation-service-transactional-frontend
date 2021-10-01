export class AuthenticationModel {

  isSignIn: boolean;
  isValidUser?: boolean;
  hasInnovationTransfers?: boolean;

  user?: {
    id: string;
    email: string;
    displayName: string;
    type: '' | 'ASSESSMENT' | 'ACCESSOR' | 'INNOVATOR';
    phone: string;
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
  };


  constructor() {

    this.isSignIn = false;

  }

}
