import { InnovationSupportsListDTO } from '@modules/shared/services/innovations.dtos';


export type OrganisationsStepInputType = {
  innovation: { id: string },
  organisationUnits: InnovationSupportsListDTO,
  selectedOrganisationUnits: string[],
  activeInnovators: boolean
};

export type OrganisationsStepOutputType = {
  organisationUnits: {
    id: string,
    name: string,
    users: { id: string, userRoleId: string, name: string }[]
  }[]
};
