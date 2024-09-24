import { ThreadAvailableRecipientsDTO } from '@modules/shared/services/innovations.service';

export type OrganisationsStepInputType = {
  innovation: { id: string };
  organisationUnits: ThreadAvailableRecipientsDTO;
  selectedOrganisationUnits: string[];
  activeInnovators: boolean;
};

export type OrganisationsStepOutputType = {
  organisationUnits: {
    id: string;
    name: string;
    users: { id: string; roleId: string; name: string }[];
  }[];
};
