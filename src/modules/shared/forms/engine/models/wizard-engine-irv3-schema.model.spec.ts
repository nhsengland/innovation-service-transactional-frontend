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
  });
});
