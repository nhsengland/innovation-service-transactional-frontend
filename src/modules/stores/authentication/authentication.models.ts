import { DateISOType } from '@modules/core/interfaces/base.interfaces';
import { RoleType } from '@modules/shared/dtos/roles.dto';

import { AccessorOrganisationRoleEnum, InnovatorOrganisationRoleEnum, UserRoleEnum } from './authentication.enums';
import { PhoneUserPreferenceEnum } from './authentication.service';

export type UserContext = {
  roleId: string,
  type: UserRoleEnum,
  organisation?: {
    id: string,
    acronym: string | null,
    name: string,
    organisationUnit?: { id: string; name: string; acronym: string; }
  }
};


export class AuthenticationModel {

  isSignIn: boolean = false;

  userContext?: UserContext;

  user?: {
    id: string,
    email: string,
    displayName: string,
    roles: RoleType[],
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
      acronym: string | null,
      role: InnovatorOrganisationRoleEnum | AccessorOrganisationRoleEnum,
      isShadow: boolean,
      size: null | string,
      organisationUnits: { id: string; name: string; acronym: string; }[]
    }[]
  };


}
