import '@modules/core';
import { WIZARD_BASE_QUESTIONS, WIZARD_EDIT_QUESTIONS, WIZARD_WITH_LOCATION_QUESTIONS } from './document-newdit.config';

describe.each([
  ['new document', WIZARD_BASE_QUESTIONS],
  ['edit document', WIZARD_EDIT_QUESTIONS],
  ['document with location', WIZARD_WITH_LOCATION_QUESTIONS]
])('%s upload summary', (_name, wizard) => {
  it.each([undefined, ''])('shows plain filename text when the URL is %s', url => {
    const summary = wizard.runSummaryParsing({ file: { name: 'results.pdf', url } });
    expect(summary.find(item => item.label === 'Uploaded document')).toMatchObject({
      value: 'results.pdf',
      allowHTML: false
    });
  });

  it('preserves an available download link', () => {
    const summary = wizard.runSummaryParsing({ file: { name: 'results.pdf', url: 'https://example.test/file' } });
    expect(summary.find(item => item.label === 'Uploaded document')).toMatchObject({
      value: "<a href='https://example.test/file'>results.pdf</a>",
      allowHTML: true
    });
  });
});
