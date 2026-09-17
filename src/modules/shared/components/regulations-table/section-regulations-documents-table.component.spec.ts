jest.mock('@app/base', () => ({
  CoreComponent: class {}
}));
jest.mock('@app/base/helpers', () => ({
  UtilsHelper: {
    regulationsRequiringDocuments: (regulations: { type: string; hasMet?: string }[]) =>
      regulations.filter(regulation => regulation.hasMet === 'YES').map(regulation => regulation.type)
  }
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

  it('only includes regulations answered yes in the document table', () => {
    const table = Object.create(
      InnovationRegulationsDocumentsTableComponent.prototype
    ) as InnovationRegulationsDocumentsTableComponent;

    table.sectionInfo = {
      standards: [
        { type: 'DTAC', hasMet: 'YES' },
        { type: 'CE_UKCA_NON_MEDICAL', hasMet: 'IN_PROGRESS' },
        { type: 'UK_MDR_CLASS_I', hasMet: 'NOT_YET' }
      ]
    } as any;
    table.sectionRegulationsDocuments = [];

    table.ngOnInit();

    expect(table.selectedRegulations).toEqual(['DTAC']);
  });
});
