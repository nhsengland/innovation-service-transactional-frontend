import { DateISOType } from '@modules/core/interfaces/base.interfaces';

import { AccessorOrganisationRoleEnum, InnovatorOrganisationRoleEnum, UserRoleEnum } from './authentication.enums';
import { PhoneUserPreferenceEnum } from './authentication.service';

export class AuthenticationModel {

  isSignIn: boolean;
  userContext: {
    type: '' | UserRoleEnum,
    organisation?: {
      id: string,
      name: string,
      role: InnovatorOrganisationRoleEnum | AccessorOrganisationRoleEnum,
      organisationUnit: { id: string; name: string; acronym: string; }
    }
  };
  user?: {
    id: string,
    email: string,
    displayName: string,
    type: '' | UserRoleEnum,
    roles: UserRoleEnum[],
    contactByPhone: boolean,
    contactByEmail: boolean,
    contactByPhoneTimeframe: PhoneUserPreferenceEnum | null,
    phone: string | null,
    contactDetails: string | null,
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
