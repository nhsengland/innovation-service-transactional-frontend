import { UserRoleEnum } from "@app/base/enums";

// This needs to be improved it's still lacking on the backend definition also. Defining it to avoid multiple changes in the future.
export type RoleDTO = {
  id: string;
  role: UserRoleEnum
}