import { InnovationRecordSchemaInfoType } from '@modules/stores/ctx/schema/schema.types';
import { WizardIRV3EngineModel } from './wizard-engine-irv3-schema.model';

describe('WizardIRV3EngineModel', () => {
  it('uses the row index when generating fields-group addQuestions steps', () => {
    const schema: InnovationRecordSchemaInfoType = {
      id: 'test-schema',
      version: 15,
      schema: {
        sections: [
          {
            id: 'testingWithUsers',
            title: 'Testing with users',
            subSections: [
              {
                id: 'TESTING_WITH_USERS',
                title: 'Testing with users',
                steps: [
                  {
                    questions: [
                      {
                        id: 'userTests',
                        dataType: 'fields-group',
                        label: 'What kind of testing with users have you done?',
                        field: {
                          id: 'kind',
                          dataType: 'text',
                          label: 'User test',
                          validations: { isRequired: 'Required' }
                        },
                        addQuestions: [
                          {
                            id: 'feedback',
                            dataType: 'textarea',
                            label: 'Describe the testing and feedback for {{item.kind}}',
                            validations: { isRequired: 'A description is required' }
                          }
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

    const wizard = new WizardIRV3EngineModel({
      sectionId: 'TESTING_WITH_USERS',
      schema,
      currentAnswers: {
        userTests: [
          { kind: 'A', feedback: null },
          { kind: 'B', feedback: null }
        ]
      }
    });

    wizard.runRules();

    expect(wizard.steps.map(step => step.parameters[0].id)).toEqual(['userTests', 'feedback_0', 'feedback_1']);
  });

  it('normalizes a legacy standards id before binding its answers', () => {
    const schema: InnovationRecordSchemaInfoType = {
      id: 'test-schema',
      version: 15,
      schema: {
        sections: [
          {
            id: 'regulationsStandards',
            title: 'Regulations and standards',
            subSections: [
              {
                id: 'REGULATIONS_AND_STANDARDS',
                title: 'Regulations and standards',
                steps: [
                  {
                    questions: [
                      {
                        id: 'standards',
                        dataType: 'checkbox-array',
                        checkboxAnswerId: 'type',
                        label: 'Which standards apply?',
                        items: [{ id: 'MARKETING_AUTHORISATION', label: 'Marketing authorisation' }],
                        addQuestions: [
                          {
                            id: 'hasMet',
                            dataType: 'radio-group',
                            label: 'Do you have a certification?',
                            items: [{ id: 'YES', label: 'Yes' }]
                          }
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

    const wizard = new WizardIRV3EngineModel({
      sectionId: 'REGULATIONS_AND_STANDARDS',
      schema,
      currentAnswers: {
        standards: [{ type: 'MARKETING', hasMet: 'YES' }]
      }
    });

    wizard.runRules().runInboundParsing();

    expect(wizard.getAnswers()).toMatchObject({
      standards: ['MARKETING_AUTHORISATION'],
      hasMet_MARKETING_AUTHORISATION: 'YES'
    });
  });

  it('keeps an ambiguous legacy standard visible and blocks editing until it is replaced', () => {
    const schema: InnovationRecordSchemaInfoType = {
      id: 'test-schema',
      version: 15,
      schema: {
        sections: [
          {
            id: 'regulationsStandards',
            title: 'Regulations and standards',
            subSections: [
              {
                id: 'REGULATIONS_AND_STANDARDS',
                title: 'Regulations and standards',
                steps: [
                  {
                    questions: [
                      {
                        id: 'standards',
                        dataType: 'checkbox-array',
                        checkboxAnswerId: 'type',
                        label: 'Which standards apply?',
                        validations: { isRequired: 'Choose at least one option' },
                        items: [{ id: 'UK_MDR_CLASS_II_B', label: 'UK MDR Class IIb' }],
                        addQuestions: [
                          {
                            id: 'hasMet',
                            dataType: 'radio-group',
                            label: 'Do you have a certification?',
                            items: [{ id: 'YES', label: 'Yes' }]
                          }
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

    const wizard = new WizardIRV3EngineModel({
      sectionId: 'REGULATIONS_AND_STANDARDS',
      schema,
      currentAnswers: {
        standards: [{ type: 'CE_UKCA_CLASS_II_B', hasMet: 'YES' }]
      }
    });

    wizard.runRules();

    expect(wizard.steps[0].parameters[0].items).toContainEqual(expect.objectContaining({ id: 'CE_UKCA_CLASS_II_B' }));
    expect(wizard.validateData().valid).toBe(false);
  });
});
