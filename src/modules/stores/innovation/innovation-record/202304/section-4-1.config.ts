import { StringsHelper } from '@app/base/helpers';
import {
  FormEngineModel,
  FormEngineParameterModel,
  WizardEngineModel,
  WizardStepType,
  WizardSummaryType
} from '@modules/shared/forms';

import { InnovationSectionConfigType } from '../ir-versions.types';

import { InnovationSections } from './catalog.types';
import { DocumentType202304 } from './document.types';
import {
  intendedUserGroupsEngagedItems,
  involvedUsersDesignProcessItems,
  testedWithIntendedUsersItems
} from './forms.config';

// Labels.
const stepsLabels = {
  q1: {
    label: 'Have you involved users in the design process?',
    description:
      'This includes involving patients or the public, carers, clinicians or administrators in the design process, including people with different accessibility needs.'
  },
  q2: {
    label: 'Have you tested your innovation with its intended users in a real life setting?',
    description: 'Do not include any testing you have done with users in a controlled setting.'
  },
  q3: { label: 'Which groups of intended users have you engaged with?', conditional: true },
  q4: {
    label: 'What kind of testing with users have you done?',
    description:
      'This can include any testing you have done with people who would use your innovation, for example patients, nurses or administrative staff.',
    conditional: true
  }
  // q5: { label: 'Upload any documents that showcase your user testing', description: 'Files must be CSV, XLSX, DOCX or PDF, and can be up to 20MB each.',
  //       conditional: true
  //     },
};

const stepsChildParentRelations = {
  intendedUserGroupsEngaged: 'testedWithIntendedUsers',
  userTests: 'intendedUserGroupsEngaged',
  userTestFeedback: 'userTests'
};

// Types.
type InboundPayloadType = DocumentType202304['TESTING_WITH_USERS'];
type StepPayloadType = InboundPayloadType & { [key in `userTestFeedback_${string}`]?: string };
type OutboundPayloadType = DocumentType202304['TESTING_WITH_USERS'];

// Logic.
export const SECTION_4_1: InnovationSectionConfigType<InnovationSections> = {
  id: 'TESTING_WITH_USERS',
  title: 'Testing with users',
  wizard: new WizardEngineModel({
    stepsChildParentRelations: stepsChildParentRelations,
    steps: [
      new FormEngineModel({
        parameters: [
          {
            id: 'involvedUsersDesignProcess',
            dataType: 'radio-group',
            label: stepsLabels.q1.label,
            description: stepsLabels.q1.description,
            validations: { isRequired: [true, 'Choose one option'] },
            items: involvedUsersDesignProcessItems
          }
        ]
      }),
      new FormEngineModel({
        parameters: [
          {
            id: 'testedWithIntendedUsers',
            dataType: 'radio-group',
            label: stepsLabels.q2.label,
            description: stepsLabels.q2.description,
            validations: { isRequired: [true, 'Choose one option'] },
            items: testedWithIntendedUsersItems
          }
        ]
      })
    ],
    showSummary: true,
    runtimeRules: [
      (steps: WizardStepType[], currentValues: StepPayloadType, currentStep: number | 'summary') =>
        runtimeRules(steps, currentValues, currentStep)
    ],
    inboundParsing: (data: InboundPayloadType) => inboundParsing(data),
    outboundParsing: (data: StepPayloadType) => outboundParsing(data),
    summaryParsing: (data: StepPayloadType) => summaryParsing(data)
  }),
  allStepsList: stepsLabels
};

function runtimeRules(steps: WizardStepType[], currentValues: StepPayloadType, currentStep: number | 'summary'): void {
  steps.splice(2);

  if (['NOT_YET'].includes(currentValues.testedWithIntendedUsers || 'NOT_YET')) {
    delete currentValues.intendedUserGroupsEngaged;
    delete currentValues.otherIntendedUserGroupsEngaged;
    delete currentValues.userTests;
    Object.keys(currentValues)
      .filter(key => key.startsWith('userTestFeedback_'))
      .forEach(key => {
        delete currentValues[key as any];
      });
    return;
  }

  steps.push(
    new FormEngineModel({
      parameters: [
        {
          id: 'intendedUserGroupsEngaged',
          dataType: 'checkbox-array',
          label: stepsLabels.q3.label,
          validations: { isRequired: [true, 'Choose at least one group'] },
          items: [
            ...intendedUserGroupsEngagedItems,
            {
              value: 'OTHER',
              label: 'Other',
              conditional: new FormEngineParameterModel({
                id: 'otherIntendedUserGroupsEngaged',
                dataType: 'text',
                label: 'Other group',
                validations: { isRequired: [true, 'Other group description is required'], maxLength: 100 }
              })
            }
          ]
        }
      ]
    })
  );

  if (Number(currentStep) > 3) {
    // Delete any userTests item without 'kind' value. Can happen when user goes back!
    currentValues.userTests = currentValues.userTests?.filter(item => item.kind);

    // Updates userTests.feedback value.
    Object.keys(currentValues)
      .filter(key => key.startsWith('userTestFeedback_'))
      .forEach(key => {
        const index = (currentValues.userTests ?? []).findIndex(
          item => StringsHelper.slugify(item.kind) === key.split('_')[1]
        );
        if (index > -1) {
          (currentValues.userTests ?? [])[index].feedback = currentValues[key as any];
        }
        delete currentValues[key as any];
      });
  }

  steps.push(
    new FormEngineModel({
      parameters: [
        {
          id: 'userTests',
          dataType: 'fields-group',
          label: stepsLabels.q4.label,
          description: stepsLabels.q4.description,
          fieldsGroupConfig: {
            fields: [
              { id: 'kind', dataType: 'text', label: 'User test', validations: { isRequired: true, maxLength: 100 } },
              { id: 'feedback', dataType: 'text', isVisible: false }
            ],
            addNewLabel: 'Add new user test'
          }
        }
      ]
    })
  );

  currentValues.userTests?.forEach((item, i) => {
    steps.push(
      new FormEngineModel({
        parameters: [
          {
            id: `userTestFeedback_${StringsHelper.slugify(item.kind)}`,
            dataType: 'textarea',
            label: `Describe the testing and feedback for ${item.kind}`,
            description:
              'Provide a brief summary of the method and key findings. You can upload any documents that showcase your user testing next.',
            validations: { isRequired: [true, 'A description is required'] },
            lengthLimit: 's'
          }
        ]
      })
    );
    currentValues[`userTestFeedback_${StringsHelper.slugify(item.kind)}`] = item.feedback;
  });
}

function inboundParsing(data: InboundPayloadType): StepPayloadType {
  const parsedData = {
    involvedUsersDesignProcess: data.involvedUsersDesignProcess,
    testedWithIntendedUsers: data.testedWithIntendedUsers,
    intendedUserGroupsEngaged: data.intendedUserGroupsEngaged,
    otherIntendedUserGroupsEngaged: data.otherIntendedUserGroupsEngaged,
    userTests: data.userTests
  } as StepPayloadType;

  (data.userTests ?? []).forEach((item, i) => {
    parsedData[`userTestFeedback_${StringsHelper.slugify(item.kind)}`] = item.feedback;
  });

  return parsedData;
}

function outboundParsing(data: StepPayloadType): OutboundPayloadType {
  return {
    ...(data.involvedUsersDesignProcess && { involvedUsersDesignProcess: data.involvedUsersDesignProcess }),
    ...(data.testedWithIntendedUsers && { testedWithIntendedUsers: data.testedWithIntendedUsers }),
    ...((data.intendedUserGroupsEngaged ?? []).length > 0 && {
      intendedUserGroupsEngaged: data.intendedUserGroupsEngaged
    }),
    ...(data.otherIntendedUserGroupsEngaged && { otherIntendedUserGroupsEngaged: data.otherIntendedUserGroupsEngaged }),
    ...((data.userTests ?? []).length > 0 && {
      userTests: data.userTests?.map(item => ({
        kind: item.kind,
        ...(item.feedback && { feedback: item.feedback })
      }))
    })
  };
}

function summaryParsing(data: StepPayloadType): WizardSummaryType[] {
  const toReturn: WizardSummaryType[] = [];

  let editStepNumber = 1;

  toReturn.push(
    {
      label: stepsLabels.q1.label,
      value: involvedUsersDesignProcessItems.find(item => item.value === data.involvedUsersDesignProcess)?.label,
      editStepNumber: editStepNumber++
    },
    {
      label: stepsLabels.q2.label,
      value: testedWithIntendedUsersItems.find(item => item.value === data.testedWithIntendedUsers)?.label,
      editStepNumber: editStepNumber++
    }
  );

  if (!['NOT_YET'].includes(data.testedWithIntendedUsers || 'NOT_YET')) {
    toReturn.push({
      label: stepsLabels.q3.label,
      value: data.intendedUserGroupsEngaged
        ?.map(v =>
          v === 'OTHER'
            ? data.otherIntendedUserGroupsEngaged
            : intendedUserGroupsEngagedItems.find(item => item.value === v)?.label
        )
        .join('\n'),
      editStepNumber: editStepNumber++
    });

    toReturn.push({
      label: stepsLabels.q4.label,
      value: data.userTests?.map(item => item.kind).join('\n'),
      editStepNumber: editStepNumber++,
      isNotMandatory: true
    });

    data.userTests?.forEach(item => {
      toReturn.push({
        label: `Describe the testing and feedback for ${item.kind}`,
        value: item.feedback,
        editStepNumber: editStepNumber++
      });
    });
  }

  return toReturn;
}
