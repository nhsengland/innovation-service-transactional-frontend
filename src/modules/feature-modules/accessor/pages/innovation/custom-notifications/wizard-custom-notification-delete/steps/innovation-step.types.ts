import { GetNotifyMeInnovationsWithSubscriptions } from '@modules/feature-modules/accessor/services/accessor.service';

export type InnovationStepInputType = {
  innovations: GetNotifyMeInnovationsWithSubscriptions[];
  selectedInnovation: GetNotifyMeInnovationsWithSubscriptions | 'ALL';
};

export type InnovationStepOutputType = {
  selectedInnovation: GetNotifyMeInnovationsWithSubscriptions | 'ALL';
};
