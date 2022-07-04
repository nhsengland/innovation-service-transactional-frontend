import { AccessorOrganisationRoleEnum, InnovatorOrganisationRoleEnum, UserRoleEnum, UserTypeEnum } from './authentication.enums';

export class AuthenticationModel {

  isSignIn: boolean;
  isValidUser?: boolean;
  hasInnovationTransfers?: boolean;

  isTermsOfUseAccepted?: boolean;

  user?: {
    id: string;
    email: string;
    displayName: string;
    phone: string;
    type: '' | UserTypeEnum;
    roles: UserRoleEnum[];
    organisations: {
      id: string;
      name: string;
      size: null | string;
      role: InnovatorOrganisationRoleEnum | AccessorOrganisationRoleEnum;
      isShadow: boolean;
      organisationUnits?: {
        id: string;
        name: string;
      }[];
    }[];
    passwordResetOn: string;

  };


  constructor() {

    this.isSignIn = false;

  }

}
