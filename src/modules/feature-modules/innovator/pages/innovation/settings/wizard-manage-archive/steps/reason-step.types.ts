import { InnovationArchiveReasonEnum } from '@modules/feature-modules/innovator/services/innovator.service';

export type ReasonStepInputType = {
  reason: InnovationArchiveReasonEnum | null;
};

export type ReasonStepOutputType = {
  reason: InnovationArchiveReasonEnum | null;
};
