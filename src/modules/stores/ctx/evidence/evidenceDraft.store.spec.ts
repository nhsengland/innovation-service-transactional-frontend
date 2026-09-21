import { EvidenceDraftService } from './evidenceDraft.store';

describe('EvidenceDraftService', () => {
  let service: EvidenceDraftService;

  beforeEach(() => {
    service = new EvidenceDraftService();
  });

  it('adds a document when the draft has not been initialised', () => {
    const document = {
      context: { type: 'INNOVATION_EVIDENCE' as const, id: '' },
      name: 'Evidence file',
      description: 'Evidence document',
      file: { id: 'File001', name: 'file.pdf', extension: 'pdf' }
    };

    service.addDocument(document);

    expect(service.documents()).toEqual([document]);
    expect(service.evidence()).toEqual({});
  });

  it('updates evidence when the draft has not been initialised', () => {
    service.updateEvidence({ summary: 'Evidence summary' });

    expect(service.evidence()).toEqual({ summary: 'Evidence summary' });
    expect(service.documents()).toEqual([]);
  });

  it('does not crash when clearing or updating documents without a draft', () => {
    expect(() => service.removeDocument(0)).not.toThrow();
    expect(() => service.clearDocuments()).not.toThrow();
    expect(() => service.updateAllDocumentContexts('Evidence001')).not.toThrow();
  });
});
