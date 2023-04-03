import { FormEngineModel, WizardEngineModel, WizardStepType, WizardSummaryType } from '@modules/shared/forms';

import { sectionType } from '../shared.types';
import { InnovationSections } from './catalog.types';
import { DocumentType202209 } from './document.types';

import { diseasesConditionsImpactItems, innovationImpactItems } from './forms.config';


// Labels.
const stepsLabels = {
  l1: 'Who does your innovation impact?',
  l2: 'What diseases or conditions does your innovation impact?',
  l3: 'What specific groups of people will your innovation impact?',
  l4: 'Please specify the groups of clinicians, carers or administrative staff that your innovation impacts'
};


// Types.
type InboundPayloadType = DocumentType202209['UNDERSTANDING_OF_NEEDS'];
type StepPayloadType = Omit<InboundPayloadType, 'impactPatients' | 'impactClinicians'> & { impacts: ('PATIENTS' | 'CLINICIANS')[] };
type OutboundPayloadType = InboundPayloadType;


export const SECTION_2_1: sectionType<InnovationSections> = {
  id: 'UNDERSTANDING_OF_NEEDS',
  title: 'Detailed understanding of needs',
  wizard: new WizardEngineModel({
    steps: [
      new FormEngineModel({
        parameters: [{
          id: 'impacts',
          dataType: 'checkbox-array',
          label: stepsLabels.l1,
          description: 'We\'re asking this to understand if we should ask you specific questions about patients and/or healthcare professionals. Your answer will determine which questions we ask in this and other sections.',
          validations: { isRequired: [true, 'Choose at least one option'] },
          items: innovationImpactItems
        }]
      })
    ],
    showSummary: true,
    runtimeRules: [(steps: WizardStepType[], currentValues: StepPayloadType, currentStep: number | 'summary') => runtimeRules(steps, currentValues, currentStep)],
    inboundParsing: (data: InboundPayloadType) => inboundParsing(data),
    outboundParsing: (data: StepPayloadType) => outboundParsing(data),
    summaryParsing: (data: StepPayloadType) => summaryParsing(data),
    summaryPDFParsing: (data: StepPayloadType) => summaryPDFParsing(data)
  })
};


function runtimeRules(steps: WizardStepType[], currentValues: StepPayloadType, currentStep: number | 'summary'): void {

  console.log(currentValues);

  steps.splice(1);

  // PATIENTS.
  if (!currentValues.impacts?.includes('PATIENTS')) { // Removes all subgroups if no PATIENTS has been selected.
    currentValues.subgroups = [];
    delete currentValues.diseasesConditionsImpact;
  } else {

    // currentValues.subgroups = currentValues.subgroups.filter(group => group.id || group.name); // This will prevent empty subgroups when user go back (where validations are not triggered).

    steps.push(

      new FormEngineModel({
        parameters: [{
          id: 'diseasesConditionsImpact',
          dataType: 'autocomplete-array',
          label: stepsLabels.l2,
          description: 'Start typing to filter and choose from the available options up to 5 diseases or conditions',
          validations: { isRequired: [true, 'You must choose at least one disease or condition'], max: [5, 'You can only choose up to 5 diseases or conditions'] },
          items: diseasesConditionsImpactItems
        }]
      }),
      {
        saveStrategy: 'updateAndWait',
        ...new FormEngineModel({
          parameters: [{
            id: 'subgroups',
            dataType: 'fields-group',
            label: stepsLabels.l3,
            description: `For example, children aged 0-5, pregnant women, people with high blood pressure. Please write "not applicable" if this doesn't apply to your innovation.`,
            validations: { isRequired: true },
            fieldsGroupConfig: {
              fields: [
                // { id: 'id', dataType: 'text', isVisible: false },
                { id: 'name', dataType: 'text', label: 'Population or subgroup', validations: { isRequired: true, maxLength: 50 } }
              ],
              addNewLabel: 'Add new population or subgroup'
            }
          }]
        })
      }

    );

  }

  // CLINICIANS.
  if (!currentValues.impacts?.includes('CLINICIANS')) {
    delete currentValues.cliniciansImpactDetails;
  } else {
    steps.push(
      new FormEngineModel({
        parameters: [{
          id: 'cliniciansImpactDetails',
          dataType: 'textarea',
          label: stepsLabels.l4,
          description: 'For example, carers of people with functional disability following stroke, GP practice managers, liaison psychiatrists in emergency departments.',
          validations: { isRequired: [true, 'Specification is required'] },
          lengthLimit: 'medium'
        }]

      })
    );
  }

}

function inboundParsing(data: InboundPayloadType): StepPayloadType {

  const impacts: ('PATIENTS' | 'CLINICIANS')[] = [];

  if (data.impactPatients) { impacts.push('PATIENTS'); }
  if (data.impactClinicians) { impacts.push('CLINICIANS'); }

  return {
    ...data, impacts
    // subgroups: data.subgroups.map(item => ({ id: null, name: item })),
  };

}

function outboundParsing(data: StepPayloadType): OutboundPayloadType {

  return {
    impactPatients: data.impacts?.includes('PATIENTS') || false,
    impactClinicians: data.impacts?.includes('CLINICIANS') || false,
    subgroups: data.subgroups,
    diseasesConditionsImpact: data.diseasesConditionsImpact,
    cliniciansImpactDetails: data.cliniciansImpactDetails
  };

}

function summaryParsing(data: StepPayloadType): WizardSummaryType[] {

  const toReturn: WizardSummaryType[] = [];

  toReturn.push({
    label: stepsLabels.l1,
    value: data.impacts?.map(impact => innovationImpactItems.find(item => item.value === impact)?.label).join('\n'),
    editStepNumber: toReturn.length + 1
  });

  if (data.impacts?.includes('PATIENTS')) {

    toReturn.push({
      label: stepsLabels.l2,
      value: data.diseasesConditionsImpact?.map(impact => diseasesConditionsImpactItems.find(item => item.value === impact)?.label).join('\n'),
      editStepNumber: toReturn.length + 1
    });

    toReturn.push({
      label: stepsLabels.l3,
      // value: data.subgroups?.map(group => group.name).join('\n'),
      value: data.subgroups?.join('\n'),
      editStepNumber: toReturn.length + 1
    });

  }

  if (data.impacts?.includes('CLINICIANS')) {

    toReturn.push({
      label: stepsLabels.l4,
      value: data.cliniciansImpactDetails,
      editStepNumber: toReturn.length + 1
    });

  }

  return toReturn;

}

function summaryPDFParsing(data: StepPayloadType): WizardSummaryType[] {
  return summaryParsing(data);
}
