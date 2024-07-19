import { InnovationSections } from '@modules/stores/innovation/innovation-record/202304/catalog.types';

export type InnovationRecordUpdateStepInputType = {
  innovationRecordSections: InnovationSections[];
  selectedInnovationRecordSections: (InnovationSections | 'ALL')[];
};

export type InnovationRecordUpdateStepOutputType = {
  innovationRecordSections: (InnovationSections | 'ALL')[];
};
