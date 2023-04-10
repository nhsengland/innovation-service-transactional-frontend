import { FormEngineModel, WizardEngineModel, WizardStepType, WizardSummaryType } from '@modules/shared/forms';

import { InnovationSectionConfigType } from '../shared.types';

import { InnovationSections } from './catalog.types';
import { DocumentType202304 } from './document.types';
import { benefitsOrImpactItems, carbonReductionPlanItems, diseasesConditionsImpactItems, keyHealthInequalitiesItems, yesNoItems, yesNotYetNoItems } from './forms.config';


// Labels.
const stepsLabels = {
  q1: {
    label: 'What problem is your innovation trying to solve?',
    description: `Include the current concequences of the problem. For example, the process of checking a patient's pulse to determine if there is atrial fibrillation using a finger and a watch is inherently inaccurate. Using this method approximately 25% of patients are not referred to secondary care who should be (false negative) and 15% of patients who are referred are referred unnecessarily (false positive). For those patients who are not picked up at this stage, their underlying disease will progress before being correctly diagnosed.`
  },
  q2: {
    label: 'How does your innovation work?',
    description: `
      <div>If this is or might be a medical device, include the <a href="https://www.digitalregulations.innovation.nhs.uk/developers-guidance/all-developers-guidance/medical-devices-intended-purpose-statement" target="_blank" rel="noopener noreferrer">intended purpose statement (opens in new window)</a>.</div>
      <div>For example, GPs will identify patients with suspected atrial fibrillation from their history and reported symptoms. This innovation is a portable device that patients wear over a 7-day period. The device will monitor the patient’s heart rate continuously whilst they are wearing it. GPs will need to be trained in using the device and interpreting the results. GP practices will need to store the device and consumables.</div>`
  },
  q3: {
    label: 'What are the benefits or impact of your innovation?',
    description: 'Start typing to filter and choose from the available options up to 5 diseases or conditions'
  },
  q4: { label: 'Does your innovation impact a disease or condition?' },
  q5: {
    label: 'What diseases or conditions does your innovation impact?',
    description: 'Start typing to view conditions. You can select as many conditions as you like.'
  },
  q6: {
    label: 'Have you estimated the carbon reduction or savings that your innovation will bring?',
    description: `
    <div>All NHS suppliers will be expected to provide the carbon footprint associated with the use of their innovation, as outlined in the <a href="https://www.england.nhs.uk/greenernhs/wp-content/uploads/sites/51/2022/07/B1728-delivering-a-net-zero-nhs-july-2022.pdf" target="_blank" rel="noopener noreferrer">Delivering a Net Zero NHS report (opens in new window)</a>.</div>
    <div>If this is something you are unsure of, the NHS Innovation Service can support you with this.</div>`
  },
  q7: {
    labelYES: 'Provide the estimates and how this was calculated',
    labelNOTYET: 'Explain how you plan to calculate carbon reduction savings'
  },
  q8: {
    label: 'Do you have or are you working on a carbon reduction plan (CRP)?',
    description: `All NHS suppliers will require a carbon reduction plan (CRP), as outlined in the <a href="https://www.england.nhs.uk/greenernhs/get-involved/suppliers/" target="_blank" rel="noopener noreferrer">NHS Suppliers Roadmap plan (opens in new window)</a>.`
  },
  q9: {
    label: 'Which key health inequalities does your innovation impact?',
    description: `Core20PLUS5 is a national NHS England approach to support the reduction of health inequalities, defining target populations and clinical areas that require improvement. More information is available on the <a href="https://www.england.nhs.uk/about/equality/equality-hub/national-healthcare-inequalities-improvement-programme/core20plus5" target="_blank" rel="noopener noreferrer">Core20PLUS5 web page (opens in new window)</a>.`
  },
  q10: {
    label: 'Have you completed a health inequalities impact assessment?',
    description: `By this, we mean a document or template which asks you about the impact of your innovation on health inequalities. One example is the Equality Impact Assessment Standard (link once live end of Jan) produced by the <a href="https://www.nhsrho.org" target="_blank" rel="noopener noreferrer">NHS Race and Health Observatory (opens in new window)</a>.`
  },
  q11: {
    label: 'Upload the health inequalities impact assessment, or any relevant documents',
    description: 'The files must be CSV, XLSX, DOCX or PDF, and can be up to 20MB.'
  }
};


// Types.
type InboundPayloadType = Omit<DocumentType202304['UNDERSTANDING_OF_NEEDS'], 'files'> & { files?: { id: string; name: string, url: string }[] };
type StepPayloadType = InboundPayloadType;
type OutboundPayloadType = DocumentType202304['UNDERSTANDING_OF_NEEDS'];

// Logic.
export const SECTION_2_1: InnovationSectionConfigType<InnovationSections> = {
  id: 'UNDERSTANDING_OF_NEEDS',
  title: 'Detailed understanding of needs and benefits',
  wizard: new WizardEngineModel({
    steps: [
      new FormEngineModel({
        parameters: [{
          id: 'problemsTackled', dataType: 'textarea', label: stepsLabels.q1.label, description: stepsLabels.q1.description,
          validations: { isRequired: [true, 'A description is required'] },
          lengthLimit: 'largeDown'
        }]
      }),
      new FormEngineModel({
        parameters: [{
          id: 'howInnovationWork',
          dataType: 'textarea', label: stepsLabels.q2.label, description: stepsLabels.q2.description,
          validations: { isRequired: [true, 'A description is required'] },
          lengthLimit: 'largeDown'
        }]
      }),
      new FormEngineModel({
        parameters: [{
          id: 'benefitsOrImpact', dataType: 'autocomplete-array', label: stepsLabels.q3.label, description: stepsLabels.q3.description,
          // validations: { isRequired: [true, 'You must choose at least one disease or condition'] },
          items: benefitsOrImpactItems
        }]
      }),
      new FormEngineModel({
        parameters: [{
          id: 'impactDiseaseCondition', dataType: 'radio-group', label: stepsLabels.q4.label,
          validations: { isRequired: [true, 'Choose one option'] },
          items: yesNoItems
        }]
      })
    ],
    showSummary: true,
    runtimeRules: [(steps: WizardStepType[], currentValues: StepPayloadType, currentStep: number | 'summary') => runtimeRules(steps, currentValues, currentStep)],
    // inboundParsing: (data: InboundPayloadType) => inboundParsing(data),
    outboundParsing: (data: StepPayloadType) => outboundParsing(data),
    summaryParsing: (data: StepPayloadType) => summaryParsing(data),
    summaryPDFParsing: (data: StepPayloadType) => summaryPDFParsing(data)
  })
};


function runtimeRules(steps: WizardStepType[], data: StepPayloadType, currentStep: number | 'summary'): void {

  steps.splice(4);

  if (data.impactDiseaseCondition === 'YES') {
    steps.push(
      new FormEngineModel({
        parameters: [{
          id: 'diseasesConditionsImpact', dataType: 'autocomplete-array', label: stepsLabels.q5.label, description: stepsLabels.q5.description,
          validations: { isRequired: [true, 'You must choose at least one disease or condition'] },
          items: diseasesConditionsImpactItems
        }]
      })
    );
  } else {
    delete data.diseasesConditionsImpact;
  }

  steps.push(
    new FormEngineModel({
      parameters: [{
        id: 'estimatedCarbonReductionSavings', dataType: 'radio-group', label: stepsLabels.q6.label, description: stepsLabels.q6.description,
        validations: { isRequired: [true, 'Choose one option'] },
        items: yesNotYetNoItems
      }]
    })
  );

  if (['YES', 'NOT_YET'].includes(data.estimatedCarbonReductionSavings ?? '')) {
    steps.push(
      new FormEngineModel({
        parameters: [{
          id: 'estimatedCarbonReductionSavingsDescription', dataType: 'textarea', label: data.estimatedCarbonReductionSavings === 'YES' ? stepsLabels.q7.labelYES : stepsLabels.q7.labelNOTYET,
          validations: { isRequired: true },
          lengthLimit: 'large'
        }]
      })
    );
  } else {
    delete data.estimatedCarbonReductionSavingsDescription;
  }

  steps.push(
    new FormEngineModel({
      parameters: [{
        id: 'carbonReductionPlan', dataType: 'radio-group', label: stepsLabels.q8.label, description: stepsLabels.q8.description,
        validations: { isRequired: [true, 'Choose one option'] },
        items: carbonReductionPlanItems
      }]
    }),
    new FormEngineModel({
      parameters: [{
        id: 'keyHealthInequalities', dataType: 'checkbox-array', label: stepsLabels.q9.label, description: stepsLabels.q9.description,
        validations: { isRequired: [true, 'Choose at least one item'] },
        items: keyHealthInequalitiesItems
      }]
    }),
    new FormEngineModel({
      parameters: [{
        id: 'completedHealthInequalitiesImpactAssessment', dataType: 'radio-group', label: stepsLabels.q10.label, description: stepsLabels.q10.description,
        validations: { isRequired: [true, 'Choose one option'] },
        items: yesNoItems
      }]
    })
  );

  if (data.completedHealthInequalitiesImpactAssessment === 'YES') {
    steps.push(
      new FormEngineModel({
        parameters: [{
          id: 'files', dataType: 'file-upload', label: stepsLabels.q11.label, description: stepsLabels.q11.description,
          validations: { isRequired: [true, 'Upload at least one file'] }
        }]
      })
    );
  } else {
    delete data.files;
  }

}

// function inboundParsing(data: InboundPayloadType): StepPayloadType {

//   return {
//     problemsTackled: data.problemsTackled ?? null,
//     howInnovationWork: data.howInnovationWork ?? null,
//     benefitsOrImpact: data.benefitsOrImpact ?? [],
//     impactDiseaseCondition: data.impactDiseaseCondition ?? null,
//     diseasesConditionsImpact: data.diseasesConditionsImpact ?? null,
//     estimatedCarbonReductionSavings: data.estimatedCarbonReductionSavings ?? null,
//     estimatedCarbonReductionSavingsDescription: data.estimatedCarbonReductionSavingsDescription ?? null,
//     carbonReductionPlan: data.carbonReductionPlan ?? null,
//     keyHealthInequalities: data.keyHealthInequalities ?? null,
//     completedHealthInequalitiesImpactAssessment: data.completedHealthInequalitiesImpactAssessment ?? null,
//     healthInequalitiesFiles: data.healthInequalitiesFiles ?? []
//   };

// }

function outboundParsing(data: StepPayloadType): OutboundPayloadType {

  return {
    problemsTackled: data.problemsTackled,
    howInnovationWork: data.howInnovationWork,
    benefitsOrImpact: data.benefitsOrImpact,
    impactDiseaseCondition: data.impactDiseaseCondition,
    diseasesConditionsImpact: data.diseasesConditionsImpact,
    estimatedCarbonReductionSavings: data.estimatedCarbonReductionSavings,
    estimatedCarbonReductionSavingsDescription: data.estimatedCarbonReductionSavingsDescription,
    carbonReductionPlan: data.carbonReductionPlan,
    keyHealthInequalities: data.keyHealthInequalities,
    completedHealthInequalitiesImpactAssessment: data.completedHealthInequalitiesImpactAssessment,
    files: data.files?.map(item => item.id)
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
      value: data.benefitsOrImpact?.map(impact => benefitsOrImpactItems.find(item => item.value === impact)?.label).join('\n'),
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
      value: data.diseasesConditionsImpact?.map(impact => diseasesConditionsImpactItems.find(item => item.value === impact)?.label).join('\n'),
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
      label: data.estimatedCarbonReductionSavings === 'YES' ? stepsLabels.q7.labelYES : stepsLabels.q7.labelNOTYET,
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
      value: data.keyHealthInequalities?.map(impact => keyHealthInequalitiesItems.find(item => item.value === impact)?.label).join('\n'),
      editStepNumber: editStepNumber++
    },
    {
      label: stepsLabels.q10.label,
      value: yesNoItems.find(item => item.value === data.completedHealthInequalitiesImpactAssessment)?.label,
      editStepNumber: editStepNumber++
    }
  );

  if (data.completedHealthInequalitiesImpactAssessment === 'YES') {
    const stepNumber = editStepNumber++
    const allFiles = (data.files || []).map(item => ({ id: item.id, name: item.name, url: item.url }));
    allFiles.forEach((item, i) => {
      toReturn.push({
        label: `Attachment ${i + 1}`,
        value: `<a href='${item.url}'>${item.name}</a>` || 'Unknown',
        editStepNumber: stepNumber,
        allowHTML: true,
        isFile: true
      });
    });
  }

  return toReturn;

}

function summaryPDFParsing(data: StepPayloadType): WizardSummaryType[] {
  return summaryParsing(data);
}
