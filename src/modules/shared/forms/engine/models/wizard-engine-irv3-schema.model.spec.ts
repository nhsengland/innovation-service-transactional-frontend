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

  it('uses the checkbox question id when checkboxAnswerId is not defined', () => {
    const schema: InnovationRecordSchemaInfoType = {
      id: 'test-schema',
      version: 15,
      schema: {
        sections: [
          {
            id: 'categoriesSection',
            title: 'Categories',
            subSections: [
              {
                id: 'CATEGORIES',
                title: 'Categories',
                steps: [
                  {
                    questions: [
                      {
                        id: 'categories',
                        dataType: 'checkbox-array',
                        label: 'Which categories apply?',
                        items: [{ id: 'MEDICAL_DEVICE', label: 'Medical device' }],
                        addQuestions: [
                          {
                            id: 'details',
                            dataType: 'text',
                            label: 'Provide details'
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
      sectionId: 'CATEGORIES',
      schema,
      currentAnswers: {
        categories: [{ categories: 'MEDICAL_DEVICE', details: 'A medical device' }]
      }
    });

    wizard.runRules().runInboundParsing();

    expect(wizard.getAnswers()).toMatchObject({
      categories: ['MEDICAL_DEVICE'],
      details_MEDICAL_DEVICE: 'A medical device'
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

describe('translateSummaryForIRDocumentExport', () => {
  it('exports radio item conditional answers as their own labelled rows', () => {
    const wizard = new WizardIRV3EngineModel({
      currentAnswers: {
        hasWebsite: 'YES',
        website: 'https://example.com'
      },
      steps: [
        {
          parameters: [
            {
              id: 'hasWebsite',
              dataType: 'radio-group',
              label: 'Does your innovation have a website?',
              items: [
                {
                  id: 'YES',
                  label: 'Yes',
                  conditional: {
                    id: 'website',
                    dataType: 'text',
                    label: 'Website'
                  }
                },
                { id: 'NO', label: 'No' }
              ],
              isHidden: false
            }
          ]
        }
      ],
      translations: {
        sections: new Map(),
        subsections: new Map(),
        questions: new Map([
          [
            'hasWebsite',
            {
              label: 'Does your innovation have a website?',
              items: new Map([
                ['YES', { label: 'Yes', group: '' }],
                ['NO', { label: 'No', group: '' }]
              ])
            }
          ],
          ['website', { label: 'Website', items: new Map() }]
        ])
      }
    });

    expect(wizard.translateSummaryForIRDocumentExport()).toEqual([
      { label: 'Does your innovation have a website?', value: 'Yes' },
      { label: 'Website', value: 'https://example.com' }
    ]);
  });

  it('does not export stale radio conditional answers when the parent option is not selected', () => {
    const wizard = new WizardIRV3EngineModel({
      currentAnswers: {
        hasWebsite: 'NO',
        website: 'https://example.com'
      },
      steps: [
        {
          parameters: [
            {
              id: 'hasWebsite',
              dataType: 'radio-group',
              label: 'Does your innovation have a website?',
              items: [
                {
                  id: 'YES',
                  label: 'Yes',
                  conditional: {
                    id: 'website',
                    dataType: 'text',
                    label: 'Website'
                  }
                },
                { id: 'NO', label: 'No' }
              ],
              isHidden: false
            }
          ]
        }
      ],
      translations: {
        sections: new Map(),
        subsections: new Map(),
        questions: new Map([
          [
            'hasWebsite',
            {
              label: 'Does your innovation have a website?',
              items: new Map([
                ['YES', { label: 'Yes', group: '' }],
                ['NO', { label: 'No', group: '' }]
              ])
            }
          ],
          ['website', { label: 'Website', items: new Map() }]
        ])
      }
    });

    expect(wizard.translateSummaryForIRDocumentExport()).toEqual([
      { label: 'Does your innovation have a website?', value: 'No' }
    ]);
  });

  it('exports real IR schema website and video conditional answers', () => {
    const wizard = new WizardIRV3EngineModel({
      currentAnswers: {
        hasWebsite: 'YES',
        website: 'https://example.com',
        hasVideoDemonstration: 'YES',
        videoDemonstrationUrl: 'https://youtube.com/watch?v=demo'
      },
      steps: [
        {
          parameters: [
            {
              id: 'hasWebsite',
              dataType: 'radio-group',
              label: 'Does your innovation have a website?',
              items: [
                {
                  id: 'YES',
                  label: 'Yes',
                  conditional: {
                    id: 'website',
                    dataType: 'text',
                    label: 'Website'
                  }
                },
                { id: 'NO', label: 'No' }
              ],
              isHidden: false
            }
          ]
        },
        {
          parameters: [
            {
              id: 'hasVideoDemonstration',
              dataType: 'radio-group',
              label: 'Does your innovation have a video that explains how it works ?',
              items: [
                {
                  id: 'YES',
                  label: 'Yes',
                  conditional: {
                    id: 'videoDemonstrationUrl',
                    dataType: 'text',
                    label: 'Link'
                  }
                },
                { id: 'NO', label: 'No' }
              ],
              isHidden: false
            }
          ]
        }
      ],
      translations: {
        sections: new Map(),
        subsections: new Map(),
        questions: new Map([
          [
            'hasWebsite',
            {
              label: 'Does your innovation have a website?',
              items: new Map([
                ['YES', { label: 'Yes', group: '' }],
                ['NO', { label: 'No', group: '' }]
              ])
            }
          ],
          ['website', { label: 'Website', items: new Map() }],
          [
            'hasVideoDemonstration',
            {
              label: 'Does your innovation have a video that explains how it works ?',
              items: new Map([
                ['YES', { label: 'Yes', group: '' }],
                ['NO', { label: 'No', group: '' }]
              ])
            }
          ],
          ['videoDemonstrationUrl', { label: 'Link', items: new Map() }]
        ])
      }
    });

    expect(wizard.translateSummaryForIRDocumentExport()).toEqual([
      { label: 'Does your innovation have a website?', value: 'Yes' },
      { label: 'Website', value: 'https://example.com' },
      { label: 'Does your innovation have a video that explains how it works ?', value: 'Yes' },
      { label: 'Link', value: 'https://youtube.com/watch?v=demo' }
    ]);
  });

  it('exports checkbox item conditional answers as their own labelled rows', () => {
    const wizard = new WizardIRV3EngineModel({
      currentAnswers: {
        categories: ['OTHER', 'MEDICAL_DEVICE'],
        otherCategoryDescription: 'Remote monitoring'
      },
      steps: [
        {
          parameters: [
            {
              id: 'categories',
              dataType: 'checkbox-array',
              label: 'Select all categories',
              items: [
                {
                  id: 'OTHER',
                  label: 'Other',
                  conditional: {
                    id: 'otherCategoryDescription',
                    dataType: 'text',
                    label: 'Other category'
                  }
                },
                { id: 'MEDICAL_DEVICE', label: 'Medical device' }
              ],
              isHidden: false
            }
          ]
        }
      ],
      translations: {
        sections: new Map(),
        subsections: new Map(),
        questions: new Map([
          [
            'categories',
            {
              label: 'Select all categories',
              items: new Map([
                ['OTHER', { label: 'Other', group: '' }],
                ['MEDICAL_DEVICE', { label: 'Medical device', group: '' }]
              ])
            }
          ],
          ['otherCategoryDescription', { label: 'Other category', items: new Map() }]
        ])
      }
    });

    expect(wizard.translateSummaryForIRDocumentExport()).toEqual([
      { label: 'Select all categories', value: 'Other\nMedical device' },
      { label: 'Other category', value: 'Remote monitoring' }
    ]);
  });

  it('does not export stale checkbox conditional answers when the parent option is not selected', () => {
    const wizard = new WizardIRV3EngineModel({
      currentAnswers: {
        categories: ['MEDICAL_DEVICE'],
        otherCategoryDescription: 'Remote monitoring'
      },
      steps: [
        {
          parameters: [
            {
              id: 'categories',
              dataType: 'checkbox-array',
              label: 'Select all categories',
              items: [
                {
                  id: 'OTHER',
                  label: 'Other',
                  conditional: {
                    id: 'otherCategoryDescription',
                    dataType: 'text',
                    label: 'Other category'
                  }
                },
                { id: 'MEDICAL_DEVICE', label: 'Medical device' }
              ],
              isHidden: false
            }
          ]
        }
      ],
      translations: {
        sections: new Map(),
        subsections: new Map(),
        questions: new Map([
          [
            'categories',
            {
              label: 'Select all categories',
              items: new Map([
                ['OTHER', { label: 'Other', group: '' }],
                ['MEDICAL_DEVICE', { label: 'Medical device', group: '' }]
              ])
            }
          ],
          ['otherCategoryDescription', { label: 'Other category', items: new Map() }]
        ])
      }
    });

    expect(wizard.translateSummaryForIRDocumentExport()).toEqual([
      { label: 'Select all categories', value: 'Medical device' }
    ]);
  });

  it('exports object answers such as certifications', () => {
    const wizard = new WizardIRV3EngineModel({
      currentAnswers: {
        certifications: { GMDN: '12345', UDI: '67890' }
      },
      steps: [
        {
          parameters: [
            {
              id: 'certifications',
              dataType: 'input-array',
              label: 'Certifications',
              items: [],
              isHidden: false
            }
          ]
        }
      ],
      translations: {
        sections: new Map(),
        subsections: new Map(),
        questions: new Map([['certifications', { label: 'Certifications', items: new Map() }]])
      }
    });

    expect(wizard.translateSummaryForIRDocumentExport()).toEqual([
      { label: 'Certifications', value: 'GMDN: 12345\nUDI: 67890' }
    ]);
  });
});

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
