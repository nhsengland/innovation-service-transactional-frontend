import { DateISOType } from '@app/base/types';
import { UserRoleType } from '@modules/shared/dtos/roles.dto';
import { BaseContextType } from '../ctx.types';

export type UserContextType = {
  user: UserInfo;
  domainContext: null | DomainUserContext;
} & BaseContextType;

export type DomainUserContext = {
  id: string;
  roleId: string;
  type: UserRoleEnum;
  organisation?: { id: string; name: string; acronym: null | string };
  organisationUnit?: { id: string; name: string; acronym: string };
};

export type UserInfo = {
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
  hasLoginAnnouncements: Record<string, boolean>;
  passwordResetAt: null | DateISOType;
  passwordChangeSinceLastSignIn?: boolean;
  firstTimeSignInAt: null | DateISOType;
  organisations: {
    id: string;
    name: string;
    acronym: string;
    isShadow: boolean;
    size: null | string;
    registrationNumber: null | string;
    description: null | string;
    organisationUnits: { id: string; name: string; acronym: string }[];
  }[];
};

export const EMPTY_USER_INFO: UserInfo = {
  id: '',
  email: '',
  displayName: '',
  roles: [],
  contactByEmail: false,
  contactByPhone: false,
  contactByPhoneTimeframe: null,
  phone: null,
  contactDetails: null,
  termsOfUseAccepted: false,
  hasInnovationTransfers: false,
  hasInnovationCollaborations: false,
  hasLoginAnnouncements: {},
  passwordResetAt: null,
  firstTimeSignInAt: null,
  organisations: []
};

/**
 * ENUM
 */
export enum UserRoleEnum {
  ADMIN = 'ADMIN',
  INNOVATOR = 'INNOVATOR',
  ACCESSOR = 'ACCESSOR',
  ASSESSMENT = 'ASSESSMENT',
  QUALIFYING_ACCESSOR = 'QUALIFYING_ACCESSOR'
}

export enum ContactUserPreferenceEnum {
  PHONE = 'PHONE',
  EMAIL = 'EMAIL'
}

export enum PhoneUserPreferenceEnum {
  MORNING = 'MORNING',
  AFTERNOON = 'AFTERNOON',
  DAILY = 'DAILY'
}

export enum TermsOfUseTypeEnum {
  INNOVATOR = 'INNOVATOR',
  SUPPORT_ORGANISATION = 'SUPPORT_ORGANISATION'
}
