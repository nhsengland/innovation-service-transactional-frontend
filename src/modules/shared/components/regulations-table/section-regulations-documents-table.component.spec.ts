jest.mock('@app/base', () => ({
  CoreComponent: class {}
}));

import { InnovationRegulationsDocumentsTableComponent } from './section-regulations-documents-table.component';

describe('InnovationRegulationsDocumentsTableComponent', () => {
  it('only shows More details when a regulation has a document', () => {
    const table = Object.create(
      InnovationRegulationsDocumentsTableComponent.prototype
    ) as InnovationRegulationsDocumentsTableComponent;

    table.sectionInfo = {
      standards: [{ type: 'DTAC', hasMet: 'NOT_YET' }]
    } as any;
    table.regulationsDocuments = { DTAC: [] };

    expect(table.certificationsHasDocuments('DTAC')).toBe(false);

    table.regulationsDocuments = { DTAC: [{ context: { id: 'DTAC' } }] } as any;

    expect(table.certificationsHasDocuments('DTAC')).toBe(true);
  });

  it('does not ask for a document when a regulation is IN_PROGRESS', () => {
    const table = Object.create(
      InnovationRegulationsDocumentsTableComponent.prototype
    ) as InnovationRegulationsDocumentsTableComponent;

    table.sectionInfo = {
      standards: [{ type: 'DTAC', hasMet: 'IN_PROGRESS' }]
    } as any;
    table.regulationsDocuments = { DTAC: [] };

    expect(table.shouldAddDocument('DTAC')).toBe(false);
  });
});
