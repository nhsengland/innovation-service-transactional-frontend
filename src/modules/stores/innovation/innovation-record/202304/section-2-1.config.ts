import { URLS } from '@app/base/constants';
import { FormEngineModel, WizardEngineModel, WizardStepType, WizardSummaryType } from '@modules/shared/forms';

import { InnovationSectionConfigType, InnovationSectionStepLabels } from '../ir-versions.types';

import { InnovationSections } from './catalog.types';
import { DocumentType202304 } from './document.types';
import {
  benefitsOrImpactItems,
  carbonReductionPlanItems,
  diseasesConditionsImpactItems,
  estimatedCarbonReductionSavingsItems,
  keyHealthInequalitiesItems,
  yesNoItems,
  yesNotYetNoItems
} from './forms.config';

// Labels.
const stepsLabels: InnovationSectionStepLabels = {
  q1: {
    label: 'What problem is your innovation trying to solve?',
    description: `
      <p>Include the current consequences of the problem.</p>
      <p>For example, the process of checking a patient's pulse to determine if there is atrial fibrillation using a finger and a watch is inherently inaccurate. Using this method approximately 25% of patients are not referred to secondary care who should be (false negative) and 15% of patients who are referred are referred unnecessarily (false positive). For those patients who are not picked up at this stage, their underlying disease will progress before being correctly diagnosed.</p>`
  },
  q2: {
    label: 'Give an overview of how your innovation works',
    description: `
      <p>If this is or might be a medical device, include the <a href=${URLS.MEDICAL_DEVICES_INTENDED_PURPOSE_STATEMENT} target="_blank" rel="noopener noreferrer">intended purpose statement (opens in a new window)</a>.</p>
      <p>For example, GPs will identify patients with suspected atrial fibrillation from their history and reported symptoms. This innovation is a portable device that patients wear over a 7-day period. The device will monitor the patient’s heart rate continuously whilst they are wearing it. GPs will need to be trained in using the device and interpreting the results. GP practices will need to store the device and consumables.</p>`
  },
  q3: { label: 'What are the benefits or impact of your innovation?' },
  q4: { label: 'Does your innovation impact a disease or condition?' },
  q5: {
    label: 'What diseases or conditions does your innovation impact?',
    description: 'Start typing to view conditions. You can select as many conditions as you like.',
    conditional: true
  },
  q6: {
    label: 'Have you estimated the carbon reduction or savings that your innovation will bring?',
    description: `
    <p>All NHS suppliers will be expected to provide the carbon footprint associated with the use of their innovation, as outlined in the <a href=${URLS.DELIVERING_A_NET_ZERO_NHS} target="_blank" rel="noopener noreferrer">Delivering a Net Zero NHS report (opens in a new window)</a>.</p>
    <p>If this is something you are unsure of, the NHS Innovation Service can support you with this.</p>`
  },
  q7_a: {
    label: 'Provide the estimates and how this was calculated',
    conditional: true
  },
  q7_b: {
    label: 'Explain how you plan to calculate carbon reduction savings',
    conditional: true
  },
  q8: {
    label: 'Do you have or are you working on a carbon reduction plan (CRP)?',
    description: `All NHS suppliers will require a carbon reduction plan (CRP), as outlined in the <a href="${URLS.SUPPLIERS}" target="_blank" rel="noopener noreferrer">NHS Suppliers Roadmap plan (opens in a new window)</a>.`
  },
  q9: {
    label: 'Which key health inequalities does your innovation impact?',
    description: `
    <p>Core20PLUS5 is a national NHS England approach to support the reduction of health inequalities, defining target populations and clinical areas that require improvement.</p>
    <p>More information is available on the <a href=${URLS.CORE20PLUS5} target="_blank" rel="noopener noreferrer">Core20PLUS5 web page (opens in a new window)</a>.</p>`
  },
  q10: {
    label: 'Have you completed a health inequalities impact assessment?',
    description: `
      <p>By this, we mean a document or template which assesses the impact of your innovation on health inequalities and on those with protected characteristics. Health inequalities are the unfair and avoidable differences in health across the population, and between different groups within society.</p>
      <p>An example of a completed health inequalities impact assessment can be found on <a href=${URLS.EQUALITY_AND_HEALTH_INEQUALITIES_IMPACT_ASSESSMENT_EHIA} target="_blank" rel="noopener noreferrer">NHS England's web page (opens in a new window)</a>.</p>`
  }
  // q11: {
  //   label: 'Upload the health inequalities impact assessment, or any relevant documents',
  //   description: 'The files must be CSV, XLSX, DOCX or PDF, and can be up to 20MB.',
  //   conditional: true
  // }
};

// Types.
// type InboundPayloadType = DocumentType202304['UNDERSTANDING_OF_NEEDS'];
type StepPayloadType = DocumentType202304['UNDERSTANDING_OF_NEEDS'];
type OutboundPayloadType = DocumentType202304['UNDERSTANDING_OF_NEEDS'];

// Logic.
export const SECTION_2_1: InnovationSectionConfigType<InnovationSections> = {
  id: 'UNDERSTANDING_OF_NEEDS',
  title: 'Detailed understanding of needs and benefits',
  wizard: new WizardEngineModel({
    steps: [
      new FormEngineModel({
        parameters: [
          {
            id: 'problemsTackled',
            dataType: 'textarea',
            label: stepsLabels.q1.label,
            description: stepsLabels.q1.description,
            validations: { isRequired: [true, 'A description is required'] },
            lengthLimit: 'l'
          }
        ]
      }),
      new FormEngineModel({
        parameters: [
          {
            id: 'howInnovationWork',
            dataType: 'textarea',
            label: stepsLabels.q2.label,
            description: stepsLabels.q2.description,
            validations: { isRequired: [true, 'A description is required'] },
            lengthLimit: 'l'
          }
        ]
      }),
      new FormEngineModel({
        parameters: [
          {
            id: 'benefitsOrImpact',
            dataType: 'checkbox-array',
            label: stepsLabels.q3.label,
            // validations: { isRequired: [true, 'You must choose at least one disease or condition'] },
            items: benefitsOrImpactItems
          }
        ]
      }),
      new FormEngineModel({
        parameters: [
          {
            id: 'impactDiseaseCondition',
            dataType: 'radio-group',
            label: stepsLabels.q4.label,
            validations: { isRequired: [true, 'Choose one option'] },
            items: yesNoItems
          }
        ]
      })
    ],
    showSummary: true,
    runtimeRules: [
      (steps: WizardStepType[], currentValues: StepPayloadType, currentStep: number | 'summary') =>
        runtimeRules(steps, currentValues, currentStep)
    ],
    outboundParsing: (data: StepPayloadType) => outboundParsing(data),
    summaryParsing: (data: StepPayloadType) => summaryParsing(data)
  }),
  allStepsList: stepsLabels
};

function runtimeRules(steps: WizardStepType[], data: StepPayloadType, currentStep: number | 'summary'): void {
  steps.splice(4);

  if (data.impactDiseaseCondition === 'YES') {
    steps.push(
      new FormEngineModel({
        parameters: [
          {
            id: 'diseasesConditionsImpact',
            dataType: 'autocomplete-array',
            label: stepsLabels.q5.label,
            description: stepsLabels.q5.description,
            validations: { isRequired: [true, 'You must choose at least one disease or condition'] },
            items: diseasesConditionsImpactItems
          }
        ]
      })
    );
  } else {
    delete data.diseasesConditionsImpact;
  }

  steps.push(
    new FormEngineModel({
      parameters: [
        {
          id: 'estimatedCarbonReductionSavings',
          dataType: 'radio-group',
          label: stepsLabels.q6.label,
          description: stepsLabels.q6.description,
          validations: { isRequired: [true, 'Choose one option'] },
          items: estimatedCarbonReductionSavingsItems
        }
      ]
    })
  );

  if (['YES', 'NOT_YET'].includes(data.estimatedCarbonReductionSavings ?? '')) {
    steps.push(
      new FormEngineModel({
        parameters: [
          {
            id: 'estimatedCarbonReductionSavingsDescription',
            dataType: 'textarea',
            label: data.estimatedCarbonReductionSavings === 'YES' ? stepsLabels.q7_a.label : stepsLabels.q7_b.label,
            validations: { isRequired: [true, 'A description is required'] },
            lengthLimit: 'xl'
          }
        ]
      })
    );
  } else {
    delete data.estimatedCarbonReductionSavingsDescription;
  }

  steps.push(
    new FormEngineModel({
      parameters: [
        {
          id: 'carbonReductionPlan',
          dataType: 'radio-group',
          label: stepsLabels.q8.label,
          description: stepsLabels.q8.description,
          validations: { isRequired: [true, 'Choose one option'] },
          items: carbonReductionPlanItems
        }
      ]
    }),
    new FormEngineModel({
      parameters: [
        {
          id: 'keyHealthInequalities',
          dataType: 'checkbox-array',
          label: stepsLabels.q9.label,
          description: stepsLabels.q9.description,
          validations: { isRequired: [true, 'Choose at least one item'] },
          items: keyHealthInequalitiesItems
        }
      ]
    }),
    new FormEngineModel({
      parameters: [
        {
          id: 'completedHealthInequalitiesImpactAssessment',
          dataType: 'radio-group',
          label: stepsLabels.q10.label,
          description: stepsLabels.q10.description,
          validations: { isRequired: [true, 'Choose one option'] },
          items: yesNoItems
        }
      ]
    })
  );
}

function outboundParsing(data: StepPayloadType): OutboundPayloadType {
  return {
    ...(data.problemsTackled && { problemsTackled: data.problemsTackled }),
    ...(data.howInnovationWork && { howInnovationWork: data.howInnovationWork }),
    ...((data.benefitsOrImpact ?? []).length > 0 && { benefitsOrImpact: data.benefitsOrImpact }),
    ...(data.impactDiseaseCondition && { impactDiseaseCondition: data.impactDiseaseCondition }),
    ...((data.diseasesConditionsImpact ?? []).length > 0 && {
      diseasesConditionsImpact: data.diseasesConditionsImpact
    }),
    ...(data.estimatedCarbonReductionSavings && {
      estimatedCarbonReductionSavings: data.estimatedCarbonReductionSavings
    }),
    ...(data.estimatedCarbonReductionSavingsDescription && {
      estimatedCarbonReductionSavingsDescription: data.estimatedCarbonReductionSavingsDescription
    }),
    ...(data.carbonReductionPlan && { carbonReductionPlan: data.carbonReductionPlan }),
    ...((data.keyHealthInequalities ?? []).length > 0 && { keyHealthInequalities: data.keyHealthInequalities }),
    ...(data.completedHealthInequalitiesImpactAssessment && {
      completedHealthInequalitiesImpactAssessment: data.completedHealthInequalitiesImpactAssessment
    })
  };
}

function summaryParsing(data: StepPayloadType): WizardSummaryType[] {
  const toReturn: WizardSummaryType[] = [];

  let editStepNumber = 1;

  toReturn.push(
    {
      label: stepsLabels.q1.label,
      value: data.problemsTackled,
      editStepNumber: editStepNumber++
    },
    {
      label: stepsLabels.q2.label,
      value: data.howInnovationWork,
      editStepNumber: editStepNumber++
    },
    {
      label: stepsLabels.q3.label,
      value: data.benefitsOrImpact
        ?.map(impact => benefitsOrImpactItems.find(item => item.value === impact)?.label)
        .join('\n'),
      editStepNumber: editStepNumber++
    },
    {
      label: stepsLabels.q4.label,
      value: yesNoItems.find(item => item.value === data.impactDiseaseCondition)?.label,
      editStepNumber: editStepNumber++
    }
  );

  if (data.impactDiseaseCondition === 'YES') {
    toReturn.push({
      label: stepsLabels.q5.label,
      value: data.diseasesConditionsImpact
        ?.map(impact => diseasesConditionsImpactItems.find(item => item.value === impact)?.label)
        .join('\n'),
      editStepNumber: editStepNumber++
    });
  }

  toReturn.push({
    label: stepsLabels.q6.label,
    value: yesNotYetNoItems.find(item => item.value === data.estimatedCarbonReductionSavings)?.label,
    editStepNumber: editStepNumber++
  });

  if (['YES', 'NOT_YET'].includes(data.estimatedCarbonReductionSavings ?? '')) {
    toReturn.push({
      label: data.estimatedCarbonReductionSavings === 'YES' ? stepsLabels.q7_a.label : stepsLabels.q7_b.label,
      value: data.estimatedCarbonReductionSavingsDescription,
      editStepNumber: editStepNumber++
    });
  }

  toReturn.push(
    {
      label: stepsLabels.q8.label,
      value: carbonReductionPlanItems.find(item => item.value === data.carbonReductionPlan)?.label,
      editStepNumber: editStepNumber++
    },
    {
      label: stepsLabels.q9.label,
      value: data.keyHealthInequalities
        ?.map(impact => keyHealthInequalitiesItems.find(item => item.value === impact)?.label)
        .join('\n'),
      editStepNumber: editStepNumber++
    },
    {
      label: stepsLabels.q10.label,
      value: yesNoItems.find(item => item.value === data.completedHealthInequalitiesImpactAssessment)?.label,
      editStepNumber: editStepNumber++
    }
  );

  return toReturn;
}
