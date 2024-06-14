export enum NotificationEnum {
  SUPPORT_UPDATED = 'SUPPORT_UPDATED',
  PROGRESS_UPDATE_CREATED = 'PROGRESS_UPDATE_CREATED',
  RECORD_UPDATED = 'RECORD_UPDATED',
  DOCUMENT_UPLOADED = 'DOCUMENT_UPLOADED',
  REMINDER = 'REMINDER'
}

export enum CategoryEnum {
  NOTIFIY_ME_WHEN = 'NOTIFIY_ME_WHEN',
  REMIND_ME = 'REMIND_ME'
}

export type Notification = {
  type: NotificationEnum;
  category: CategoryEnum;
  label: string;
};

export const NOTIFICATION_ITEMS: Notification[] = [
  {
    type: NotificationEnum.SUPPORT_UPDATED,
    category: CategoryEnum.NOTIFIY_ME_WHEN,
    label: 'an organisation updates their support status'
  },
  {
    type: NotificationEnum.PROGRESS_UPDATE_CREATED,
    category: CategoryEnum.NOTIFIY_ME_WHEN,
    label: 'an organisation adds a progress update to the support summary'
  },
  {
    type: NotificationEnum.RECORD_UPDATED,
    category: CategoryEnum.NOTIFIY_ME_WHEN,
    label: 'the innovator updates their innovation record'
  },
  {
    type: NotificationEnum.DOCUMENT_UPLOADED,
    category: CategoryEnum.NOTIFIY_ME_WHEN,
    label: 'a new document is uploaded'
  },
  {
    type: NotificationEnum.REMINDER,
    category: CategoryEnum.REMIND_ME,
    label: 'about this innovation on a date in future'
  }
];

export type NotificationStepInputType = {
  selectedNotification: string;
};

export type NotificationStepOutputType = {
  notification: string;
};
