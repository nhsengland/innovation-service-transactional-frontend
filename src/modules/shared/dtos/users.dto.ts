import { UserRoleEnum } from "@app/base/enums";
import { DateISOType } from "@app/base/types";
import { RoleType } from "./roles.dto";

export type UserSearchDTO = {
  id: string;
  email: string;
  name: string;
  roles: RoleType[];
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