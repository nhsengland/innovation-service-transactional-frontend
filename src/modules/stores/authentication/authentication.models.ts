import { DateISOType } from '@modules/core/interfaces/base.interfaces';

import { AccessorOrganisationRoleEnum, InnovatorOrganisationRoleEnum, UserRoleEnum, UserTypeEnum } from './authentication.enums';

export class AuthenticationModel {

  isSignIn: boolean;
  userContext: {
    type: '' | AccessorOrganisationRoleEnum | InnovatorOrganisationRoleEnum | UserTypeEnum,
    organisation?: {
      id: string,
      name: string,
      organisationUnit: { id: string; name: string; acronym: string; }
    }
  };
  user?: {
    id: string,
    email: string,
    displayName: string,
    type: '' | UserTypeEnum,
    roles: UserRoleEnum[],
    phone: string | null,
    termsOfUseAccepted: boolean,
    hasInnovationTransfers: boolean,
    passwordResetAt: null | DateISOType,
    firstTimeSignInAt: null | DateISOType,
    organisations: {
      id: string,
      name: string,
      role: InnovatorOrganisationRoleEnum | AccessorOrganisationRoleEnum,
      isShadow: boolean,
      size: null | string,
      organisationUnits: { id: string; name: string; acronym: string; }[]
    }[]
  };


  constructor() {

    this.isSignIn = false;
    this.userContext = {
      type: ''
    }
  }

}
