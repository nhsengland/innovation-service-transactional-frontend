import { UserRoleEnum } from '@app/base/enums';
import { DatesHelper } from '@app/base/helpers';

import { FormEngineModel, WizardEngineModel } from '@modules/shared/forms';
import {
  AnnouncementTypeEnum,
  GetAnnouncementInfoType,
  UpsertAnnouncementType
} from '@modules/feature-modules/admin/services/announcements.service';

// Labels.
const stepsLabels = {
  l1: {
    label: `What's the title of the announcement?`,
    description: `Enter a title with a maximum of 100 characters that explains what the announcement is about. For example, "A new support organisation has been added to the Innovation Service".`
  },
  l2: {
    label: 'Add an inset text (optional)',
    description:
      'Use inset text for content that needs to stand out from the rest of the page. For example, "Health Innovation South West has been added to the Innovation Service".'
  },
  l3: {
    label: 'Add body content (optional)',
    description:
      'Add more detailed information to guide the user. For example, if you think this organisation will be able to support you, you can share your innovation with them in your data sharing preferences.'
  },
  l4: {
    label: 'Add a secondary link (optional)',
    description:
      'Add a link if you want to guide users to start a task or to point them to relevant content in another page. The label should describe where the link are taking the users. For example, go to your innovations page and change your data sharing preferences.'
  },
  l5: { label: 'When do you want this announcement to be live?' },
  l6: {
    label: 'Which user groups do you want this announcement to be sent to?',
    description: 'Select all that apply.'
  }
};

// Types.
type InboundPayloadType = GetAnnouncementInfoType;
type StepPayloadType = {
  title: string;
  userRoles: UserRoleEnum[];
  startsAt?: string;
  expiresAt?: string;
  insetTitle?: string;
  insetContent?: string;
  insetLinkLabel?: string;
  insetLinkUrl?: string;
  content?: string;
  actionLinkLabel?: string;
  actionLinkUrl?: string;
};
export type OutboundPayloadType = UpsertAnnouncementType;

export const ANNOUNCEMENT_NEW_QUESTIONS: WizardEngineModel = new WizardEngineModel({
  showSummary: true,
  steps: [
    new FormEngineModel({
      parameters: [
        {
          id: 'title',
          dataType: 'text',
          label: stepsLabels.l1.label,
          description: stepsLabels.l1.description,
          validations: { isRequired: [true, 'Title is required'], maxLength: 100 }
        }
      ]
    }),
    new FormEngineModel({
      label: stepsLabels.l2.label,
      description: stepsLabels.l2.description,
      parameters: [
        {
          id: 'insetTitle',
          dataType: 'text',
          label: 'Title (optional)',
          description: 'Enter the title of the inset text'
        },
        { id: 'insetContent', dataType: 'text', label: 'Content (optional)', description: 'Enter message' },
        { id: 'insetLinkLabel', dataType: 'text', label: 'Add a link (optional)', description: 'Enter the link label' },
        {
          id: 'insetLinkUrl',
          dataType: 'text',
          label: 'Enter the link URL. (Make sure that it starts with http:// or https://)'
        }
      ]
    }),
    new FormEngineModel({
      parameters: [
        {
          id: 'content',
          dataType: 'textarea',
          label: stepsLabels.l3.label,
          description: stepsLabels.l3.description,
          lengthLimit: 'xs'
        }
      ]
    }),
    new FormEngineModel({
      label: stepsLabels.l4.label,
      description: stepsLabels.l4.description,
      parameters: [
        { id: 'actionLinkLabel', dataType: 'text', label: 'Enter the link label' },
        {
          id: 'actionLinkUrl',
          dataType: 'text',
          label: 'Enter the link URL (Make sure that it starts with http:// or https://)'
        }
      ]
    }),
    new FormEngineModel({
      label: stepsLabels.l5.label,
      parameters: [
        {
          id: 'startsAt',
          dataType: 'date',
          label: 'Set a start date',
          description: 'For example, 21/12/2014.',
          validations: { isRequired: [true, 'Start date is required'] }
        },
        {
          id: 'expiresAt',
          dataType: 'date',
          label: 'Set an end date',
          description:
            'If you do not set an end date, the announcement will remain on the service until the user clicks continue. For example, 21/12/2014.'
        }
      ]
    }),
    new FormEngineModel({
      parameters: [
        {
          id: 'userRoles',
          dataType: 'checkbox-array',
          label: stepsLabels.l6.label,
          description: stepsLabels.l6.description,
          validations: { isRequired: [true, 'Choose at least one user group'] },
          items: [
            { value: UserRoleEnum.INNOVATOR, label: 'Innovators' },
            { value: UserRoleEnum.ASSESSMENT, label: 'Needs assessors' },
            { value: UserRoleEnum.QUALIFYING_ACCESSOR, label: 'Qualifying accessors' },
            { value: UserRoleEnum.ACCESSOR, label: 'Accessors' }
          ]
        }
      ]
    })
  ],
  inboundParsing: (data: InboundPayloadType) => inboundParsing(data),
  outboundParsing: (data: StepPayloadType) => outboundParsing(data)
});

export const ANNOUNCEMENT_EDIT_QUESTIONS: WizardEngineModel = new WizardEngineModel({
  showSummary: true,
  steps: [
    new FormEngineModel({
      parameters: [
        {
          id: 'expiresAt',
          dataType: 'date',
          label: 'Set an end date',
          description:
            'If you do not set an end date, the announcement will remain on the service until the user clicks continue.<br />Enter date. For example, 21/12/2014.'
        }
      ]
    })
  ],
  inboundParsing: (data: InboundPayloadType) => inboundParsing(data),
  outboundParsing: (data: StepPayloadType) => outboundParsing(data)
});

function inboundParsing(data: InboundPayloadType): StepPayloadType {
  return {
    title: data.title,
    userRoles: data.userRoles,
    startsAt: new Date(data.startsAt).toLocaleString('en-GB').slice(0, 10),
    expiresAt: data.expiresAt ? new Date(data.expiresAt).toLocaleString('en-GB').slice(0, 10) : undefined,
    insetTitle: data.params?.inset?.title,
    insetContent: data.params?.inset?.content,
    insetLinkLabel: data.params?.inset?.link?.label,
    insetLinkUrl: data.params?.inset?.link?.url,
    content: data.params?.content,
    actionLinkLabel: data.params?.actionLink?.label,
    actionLinkUrl: data.params?.actionLink?.url
  };
}

function outboundParsing(data: StepPayloadType): OutboundPayloadType {
  return {
    title: data.title,
    userRoles: data.userRoles,
    startsAt:
      DatesHelper.parseIntoValidFormat(data.startsAt ?? null, 'yyyy-MM-dd') ?? new Date().toISOString().slice(0, 10),
    expiresAt: DatesHelper.parseIntoValidFormat(data.expiresAt ?? null, 'yyyy-MM-dd') ?? undefined,
    params: {
      ...(data.insetTitle || data.insetContent || data.insetLinkLabel
        ? {
            inset: {
              ...(data.insetTitle ? { title: data.insetTitle } : {}),
              ...(data.insetContent ? { content: data.insetContent } : {}),
              ...(data.insetLinkLabel && data.insetLinkUrl
                ? { link: { label: data.insetLinkLabel, url: data.insetLinkUrl } }
                : {})
            }
          }
        : {}),
      ...(data.content ? { content: data.content } : {}),
      ...(data.actionLinkLabel && data.actionLinkUrl
        ? { actionLink: { label: data.actionLinkLabel, url: data.actionLinkUrl } }
        : {})
    },
    type: AnnouncementTypeEnum.LOG_IN // TO DO: Change this in the future. Setting LOG_IN as a default value at the moment
  };
}
