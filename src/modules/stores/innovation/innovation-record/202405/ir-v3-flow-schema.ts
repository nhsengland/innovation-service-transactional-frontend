import { InnovationRecordSchemaInfoType } from '../innovation-record-schema/innovation-record-schema.models';
import { InnovationRecordSchemaV3Type, InnovationRecordSubSectionType } from './ir-v3-types';

export const dummy_schema_flow_demo: InnovationRecordSchemaInfoType = {
  id: '',
  version: 0,
  schema: {
    sections: [
      {
        id: 'schemaManagement',
        title: 'IR Management Schema',
        subSections: [
          {
            id: 'newQuestion',
            title: 'Add a new question to the innovation record',

            steps: [
              {
                questions: [
                  {
                    id: 'questionPlacement',
                    dataType: 'radio-group',
                    label: 'Where in this subsection do you want to add a new question?',
                    description: '',
                    validations: {
                      isRequired: 'Choose one option',
                      maxLength: 100
                    },
                    items: [
                      {
                        id: 'bla1',
                        label: 'After question 1'
                      },
                      {
                        id: 'bla2',
                        label: 'After question 2'
                      },
                      {
                        id: 'bla3',
                        label: 'After question 3'
                      }
                    ]
                  }
                ]
              },
              {
                questions: [
                  {
                    id: 'questionDescription',
                    dataType: 'textarea',
                    label: 'Write question',
                    description:
                      'You will be asked to add the answer types, as well as any hint text and dependancies on the next few pages. For tips on writing questions view rules and guidance (opens in new window).',
                    validations: {
                      isRequired: 'A description is required'
                    },
                    lengthLimit: 'xl'
                  }
                ]
              },
              {
                questions: [
                  {
                    id: 'answerType',
                    dataType: 'radio-group',
                    label: 'Select answer type for the new question',
                    description:
                      'You will be asked to add the answer types, as well as any hint text and dependancies on the next few pages. For tips on writing questions view rules and guidance (opens in new window).',
                    validations: {
                      isRequired: 'Choose one option'
                    },
                    items: [
                      {
                        id: 'text',
                        label: 'Text input or textarea',
                        description: 'Use text input or textareas to let users enter 1 or more lines of text.'
                      },
                      {
                        id: 'radio-group',
                        label: 'Radio group',
                        description: 'Use radios when you want users to select only 1 option from a list.'
                      },
                      {
                        id: 'check-boxes',
                        label: 'Checkboxes',
                        description: 'Use checkboxes to let users select 1 or more options on a form.'
                      }
                    ]
                  }
                ]
              },
              {
                questions: [
                  {
                    id: 'textAnswerDescription',
                    dataType: 'textarea',
                    label: 'New question: {{questionDescription}}',
                    description:
                      'For more information on hint text and answer character limits, read the guidance on adding a new question (opens in new window). ',
                    validations: {
                      isRequired: 'A description is required'
                    },
                    lengthLimit: 'xl'
                  },
                  {
                    id: 'textAnswerLength',
                    dataType: 'radio-group',
                    label: 'Answer character limit',
                    description: "Select a suitable character limit for the innovator's answer.",
                    validations: {
                      isRequired: 'Choose one option'
                    },
                    items: [
                      {
                        id: 'xs',
                        label: '200 characters (XS)'
                      },
                      {
                        id: 's',
                        label: '500 characters (S)'
                      },
                      {
                        id: 'm',
                        label: '1000 characters (M)'
                      },
                      {
                        id: 'l',
                        label: '1500 characters (L)'
                      },
                      {
                        id: 'xl',
                        label: '2000 characters (XL)'
                      },
                      {
                        id: 'XXL',
                        label: '4000 characters (XXL)'
                      }
                    ]
                  }
                ],
                condition: {
                  id: 'answerType',
                  options: ['text']
                }
              },
              {
                questions: [
                  {
                    id: 'textAnswerDescription',
                    dataType: 'textarea',
                    label: 'New question: {{questionDescription}}',
                    description:
                      'For more information on hint text and answer character limits, read the guidance on adding a new question (opens in new window). ',
                    validations: {
                      isRequired: 'A description is required'
                    },
                    lengthLimit: 'xl'
                  },
                  {
                    id: 'answer1',
                    dataType: 'text',
                    label: 'Answer 1',
                    validations: {
                      isRequired: 'Answer 1 is required'
                    }
                  },
                  {
                    id: 'answer2hint',
                    dataType: 'text',
                    label: 'Answer 2',
                    validations: {
                      isRequired: 'Answer 2 is required'
                    }
                  }
                ],
                condition: {
                  id: 'answerType',
                  options: ['radio-group', 'check-boxes']
                }
              },
              {
                questions: [
                  {
                    id: 'questionDependencies',
                    dataType: 'radio-group',
                    label: 'Does your question have dependancies?',
                    description:
                      'If the question has dependencies it will only show to the innovator if they respond to previous questions with a certain answer. This question is dependant on previous answers.',
                    validations: {
                      isRequired: 'Choose one option'
                    },
                    items: [
                      {
                        id: 'yes',
                        label: 'Yes'
                      },
                      {
                        id: 'no',
                        label: 'No'
                      }
                    ]
                  }
                ]
              },
              {
                questions: [
                  {
                    id: 'selectDependencies',
                    dataType: 'radio-group',
                    label: 'Select the question and answers your question is dependant on',
                    description:
                      'You can select 1 question and multiple answers. Your new question will only be visible to innovators who have selected one or more of these answers.',
                    validations: {
                      isRequired: 'Choose one option'
                    },
                    items: [
                      {
                        id: 'question1',
                        label: 'Some question',
                        conditional: {
                          id: 'question1items',
                          dataType: 'checkbox-array',
                          items: [
                            {
                              id: 'yes',
                              label: 'Yes'
                            },
                            {
                              id: 'maybe',
                              label: 'Maybe'
                            },
                            {
                              id: 'no',
                              label: 'No'
                            }
                          ]
                        }
                      },
                      {
                        id: 'question2',
                        label: 'Another question',
                        conditional: {
                          id: 'question2items',
                          dataType: 'checkbox-array',
                          items: [
                            {
                              id: 'oneOffInnovation',
                              label: 'A one-off innovation, or the first of its kind'
                            },
                            {
                              id: 'betterAlternative',
                              label: 'A better alternative to those that already exist'
                            },
                            {
                              id: 'equivalentAlternative',
                              label: 'An equivalent alternative to those that already exist'
                            },
                            {
                              id: 'costEffectAlternative',
                              label: 'A more cost-effect alternative to those that already exist'
                            },
                            {
                              id: 'notSure',
                              label: 'I am not sure'
                            }
                          ]
                        }
                      }
                    ]
                  }
                ],
                condition: {
                  id: 'questionDependencies',
                  options: ['yes']
                }
              },
              {
                questions: [
                  {
                    id: 'questionReason',
                    dataType: 'textarea',
                    label: 'Why have you added this question?',
                    description:
                      'This information will be stored on the change log and may be referred to for governance purposes.\nExplain reason',
                    validations: {
                      isRequired: 'A description is required'
                    },
                    lengthLimit: 'xl'
                  },
                  {
                    id: 'questionSignoff',
                    dataType: 'textarea',
                    label: '',
                    description: 'Who signed off this new question?',
                    validations: {
                      isRequired: 'A description is required'
                    },
                    lengthLimit: 'xl'
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
