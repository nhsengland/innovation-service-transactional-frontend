export enum NotificationContextTypeEnum {
  INNOVATION = 'INNOVATION',
  COMMENT = 'COMMENT',
  ACTION = 'ACTION',
  SUPPORT = 'SUPPORT'
}
export enum NotificationContextDetailEnum {
  LOCK_USER = 'LOCK_USER',
  COMMENT_CREATION = 'COMMENT_CREATION',
  COMMENT_REPLY = 'COMMENT_REPLY',
  ACTION_CREATION = 'ACTION_CREATION',
  ACTION_UPDATE = 'ACTION_UPDATE',
  NEEDS_ASSESSMENT_COMPLETED = 'NEEDS_ASSESSMENT_COMPLETED',
  NEEDS_ASSESSMENT_ORGANISATION_SUGGESTION = 'NEEDS_ASSESSMENT_ORGANISATION_SUGGESTION',
  INNOVATION_SUBMISSION = 'INNOVATION_SUBMISSION',
  SUPPORT_STATUS_UPDATE = 'SUPPORT_STATUS_UPDATE'
}

// export const NOTIFICATION_ITEMS: { [key in NotificationContextDetailEnum]: { type: NotificationContextTypeEnum } } = Object.freeze({
//   LOCK_USER: { type: NotificationContextTypeEnum.INNOVATION },
//   COMMENT_CREATION: { type: NotificationContextTypeEnum.COMMENT },
//   COMMENT_REPLY: { type: NotificationContextTypeEnum.COMMENT },
//   ACTION_CREATION: { type: NotificationContextTypeEnum.ACTION },
//   ACTION_UPDATE: { type: NotificationContextTypeEnum.ACTION },
//   NEEDS_ASSESSMENT_COMPLETED: { type: NotificationContextTypeEnum.INNOVATION },
//   NEEDS_ASSESSMENT_ORGANISATION_SUGGESTION: { type: NotificationContextTypeEnum.INNOVATION },
//   INNOVATION_SUBMISSION: { type: NotificationContextTypeEnum.INNOVATION },
//   SUPPORT_STATUS_UPDATE: { type: NotificationContextTypeEnum.SUPPORT }
// });
