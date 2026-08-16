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
});
