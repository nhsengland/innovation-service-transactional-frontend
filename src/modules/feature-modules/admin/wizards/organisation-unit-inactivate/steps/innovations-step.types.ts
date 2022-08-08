export type InnovationsStepInputType = {

  organisation: { id: string };
  organisationUnit: { id: string, name: string };
  agreeInnovations: boolean;

};

export type InnovationsStepOutputType = {

  agreeInnovations: boolean;
  innovationsCount: number;

};
