import { FormEngineModel } from '@modules/shared/forms';
import { InnovationSectionsIds } from './innovation.models';


export const INNOVATION_SECTIONS: {
  title: string;
  sections: {
    id: InnovationSectionsIds;
    title: string;
    data: FormEngineModel[];
  }[];
}[] = [

    // Section group 01.
    {
      title: 'About your product or service',
      sections: [

        { id: InnovationSectionsIds.INNOVATION_DESCRIPTION, title: 'Description of innovation', data: [] },
        { id: InnovationSectionsIds.VALUE_PROPOSITION, title: 'Value proposition', data: [] }
      ]
    },


    // Section Group 02.
    {
      title: 'Needs, benefits and effectiveness',
      sections: [
        {
          id: InnovationSectionsIds.UNDERSTANDING_OF_NEEDS,
          title: 'Detailed understanding of needs',
          data: [
            new FormEngineModel({
              label: 'Do you know yet what patient population or subgroup your innovation will affect?',
              description: 'We\'re asking this to get a better understanding of who would benefit from your innovation.',
              parameters: [{
                id: 'innovatorName',
                dataType: 'radio-group',
                validations: { isRequired: true },
                items: [
                  { value: 'yes', label: 'Yes' },
                  { value: 'no', label: 'No' },
                  { value: 'notRelevant', label: 'Not relevant' }
                ]
              }]
            }),
            new FormEngineModel({
              label: 'What population or subgroup does this affect?',
              description: 'We\'ll ask you further questions about each answer you provide here. If there are key distinctions between how you innovation affects different populations, be as specific as possible. If not, consider providing as few answers as possible.',
              parameters: [{
                id: 'innovatorName02',
                dataType: 'fields-group',
                // validations: { isRequired: true }
                fieldsGroupConfig: {
                  fields: [{ id: 'groupTextField', dataType: 'text', label: 'Population or subgroup', validations: { isRequired: true } }],
                  addNewLabel: 'Add new population or subgroup'
                }
              }]
            }),
            new FormEngineModel({
              label: 'What condition best categorises?',
              description: 'We\'ll ask you further questions about each answer you provide here. If there are key distinctions between how you innovation affects different populations, be as specific as possible. If not, consider providing as few answers as possible.',
              parameters: [{
                id: 'innovatorName03',
                dataType: 'text',
                validations: { isRequired: true }
              }]
            }),
          ]
        },

        { id: InnovationSectionsIds.UNDERSTANDING_OF_BENEFITS, title: 'Detailed understanding of benefits', data: [] },
        { id: InnovationSectionsIds.EVIDENCE_OF_EFFECTIVENESS, title: 'Evidence documents', data: [] }
      ]
    }


  ];
