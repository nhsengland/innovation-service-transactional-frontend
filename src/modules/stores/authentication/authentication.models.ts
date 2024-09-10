import { DateISOType } from '@modules/core/interfaces/base.interfaces';
import { UserRoleType } from '@modules/shared/dtos/roles.dto';

import { AccessorOrganisationRoleEnum, InnovatorOrganisationRoleEnum, UserRoleEnum } from './authentication.enums';
import { PhoneUserPreferenceEnum } from './authentication.service';

export class AuthenticationModel {
  isSignIn: boolean = false;

  userContext?: {
    id: string;
    roleId: string;
    type: UserRoleEnum;
    organisation?: { id: string; name: string; acronym: null | string };
    organisationUnit?: { id: string; name: string; acronym: string };
  };

  user?: {
    id: string;
    email: string;
    displayName: string;
    roles: UserRoleType[];
    contactByPhone: boolean;
    contactByEmail: boolean;
    contactByPhoneTimeframe: PhoneUserPreferenceEnum | null;
    phone: string | null;
    contactDetails: string | null;
    termsOfUseAccepted: boolean;
    hasInnovationTransfers: boolean;
    hasInnovationCollaborations: boolean;
    hasLoginAnnouncements: { [k: string]: boolean };
    passwordResetAt: null | DateISOType;
    firstTimeSignInAt: null | DateISOType;
    organisations: {
      id: string;
      name: string;
      acronym: string;
      role: InnovatorOrganisationRoleEnum | AccessorOrganisationRoleEnum;
      isShadow: boolean;
      size: null | string;
      registrationNumber: null | string;
      description: null | string;
      organisationUnits: { id: string; name: string; acronym: string }[];
    }[];
  };
}
