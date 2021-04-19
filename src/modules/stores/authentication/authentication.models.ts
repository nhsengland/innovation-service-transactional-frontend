export class AuthenticationModel {

  isSignIn: boolean;

  user?: {
    id: string;
    displayName: string;
    type: '' | 'ACCESSOR' | 'QUALIFYING_ACCESSOR' | 'INNOVATOR',
    organisations: { id: string, name: string, role: 'OWNER' }[]
    innovations: { id: string, name: string }[];
  };

  didFirstTimeSignIn?: boolean;


  constructor() {

    this.isSignIn = false;

  }

}
