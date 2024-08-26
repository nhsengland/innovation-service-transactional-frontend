// import { InnovationSections } from '@modules/stores/innovation/innovation-record/202304/catalog.types';

export type InnovationRecordUpdateStepInputType = {
  innovationRecordSections: string[];
  selectedInnovationRecordSections: (string | 'ALL')[];
};

export type InnovationRecordUpdateStepOutputType = {
  innovationRecordSections: (string | 'ALL')[];
};
