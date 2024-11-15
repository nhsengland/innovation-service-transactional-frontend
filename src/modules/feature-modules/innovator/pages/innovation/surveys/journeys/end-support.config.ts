import { FormEngineModel, WizardEngineModel } from '@modules/shared/forms';

// Types.
type InboundPayloadType = { unitName: string };

type StepPayloadType = {
  unitName: string;
  supportSatisfaction?: string;
  ideaOnHowToProceed?: 'YES' | 'NO';
  howLikelyWouldYouRecommendIS?: string;
  comment?: string;
};

type OutboundPayloadType = {
  supportSatisfaction: string;
  ideaOnHowToProceed: 'YES' | 'NO';
  howLikelyWouldYouRecommendIS: string;
  comment?: string;
};

export const ACCOUNT_DETAILS_INNOVATOR: WizardEngineModel = new WizardEngineModel({
  steps: [],
  runtimeRules: [(steps: FormEngineModel[], data: StepPayloadType) => runtimeRules(steps, data)],
  inboundParsing: (data: InboundPayloadType) => inboundParsing(data),
  outboundParsing: (data: StepPayloadType) => outboundParsing(data)
});

function runtimeRules(steps: FormEngineModel[], data: StepPayloadType): void {
  steps.splice(0);

  steps.push(
    new FormEngineModel({
      parameters: [
        {
          id: 'supportSatisfaction',
          dataType: 'radio-group',
          label: `How satisfied are you with the support of ${data.unitName}?`,
          description: 'Select a number rating from 1 to 10, with 1 being the lowest and 10 being the highest.',
          validations: { isRequired: [true, 'Choose one option'] },
          items: [
            { value: '1', label: '1 Not satisfied' },
            { value: '2', label: '2' },
            { value: '3', label: '3' },
            { value: '4', label: '4' },
            { value: '5', label: '5' },
            { value: '6', label: '6' },
            { value: '7', label: '7' },
            { value: '8', label: '8' },
            { value: '9', label: '9' },
            { value: '10', label: '10 Extremely satisfied' }
          ]
        }
      ]
    }),
    new FormEngineModel({
      parameters: [
        {
          id: 'ideaOnHowToProceed',
          dataType: 'radio-group',
          label: 'Do you have a clear idea on how to proceed with your innovation?',
          validations: { isRequired: [true, 'Choose one option'] },
          items: [
            { value: 'YES', label: 'Yes' },
            { value: 'NO', label: 'No' }
          ]
        }
      ]
    }),
    new FormEngineModel({
      parameters: [
        {
          id: 'howLikelyWouldYouRecommendIS',
          dataType: 'radio-group',
          label: 'How likely are you to recommend the innovation service?',
          description: 'Select a number rating from 1 to 10, with 1 being the lowest and 10 being the highest.',
          validations: { isRequired: [true, 'Choose one option'] },
          items: [
            { value: '1', label: '1 Not likely' },
            { value: '2', label: '2' },
            { value: '3', label: '3' },
            { value: '4', label: '4' },
            { value: '5', label: '5' },
            { value: '6', label: '6' },
            { value: '7', label: '7' },
            { value: '8', label: '8' },
            { value: '9', label: '9' },
            { value: '10', label: '10 Extremely likely' }
          ]
        }
      ]
    }),
    new FormEngineModel({
      parameters: [
        {
          id: 'comment',
          dataType: 'textarea',
          label: 'Any other comments',
          description: 'Optional',
          lengthLimit: 'xxl'
        }
      ]
    })
  );
}

function inboundParsing(data: InboundPayloadType): StepPayloadType {
  return { unitName: data.unitName };
}

function outboundParsing(data: StepPayloadType): OutboundPayloadType {
  return {
    comment: data.comment,
    supportSatisfaction: data.supportSatisfaction ?? '',
    ideaOnHowToProceed: data.ideaOnHowToProceed ?? 'NO',
    howLikelyWouldYouRecommendIS: data.howLikelyWouldYouRecommendIS ?? ''
  };
}
