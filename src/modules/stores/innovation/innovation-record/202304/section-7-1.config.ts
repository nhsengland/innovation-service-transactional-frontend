import { FormEngineModel, WizardEngineModel, WizardStepType, WizardSummaryType } from '@modules/shared/forms';

import { sectionType } from '../shared.types';

import { InnovationSections } from './catalog.types';
import { DocumentType202304 } from './document.types';
import { costComparisonItems, hasCostKnowledgeItems, patientRangeItems } from './forms.config';


// Labels.
const stepsLabels = {
  q1: {
    label: 'Do you know the cost of your innovation?',
    description: 'By cost, we mean the cost to the NHS or any care organisation that would implement your innovation. Support organisations will use this to calculate cost effectiveness.'
  },
  q2: {
    label: 'What is the cost of your innovation?',
    description: 'Include the relevant metric such as a flat capital cost or cost per patient, cost per unit or cost per procedure. Include any costs associated with implementation and resources. For example, £10 based on 500 units per site. £345 per procedure and a typical patient requires two procedures.'
  },
  q3: { label: 'Roughly how many patients would be eligible for your innovation in the UK?' },
  q4: { label: 'What is the elibility criteria for your innovation?', description: 'For example, users need to be over a certain age, or have a certain medical history or current health status. Answer "not relevant" if your innovation does not have any elibility criteria.' },
  q5: { label: 'How many units of your innovation would you expect to sell in the UK per year?' },
  q6: {
    label: 'Approximately how long do you expect each unit of your innovation to be in use?',
    description: `By this we mean the shelf life of the product, or the product's lifespan. This can include the lifespan of any components such as batteries.`
  },
  q7: { label: 'What are the costs associated with the use of your innovation, compared to current practice in the UK?' }
};


// Types.
type InboundPayloadType = DocumentType202304['COST_OF_INNOVATION'];
type StepPayloadType = InboundPayloadType;


// Logic.
export const SECTION_7_1: sectionType<InnovationSections> = {
  id: 'COST_OF_INNOVATION',
  title: 'Cost of your innovation',
  wizard: new WizardEngineModel({
    steps: [
      new FormEngineModel({
        parameters: [{
          id: 'hasCostKnowledge', dataType: 'radio-group', label: stepsLabels.q1.label, description: stepsLabels.q1.description,
          validations: { isRequired: [true, 'Choose one option'] },
          items: hasCostKnowledgeItems
        }]
      })
    ],
    showSummary: true,
    runtimeRules: [(steps: WizardStepType[], currentValues: StepPayloadType, currentStep: number | 'summary') => runtimeRules(steps, currentValues, currentStep)],
    summaryParsing: (data: StepPayloadType) => summaryParsing(data),
    summaryPDFParsing: (data: StepPayloadType) => summaryPDFParsing(data)
  })
};

function runtimeRules(steps: WizardStepType[], currentValues: StepPayloadType, currentStep: number | 'summary'): void {

  steps.splice(1);

  if (['NO'].includes(currentValues.hasCostKnowledge || 'NO')) {
    delete currentValues.costDescription;
  } else {
    steps.push(
      new FormEngineModel({
        parameters: [{
          id: 'costDescription',
          dataType: 'textarea', label: stepsLabels.q2.label, description: stepsLabels.q2.description,
          validations: { isRequired: [true, 'Description is required'] },
          lengthLimit: 'mediumUp'
        }]
      })
    );
  }

  steps.push(
    new FormEngineModel({
      parameters: [{
        id: 'patientsRange', dataType: 'radio-group', label: stepsLabels.q3.label,
        validations: { isRequired: [true, 'Choose one option'] },
        items: patientRangeItems
      }]
    })
  );

  if (['NOT_RELEVANT'].includes(currentValues.patientsRange || '')) {
    delete currentValues.eligibilityCriteria;
  } else {
    steps.push(
      new FormEngineModel({
        parameters: [{
          id: 'elibilityCriteria', dataType: 'textarea', label: stepsLabels.q4.label, description: stepsLabels.q4.description,
          validations: { isRequired: [true, 'Description is required'] },
          lengthLimit: 'mediumUp'
        }]
      })
    );
  }

  steps.push(
    new FormEngineModel({
      parameters: [{
        id: 'sellExpectations', dataType: 'textarea', label: stepsLabels.q5.label,
        validations: { isRequired: [true, 'Description is required'] },
        lengthLimit: 'medium'
      }]
    }),
    new FormEngineModel({
      parameters: [{
        id: 'usageExpectations', dataType: 'textarea', label: stepsLabels.q6.label, description: stepsLabels.q6.description,
        validations: { isRequired: [true, 'Description is required'] },
        lengthLimit: 'mediumUp'
      }]
    }),
    new FormEngineModel({
      parameters: [{
        id: 'costComparison', dataType: 'radio-group', label: stepsLabels.q7.label,
        validations: { isRequired: [true, 'Choose one option'] },
        items: costComparisonItems
      }]
    })
  );

}

function summaryParsing(data: StepPayloadType): WizardSummaryType[] {

  const toReturn: WizardSummaryType[] = [];

  let editStepNumber = 1;

  toReturn.push({
    label: stepsLabels.q1.label,
    value: hasCostKnowledgeItems.find(item => item.value === data.hasCostKnowledge)?.label,
    editStepNumber: editStepNumber++
  });

  if (!['NO'].includes(data.hasCostKnowledge || 'NO')) {
    toReturn.push({
      label: stepsLabels.q2.label,
      value: data.costDescription,
      editStepNumber: editStepNumber++
    });
  }

  toReturn.push({
    label: stepsLabels.q3.label,
    value: patientRangeItems.find(item => item.value === data.patientsRange)?.label,
    editStepNumber: editStepNumber++
  });

  if (['NOT_RELEVANT'].includes(data.patientsRange || '')) {
    toReturn.push({
      label: stepsLabels.q4.label,
      value: data.eligibilityCriteria,
      editStepNumber: editStepNumber++
    });
  }

  toReturn.push(
    { label: stepsLabels.q5.label, value: data.sellExpectations, editStepNumber: editStepNumber++ },
    { label: stepsLabels.q6.label, value: data.usageExpectations, editStepNumber: editStepNumber++ },
    {
      label: stepsLabels.q7.label,
      value: costComparisonItems.find(item => item.value === data.costComparison)?.label,
      editStepNumber: editStepNumber++
    }
  );

  return toReturn;

}

function summaryPDFParsing(data: StepPayloadType): WizardSummaryType[] {
  return summaryParsing(data);
}
