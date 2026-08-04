import { WizardIRV3EngineModel } from './wizard-engine-irv3-schema.model';

describe('WizardIRV3EngineModel', () => {
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
