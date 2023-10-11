export type SubjectMessageStepInputType = {
  innovation: { id: string },
  teams: {
    name: string,
    users: { name: string }[]
  }[],
  subject: string,
  message: string,
  document: null | File,
  documentDescriptiveName: string
};

export type SubjectMessageStepOutputType = {
  subject: string,
  message: string,
  document: null | File,
  documentDescriptiveName: string
};
