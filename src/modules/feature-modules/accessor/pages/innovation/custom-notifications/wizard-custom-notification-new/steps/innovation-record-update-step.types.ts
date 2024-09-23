export type InnovationRecordUpdateStepInputType = {
  innovationRecordSections: string[];
  selectedInnovationRecordSections: (string | 'ALL')[];
};

export type InnovationRecordUpdateStepOutputType = {
  innovationRecordSections: (string | 'ALL')[];
};
