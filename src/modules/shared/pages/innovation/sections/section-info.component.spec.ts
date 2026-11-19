import '@modules/core';
import { of } from 'rxjs';
import { PageInnovationSectionInfoComponent } from './section-info.component';

describe('required document section summary', () => {
  function setup(sectionId: string, scanState: string) {
    const wizard = {
      setAnswers: () => wizard,
      runRules: () => wizard,
      runInboundParsing: () => wizard,
      parseSummary: () => [],
      validateData: () => ({ valid: true })
    };
    const isEvidence = sectionId === 'EVIDENCE_OF_EFFECTIVENESS';
    const data = isEvidence
      ? { hasEvidence: 'YES', evidences: [{ id: 'ev', name: 'Trial', summary: 'Results' }] }
      : { standards: [{ type: 'DTAC', hasMet: 'YES' }] };
    const contextId = isEvidence ? 'ev' : 'DTAC';
    const documents = {
      data: [
        { id: 'clean', context: { id: contextId }, file: { name: 'clean.pdf', scanState: 'ready' } },
        { id: 'other', context: { id: contextId }, file: { name: 'other.pdf', scanState } }
      ]
    };
    const component = Object.assign(Object.create(PageInnovationSectionInfoComponent.prototype), {
      innovation: { id: 'innovation', status: 'CREATED' },
      baseUrl: '/innovator/innovations/innovation',
      activatedRoute: { snapshot: { params: { sectionId } } },
      ctx: {
        user: { isInnovator: () => true },
        schema: {
          getIrSchemaSectionV3: () => ({ id: sectionId, title: 'Section', wizard, evidences: true }),
          getInnovationSectionsWithFiles: () => [],
          getIrSchemaTranslationsMap: () => ({ subsections: new Map(), questions: new Map() })
        },
        innovation: { getSectionInfo$: () => of({ status: 'DRAFT', data }), getSectionsSummary$: () => of([]) }
      },
      sectionSummaryData: { sectionInfo: { submitButton: { show: false } } },
      evidenceData: {},
      regulationsData: {},
      irv3translate: { transform: (value: string) => value },
      getDocumentsByContext: () => of(documents),
      getSectionMetadata: () => ({ label: 'Section', title: 'Section' }),
      getPreviousAndNextPagination: jest.fn(),
      translate: (value: string) => value,
      setPageStatus: jest.fn(),
      setPageTitle: jest.fn(),
      setBackLink: jest.fn(),
      setAlertError: jest.fn(),
      setAlertUnknownError: jest.fn(),
      resetAlert: jest.fn()
    });
    return { component, documents };
  }
  it.each(['EVIDENCE_OF_EFFECTIVENESS', 'REGULATIONS_AND_STANDARDS'])(
    'blocks %s when a clean file and a rejected file are attached',
    section => {
      const { component } = setup(section, 'rejected');
      component.initializePage();
      expect(component.isSectionComplete).toBe(false);
      expect(component.sectionSummaryData.sectionInfo.submitButton.show).toBe(false);
      expect(component.setAlertError).toHaveBeenLastCalledWith(
        expect.any(String),
        expect.objectContaining({
          itemsList: [
            expect.objectContaining({
              title: expect.stringContaining('other.pdf'),
              description: expect.stringContaining('Malware detected')
            })
          ]
        })
      );
    }
  );
  it.each(['scanning', 'delayed', 'rejected', 'scan_failed', 'not_scanned', 'removed', 'unavailable'])(
    'blocks both required-document summaries for %s, even alongside a clean file',
    state => {
      for (const section of ['EVIDENCE_OF_EFFECTIVENESS', 'REGULATIONS_AND_STANDARDS']) {
        const { component } = setup(section, state);
        component.initializePage();
        expect(component.isSectionComplete).toBe(false);
        expect(component.setAlertError).toHaveBeenLastCalledWith(
          expect.any(String),
          expect.objectContaining({
            itemsList: [expect.objectContaining({ title: expect.stringContaining('other.pdf') })]
          })
        );
      }
    }
  );
  it('clears the old scan error after a fresh successful check', () => {
    const { component, documents } = setup('EVIDENCE_OF_EFFECTIVENESS', 'scanning');
    component.initializePage();
    documents.data[1].file.scanState = 'ready';
    component.initializePage();
    expect(component.isSectionComplete).toBe(true);
    expect(component.sectionSummaryData.sectionInfo.submitButton.show).toBe(true);
    expect(component.resetAlert).toHaveBeenCalledTimes(1);
  });
});
