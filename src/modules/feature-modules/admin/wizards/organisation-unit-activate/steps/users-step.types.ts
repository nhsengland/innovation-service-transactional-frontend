export type UsersStepInputType = {

  organisation: { id: string };
  organisationUnit: { id: string, name: string };
  agreeUsers: boolean;
  users: { id: string, name: string, organisationRole: string }[];

};

export type UsersStepOutputType = {

  agreeUsers: boolean;
  users: { id: string, name: string, organisationRole: string }[];

};
