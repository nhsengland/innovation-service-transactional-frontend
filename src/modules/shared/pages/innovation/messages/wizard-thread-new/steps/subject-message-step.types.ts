export type SubjectMessageStepInputType = {
  innovation: { id: string },
  teams: {
    name: string,
    users: { name: string }[]
  }[],
  subject: string,
  message: string,
  file: null | File,
  fileName: string
};

export type SubjectMessageStepOutputType = {
  subject: string,
  message: string,
  file: null | File,
  fileName: string
};
