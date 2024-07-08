import { GetNotifyMeInnovationSubscription } from '@modules/feature-modules/accessor/services/accessor.service';

export type NotifyMeInnovationWithSubscriptions = {
  innovationId: string;
  name: string;
  count: number;
  subscriptions?: (GetNotifyMeInnovationSubscription & {
    displayTitle?: string;
    displayOrganisations?: string[];
    displayReminder?: string;
  })[];
};

export type SummaryStepInputType = {
  selectedNotificationsPerInnovation: NotifyMeInnovationWithSubscriptions[];
};
