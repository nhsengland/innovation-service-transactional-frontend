import { UserRoleEnum } from '@app/base/enums';
import { DatesHelper } from '@app/base/helpers';

import { CustomValidators, FormEngineModel, WizardEngineModel } from '@modules/shared/forms';
import {
  AnnouncementTypeEnum,
  GetAnnouncementInfoType,
  InnovationRecordFilterPayloadType,
  UpsertAnnouncementType
} from '@modules/feature-modules/admin/services/announcements.service';

enum ShowToWhomEnum {
  ALL_INNOVATIONS = 'ALL_INNOVATIONS',
  SPECIFIC_INNOVATIONS = 'SPECIFIC_INNOVATIONS'
}

// Types.
type InboundPayloadType = GetAnnouncementInfoType;
type StepPayloadType = {
  title: string;
  content: string;
  linkLabel: string;
  linkUrl: string;
  userRoles: UserRoleEnum[];
  showToWhom?: ShowToWhomEnum | undefined;
  filters?: InnovationRecordFilterPayloadType;
  startsAt: { day: string; month: string; year: string };
  expiresAt?: { day: string; month: string; year: string };
  type: AnnouncementTypeEnum;
};

export type OutboundPayloadType = UpsertAnnouncementType;

// Form validations

const endDateMustBeAfterStartDateErrorMessage = 'The end date must be after the start date';

const expiresAtGreaterThanStartsAtValidation = CustomValidators.endDateInputGreaterThanStartDateInputValidator(
  'startsAt',
  'expiresAt',
  endDateMustBeAfterStartDateErrorMessage
);

const linkMustHaveLabelAndUrlValidation = CustomValidators.makeTwoControlsAsRequiredWhenAtLeastOneIsFilledValidator(
  { name: 'linkLabel', message: 'Enter a link label' },
  { name: 'linkUrl', message: 'Enter a link URL' }
);
export const ANNOUNCEMENT_NEW_QUESTIONS: WizardEngineModel = new WizardEngineModel({
  steps: [
    new FormEngineModel({
      label: `What's the title of the announcement?`,
      description: `Write a title that explains what the announcement is about. For example, 'A new funding opportunity is available.'.`,
      parameters: [
        {
          id: 'title',
          dataType: 'text',
          label: `Enter a title with a maximum of 100 characters`,
          pageUniqueField: false,
          validations: { isRequired: [true, 'Enter a title'], maxLength: 100 }
        }
      ]
    }),
    new FormEngineModel({
      label: `Write body content`,
      description: `Add more detailed information to guide the user. For example, applications are open for the Digital Health Entrepreneurs programme until 15 September 2024.`,
      parameters: [
        {
          id: 'content',
          dataType: 'textarea',
          label: `Enter body content`,
          lengthLimit: 'm',
          pageUniqueField: false,
          validations: { isRequired: [true, 'Enter body content'] }
        }
      ]
    }),
    new FormEngineModel({
      label: `Add a link (optional)`,
      description: `Add a link if you want to guide users to start a task or to point them to relevant content on another page. The label should describe where the link is taking users. For example, apply for the Digital Health Entrepreneurs programme here.`,
      parameters: [
        {
          id: 'linkLabel',
          dataType: 'text',
          label: 'Enter the link label',
          pageUniqueField: false
        },
        {
          id: 'linkUrl',
          dataType: 'text',
          label: 'Enter the link URL',
          pageUniqueField: false,
          validations: { urlFormat: true }
        }
      ]
    }),
    new FormEngineModel({
      parameters: [
        {
          id: 'userRoles',
          dataType: 'checkbox-array',
          label: `Which user groups do you want this announcement to be sent to?`,
          description: `Select all that apply.`,
          validations: { isRequired: [true, 'Select 1 or more user groups'] },
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
  showSummary: true,
  formValidations: [expiresAtGreaterThanStartsAtValidation, linkMustHaveLabelAndUrlValidation],
  runtimeRules: [
    (steps: FormEngineModel[], data: StepPayloadType, currentStep: number | 'summary') =>
      announcementNewRuntimeRules(steps, data, currentStep)
  ],
  inboundParsing: (data: InboundPayloadType) => inboundParsing(data),
  outboundParsing: (data: StepPayloadType) => outboundParsing(data),
  stepsChildParentRelations: {
    showToWhom: 'userRoles',
    filters: 'showToWhom'
  }
});

export const ANNOUNCEMENT_EDIT_QUESTIONS: WizardEngineModel = new WizardEngineModel({
  showSummary: true,
  steps: [
    new FormEngineModel({
      parameters: [
        {
          id: 'expiresAt',
          dataType: 'date-input',
          label: 'Set an end date',
          description: `If you do not set an end date, the announcement will be displayed until the user clears it.`,
          validations: {
            dateInputFormat: {}
          }
        }
      ]
    })
  ],
  runtimeRules: [
    (steps: FormEngineModel[], data: StepPayloadType, currentStep: number | 'summary') =>
      announcementEditRuntimeRules(steps, data, currentStep)
  ],
  inboundParsing: (data: InboundPayloadType) => inboundParsing(data),
  outboundParsing: (data: StepPayloadType) => outboundParsing(data)
});

function announcementNewRuntimeRules(
  steps: FormEngineModel[],
  data: StepPayloadType,
  currentStep: number | 'summary'
): void {
  steps.splice(4);

  if (data.userRoles.includes(UserRoleEnum.INNOVATOR)) {
    steps.push(
      new FormEngineModel({
        parameters: [
          {
            id: 'showToWhom',
            dataType: 'radio-group',
            label: `Should this announcement be shown to all innovators or a specific type of innovations?`,
            description: `You can select specific types of innovations based on their answers to the innovation record questions. For example, digital innovations that have DTAC certification.`,
            validations: { isRequired: [true, 'Select all innovators or specific types of innovations'] },
            items: [
              { value: ShowToWhomEnum.ALL_INNOVATIONS, label: 'All innovators' },
              { value: ShowToWhomEnum.SPECIFIC_INNOVATIONS, label: 'Specific types of innovations' }
            ]
          }
        ]
      })
    );
  } else {
    data.showToWhom = undefined;
  }

  if (data.showToWhom === ShowToWhomEnum.SPECIFIC_INNOVATIONS) {
    steps.push(
      new FormEngineModel({
        parameters: [
          {
            id: 'filters',
            dataType: 'ir-selectable-filters',
            label: 'Filter innovation type',
            description:
              'Filter which types of innovations you want this announcement to show for. You can filter by question and answer.'
          }
        ]
      })
    );
  } else {
    data.filters = undefined;
  }

  steps.push(
    new FormEngineModel({
      label: `When do you want this announcement to be live?`,
      description: `If you do not set an end date, the announcement will be displayed until the user clears it. `,
      parameters: [
        {
          id: 'startsAt',
          dataType: 'date-input',
          label: 'Set a start date',
          pageUniqueField: false,
          validations: {
            requiredDateInput: { message: 'Add a start date' },
            dateInputFormat: {},
            futureDateInput: { includeToday: true, message: 'The start date must be in the future' }
          }
        },
        {
          id: 'expiresAt',
          dataType: 'date-input',
          label: 'Set an end date',
          pageUniqueField: false,
          validations: {
            dateInputFormat: {}
          }
        }
      ]
    }),
    new FormEngineModel({
      parameters: [
        {
          id: 'type',
          dataType: 'radio-group',
          label: `Which type of announcement?`,
          validations: { isRequired: [true, 'Select login announcement or homepage announcement'] },
          items: [
            {
              value: AnnouncementTypeEnum.LOG_IN,
              label: 'Login announcement',
              description: `This is a full page takeover, which disrupts the user's log in journey. Use it sparingly for big announcements. For example, when a new support organisation joins the service.`
            },
            {
              value: AnnouncementTypeEnum.HOMEPAGE,
              label: 'Homepage announcement',
              description: `This will display on the user's homepage, and on the innovation overview if it relates to a specific innovation. It will be displayed until a user clears it. Use this for funding programmes or feedback survey announcements.`
            }
          ]
        }
      ]
    })
  );
}

function announcementEditRuntimeRules(
  steps: FormEngineModel[],
  data: StepPayloadType,
  currentStep: number | 'summary'
): void {
  // Add validator to check if the end date is after the start date.
  steps[0].parameters[0].validations = {
    ...steps[0].parameters[0].validations,
    endDateInputGreaterThanStartDate: {
      startDate: { day: data.startsAt.day, month: data.startsAt.month, year: data.startsAt.year },
      message: endDateMustBeAfterStartDateErrorMessage
    }
  };
}

function inboundParsing(data: InboundPayloadType): StepPayloadType {
  return {
    title: data.title ?? '',
    content: data.params?.content ?? '',
    linkLabel: data.params?.link?.label ?? '',
    linkUrl: data.params?.link?.url ?? '',
    userRoles: data.userRoles ?? [],
    showToWhom: (data.userRoles ?? []).includes(UserRoleEnum.INNOVATOR)
      ? data.filters?.length
        ? ShowToWhomEnum.SPECIFIC_INNOVATIONS
        : ShowToWhomEnum.ALL_INNOVATIONS
      : undefined,
    filters: data?.filters,
    startsAt: data.startsAt
      ? DatesHelper.getDateInputFormatFromString(data.startsAt)
      : { day: '', month: '', year: '' },
    expiresAt: data.expiresAt ? DatesHelper.getDateInputFormatFromString(data.expiresAt) : undefined,
    type: data.type ?? ''
  };
}

function outboundParsing(data: StepPayloadType): OutboundPayloadType {
  return {
    title: data.title,
    params: {
      content: data.content,
      ...(data.linkLabel && data.linkUrl ? { link: { label: data.linkLabel, url: data.linkUrl } } : {})
    },
    userRoles: data.userRoles,
    filters: data.filters,
    startsAt: DatesHelper.getDateString(data.startsAt.year, data.startsAt.month, data.startsAt.day),
    expiresAt:
      data.expiresAt?.day && data.expiresAt?.month && data.expiresAt?.year
        ? DatesHelper.getDateString(data.expiresAt.year, data.expiresAt.month, data.expiresAt.day)
        : undefined,
    type: data.type
  };
}
