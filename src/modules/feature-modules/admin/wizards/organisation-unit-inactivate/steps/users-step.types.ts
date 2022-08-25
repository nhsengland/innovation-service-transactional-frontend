export type UsersStepInputType = {

  organisation: { id: string };
  organisationUnit: { id: string, name: string };
  agreeUsers: boolean;

};

export type UsersStepOutputType = {

  agreeUsers: boolean;
  userCount: number;

};
