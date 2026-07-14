import { WizardIRV3EngineModel } from './wizard-engine-irv3-schema.model';
import { InnovationRecordSchemaInfoType } from '@modules/stores/ctx/schema/schema.types';

const schema: InnovationRecordSchemaInfoType = {
  id: 'schema',
  version: 1,
  schema: {
    sections: [
      {
        id: 'section',
        title: 'Section',
        subSections: [
          {
            id: 'UNDERSTANDING_OF_NEEDS',
            title: 'Understanding of needs',
            steps: [
              {
                questions: [
                  {
                    id: 'hasProductServiceOrPrototype',
                    dataType: 'radio-group',
                    label: 'Do you have a working product, service or prototype?',
                    items: [
                      { id: 'YES', label: 'Yes', isLegacy: true },
                      { id: 'CONCEPT_STAGE', label: 'No working prototype (concept stage)' },
                      { id: 'PROTOTYPE', label: 'Prototype' }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
};

describe('WizardIRV3EngineModel legacy schema values', () => {
  it('hides legacy YES for new records', () => {
    const wizard = new WizardIRV3EngineModel({ schema, sectionId: 'UNDERSTANDING_OF_NEEDS' }).runRules();

    expect(wizard.steps[0].parameters[0].items?.map(item => item.id)).toEqual(['CONCEPT_STAGE', 'PROTOTYPE']);
  });

  it('keeps legacy YES available when an existing record contains it', () => {
    const wizard = new WizardIRV3EngineModel({
      schema,
      sectionId: 'UNDERSTANDING_OF_NEEDS',
      currentAnswers: { hasProductServiceOrPrototype: 'YES' }
    }).runRules();

    expect(wizard.steps[0].parameters[0].items?.map(item => item.id)).toEqual(['YES', 'CONCEPT_STAGE', 'PROTOTYPE']);
  });
});
