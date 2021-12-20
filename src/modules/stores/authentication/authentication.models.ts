export class AuthenticationModel {

  isSignIn: boolean;
  isValidUser?: boolean;
  hasInnovationTransfers?: boolean;

  user?: {
    id: string;
    email: string;
    displayName: string;
    phone: string;
    type: '' | 'ADMIN' | 'ASSESSMENT' | 'ACCESSOR' | 'INNOVATOR';
    roles: ('ADMIN' | 'SERVICE_TEAM')[];
    organisations: {
      id: string;
      name: string;
      size: null | string;
      role: 'INNOVATOR_OWNER' | 'QUALIFYING_ACCESSOR' | 'ACCESSOR';
      isShadow: boolean;
      organisationUnits?: {
        id: string;
        name: string;
      }[];
    }[];
    innovations: { id: string, name: string }[];
    passwordResetOn: string;

  };


  constructor() {

    this.isSignIn = false;

  }

}
