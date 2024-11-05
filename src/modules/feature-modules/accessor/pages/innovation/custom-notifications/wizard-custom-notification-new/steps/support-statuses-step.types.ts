import { InnovationSupportStatusEnum } from '@modules/stores';

export type SupportStatusesStepInputType = {
  selectedSupportStatuses: InnovationSupportStatusEnum[];
};

export type SupportStatusesStepOutputType = {
  supportStatuses: InnovationSupportStatusEnum[];
};
