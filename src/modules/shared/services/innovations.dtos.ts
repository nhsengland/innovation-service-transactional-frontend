import { AccessorOrganisationRoleEnum, InnovatorOrganisationRoleEnum } from '@app/base/enums';
import { DateISOType } from '@app/base/types';

import { InnovationActionStatusEnum, InnovationSectionEnum, InnovationStatusEnum, InnovationSupportStatusEnum } from '@modules/stores/innovation/innovation.enums';


export type InnovationsListDTO = {
  count: number,
  data: {
    id: string,
    name: string,
    description: null | string,
    status: InnovationStatusEnum,
    submittedAt: null | DateISOType,
    countryName: null | string,
    postCode: null | string,
    mainCategory: null | string,
    otherMainCategoryDescription: null | string,
    isAssessmentOverdue?: boolean,
    assessment?: null | { id: string, createdAt: DateISOType, finishedAt: null | DateISOType, assignedTo: { name: string }, reassessmentCount: number },
    supports?: {
      id: string,
      status: InnovationSupportStatusEnum,
      updatedAt: DateISOType,
      organisation: {
        id: string, name: string, acronym: null | string,
        unit: {
          id: string, name: string, acronym: string,
          // Users only exists while a support is ENGAGING.
          users?: { name: string, role: AccessorOrganisationRoleEnum | InnovatorOrganisationRoleEnum }[]
        }
      }
    }[],
    notifications?: number,
    statistics?: {
      messages: number,
      actions: number
    }
  }[]
};


export type InnovationInfoDTO = {
  id: string;
  name: string;
  status: InnovationStatusEnum;
  description: string;
  countryName: string;
  postcode: string;
  submittedAt?: string;
  assessment?: {
    id: string;
  };
  actions: {
    requestedCount: number;
    inReviewCount: number;
  },
  notifications: { [key: string]: number }
};


export type InnovationSupportsListDTO = {
  id: string,
  status: InnovationSupportStatusEnum,
  organisation: {
    id: string, name: string, acronym: string,
    unit: { id: string, name: string, acronym: string }
  },
  engagingAccessors: { id: string, organisationUnitUserId: string, name: string }[]
}[];


export type InnovationSupportInfoDTO = {
  id: string,
  status: InnovationSupportStatusEnum,
  engagingAccessors: { id: string, organisationUnitUserId: string, name: string }[]
}


export type InnovationActionsListInDTO = {
  count: number,
  data: {
    id: string,
    displayId: string,
    description: string,
    innovation: { id: string, name: string },
    status: InnovationActionStatusEnum,
    section: InnovationSectionEnum,
    createdAt: DateISOType,
    updatedAt: DateISOType,
    notifications: number
  }[]
};
export type InnovationActionsListDTO = { count: number, data: (InnovationActionsListInDTO['data'][0] & { name: string })[] };

export type InnovationActionInfoDTO = {
  id: string,
  displayId: string,
  status: InnovationActionStatusEnum,
  section: InnovationSectionEnum,
  name: string,
  description: string,
  createdAt: DateISOType,
  createdBy: string
};
