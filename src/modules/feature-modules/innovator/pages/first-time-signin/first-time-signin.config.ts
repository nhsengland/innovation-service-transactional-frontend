import { FormEngineModel, FormEngineParameterModel, WizardEngineModel, WizardSummaryType } from '@modules/shared/forms';

const organisationDescriptions = [
  'Sole trader',
  'Unincorporated association',
  'Partnership',
  'Limited partnership',
  'Trust',
  'Limited company',
  'Limited liability partnership',
  'Community interest company',
  'Charitable incorporated organisation',
  'Co-operative society',
  'Community benefit society'
] as const;

enum HowDidYouFindUsEnums {
  EVENT = 'EVENT',
  READING = 'READING',
  RECOMMENDATION_COLLEAGUE = 'RECOMMENDATION_COLLEAGUE',
  RECOMMENDATION_ORG = 'RECOMMENDATION_ORG',
  SEARCH_ENGINE = 'SEARCH_ENGINE',
  SOCIAL_MEDIA = 'SOCIAL_MEDIA',
  OTHER = 'OTHER'
}

const howDidYouFindUsItems: {
  [key in keyof typeof HowDidYouFindUsEnums]: { label: string; conditionalPlaceholder?: string };
} = {
  EVENT: {
    label: 'At an event',
    conditionalPlaceholder: 'Add event name'
  },
  READING: {
    label: 'Reading about the service, for example in an article, blog post or policy announcement',
    conditionalPlaceholder: 'Add publication name or article link'
  },
  RECOMMENDATION_COLLEAGUE: {
    label: 'Recommendation from a colleague or friend'
  },
  RECOMMENDATION_ORG: {
    label: 'Recommendation from an organisation, for example NICE or NHS Supply Chain',
    conditionalPlaceholder: 'Add organisation name'
  },
  SEARCH_ENGINE: {
    label: 'Search engine, for example Google or Bing'
  },
  SOCIAL_MEDIA: {
    label: 'Social media'
  },
  OTHER: {
    label: 'Other',
    conditionalPlaceholder: 'Explain'
  }
};

export type HowDidYouFindUsAnswersType = {
  event?: boolean;
  eventComment?: string;
  reading?: boolean;
  readingComment?: string;
  recommendationColleague?: boolean;
  recommendationOrg?: boolean;
  recommendationOrgComment?: string;
  searchEngine?: boolean;
  socialMedia?: boolean;
  other?: boolean;
  otherComment?: string;
};

type StepPayloadType = {
  innovatorName: string;
  isCompanyOrOrganisation: 'YES' | 'NO';
  organisationName: string;
  organisationDescription: null | (typeof organisationDescriptions)[number];
  organisationSize: null | string;
  hasRegistrationNumber: 'YES' | 'NO';
  organisationRegistrationNumber: null | string;
  mobilePhone: null | string;
  howDidYouFindUsList: string[];
  howDidYouFindUsEvent?: string;
  howDidYouFindUsReading?: string;
  howDidYouFindUsRecommendation?: string;
  howDidYouFindUsOther?: string;
};
type OutboundPayloadType = {
  innovatorName: string;
  mobilePhone: null | string;
  organisation?: {
    name: string;
    description: (typeof organisationDescriptions)[number];
    size: string;
    registrationNumber?: string;
  };
  howDidYouFindUsAnswers: HowDidYouFindUsAnswersType;
};

export const FIRST_TIME_SIGNIN_QUESTIONS: WizardEngineModel = new WizardEngineModel({
  showSummary: true,
  steps: [
    new FormEngineModel({
      parameters: [
        {
          id: 'innovatorName',
          dataType: 'text',
          label: 'What is your name?',
          validations: { isRequired: [true, 'Name is required'], maxLength: 100 }
        }
      ]
    }),

    new FormEngineModel({
      parameters: [
        {
          id: 'isCompanyOrOrganisation',
          dataType: 'radio-group',
          label: 'Are you signing up to the service as part of a company or organisation?',
          validations: { isRequired: [true, 'Choose one option'] },
          items: [
            {
              value: 'YES',
              label: 'Yes',
              conditional: new FormEngineParameterModel({
                id: 'organisationName',
                dataType: 'text',
                label: 'Enter the company or organisation name',
                validations: { isRequired: [true, 'Organisation/Company name is required'], maxLength: 100 }
              })
            },
            { value: 'NO', label: 'No' }
          ]
        }
      ]
    })
  ],
  runtimeRules: [
    (steps: FormEngineModel[], data: StepPayloadType, currentStep: number | 'summary') =>
      runtimeRules(steps, data, currentStep)
  ],
  inboundParsing: () => inboundParsing(),
  outboundParsing: (data: StepPayloadType) => outboundParsing(data),
  summaryParsing: (data: StepPayloadType, steps?: FormEngineModel[]) => summaryParsing(data, steps || [])
});

function runtimeRules(steps: FormEngineModel[], data: StepPayloadType, currentStep: number | 'summary'): void {
  steps.splice(2);

  if (data.isCompanyOrOrganisation === 'NO') {
    data.organisationName = '';
    data.organisationSize = null;
  } else {
    steps.push(
      new FormEngineModel({
        parameters: [
          {
            id: 'organisationDescription',
            dataType: 'radio-group',
            label: 'How would you describe your company or organisation?',
            validations: { isRequired: [true, 'Organisation description is required'] },
            items: organisationDescriptions.map(description => ({ value: description, label: description }))
          }
        ]
      })
    );

    steps.push(
      new FormEngineModel({
        parameters: [
          {
            id: 'organisationSize',
            dataType: 'radio-group',
            label: 'What is the size of your company or organisation?',
            validations: { isRequired: [true, 'Organisation size is required'] },
            items: [
              { value: '1 to 5 employees', label: '1 to 5 employees' },
              { value: '6 to 25 employees', label: '6 to 25 employees' },
              { value: '26 to 100 employees', label: '26 to 100 employees' },
              { value: 'More than 100 employees', label: 'More than 100 employees' }
            ]
          }
        ]
      })
    );

    steps.push(
      new FormEngineModel({
        parameters: [
          {
            id: 'hasRegistrationNumber',
            dataType: 'radio-group',
            label: 'Do you have a UK company registration number?',
            validations: { isRequired: [true, 'Choose one option'] },
            items: [
              {
                value: 'YES',
                label: 'Yes',
                conditional: new FormEngineParameterModel({
                  id: 'organisationRegistrationNumber',
                  dataType: 'text',
                  label: 'Enter the company registration number',
                  validations: { isRequired: [true, 'Registration number is required'], equalToLength: 8 }
                })
              },
              { value: 'NO', label: 'No' }
            ]
          }
        ]
      })
    );
  }

  steps.push(
    new FormEngineModel({
      parameters: [
        {
          id: 'mobilePhone',
          dataType: 'number',
          label: 'What is your phone number? (optional)',
          description: "If you'd like to be contacted by phone about your innovation, enter your phone number.",
          validations: { maxLength: 20 }
        }
      ]
    })
  );

  steps.push(
    new FormEngineModel({
      parameters: [
        {
          id: 'howDidYouFindUsList',
          dataType: 'checkbox-array',
          label: 'How did you find out about the NHS Innovation Service?',
          description: 'Select all that apply.',
          validations: { isRequired: [true, 'Choose at least one option'] },
          items: [
            {
              value: HowDidYouFindUsEnums.EVENT,
              label: howDidYouFindUsItems.EVENT.label,
              conditional: new FormEngineParameterModel({
                id: 'howDidYouFindUsEvent',
                dataType: 'text',
                placeholder: howDidYouFindUsItems.EVENT.conditionalPlaceholder,
                cssOverride: 'nhsuk-u-margin-bottom-4',
                validations: { isRequired: [true, `${howDidYouFindUsItems.EVENT.conditionalPlaceholder}`] }
              })
            },
            {
              value: HowDidYouFindUsEnums.READING,
              label: howDidYouFindUsItems.READING.label,
              conditional: new FormEngineParameterModel({
                id: 'howDidYouFindUsReading',
                dataType: 'text',
                placeholder: howDidYouFindUsItems.READING.conditionalPlaceholder,
                cssOverride: 'nhsuk-u-margin-bottom-4',
                validations: { isRequired: [true, `${howDidYouFindUsItems.READING.conditionalPlaceholder}`] }
              })
            },
            {
              value: HowDidYouFindUsEnums.RECOMMENDATION_COLLEAGUE,
              label: howDidYouFindUsItems.RECOMMENDATION_COLLEAGUE.label
            },
            {
              value: HowDidYouFindUsEnums.RECOMMENDATION_ORG,
              label: howDidYouFindUsItems.RECOMMENDATION_ORG.label,
              conditional: new FormEngineParameterModel({
                id: 'howDidYouFindUsRecommendation',
                dataType: 'text',
                placeholder: howDidYouFindUsItems.RECOMMENDATION_ORG.conditionalPlaceholder,
                cssOverride: 'nhsuk-u-margin-bottom-4',
                validations: { isRequired: [true, `${howDidYouFindUsItems.RECOMMENDATION_ORG.conditionalPlaceholder}`] }
              })
            },
            {
              value: HowDidYouFindUsEnums.SEARCH_ENGINE,
              label: howDidYouFindUsItems.SEARCH_ENGINE.label
            },
            {
              value: HowDidYouFindUsEnums.SOCIAL_MEDIA,
              label: howDidYouFindUsItems.SOCIAL_MEDIA.label
            },
            {
              value: HowDidYouFindUsEnums.OTHER,
              label: howDidYouFindUsItems.OTHER.label,
              conditional: new FormEngineParameterModel({
                id: 'howDidYouFindUsOther',
                dataType: 'text',
                placeholder: howDidYouFindUsItems.OTHER.conditionalPlaceholder,
                validations: { isRequired: [true, 'Explain where you heard about the service'] }
              })
            }
          ]
        }
      ]
    })
  );
}

function inboundParsing(): StepPayloadType {
  return {
    innovatorName: '',
    isCompanyOrOrganisation: 'NO',
    organisationName: '',
    organisationSize: null,
    organisationDescription: null,
    hasRegistrationNumber: 'NO',
    organisationRegistrationNumber: null,
    mobilePhone: null,
    howDidYouFindUsList: []
  };
}

function outboundParsing(data: StepPayloadType): OutboundPayloadType {
  return {
    innovatorName: data.innovatorName,
    mobilePhone: data.mobilePhone,
    ...(data.isCompanyOrOrganisation === 'YES' && {
      organisation: {
        name: data.organisationName ?? '', // default never happens at this point
        size: data.organisationSize ?? '', // default never happens at this point
        description: data.organisationDescription ?? 'Sole trader', // default never happens at this point
        registrationNumber:
          data.hasRegistrationNumber === 'YES' && data.organisationRegistrationNumber
            ? data.organisationRegistrationNumber
            : undefined
      }
    }),
    howDidYouFindUsAnswers: howDidYouFindUsDataOutboundParsing(data)
  };
}

function summaryParsing(data: StepPayloadType, steps: FormEngineModel[]): WizardSummaryType[] {
  const toReturn: WizardSummaryType[] = [];

  toReturn.push(
    { label: 'What is your name?', value: data.innovatorName, editStepNumber: 1 },
    {
      label: 'Are you signing up to the service as part of a company or organisation?',
      value: data.isCompanyOrOrganisation === 'YES' ? `Yes, ${data.organisationName}` : 'No',
      editStepNumber: 2
    }
  );

  let lastMarkStep = 2;

  if (data.isCompanyOrOrganisation === 'YES') {
    toReturn.push(
      {
        label: 'How would you describe your company or organisation?',
        value: data.organisationDescription,
        editStepNumber: 3
      },
      { label: 'What is the size of your company or organisation?', value: data.organisationSize, editStepNumber: 4 },
      {
        label: 'Do you have a UK company registration number?',
        value: data.hasRegistrationNumber === 'YES' ? `Yes, ${data.organisationRegistrationNumber}` : 'No',
        editStepNumber: 5
      }
    );

    lastMarkStep = 5;
  }

  toReturn.push({
    label: 'What is your phone number? (optional)',
    value: data.mobilePhone,
    editStepNumber: lastMarkStep + 1
  });

  lastMarkStep = lastMarkStep + 1;

  toReturn.push({
    label: 'How did you find out about the NHS Innovation Service?',
    value: howDidYouFindUsDataSummaryParsing(data),
    editStepNumber: lastMarkStep + 1,
    allowHTML: true
  });

  return toReturn;
}

function howDidYouFindUsDataOutboundParsing(data: StepPayloadType): HowDidYouFindUsAnswersType {
  const answers = {
    ...(data.howDidYouFindUsList.includes('EVENT')
      ? { event: true, eventComment: data.howDidYouFindUsEvent ?? '' }
      : null),
    ...(data.howDidYouFindUsList.includes('READING')
      ? { reading: true, readingComment: data.howDidYouFindUsReading ?? '' }
      : null),
    ...(data.howDidYouFindUsList.includes('RECOMMENDATION_COLLEAGUE') ? { recommendationColleague: true } : null),
    ...(data.howDidYouFindUsList.includes('RECOMMENDATION_ORG')
      ? { recommendationOrg: true, recommendationOrgComment: data.howDidYouFindUsRecommendation }
      : null),
    ...(data.howDidYouFindUsList.includes('SEARCH_ENGINE') ? { searchEngine: true } : null),
    ...(data.howDidYouFindUsList.includes('SOCIAL_MEDIA') ? { socialMedia: true } : null),
    ...(data.howDidYouFindUsList.includes('OTHER')
      ? { other: true, otherComment: data.howDidYouFindUsOther ?? '' }
      : null)
  };

  return answers;
}

function howDidYouFindUsDataSummaryParsing(data: StepPayloadType): string {
  let summaryData = '';

  summaryData += '<ul class="nhsuk-list">';

  data.howDidYouFindUsList.forEach(item => {
    summaryData += '<li>';
    summaryData += howDidYouFindUsItems[item as HowDidYouFindUsEnums].label;

    if (item === 'EVENT' && data.howDidYouFindUsEvent) summaryData += ` - ${data.howDidYouFindUsEvent}`;
    if (item === 'READING' && data.howDidYouFindUsReading) summaryData += ` - ${data.howDidYouFindUsReading}`;
    if (item === 'RECOMMENDATION_ORG' && data.howDidYouFindUsRecommendation)
      summaryData += ` - ${data.howDidYouFindUsRecommendation}`;
    if (item === 'OTHER' && data.howDidYouFindUsOther) summaryData += ` - ${data.howDidYouFindUsOther}`;

    summaryData += '</li>';
  });
  summaryData += '</ul>';

  return summaryData;
}
