jest.mock('@app/base', () => ({
  CoreComponent: class {}
}));

import { InnovationRegulationsDocumentsTableComponent } from './section-regulations-documents-table.component';

describe('InnovationRegulationsDocumentsTableComponent', () => {
  it('does not ask for a document when a regulation is NOT_YET', () => {
    const table = Object.create(
      InnovationRegulationsDocumentsTableComponent.prototype
    ) as InnovationRegulationsDocumentsTableComponent;

    table.sectionInfo = {
      standards: [{ type: 'DTAC', hasMet: 'NOT_YET' }]
    } as any;
    table.regulationsDocuments = { DTAC: [] };

    expect(table.certificationsHasDocuments('DTAC')).toBe(true);
  });
});
