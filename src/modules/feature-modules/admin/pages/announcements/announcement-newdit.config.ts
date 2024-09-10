import { UserRoleEnum } from '@app/base/enums';
import { DatesHelper } from '@app/base/helpers';

import { CustomValidators, FormEngineModel, WizardEngineModel } from '@modules/shared/forms';
import {
  AnnouncementTypeEnum,
  GetAnnouncementInfoType,
  InnovationRecordFilterPayloadType,
  UpsertAnnouncementType
} from '@modules/feature-modules/admin/services/announcements.service';
import { INPUT_LENGTH_LIMIT, TEXTAREA_LENGTH_LIMIT } from '@modules/shared/forms/engine/config/form-engine.config';

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
  sendEmail: string;
};

export type OutboundPayloadType = UpsertAnnouncementType;

// Steps labels.

export const stepsLabels = {
  s1: {
    label: `What's the title of the announcement?`,
    description: `Write a title that explains what the announcement is about. For example, 'A new funding opportunity is available.'.`,
    p1: {
      label: `Enter a title with a maximum of 100 characters`
    }
  },
  s2: {
    label: `Write body content`,
    description: `Add more detailed information to guide the user. For example, applications are open for the Digital Health Entrepreneurs programme until 15 September 2024.`,
    p1: {
      label: `Enter body content`
    }
  },
  s3: {
    label: `Add a link (optional)`,
    description: `Add a link if you want to guide users to start a task or to point them to relevant content on another page. The label should describe where the link is taking users. For example, apply for the Digital Health Entrepreneurs programme here.`,
    p1: {
      label: `Enter the link label with a maximum of 200 characters`
    },
    p2: {
      label: `Enter the link URL`
    }
  },
  s4: {
    p1: {
      label: `Which user groups do you want this announcement to be sent to?`,
      description: `Select all that apply.`
    }
  },
  s5: {
    p1: {
      label: `Should this announcement be shown to all innovators or a specific type of innovations?`,
      description: `You can select specific types of innovations based on their answers to the innovation record questions. For example, digital innovations that have DTAC certification.`
    }
  },
  s6: {
    p1: {
      label: 'Filter innovation type',
      description:
        'Filter which types of innovations you want this announcement to show for. You can filter by question and answer.'
    }
  },
  s7: {
    label: 'When do you want this announcement to be live?',
    description: `If you do not set an end date, the announcement will be displayed until the user clears it.`,
    p1: {
      label: `Set a start date`
    },
    p2: {
      label: `Set an end date`
    }
  },
  s8: {
    p1: {
      label: 'Which type of announcement?'
    }
  },
  s9: {
    p1: {
      label: `Would you like to send this announcement via email too?`,
      description: `In addition, to the announcement on the service.`
    }
  }
};

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
      label: stepsLabels.s1.label,
      description: stepsLabels.s1.description,
      showParamLabelAsTitle: false,
      parameters: [
        {
          id: 'title',
          dataType: 'text',
          label: stepsLabels.s1.p1.label,
          validations: { isRequired: [true, 'Enter a title'], maxLength: 100 }
        }
      ]
    }),
    new FormEngineModel({
      label: stepsLabels.s2.label,
      description: stepsLabels.s2.description,
      showParamLabelAsTitle: false,
      parameters: [
        {
          id: 'content',
          dataType: 'textarea',
          label: stepsLabels.s2.p1.label,
          lengthLimit: 'm',
          validations: { isRequired: [true, 'Enter body content'] }
        }
      ]
    }),
    new FormEngineModel({
      label: stepsLabels.s3.label,
      description: stepsLabels.s3.description,
      parameters: [
        {
          id: 'linkLabel',
          dataType: 'text',
          label: stepsLabels.s3.p1.label,
          validations: { maxLength: INPUT_LENGTH_LIMIT.xs }
        },
        {
          id: 'linkUrl',
          dataType: 'text',
          label: stepsLabels.s3.p2.label,
          validations: { urlFormat: { maxLength: INPUT_LENGTH_LIMIT.l } }
        }
      ]
    }),
    new FormEngineModel({
      parameters: [
        {
          id: 'userRoles',
          dataType: 'checkbox-array',
          label: stepsLabels.s4.p1.label,
          description: stepsLabels.s4.p1.description,
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
            label: stepsLabels.s5.p1.label,
            description: stepsLabels.s5.p1.description,
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
            label: stepsLabels.s6.p1.label,
            description: stepsLabels.s6.p1.description
          }
        ]
      })
    );
  } else {
    data.filters = undefined;
  }

  steps.push(
    new FormEngineModel({
      label: stepsLabels.s7.label,
      description: stepsLabels.s7.description,
      parameters: [
        {
          id: 'startsAt',
          dataType: 'date-input',
          label: stepsLabels.s7.p1.label,
          validations: {
            requiredDateInput: { message: 'Add a start date' },
            dateInputFormat: {},
            futureDateInput: { includeToday: true, message: 'The start date must be in the future or today' }
          }
        },
        {
          id: 'expiresAt',
          dataType: 'date-input',
          label: stepsLabels.s7.p2.label,
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
          label: stepsLabels.s8.p1.label,
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
    }),

    new FormEngineModel({
      parameters: [
        {
          id: 'sendEmail',
          dataType: 'radio-group',
          label: stepsLabels.s9.p1.label,
          description: stepsLabels.s9.p1.description,
          validations: { isRequired: [true, 'Select yes or no'] },
          items: [
            { value: 'YES', label: 'Yes' },
            { value: 'NO', label: 'No' }
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
    type: data.type ?? '',
    sendEmail: data.sendEmail ? 'YES' : data.sendEmail === false ? 'NO' : ''
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
    type: data.type,
    sendEmail: data.sendEmail === 'YES' ? true : false
  };
}
