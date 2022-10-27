import { InnovationSupportStatusEnum } from "@modules/stores/innovation/innovation.enums"

export type getInnovationSupportsDTO = {
  id: string,
  status: InnovationSupportStatusEnum,
  organisation: {
    id: string, name: string, acronym: string,
    unit: { id: string, name: string, acronym: string }
  },
  engagingAccessors?: { id: string, organisationUnitUserId: string, name: string }[]
}[];

export type getAccessorsSupportsListDTO = {
  id: string,
  status: InnovationSupportStatusEnum,
  engagingAccessors?: { id: string, organisationUnitUserId: string, name: string }[]
}


