import {
  GetNotifyMeInnovationSubscription,
  GetNotifyMeInnovationsWithSubscriptions
} from '@modules/feature-modules/accessor/services/accessor.service';

export type NotificationsStepInputType = {
  selectedInnovation: GetNotifyMeInnovationsWithSubscriptions;
  selectedNotifications: (GetNotifyMeInnovationSubscription | 'ALL')[];
};

export type NotificationsStepOutputType = {
  selectedNotifications: (GetNotifyMeInnovationSubscription | 'ALL')[];
};
