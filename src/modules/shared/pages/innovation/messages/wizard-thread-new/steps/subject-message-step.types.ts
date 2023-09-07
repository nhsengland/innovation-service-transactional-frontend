export type SubjectMessageStepInputType = {
  innovation: { id: string },
  teams: {
    name: string,
    users: { name: string }[]
  }[],
  subject: string,
  message: string
};

export type SubjectMessageStepOutputType = {
  subject: string,
  message: string
};
