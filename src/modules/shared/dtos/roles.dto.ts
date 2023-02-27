import { UserRoleEnum } from "@app/base/enums";

// This needs to be improved it's still lacking on the backend definition also. Defining it to avoid multiple changes in the future.
export type RoleType = {
  id: string,
  role: UserRoleEnum,
  organisation?: {
    id: string,
    name: string,
    acronym: string | null
  },
  organisationUnit?: {
    id: string,
    name: string,
    acronym: string
  }
}