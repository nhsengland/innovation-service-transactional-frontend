import { InnovationArchiveReasonEnum } from '@modules/feature-modules/innovator/services/innovator.service';

export type ArchiveType = {
  reason: InnovationArchiveReasonEnum | null;
  email: string;
  confirmation: string;
};
