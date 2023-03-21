import { UserRoleEnum } from "@app/base/enums";
import { DateISOType } from "@app/base/types";
import { UserRoleType } from "./roles.dto";

export type UserSearchDTO = {  
  id: string;
  email: string;
  name: string;
  roles: UserRoleType[];
  isActive: boolean;
  lockedAt?: DateISOType;
  organisations?: {
    id: string;
    name: string;
    acronym: string;
    role: UserRoleEnum.ACCESSOR | UserRoleEnum.QUALIFYING_ACCESSOR;
    units?: { 
      id: string,
      name: string,
      acronym: string,
      organisationUnitUserId: string
    }[]
  }[]
};


export type UsersListDTO = {
  count: number;
  data: {
    id: string,
    isActive: boolean,
    name: string,  
    role: UserRoleEnum
    roleDescription: string,
    lockedAt: null | string,  
    organisationUnitUserId: string,
    email: string,
  }[];
}

export type GetUsersRequestDTO = {
  count: number,
  data: {
    id: string,
    isActive: boolean,
    name: string,
    lockedAt: DateISOType,
    roles: {
      id: string,
      organisationId: string,
      organisationUnitId: string,
      role: UserRoleEnum
    }[],
    email?: string,
    organisationUnitUserId?: string
  }[]
};