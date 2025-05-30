import { NotificationCategoryTypeEnum } from '@app/base/enums';
import { DateISOType } from '@app/base/types';
import { PhoneUserPreferenceEnum } from '../user/user.types';
import { InnovationStatusEnum, InnovationSupportStatusEnum } from './innovation.enums';

export type ContextInnovationType = {
  id: string;
  uniqueId: string;
  name: string;
  status: InnovationStatusEnum;
  statusUpdatedAt: null | DateISOType;
  submittedAt?: null | DateISOType;
  hasBeenAssessed: boolean;
  countryName: string | null;
  description: string | null;
  postCode: string | null;
  categories: string[];
  otherCategoryDescription: string | null;
  owner?: {
    id: string;
    name: string;
    email?: string;
    contactByEmail?: boolean;
    contactByPhone?: boolean;
    contactByPhoneTimeframe?: PhoneUserPreferenceEnum | null;
    mobilePhone?: null | string;
    contactDetails?: null | string;
    isActive: boolean;
    organisation?: { name: string; size: null | string; registrationNumber: null | string };
    lastLoginAt?: DateISOType;
  };
  loggedUser: { isOwner: boolean };
  assessment?: {
    id: string;
    currentMajorAssessmentId: null | string;
    majorVersion: number;
    minorVersion: number;
    createdAt: DateISOType;
    finishedAt: null | DateISOType;
  };
  assignedTo?: { id: string; userRoleId: string; name: string };
  support?: { id: string; status: InnovationSupportStatusEnum };
  notifications?: Partial<Record<NotificationCategoryTypeEnum, number>>;
  collaboratorId?: string;
  createdAt?: DateISOType;
  expiryAt: number;
};

export const EMPTY_CONTEXT: ContextInnovationType = {
  id: '',
  uniqueId: '',
  name: '',
  status: InnovationStatusEnum.CREATED,
  statusUpdatedAt: null,
  hasBeenAssessed: false,
  loggedUser: { isOwner: false },
  categories: [],
  otherCategoryDescription: '',
  countryName: '',
  description: '',
  postCode: '',
  expiryAt: 0
};
