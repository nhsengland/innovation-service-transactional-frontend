import {
  buildRequiredDocumentAlert,
  isEligibleRequiredDocument,
  requiredDocumentErrorAlert
} from './required-document-errors';

describe('required document errors', () => {
  it.each(['ready', 'legacy_allowed'])('allows %s', scanState => {
    expect(isEligibleRequiredDocument({ scanState } as never)).toBe(true);
  });
  it.each(['scanning', 'delayed', 'rejected', 'scan_failed', 'not_scanned', 'removed', 'unavailable', undefined])(
    'blocks %s',
    scanState => {
      expect(isEligibleRequiredDocument({ scanState } as never)).toBe(false);
    }
  );
  it('keeps all affected files in one linked error summary', () => {
    const alert = buildRequiredDocumentAlert('innovation', [
      {
        section: 'EVIDENCE_OF_EFFECTIVENESS',
        contextId: 'ev',
        contextName: 'Clinical trial',
        filename: 'results.pdf',
        scanState: 'rejected'
      },
      {
        section: 'REGULATIONS_AND_STANDARDS',
        contextId: 'CE_UKCA_CLASS_I',
        contextName: 'UKCA certificate',
        filename: 'certificate.pdf',
        scanState: 'scanning'
      }
    ]);
    expect(alert.itemsList).toHaveLength(2);
    expect(alert.itemsList[0].title).toContain('Clinical trial');
    expect(alert.itemsList[0].title).toContain('results.pdf');
    expect(alert.itemsList[0].description).toContain('Malware detected');
    expect(alert.itemsList[0].callback).toContain('/evidences/ev');
    expect(alert.itemsList[1].description).toContain('Scanning');
    expect(alert.itemsList[1].callback).toContain('/record/sections/REGULATIONS_AND_STANDARDS');
  });
  it('uses different explanations for every blocked status', () => {
    const states = [
      'scanning',
      'delayed',
      'rejected',
      'scan_failed',
      'not_scanned',
      'removed',
      'unavailable',
      'missing'
    ];
    const alert = buildRequiredDocumentAlert(
      'innovation',
      states.map(scanState => ({
        section: 'EVIDENCE_OF_EFFECTIVENESS',
        contextId: 'ev',
        contextName: 'Trial',
        scanState
      }))
    );
    expect(new Set(alert.itemsList.map(item => item.description)).size).toBe(states.length);
    expect(
      alert.itemsList.every(
        item =>
          !item.description.includes('—') && !item.description.includes('You cannot') && item.description.length < 160
      )
    ).toBe(true);
  });
  it('extracts structured backend errors and ignores unrelated errors', () => {
    expect(
      requiredDocumentErrorAlert(
        {
          error: {
            error: 'I.0036',
            details: {
              files: [
                {
                  section: 'EVIDENCE_OF_EFFECTIVENESS',
                  contextId: 'ev',
                  contextName: 'Trial',
                  scanState: 'unavailable'
                }
              ]
            }
          }
        },
        'innovation'
      )?.itemsList
    ).toHaveLength(1);
    expect(requiredDocumentErrorAlert({ error: { error: 'OTHER' } }, 'innovation')).toBeNull();
  });
});
