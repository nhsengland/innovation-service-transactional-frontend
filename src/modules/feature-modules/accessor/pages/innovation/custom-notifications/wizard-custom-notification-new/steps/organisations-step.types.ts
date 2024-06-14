export type Organisation = {
  id: string;
  name: string;
  description?: string;
  units: { id: string; name: string }[];
};

export type OrganisationsStepInputType = {
  organisations: Organisation[];
  selectedOrganisations: Organisation[];
};

export type OrganisationsStepOutputType = {
  selectedOrganisations: Organisation[];
};
