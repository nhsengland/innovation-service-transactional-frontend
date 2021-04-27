import { InnovationSectionsIds } from './innovation.models';


export const INNOVATION_SECTIONS: {
  title: string;
  sections: { id: InnovationSectionsIds, title: string }[]
}[] = [
    {
      title: 'About your product or service',
      sections: [
        { id: InnovationSectionsIds.descritionOfInnovation, title: 'Description of innovation' },
        { id: InnovationSectionsIds.valueProposition, title: 'Value proposition' }
      ]
    },
    {
      title: 'Clinical needs and benefits',
      sections: [
        { id: InnovationSectionsIds.understandingOfNeeds, title: 'Detailed understanding of needs' },
        { id: InnovationSectionsIds.understandingOfBenefits, title: 'Detailed understanding of benefits' },
        { id: InnovationSectionsIds.evidenceDocuments, title: 'Evidence documents' }
      ]
    },

  ];
