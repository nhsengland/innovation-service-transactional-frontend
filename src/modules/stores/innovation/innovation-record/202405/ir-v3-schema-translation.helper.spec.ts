import { irSchemaTranslationsMap } from './ir-v3-schema-translation.helper';
import { InnovationRecordSchemaV3Type } from './ir-v3-types';

describe('irSchemaTranslationsMap legacy values', () => {
  it('translates the legacy YES value', () => {
    const schema: InnovationRecordSchemaV3Type = {
      sections: [
        {
          id: 'section',
          title: 'Section',
          subSections: [
            {
              id: 'subsection',
              title: 'Subsection',
              steps: [
                {
                  questions: [
                    {
                      id: 'hasProductServiceOrPrototype',
                      dataType: 'radio-group',
                      label: 'Do you have a working product, service or prototype?',
                      items: [{ id: 'YES', label: 'Yes', isLegacy: true }]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    };

    expect(irSchemaTranslationsMap(schema).questions.get('hasProductServiceOrPrototype')?.items.get('YES')?.label).toBe(
      'Yes'
    );
  });
});
